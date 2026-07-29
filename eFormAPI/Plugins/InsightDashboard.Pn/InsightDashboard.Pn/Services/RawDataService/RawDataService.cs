/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace InsightDashboard.Pn.Services.RawDataService;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Common.InsightDashboardLocalizationService;
using Infrastructure.Helpers;
using Infrastructure.Models.Dashboards;
using Infrastructure.Models.RawData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.InsightDashboardBase.Infrastructure.Data;
using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
using RawDataExcelService;

public class RawDataService : IRawDataService
{
    /// <summary>
    /// Hard ceiling for the unpaged export.
    ///
    /// Batching removed the memory constraint and keyset paging removed the
    /// quadratic database cost, so this is no longer protecting the heap. What it
    /// still bounds is wall-clock time: the whole file is generated before the
    /// response starts, so a slow export can outlive a reverse proxy's read timeout
    /// (nginx defaults to 60s). This value is NOT derived from a measurement of a
    /// cap-sized export in production - raising it further should be, or better,
    /// the sheet should be written straight to the response body so bytes flow
    /// while rows are generated and no ceiling is needed.
    /// </summary>
    public const int ExportRowLimit = 50000;

    /// <summary>Default answers per round trip during an export.</summary>
    public const int DefaultExportBatchSize = 2000;

    /// <summary>
    /// Answers fetched per round trip. Peak memory is roughly this many rows plus
    /// their answer values, however large the export is. Settable so tests can
    /// cross batch boundaries without seeding thousands of answers.
    /// </summary>
    public int ExportBatchSize { get; set; } = DefaultExportBatchSize;

    private const string NotAnswered = RawDataValueResolver.NotAnswered;

    private readonly ILogger<RawDataService> _logger;
    private readonly IInsightDashboardLocalizationService _localizationService;
    private readonly IEFormCoreService _coreHelper;
    private readonly InsightDashboardPnDbContext _dbContext;
    private readonly IUserService _userService;
    private readonly IRawDataExcelService _excelService;

    public RawDataService(
        ILogger<RawDataService> logger,
        IInsightDashboardLocalizationService localizationService,
        IEFormCoreService coreHelper,
        InsightDashboardPnDbContext dbContext,
        IUserService userService,
        IRawDataExcelService excelService)
    {
        _logger = logger;
        _localizationService = localizationService;
        _coreHelper = coreHelper;
        _dbContext = dbContext;
        _userService = userService;
        _excelService = excelService;
    }

    public async Task<OperationDataResult<RawDataListModel>> GetRawData(RawDataRequestModel requestModel)
    {
        try
        {
            var core = await _coreHelper.GetCore();
            await using var sdkContext = core.DbContextHelper.GetDbContext();

            var scope = await ResolveScope(
                sdkContext, requestModel.DashboardId, requestModel.DashboardItemId);

            if (!scope.Success)
            {
                return new OperationDataResult<RawDataListModel>(false, scope.Message);
            }

            var result = new RawDataListModel
            {
                Columns = scope.Model.Schema.Columns,
                Total = await scope.Model.Answers.CountAsync(),
            };

            var page = await ReadAnswerPage(
                scope.Model.Answers,
                requestModel.Sort,
                requestModel.IsSortDsc,
                requestModel.Offset,
                requestModel.PageSize);

            result.Rows.AddRange(await BuildRows(sdkContext, scope.Model, page));

            return new OperationDataResult<RawDataListModel>(true, result);
        }
        catch (Exception e)
        {
            Trace.TraceError(e.Message);
            _logger.LogError(e, e.Message);
            return new OperationDataResult<RawDataListModel>(
                false, _localizationService.GetString("ErrorWhileObtainingRawData"));
        }
    }

