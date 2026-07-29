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
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Common.InsightDashboardLocalizationService;
using Infrastructure.Helpers;
using Infrastructure.Models.Dashboards;
using Infrastructure.Models.RawData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.InsightDashboardBase.Infrastructure.Data;
using Microting.InsightDashboardBase.Infrastructure.Data.Entities;

public class RawDataService : IRawDataService
{
    /// <summary>
    /// Hard ceiling for the unpaged export. Deliberately well below the point where
    /// the process would struggle: the export materialises every answer id into an
    /// IN(...) set, every AnswerValue for those answers, and one dictionary per row.
    /// Batching the id lookup would let this rise; until then the cap must stay where
    /// the whole set comfortably fits in memory.
    /// </summary>
    public const int ExportRowLimit = 25000;

    private const string NotAnswered = "—";
    private const string NaOptionName = "na";

    private readonly ILogger<RawDataService> _logger;
    private readonly IInsightDashboardLocalizationService _localizationService;
    private readonly IEFormCoreService _coreHelper;
    private readonly InsightDashboardPnDbContext _dbContext;
    private readonly IUserService _userService;

    public RawDataService(
        ILogger<RawDataService> logger,
        IInsightDashboardLocalizationService localizationService,
        IEFormCoreService coreHelper,
        InsightDashboardPnDbContext dbContext,
        IUserService userService)
    {
        _logger = logger;
        _localizationService = localizationService;
        _coreHelper = coreHelper;
        _dbContext = dbContext;
        _userService = userService;
    }

    public Task<OperationDataResult<RawDataListModel>> GetRawData(RawDataRequestModel requestModel) =>
        Build(requestModel.DashboardId, requestModel.DashboardItemId, requestModel, applyPaging: true);

    public Task<OperationDataResult<RawDataListModel>> GetAllRawData(int dashboardId, int dashboardItemId) =>
        Build(dashboardId, dashboardItemId, null, applyPaging: false);

    private async Task<OperationDataResult<RawDataListModel>> Build(
        int dashboardId,
        int dashboardItemId,
        RawDataRequestModel requestModel,
        bool applyPaging)
    {
        try
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
                return new OperationDataResult<RawDataListModel>(
                    false, _localizationService.GetString("DashboardNotFound"));
            }

            var dashboardItem = dashboard.DashboardItems
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .FirstOrDefault(x => x.Id == dashboardItemId);

            if (dashboardItem == null)
            {
                return new OperationDataResult<RawDataListModel>(
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

            var core = await _coreHelper.GetCore();
            var userLanguage = await _userService.GetCurrentUserLanguage();

            await using var sdkContext = core.DbContextHelper.GetDbContext();

            // Text items render the interviews grid, not a chart, and ChartDataHelpers
            // filters them down a different branch (it applies the location filter
            // regardless of CompareEnabled). AnswerFilterHelper does not mirror that
            // branch, so refuse rather than return a set that matches nothing on screen.
            var firstQuestionType = await sdkContext.Questions
                .AsNoTracking()
                .Where(x => x.Id == dashboardItem.FirstQuestionId)
                .Select(x => x.QuestionType)
                .FirstOrDefaultAsync();

            if (firstQuestionType == Constants.QuestionTypes.Text)
            {
                return new OperationDataResult<RawDataListModel>(
                    false, _localizationService.GetString("RawDataNotAvailableForTextQuestions"));
            }

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

            var result = new RawDataListModel
            {
                Columns = schema.Columns,
                Total = await answerQuery.CountAsync(),
            };

            if (!applyPaging && result.Total > ExportRowLimit)
            {
                return new OperationDataResult<RawDataListModel>(
                    false,
                    string.Format(
                        _localizationService.GetString("RawDataExportTooLarge"),
                        result.Total,
                        ExportRowLimit));
            }

            var ordered = ApplySort(answerQuery, requestModel?.Sort, requestModel?.IsSortDsc ?? true);

            if (applyPaging)
            {
                ordered = ordered.Skip(requestModel.Offset).Take(requestModel.PageSize);
            }

            var answers = await ordered
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

            var answerIds = answers.Select(x => x.Id).ToList();

            var values = await sdkContext.AnswerValues
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => answerIds.Contains(x.AnswerId))
                .Select(x => new { x.AnswerId, x.QuestionId, x.OptionId, x.Value })
                .ToListAsync();

            var metaByQuestionId = schema.Questions.ToDictionary(x => x.QuestionId);
            var valuesByAnswerId = values
                .GroupBy(x => x.AnswerId)
                .ToDictionary(x => x.Key, x => x.ToList());

            foreach (var answer in answers)
            {
                var row = ToRowDictionary(answer);

                // Every question column starts as "not answered"; real values overwrite it.
                foreach (var meta in schema.Questions)
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
                        var skipped = string.Equals(optionName, NaOptionName, StringComparison.OrdinalIgnoreCase);

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
                            : ResolveSingleValue(meta, answerValue.OptionId, answerValue.Value, optionName);
                    }
                }

                result.Rows.Add(row);
            }

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

    /// <summary>
    /// Resolves one cell. The option's own translated name is only meaningful for
    /// choice questions: the SDK auto-generates options whose translation IS the
    /// type keyword - "smiley1".."smiley6", "number", "text", "next", "na"
    /// (Question.GenerateSmileyOptions / GenerateSpecialQuestionTypes). Preferring
    /// the option name for every type would therefore render "text" instead of the
    /// answer, and "smiley1" instead of "Meget glad".
    ///
    /// Core.SaveAnswer only overwrites AnswerValue.Value with the option name for
    /// buttons/list/multi; for every other type Value holds the real answer.
    /// </summary>
    private static string ResolveSingleValue(
        RawDataQuestionMeta meta, int optionId, string value, string optionName)
    {
        switch (meta.Kind)
        {
            case RawDataColumnKinds.Smiley:
            {
                // Label from the weight ladder, matching what the chart plots
                // (ChartDataHelpers.cs:60-68), not from the "smileyN" translation.
                var weightValue = meta.WeightValueByOptionId.GetValueOrDefault(optionId);
                var label = RawDataColumnBuilder.SmileyFallbackLabel(weightValue);

                return string.IsNullOrEmpty(label)
                    ? weightValue.ToString()
                    : $"{label} ({weightValue})";
            }

            case RawDataColumnKinds.Single:
                // buttons / list - the option translation is the real answer text.
                return !string.IsNullOrEmpty(optionName) ? optionName : value;

            case RawDataColumnKinds.Number:
            case RawDataColumnKinds.Text:
                // Free input lives in Value; an empty Value means the question was skipped.
                return string.IsNullOrEmpty(value) ? NotAnswered : value;

            default:
                // picture / info_text carry no answer, only a synthetic "next" option.
                return string.Empty;
        }
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
