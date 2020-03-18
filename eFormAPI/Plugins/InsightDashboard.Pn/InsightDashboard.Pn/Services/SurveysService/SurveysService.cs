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

namespace InsightDashboard.Pn.Services.SurveysService
{
    using System;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using Infrastructure.Models.Surveys;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class SurveysService : ISurveysService
    {
        private readonly ILogger<SurveysService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly IEFormCoreService _coreHelper;

        public SurveysService(
            ILogger<SurveysService> logger,
            IInsightDashboardLocalizationService localizationService,
            IEFormCoreService coreHelper)
        {
            _logger = logger;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<SurveyConfigsListModel>> Get(SurveyConfigsRequestModel requestModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var result = new SurveyConfigsListModel();
                // await core.GetAllSurveyConfigurations();
                // await core.GetAllQuestionSets();
                await core.GetAllAnswers();
                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    var surveysQueryable = sdkContext.survey_configurations
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AsNoTracking()
                        .AsQueryable();

                    if (!string.IsNullOrEmpty(requestModel.SearchString))
                    {
                        surveysQueryable = surveysQueryable
                            .Where(x => x.Name.Contains(
                                requestModel.SearchString,
                                StringComparison.CurrentCultureIgnoreCase));
                    }

                    if (!string.IsNullOrEmpty(requestModel.Sort))
                    {
                        if (requestModel.IsSortDsc)
                        {
                            switch (requestModel.Sort)
                            {
                                case nameof(SurveyConfigModel.SurveyName):
                                    surveysQueryable = surveysQueryable
                                        .OrderByDescending(x => x.QuestionSet.Name);
                                    break;
                                default:
                                    surveysQueryable = surveysQueryable
                                        .CustomOrderByDescending(requestModel.Sort);
                                    break;
                            }
                        }
                        else
                        {
                            switch (requestModel.Sort)
                            {
                                case nameof(SurveyConfigModel.SurveyName):
                                    surveysQueryable = surveysQueryable
                                        .OrderBy(x => x.QuestionSet.Name);
                                    break;
                                default:
                                    surveysQueryable = surveysQueryable
                                        .CustomOrderBy(requestModel.Sort);
                                    break;
                            }
                        }
                    }
                    else
                    {
                        surveysQueryable = surveysQueryable
                            .OrderBy(x => x.Id);
                    }

                    result.Total = await surveysQueryable
                        .Select(x => x.Id)
                        .CountAsync();

                    surveysQueryable = surveysQueryable
                        .Skip(requestModel.Offset)
                        .Take(requestModel.PageSize);

                    result.Entities = await surveysQueryable
                        .Select(x => new SurveyConfigModel()
                        {
                            Id = x.Id,
                            SurveyName = x.QuestionSet.Name,
                            SurveyId = x.QuestionSet.Id,
                            Locations = x.SiteSurveyConfigurations
                                .Where(l => l.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(l => l.Site.WorkflowState != Constants.WorkflowStates.Removed)
                                .Select(l => new CommonDictionaryModel
                                {
                                    Id = l.Site.Id,
                                    Name = l.Site.Name,
                                }).ToList()
                        }).ToListAsync();
                }

                return new OperationDataResult<SurveyConfigsListModel>(true, result);

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<SurveyConfigsListModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingSurveyConfigurations"));
            }
        }

        public async Task<OperationResult> Create(SurveyConfigCreateModel createModel)
        {
            try
            {

                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    using (var transaction = await sdkContext.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var surveyConfig = new survey_configurations
                            {
                                QuestionSetId = createModel.SurveyId,
                            };

                            await surveyConfig.Create(sdkContext);

                            foreach (var locationsId in createModel.LocationsIds)
                            {
                                var siteSurveyConfig = new site_survey_configurations
                                {
                                    SurveyConfigurationId = surveyConfig.Id,
                                    SiteId = locationsId,
                                };

                                await siteSurveyConfig.Create(sdkContext);
                            }

                            transaction.Commit();
                            return new OperationResult(
                                true,
                                _localizationService.GetString("SurveyConfigurationCreatedSuccessfully"));
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString("ErrorWhileCreatingSurveyConfiguration"));
            }
        }


        public async Task<OperationResult> Update(SurveyConfigUpdateModel updateModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    using (var transaction = await sdkContext.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var surveyConfiguration = await sdkContext.survey_configurations
                                .Include(x => x.SiteSurveyConfigurations)
                                .Where(x => x.Id == updateModel.Id)
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .FirstOrDefaultAsync();

                            if (surveyConfiguration == null)
                            {
                                transaction.Commit();
                                return new OperationResult(
                                    false,
                                    _localizationService.GetString("SurveyConfigurationNotFound"));
                            }

                            surveyConfiguration.QuestionSetId = updateModel.SurveyId;
                            await surveyConfiguration.Update(sdkContext);

                            // Locations
                            var siteIds = surveyConfiguration.SiteSurveyConfigurations
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Select(x => x.SiteId)
                                .ToList();

                            var forRemove = siteIds
                                .Where(x => !updateModel.LocationsIds.Contains(x))
                                .ToList();

                            foreach (var siteIdForRemove in forRemove)
                            {
                                var siteSurveyConfigurations = await sdkContext
                                    .site_survey_configurations
                                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                    .FirstOrDefaultAsync(
                                        x => x.SurveyConfigurationId == surveyConfiguration.Id
                                             && x.SiteId == siteIdForRemove);

                                if (siteSurveyConfigurations != null)
                                {
                                    await siteSurveyConfigurations.Delete(sdkContext);
                                }
                            }

                            var forCreate = updateModel.LocationsIds
                                .Where(x => !siteIds.Contains(x))
                                .ToList();

                            foreach (var siteIdForCreate in forCreate)
                            {
                                var siteSurveyConfigurations = new site_survey_configurations()
                                {
                                    SurveyConfigurationId = surveyConfiguration.Id,
                                    SiteId = siteIdForCreate
                                };

                                await siteSurveyConfigurations.Create(sdkContext);
                            }


                            transaction.Commit();
                            return new OperationResult(
                                true,
                                _localizationService.GetString("SurveyConfigurationUpdatedSuccessfully"));
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString("ErrorWhileUpdatingSurveyConfiguration"));
            }
        }

        public async Task<OperationResult> ChangeStatus(SurveyConfigUpdateStatusModel configUpdateStatusModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    var surveyConfiguration = await sdkContext.survey_configurations
                        .Where(x => x.Id == configUpdateStatusModel.Id)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .FirstOrDefaultAsync();

                    if (surveyConfiguration == null)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString("SurveyConfigurationNotFound"));
                    }

                    // TODO Change status
                    var message = configUpdateStatusModel.IsActive
                        ? "SurveyConfigurationHasBeenActivated"
                        : "SurveyConfigurationHasBeenDeactivated";

                    return new OperationResult(
                        true,
                        _localizationService.GetString(message));
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString("ErrorWhileChangingSurveyConfigurationStatus"));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    var surveyConfiguration = await sdkContext.survey_configurations
                        .Where(x => x.Id == id)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .FirstOrDefaultAsync();

                    if (surveyConfiguration == null)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString("SurveyConfigurationNotFound"));
                    }

                    await surveyConfiguration.Delete(sdkContext);

                    return new OperationResult(
                        true,
                        _localizationService.GetString("SurveyConfigurationHasBeenRemoved"));
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString("ErrorWhileRemovingSurveyConfiguration"));
            }
        }
    }
}