/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

namespace InsightDashboard.Pn.Services.DashboardService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Globalization;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using Infrastructure.Models.Dashboards;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.InsightDashboardBase.Infrastructure.Data;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Microting.InsightDashboardBase.Infrastructure.Enums;

    public class DashboardService : IDashboardService
    {
        private readonly ILogger<DashboardService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly IEFormCoreService _coreHelper;
        private readonly InsightDashboardPnDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DashboardService(
            ILogger<DashboardService> logger,
            IInsightDashboardLocalizationService localizationService,
            IEFormCoreService coreHelper,
            InsightDashboardPnDbContext dbContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<OperationDataResult<DashboardsListModel>> GetAll(DashboardsRequestModel requestModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var result = new DashboardsListModel();
                var dashboardsQueryable = _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsNoTracking()
                    .AsQueryable();

                if (!string.IsNullOrEmpty(requestModel.SearchString))
                {
                    dashboardsQueryable = dashboardsQueryable
                        .Where(x => x.Name.Contains(
                            requestModel.SearchString,
                            StringComparison.CurrentCultureIgnoreCase));
                }

                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        dashboardsQueryable = dashboardsQueryable
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        dashboardsQueryable = dashboardsQueryable
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    dashboardsQueryable = dashboardsQueryable
                        .OrderBy(x => x.Id);
                }

                result.Total = await dashboardsQueryable
                    .Select(x => x.Id)
                    .CountAsync();

                dashboardsQueryable = dashboardsQueryable
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

                // dashboards
                var dashboards = await dashboardsQueryable
                    .Select(x => new DashboardModel
                    {
                        Id = x.Id,
                        SurveyId = x.SurveyId,
                        LocationId = x.LocationId,
                        TagId = x.TagId,
                        DashboardName = x.Name,
                    })
                    .ToListAsync();

                // TODO tasks here
                foreach (var dashboardModel in dashboards)
                {
                    using (var sdkContext = core.dbContextHelper.GetDbContext())
                    {
                        dashboardModel.SurveyName = await sdkContext.question_sets
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Id == dashboardModel.SurveyId)
                            .Select(x => x.Name)
                            .FirstOrDefaultAsync();

                        if (dashboardModel.LocationId != null)
                        {
                            dashboardModel.LocationName = await sdkContext.sites
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.Id == dashboardModel.LocationId)
                                .Select(x => x.Name)
                                .FirstOrDefaultAsync();
                        }

                        if (dashboardModel.TagId != null)
                        {
                            dashboardModel.TagName = await sdkContext.tags
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.Id == dashboardModel.TagId)
                                .Select(x => x.Name)
                                .FirstOrDefaultAsync();
                        }
                    }
                }

                result.DashboardList = dashboards;
                return new OperationDataResult<DashboardsListModel>(true, result);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<DashboardsListModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingDashboardList"));
            }
        }

        public async Task<OperationDataResult<int>> Create(DashboardCreateModel createModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                // Validation
                if (createModel.LocationId == null && createModel.ReportTagId == null)
                {
                    return new OperationDataResult<int>(
                        false,
                        _localizationService.GetString("IncorrectLocationIdOrTagId"));
                }

                if (createModel.LocationId != null && createModel.ReportTagId != null)
                {
                    return new OperationDataResult<int>(
                        false,
                        _localizationService.GetString("IncorrectLocationIdOrTagId"));
                }

                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {

                    if (!await sdkContext
                        .question_sets
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AnyAsync(x=>x.Id == createModel.SurveyId))
                    {
                        return new OperationDataResult<int>(
                            false,
                            _localizationService.GetString("SurveyNotFound"));
                    }

                    if (createModel.LocationId != null)
                    {
                        if (!await sdkContext
                            .sites
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .AnyAsync(x => x.Id == createModel.LocationId))
                        {
                            return new OperationDataResult<int>(
                                false,
                                _localizationService.GetString("LocationNotFound"));
                        }
                    }

                    if (createModel.ReportTagId != null)
                    {
                        if (!await sdkContext
                            .tags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .AnyAsync(x => x.Id == createModel.ReportTagId))
                        {
                            return new OperationDataResult<int>(
                                false,
                                _localizationService.GetString("TagNotFound"));
                        }
                    }
                }

                var dashboard = new Dashboard
                {
                    CreatedByUserId = UserId,
                    UpdatedByUserId = UserId,
                    Name = createModel.Name,
                    SurveyId = createModel.SurveyId,
                    LocationId = createModel.LocationId,
                    TagId = createModel.ReportTagId,
                };

                await dashboard.Create(_dbContext);
                return new OperationDataResult<int>(
                    true,
                    _localizationService.GetString("DashboardCreatedSuccessfully"),
                    dashboard.Id);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<int>(false,
                    _localizationService.GetString("ErrorWhileCreatingNewDashboard"));
            }
        }

        public async Task<OperationResult> Copy(int dashboardId)
        {
            try
            {
                Debugger.Break();

                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var dashboard = await _dbContext.Dashboards
                            .Include(x => x.DashboardItems)
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.DashboardItems.Any(i => i.WorkflowState != Constants.WorkflowStates.Removed))
                            .FirstOrDefaultAsync(x => x.Id == dashboardId);

                        if (dashboard == null)
                        {
                            return new OperationResult(
                                false,
                                _localizationService.GetString("DashboardNotFound"));
                        }

                        var newDashboard = new Dashboard
                        {
                            Name = dashboard.Name,
                            SurveyId = dashboard.SurveyId,
                            LocationId = dashboard.LocationId,
                            TagId = dashboard.TagId,
                            CreatedByUserId = UserId,
                            UpdatedByUserId = UserId,
                        };

                        await newDashboard.Create(_dbContext);

                        foreach (var dashboardItem in dashboard.DashboardItems)
                        {
                            var newDashboardItem = new DashboardItem
                            {
                                DashboardId = newDashboard.Id,
                                CreatedByUserId = UserId,
                                UpdatedByUserId = UserId,
                                ChartType = dashboardItem.ChartType,
                                FilterAnswerId = dashboardItem.FilterAnswerId,
                                FilterQuestionId = dashboardItem.FilterQuestionId,
                                FirstQuestionId = dashboardItem.FirstQuestionId,
                                Period = dashboardItem.Period,
                                Position = dashboardItem.Position,
                            };

                            await newDashboardItem.Save(_dbContext);
                        }

                        transaction.Commit();
                        return new OperationResult(
                            true,
                            _localizationService.GetString("DashboardCopiedSuccessfully"));
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileCopyingDashboard"));
            }
        }

        public async Task<OperationResult> Update(DashboardEditModel editModel)
        {
            try
            {
                using (var transactions = await _dbContext.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var dashboard = await _dbContext.Dashboards
                            .Include(x => x.DashboardItems)
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .FirstOrDefaultAsync(x => x.Id == editModel.Id);

                        if (dashboard == null)
                        {
                            return new OperationResult(
                                false,
                                _localizationService.GetString("DashboardNotFound"));
                        }

                        dashboard.UpdatedAt = DateTime.UtcNow;
                        dashboard.UpdatedByUserId = UserId;
                        dashboard.Name = editModel.DashboardName;

                        await dashboard.Update(_dbContext);

                        var editItemsIds = editModel.Items
                            .Where(x => x.Id != null)
                            .Select(x => x.Id)
                            .ToArray();

                        var forDelete = dashboard.DashboardItems
                            .Where(x => !editItemsIds.Contains(x.Id))
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .ToList();

                        var forUpdate = dashboard.DashboardItems
                            .Where(x => editItemsIds.Contains(x.Id))
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .ToList();

                        var forCreate = editModel.Items
                            .Where(x => x.Id == null)
                            .ToList();

                        // Remove
                        foreach (var dashboardItem in forDelete)
                        {
                            await dashboardItem.Delete(_dbContext);
                        }

                        // Update
                        foreach (var dashboardItem in forUpdate)
                        {
                            var dashboardItemModel = editModel.Items
                                .FirstOrDefault(x => x.Id == dashboardItem.Id);

                            if (dashboardItemModel != null)
                            {
                                dashboardItem.UpdatedAt = DateTime.UtcNow;
                                dashboardItem.UpdatedByUserId = UserId;
                                dashboardItem.ChartType = dashboardItemModel.ChartType;
                                dashboardItem.FilterAnswerId = dashboardItemModel.FilterAnswerId;
                                dashboardItem.FilterQuestionId = dashboardItemModel.FilterQuestionId;
                                dashboardItem.FirstQuestionId = dashboardItemModel.FirstQuestionId;
                                dashboardItem.Period = dashboardItemModel.Period;
                                dashboardItem.Position = dashboardItemModel.Position;

                                await dashboardItem.Update(_dbContext);
                            }
                        }

                        // Create
                        foreach (var dashboardItemModel in forCreate)
                        {
                            var dashboardItem = new DashboardItem
                            {
                                DashboardId = dashboard.Id,
                                CreatedByUserId = UserId,
                                ChartType = dashboardItemModel.ChartType,
                                FilterAnswerId = dashboardItemModel.FilterAnswerId,
                                FilterQuestionId = dashboardItemModel.FilterQuestionId,
                                FirstQuestionId = dashboardItemModel.FirstQuestionId,
                                Period = dashboardItemModel.Period,
                                Position = dashboardItemModel.Position,
                            };

                            await dashboardItem.Save(_dbContext);
                        }


                        transactions.Commit();
                        return new OperationResult(
                            true,
                            _localizationService.GetString("DashboardUpdatedSuccessfully"));
                    }
                    catch
                    {
                        transactions.Rollback();
                        throw;
                    }
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileUpdatingDashboard"));
            }
        }

        public async Task<OperationResult> Remove(int dashboardId)
        {
            try
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var dashboard = await _dbContext.Dashboards
                            .Include(x => x.DashboardItems)
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .FirstOrDefaultAsync(x => x.Id == dashboardId);

                        if (dashboard == null)
                        {
                            return new OperationResult(
                                false,
                                _localizationService.GetString("DashboardNotFound"));
                        }

                        foreach (var dashboardItem in dashboard.DashboardItems)
                        {
                            await dashboardItem.Delete(_dbContext);
                        }

                        await dashboard.Delete(_dbContext);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }

                return new OperationResult(
                    true,
                    _localizationService.GetString("DashboardRemovedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileRemovingDashboard"));
            }
        }

        public async Task<OperationDataResult<DashboardViewModel>> GetSingleForView(int dashboardId)
        {
            try
            {
                Debugger.Break();
                var core = await _coreHelper.GetCore();
                var dashboard = await _dbContext.Dashboards
                    .Include(x => x.DashboardItems)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.DashboardItems.Any(i => i.WorkflowState != Constants.WorkflowStates.Removed))
                    .FirstOrDefaultAsync(x => x.Id == dashboardId);

                if (dashboard == null)
                {
                    return new OperationDataResult<DashboardViewModel>(
                        false,
                        _localizationService.GetString("DashboardNotFound"));
                }

                // Dashboard
                var result = new DashboardViewModel
                {
                    Id = dashboard.Id,
                    DashboardName = dashboard.Name,
                };

                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    result.SurveyName = await sdkContext.question_sets
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Id == dashboard.SurveyId)
                        .Select(x => x.Name)
                        .FirstOrDefaultAsync();

                    if (dashboard.LocationId != null)
                    {
                        result.LocationName = await sdkContext.sites
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Id == dashboard.LocationId)
                            .Select(x => x.Name)
                            .FirstOrDefaultAsync();
                    }

                    if (dashboard.TagId != null)
                    {
                        result.TagName = await sdkContext.tags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Id == dashboard.TagId)
                            .Select(x => x.Name)
                            .FirstOrDefaultAsync();
                    }
                }

                // Dashboard items
                foreach (var dashboardItem in dashboard.DashboardItems)
                {
                    var dashboardItemModel = new DashboardItemViewModel()
                    {
                        Id = dashboardItem.Id,
                        Position = dashboardItem.Position,
                        Period = dashboardItem.Period,
                        ChartType = dashboardItem.ChartType,
                    };

                    using (var sdkContext = core.dbContextHelper.GetDbContext())
                    {
                        var languages = await sdkContext.languages.ToListAsync();
                        foreach (var language in languages)
                        {
                            dashboardItemModel.FirstQuestionName = await sdkContext.QuestionTranslations
                                .AsNoTracking()
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.Question.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.Language.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                .Where(x => x.Language.Id == language.Id)
                                .Select(x => x.Name)
                                .FirstOrDefaultAsync();

                            if (dashboardItemModel.FirstQuestionName != null)
                            {
                                break;
                            }
                        }

                        if (dashboardItem.FilterQuestionId != null)
                        {
                            foreach (var language in languages)
                            {
                                dashboardItemModel.FilterQuestionName = await sdkContext.QuestionTranslations
                                    .AsNoTracking()
                                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.Question.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.Language.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.QuestionId == dashboardItem.FilterQuestionId)
                                    .Where(x => x.Language.Id == language.Id)
                                    .Select(x => x.Name)
                                    .FirstOrDefaultAsync();

                                if (dashboardItemModel.FilterQuestionName != null)
                                {
                                    break;
                                }
                            }
                        }

                        if (dashboardItem.FilterAnswerId != null)
                        {
                            foreach (var language in languages)
                            {
                                dashboardItemModel.FilterAnswerName = await sdkContext.OptionTranslations
                                    .AsNoTracking()
                                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.option.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.Language.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.OptionId == dashboardItem.FilterAnswerId)
                                    .Where(x => x.Language.Id == language.Id)
                                    .Select(x => x.Name)
                                    .FirstOrDefaultAsync();

                                if (dashboardItemModel.FilterAnswerName != null)
                                {
                                    break;
                                }
                            }
                        }


                        // Chart data
                        var singleData = false;
                        switch (dashboardItem.ChartType)
                        {
                            case DashboardChartTypes.Line:
                                singleData = false;
                                break;
                            case DashboardChartTypes.Pie:
                                singleData = true;
                                break;
                            case DashboardChartTypes.HorizontalBar:
                                singleData = true;
                                break;
                            case DashboardChartTypes.HorizontalBarStacked:
                                singleData = false;
                                break;
                            case DashboardChartTypes.HorizontalBarGrouped:
                                singleData = false;
                                break;
                            case DashboardChartTypes.VerticalBar:
                                singleData = true;
                                break;
                            case DashboardChartTypes.VerticalBarStacked:
                                singleData = false;
                                break;
                            case DashboardChartTypes.VerticalBarGrouped:
                                singleData = false;
                                break;
                            default:
                                throw new ArgumentOutOfRangeException();
                        }

                        if (singleData)
                        {
                            var answerQueryable = sdkContext.answer_values
                                .AsNoTracking()
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                .AsQueryable();


                            answerQueryable = answerQueryable
                                .Where(x => x.Answer.QuestionSetId == dashboard.SurveyId);

                            if (dashboard.LocationId != null)
                            {
                                answerQueryable = answerQueryable
                                    .Where(x => x.Answer.SiteId == dashboard.LocationId);
                            }

                            if (dashboard.TagId != null) // DELETE 
                            {
                                // TODO check it for tags
                            }

                            if (dashboardItem.FilterQuestionId != null)
                            {
                                answerQueryable = answerQueryable
                                    .Where(x => x.QuestionId == dashboardItem.FilterQuestionId);
                            }

                            if (dashboardItem.FilterAnswerId != null)
                            {
                                answerQueryable = answerQueryable
                                    .Where(x => x.OptionsId == dashboardItem.FilterAnswerId);
                            }

                            foreach (var language in languages)
                            {
                                var dat = answerQueryable
                                    .Select(x => new DashboardViewChartDataSingleModel()
                                    {
                                        Name = x.Option.OptionTranslationses
                                            .Where(qt => qt.WorkflowState != Constants.WorkflowStates.Removed)
                                            .Where(qt => qt.Language.Id == language.Id)
                                            .Select(qt => qt.Name)
                                            .FirstOrDefault(),
                                    }).ToList();
                            }



                        }

                        // TODO Chart data 
                    }

                    // Add Item
                    result.Items.Add(dashboardItemModel);
                }

                return new OperationDataResult<DashboardViewModel>(
                    true,
                    result);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<DashboardViewModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingDashboardInfo"));
            }
        }

        public async Task<OperationDataResult<DashboardEditModel>> GetSingleForEdit(int dashboardId)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var dashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x=>new DashboardEditModel
                    {
                        Id = x.Id,
                        LocationId = x.LocationId,
                        TagId = x.TagId,
                        SurveyId = x.SurveyId,
                        DashboardName = x.Name,
                        Items = x.DashboardItems
                            .Select(i => new DashboardItemModel
                            {
                                Id = i.Id,
                                ChartType = i.ChartType,
                                FilterAnswerId = i.FilterAnswerId,
                                FilterQuestionId = i.FilterQuestionId,
                                FirstQuestionId = i.FirstQuestionId,
                                Period = i.Period,
                                Position = i.Position,
                            })
                            .OrderBy(i => i.Position)
                            .ToList(),
                    })
                    .FirstOrDefaultAsync(x => x.Id == dashboardId);

                if (dashboard == null)
                {
                    return new OperationDataResult<DashboardEditModel>(
                        false,
                        _localizationService.GetString("DashboardNotFound"));
                }

                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    dashboard.SurveyName = await sdkContext.question_sets
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Id == dashboard.SurveyId)
                        .Select(x => x.Name)
                        .FirstOrDefaultAsync();

                    if (dashboard.LocationId != null)
                    {
                        dashboard.LocationName = await sdkContext.sites
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Id == dashboard.LocationId)
                            .Select(x => x.Name)
                            .FirstOrDefaultAsync();
                    }

                    if (dashboard.TagId != null)
                    {
                        dashboard.TagName = await sdkContext.tags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Id == dashboard.TagId)
                            .Select(x => x.Name)
                            .FirstOrDefaultAsync();
                    }
                }

                return new OperationDataResult<DashboardEditModel>(
                    true,
                    dashboard);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<DashboardEditModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingDashboardInfo"));
            }
        }
        private int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}