    public async Task<OperationDataResult<string>> ExportToFile(int dashboardId, int dashboardItemId)
    {
        string filePath = null;

        try
        {
            var core = await _coreHelper.GetCore();

            // The context stays open for the whole export: every batch comes from
            // the same query, so it has to outlive the loop.
            await using var sdkContext = core.DbContextHelper.GetDbContext();

            var scope = await ResolveScope(sdkContext, dashboardId, dashboardItemId);

            if (!scope.Success)
            {
                return new OperationDataResult<string>(false, scope.Message);
            }

            var total = await scope.Model.Answers.CountAsync();

            if (total > ExportRowLimit)
            {
                return new OperationDataResult<string>(
                    false,
                    string.Format(
                        _localizationService.GetString("RawDataExportTooLarge"),
                        total,
                        ExportRowLimit));
            }

            filePath = _excelService.CreateFilePath();

            var written = 0;

            using (var writer = _excelService.CreateWriter(filePath, scope.Model.Schema.Columns))
            {
                DateTime? cursorFinishedAt = null;
                int? cursorId = null;

                while (true)
                {
                    var answers = await ReadAnswerBatch(
                        scope.Model.Answers, cursorFinishedAt, cursorId, ExportBatchSize);

                    if (answers.Count == 0)
                    {
                        break;
                    }

                    foreach (var row in await BuildRows(sdkContext, scope.Model, answers))
                    {
                        writer.WriteRow(row);
                        written++;
                    }

                    var last = answers[^1];
                    cursorFinishedAt = last.FinishedAt;
                    cursorId = last.Id;
                }

                writer.Complete();
            }

            if (written != total)
            {
                // Answers added or removed while the export ran. The cursor pins us
                // to a consistent view, so the file is coherent - but it is not the
                // count the user was shown, and saying nothing would let a truncated
                // export pass as complete.
                _logger.LogWarning(
                    "Raw data export for dashboard {DashboardId} item {ItemId} wrote {Written} rows "
                    + "against an expected {Total}; answers changed while the export ran.",
                    dashboardId, dashboardItemId, written, total);
            }

            return new OperationDataResult<string>(true, filePath);
        }
        catch (Exception e)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            Trace.TraceError(e.Message);
            _logger.LogError(e, e.Message);
            return new OperationDataResult<string>(
                false, _localizationService.GetString("ErrorWhileGeneratingRawDataExport"));
        }
    }

    /// <summary>
    /// Everything a page or an export needs that does not depend on the offset: the
    /// item's column schema and the query selecting its answers.
    /// </summary>
    private async Task<OperationDataResult<RawDataScope>> ResolveScope(
        MicrotingDbContext sdkContext,
        int dashboardId,
        int dashboardItemId)
    {
        var dashboard = await _dbContext.Dashboards
            .Include(x => x.DashboardItems)
            .ThenInclude<Dashboard, DashboardItem, List<DashboardItemIgnoredAnswer>>(x => x.IgnoredAnswerValues)
            .Include(x => x.DashboardItems)
            .ThenInclude<Dashboard, DashboardItem, List<DashboardItemCompare>>(x => x.CompareLocationsTags)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .FirstOrDefaultAsync(x => x.Id == dashboardId);

        if (dashboard == null)
        {
            return new OperationDataResult<RawDataScope>(
                false, _localizationService.GetString("DashboardNotFound"));
        }

        var dashboardItem = dashboard.DashboardItems
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .FirstOrDefault(x => x.Id == dashboardItemId);

        if (dashboardItem == null)
        {
            return new OperationDataResult<RawDataScope>(
                false, _localizationService.GetString("DashboardItemNotFound"));
        }

        if (dashboard.Today)
        {
            var dateTimeNow = DateTime.Now;
            dashboard.DateTo = new DateTime(
                dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day, 23, 59, 59);
        }

        var answerDates = new DashboardEditAnswerDates
        {
            Today = dashboard.Today,
            DateFrom = dashboard.DateFrom,
            DateTo = dashboard.DateTo,
        };

        // Text items render the interviews grid, not a chart, and ChartDataHelpers
        // filters them down a different branch that AnswerFilterHelper does not
        // mirror. Refuse rather than return a set matching nothing on screen.
        var firstQuestionType = await sdkContext.Questions
            .AsNoTracking()
            .Where(x => x.Id == dashboardItem.FirstQuestionId)
            .Select(x => x.QuestionType)
            .FirstOrDefaultAsync();

        if (firstQuestionType == Constants.QuestionTypes.Text)
        {
            return new OperationDataResult<RawDataScope>(
                false, _localizationService.GetString("RawDataNotAvailableForTextQuestions"));
        }

        var userLanguage = await _userService.GetCurrentUserLanguage();

        var preferredLanguageIds = await RawDataTranslations.GetPreferredLanguageIdsAsync(
            sdkContext, dashboard.SurveyId, userLanguage.Id);

        var schema = await RawDataColumnBuilder.BuildAsync(
            sdkContext, dashboard.SurveyId, preferredLanguageIds);

        var answerQuery = AnswerFilterHelper.BuildAnswerQuery(
            sdkContext,
            dashboardItem,
            dashboard.SurveyId,
            dashboard.LocationId,
            dashboard.TagId,
            answerDates);

        return new OperationDataResult<RawDataScope>(true, new RawDataScope
        {
            Schema = schema,
            Answers = answerQuery,
        });
    }

    /// <summary>
    /// Materialises one window of answers and pivots their answer values into rows.
    /// Peak memory is bounded by pageSize, which is what makes a large export safe.
    /// </summary>
    /// <summary>Reads one keyset window of answers, newest first.</summary>
    private static Task<List<AnswerRow>> ReadAnswerBatch(
        IQueryable<Answer> answers,
        DateTime? cursorFinishedAt,
        int? cursorId,
        int batchSize) =>
        ProjectAnswers(RawDataPaging.AfterCursor(answers, cursorFinishedAt, cursorId).Take(batchSize));

    /// <summary>Reads one offset window, for the paged endpoint.</summary>
    private static Task<List<AnswerRow>> ReadAnswerPage(
        IQueryable<Answer> answers,
        string sort,
        bool isSortDsc,
        int offset,
        int pageSize) =>
        ProjectAnswers(ApplySort(answers, sort, isSortDsc).Skip(offset).Take(pageSize));

    private static Task<List<AnswerRow>> ProjectAnswers(IQueryable<Answer> answers) =>
        answers
            .Select(x => new AnswerRow
            {
                Id = x.Id,
                MicrotingUid = x.MicrotingUid,
                FinishedAt = x.FinishedAt,
                AnswerDuration = x.AnswerDuration,
                SiteId = x.SiteId,
                SiteName = x.Site.Name,
                TagNames = x.Site.SiteTags
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => y.Tag.Name)
                    .ToList(),
                UnitId = x.UnitId,
                UnitMicrotingUid = x.Unit.MicrotingUid,
                LanguageId = x.LanguageId,
                LanguageName = x.Language.Name,
                SurveyConfigurationName = x.SurveyConfiguration.Name,
                QuestionSetName = x.QuestionSet.Name,
                TimeZone = x.TimeZone,
                UtcAdjusted = x.UtcAdjusted,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                Version = x.Version,
                WorkflowState = x.WorkflowState,
            })
            .ToListAsync();

    /// <summary>
    /// Pivots one window of answers and their answer values into rows. Peak memory
    /// is bounded by the window, which is what makes a large export safe.
    /// </summary>
    private static async Task<List<Dictionary<string, object>>> BuildRows(
        MicrotingDbContext sdkContext,
        RawDataScope scope,
        List<AnswerRow> answers)
    {
        var rows = new List<Dictionary<string, object>>(answers.Count);

        if (answers.Count == 0)
        {
            return rows;
        }

        var answerIds = answers.Select(x => x.Id).ToList();

        var values = await sdkContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => answerIds.Contains(x.AnswerId))
            .Select(x => new { x.AnswerId, x.QuestionId, x.OptionId, x.Value })
            .ToListAsync();

        var metaByQuestionId = scope.Schema.Questions.ToDictionary(x => x.QuestionId);
        var valuesByAnswerId = values
            .GroupBy(x => x.AnswerId)
            .ToDictionary(x => x.Key, x => x.ToList());

        foreach (var answer in answers)
        {
            var row = ToRowDictionary(answer);

            // Every question column starts as "not answered"; real values overwrite it.
            foreach (var meta in scope.Schema.Questions)
            {
                foreach (var field in meta.OptionFields)
                {
                    row[field] = NotAnswered;
                }
            }

            if (valuesByAnswerId.TryGetValue(answer.Id, out var answerValues))
            {
                foreach (var answerValue in answerValues)
                {
                    if (!metaByQuestionId.TryGetValue(answerValue.QuestionId, out var meta))
                    {
                        continue;
                    }

                    var optionName = meta.OptionNameByOptionId.GetValueOrDefault(answerValue.OptionId);
                    var skipped = RawDataValueResolver.IsSkipped(optionName);

                    if (meta.IsMulti)
                    {
                        // A skipped multi question leaves every option column as "not answered".
                        if (skipped)
                        {
                            continue;
                        }

                        // The option was removed from the survey after this answer was
                        // given, so it has no column. Leave the question untouched rather
                        // than blanking its columns, which would assert the respondent
                        // was offered these options and picked none.
                        var optionField = meta.OptionFieldByOptionId.GetValueOrDefault(answerValue.OptionId);
                        if (optionField == null)
                        {
                            continue;
                        }

                        foreach (var field in meta.OptionFields)
                        {
                            if (Equals(row[field], NotAnswered))
                            {
                                row[field] = string.Empty;
                            }
                        }

                        row[optionField] = optionName;
                        continue;
                    }

                    row[meta.Field] = skipped
                        ? NotAnswered
                        : RawDataValueResolver.ResolveSingleValue(
                            meta, answerValue.OptionId, answerValue.Value, optionName);
                }
            }

            rows.Add(row);
        }

        return rows;
    }

    private sealed class RawDataScope
    {
        public RawDataSchema Schema { get; init; }

        public IQueryable<Answer> Answers { get; init; }
    }

    private static Dictionary<string, object> ToRowDictionary(AnswerRow answer) => new()
    {
        [RawDataFields.Id] = answer.Id,
        [RawDataFields.MicrotingUid] = answer.MicrotingUid,
        [RawDataFields.FinishedAt] = answer.FinishedAt,
        [RawDataFields.AnswerDuration] = FormatDuration(answer.AnswerDuration),
        [RawDataFields.SiteName] = answer.SiteName,
        [RawDataFields.TagNames] = string.Join(", ", answer.TagNames),
        [RawDataFields.UnitMicrotingUid] = answer.UnitMicrotingUid,
        [RawDataFields.LanguageName] = answer.LanguageName,
        [RawDataFields.SurveyConfigurationName] = answer.SurveyConfigurationName,
        [RawDataFields.QuestionSetName] = answer.QuestionSetName,
        [RawDataFields.TimeZone] = answer.TimeZone,
        [RawDataFields.UtcAdjusted] = answer.UtcAdjusted,
        [RawDataFields.CreatedAt] = answer.CreatedAt,
        [RawDataFields.UpdatedAt] = answer.UpdatedAt,
        [RawDataFields.Version] = answer.Version,
        [RawDataFields.WorkflowState] = answer.WorkflowState,
        [RawDataFields.SiteId] = answer.SiteId,
        [RawDataFields.UnitId] = answer.UnitId,
        [RawDataFields.LanguageId] = answer.LanguageId,
    };

    /// <summary>AnswerDuration is stored in seconds; the UI shows mm:ss.</summary>
    private static string FormatDuration(int seconds) =>
        $"{seconds / 60:D2}:{seconds % 60:D2}";

    private static IQueryable<Answer> ApplySort(IQueryable<Answer> query, string sort, bool isSortDsc) =>
        sort switch
        {
            RawDataFields.Id => Order(query, x => x.Id, isSortDsc),
            RawDataFields.MicrotingUid => Order(query, x => x.MicrotingUid, isSortDsc),
            RawDataFields.AnswerDuration => Order(query, x => x.AnswerDuration, isSortDsc),
            RawDataFields.SiteName => Order(query, x => x.Site.Name, isSortDsc),
            RawDataFields.UnitMicrotingUid => Order(query, x => x.Unit.MicrotingUid, isSortDsc),
            RawDataFields.LanguageName => Order(query, x => x.Language.Name, isSortDsc),
            RawDataFields.SurveyConfigurationName => Order(query, x => x.SurveyConfiguration.Name, isSortDsc),
            RawDataFields.CreatedAt => Order(query, x => x.CreatedAt, isSortDsc),
            RawDataFields.UpdatedAt => Order(query, x => x.UpdatedAt, isSortDsc),
            RawDataFields.WorkflowState => Order(query, x => x.WorkflowState, isSortDsc),
            _ => Order(query, x => x.FinishedAt, isSortDsc),
        };

    /// <summary>
    /// Always breaks ties on Id. Without it, answers sharing a FinishedAt (common -
    /// they arrive in batches) can be ordered differently per page, so paging would
    /// silently duplicate and skip rows.
    /// </summary>
    private static IQueryable<Answer> Order<TKey>(
        IQueryable<Answer> query, Expression<Func<Answer, TKey>> keySelector, bool isSortDsc) =>
        isSortDsc
            ? query.OrderByDescending(keySelector).ThenByDescending(x => x.Id)
            : query.OrderBy(keySelector).ThenBy(x => x.Id);

    private class AnswerRow
    {
        public int Id { get; init; }
        public int? MicrotingUid { get; init; }
        public DateTime FinishedAt { get; init; }
        public int AnswerDuration { get; init; }
        public int SiteId { get; init; }
        public string SiteName { get; init; }
        public List<string> TagNames { get; init; } = new();
        public int? UnitId { get; init; }
        public int? UnitMicrotingUid { get; init; }
        public int LanguageId { get; init; }
        public string LanguageName { get; init; }
        public string SurveyConfigurationName { get; init; }
        public string QuestionSetName { get; init; }
        public string TimeZone { get; init; }
        public bool UtcAdjusted { get; init; }
        public DateTime? CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public int? Version { get; init; }
        public string WorkflowState { get; init; }
    }
}
