namespace InsightDashboard.Pn.Services.DashboardService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using Infrastructure.Models.Dashboards;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.InsightDashboardBase.Infrastructure.Data;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Microting.InsightDashboardBase.Infrastructure.Enums;

    public class DashboardsListModel
    {
        public int Total { get; set; }

        public List<DashboardModel> DashboardList { get; set; }
            = new List<DashboardModel>();
    }

    public class DashboardViewModel
    {
        public int Id { get; set; }
    }

    public class DashboardEditModel
    {
        public int Id { get; set; }
        public string DashboardName { get; set; }
        public int SurveyId { get; set; }
        public string SurveyName { get; set; }
        public string LocationName { get; set; }
        public int? LocationId { get; set; }
        public string TagName { get; set; }
        public int? TagId { get; set; }

        public List<DashboardItemModel> Items { get; set; }
            = new List<DashboardItemModel>();
    }

    public class DashboardItemModel
    {
        public int Id { get; set; }
        public int FirstQuestionId { get; set; }
        public int FirstQuestionName { get; set; }
        public int FilterQuestionId { get; set; }
        public int FilterQuestionName { get; set; }
        public int FilterAnswerId { get; set; }
        public int FilterAnswerName { get; set; }
        public DashboardPeriodUnits Period { get; set; }
        public DashboardChartTypes ChartType { get; set; }
        public int Position { get; set; }
    }


    public class DashboardModel
    {
        public int Id { get; set; }
        public string DashboardName { get; set; }
        public int SurveyId { get; set; }
        public string SurveyName { get; set; }
        public string LocationName { get; set; }
        public int? LocationId { get; set; }
        public string TagName { get; set; }
        public int? TagId { get; set; }
    }


    public class DashboardCreateModel
    {
        public string Name { get; set; }
        public int SurveyId { get; set; }
        public int? LocationId { get; set; }
        public int? ReportTagId { get; set; }
    }





    public class DashboardService : IDashboardService
    {
        private readonly ILogger<DashboardService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly IEFormCoreService _coreHelper;
        private readonly InsightDashboardPnDbContext _dbContext;

        public DashboardService(
            ILogger<DashboardService> logger,
            IInsightDashboardLocalizationService localizationService,
            IEFormCoreService coreHelper,
            InsightDashboardPnDbContext dbContext)
        {
            _logger = logger;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
            _dbContext = dbContext;
        }

        public async Task<OperationDataResult<DashboardsListModel>> GetAll(DashboardsRequestModel requestModel)
        {
            try
            {
                Debugger.Break();
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

                // TODO Add Sort

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

                Parallel.ForEach(dashboards, async dashboardModel =>
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
                });

                result.DashboardList = dashboards;
                return new OperationDataResult<DashboardsListModel>(true, result);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<DashboardsListModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Create(DashboardCreateModel createModel)
        {
            try
            {
                Debugger.Break();
                var core = await _coreHelper.GetCore();

                // Validation
                if (createModel.LocationId == null && createModel.ReportTagId == null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetString(""));
                }

                if (createModel.LocationId != null && createModel.ReportTagId != null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetString(""));
                }

                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {

                    if (!await sdkContext
                        .question_sets
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AnyAsync(x=>x.Id == createModel.SurveyId))
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString(""));
                    }

                    if (createModel.LocationId != null)
                    {
                        if (!await sdkContext
                            .sites
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .AnyAsync(x => x.Id == createModel.LocationId))
                        {
                            return new OperationResult(
                                false,
                                _localizationService.GetString(""));
                        }
                    }

                    if (createModel.ReportTagId != null)
                    {
                        if (!await sdkContext
                            .tags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .AnyAsync(x => x.Id == createModel.ReportTagId))
                        {
                            return new OperationResult(
                                false,
                                _localizationService.GetString(""));
                        }
                    }
                }

                var dashboard = new Dashboard
                {
                    Name = createModel.Name,
                    SurveyId = createModel.SurveyId,
                    LocationId = createModel.LocationId,
                    TagId = createModel.ReportTagId,
                };

                await dashboard.Create(_dbContext);
                return new OperationResult(
                    true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<DashboardsListModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Copy(int dashboardId)
        {
            try
            {
                Debugger.Break();

                var dashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == dashboardId);

                if (dashboard == null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetString(""));
                }

                await dashboard.Clone(_dbContext);

                var newDashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == dashboard.Id);

                if (newDashboard == null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetString(""));
                }

                return new OperationResult(
                    true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Update(DashboardEditModel editModel)
        {
            try
            {
                Debugger.Break();

                var dashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == editModel.Id);

                if (dashboard == null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetString(""));
                }

                return new OperationResult(
                    true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Remove(int dashboardId)
        {
            try
            {
                Debugger.Break();
                var dashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == dashboardId);

                if (dashboard == null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetString(""));
                }

                await dashboard.Delete(_dbContext);

                return new OperationResult(
                    true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationDataResult<DashboardViewModel>> GetSingleForView(int dashboardId)
        {
            try
            {
                Debugger.Break();
                var result = new DashboardViewModel();
                var dashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == dashboardId);

                if (dashboard == null)
                {
                    return new OperationDataResult<DashboardViewModel>(
                        false,
                        _localizationService.GetString(""));
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
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationDataResult<DashboardEditModel>> GetSingleForEdit(int dashboardId)
        {
            try
            {
                Debugger.Break();
                var result = new DashboardEditModel();
                var dashboard = await _dbContext.Dashboards
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == dashboardId);

                if (dashboard == null)
                {
                    return new OperationDataResult<DashboardEditModel>(
                        false,
                        _localizationService.GetString(""));
                }

                return new OperationDataResult<DashboardEditModel>(
                    true,
                    result);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<DashboardEditModel>(false,
                    _localizationService.GetString(""));
            }
        }
    }
}