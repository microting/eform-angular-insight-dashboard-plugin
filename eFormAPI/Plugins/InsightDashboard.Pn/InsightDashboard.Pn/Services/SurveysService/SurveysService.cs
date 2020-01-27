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
    using System.Collections.Generic;
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
                Debugger.Break();
                var core = await _coreHelper.GetCore();
                var result = new SurveyConfigsListModel();
                using (var sdkContext = core.dbContextHelper.GetDbContext())
                {
                    var surveys = await sdkContext.survey_configurations
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(requestModel.Offset)
                        .Take(requestModel.PageSize)
                        .Select(x => new SurveyConfigModel()
                        {
                            Id = x.Id,
                            SurveyName = x.QuestionSet.Name,
                            SurveyId = x.QuestionSet.Id,
                            Locations = x.SiteSurveyConfigurations
                                .Where(l => l.Site.WorkflowState != Constants.WorkflowStates.Removed)
                                .Select(l => new CommonDictionaryModel
                                {
                                    Id = l.Site.Id,
                                    Name = l.Site.Name,
                                }).ToList()

                        }).ToListAsync();

                    result.Entities = surveys;

                    result.Total = await sdkContext.survey_configurations
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => x.Id)
                        .CountAsync();
                }

                return new OperationDataResult<SurveyConfigsListModel>(true, result);

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<SurveyConfigsListModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Create(SurveyConfigCreateModel createModel)
        {
            try
            {
                Debugger.Break();
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
                                _localizationService.GetString(""));
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
                    _localizationService.GetString(""));
            }
        }


        public async Task<OperationResult> Update(SurveyConfigUpdateModel updateModel)
        {
            try
            {
                Debugger.Break();
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
                                    _localizationService.GetString(""));
                            }

                            surveyConfiguration.QuestionSetId = updateModel.SurveyId;
                            await surveyConfiguration.Update(sdkContext);

                            // Locations
                            var siteIds = surveyConfiguration.SiteSurveyConfigurations
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
                                _localizationService.GetString(""));
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
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> ChangeStatus(SurveyConfigUpdateStatusModel configUpdateStatusModel)
        {
            try
            {
                Debugger.Break();
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
                            _localizationService.GetString(""));
                    }

                    // TODO Change status
                    return new OperationResult(
                        true,
                        _localizationService.GetString(""));
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                Debugger.Break();
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
                            _localizationService.GetString(""));
                    }

                    await surveyConfiguration.Delete(sdkContext);

                    return new OperationResult(
                        true,
                        _localizationService.GetString(""));
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString(""));
            }
        }
    }
}