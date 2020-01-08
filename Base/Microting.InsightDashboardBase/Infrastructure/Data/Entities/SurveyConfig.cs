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

namespace Microting.InsightDashboardBase.Infrastructure.Data.Entities
{
    using System;
    using System.Threading.Tasks;
    using eForm.Infrastructure.Constants;
    using eFormApi.BasePn.Infrastructure.Database.Base;
    using Microsoft.EntityFrameworkCore;

    public class SurveyConfig : BaseEntity
    {
        public async Task Create(InsightDashboardPnDbContext dbContext)
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            Version = 1;
            WorkflowState = Constants.WorkflowStates.Created;

            dbContext.SurveyConfigs.Add(this);
            await dbContext.SaveChangesAsync();

            dbContext.SurveyConfigVersions.Add(MapSurveyConfigVersion(this));
            await dbContext.SaveChangesAsync();
        }

        public async Task Update(InsightDashboardPnDbContext dbContext)
        {
            SurveyConfig surveyConfig = await dbContext.SurveyConfigs.FirstOrDefaultAsync(x => x.Id == Id);

            if (surveyConfig == null)
            {
                throw new NullReferenceException($"Could not find item with id: {Id}");
            }

            surveyConfig.WorkflowState = WorkflowState;
            surveyConfig.UpdatedAt = UpdatedAt;
            surveyConfig.UpdatedByUserId = UpdatedByUserId;

            if (dbContext.ChangeTracker.HasChanges())
            {
                surveyConfig.UpdatedAt = DateTime.UtcNow;
                surveyConfig.Version += 1;

                dbContext.SurveyConfigVersions.Add(MapSurveyConfigVersion(surveyConfig));
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task Delete(InsightDashboardPnDbContext dbContext)
        {
            SurveyConfig surveyConfig = await dbContext.SurveyConfigs.FirstOrDefaultAsync(x => x.Id == Id);

            if (surveyConfig == null)
            {
                throw new NullReferenceException($"Could not find Installation with id: {Id}");
            }

            surveyConfig.WorkflowState = Constants.WorkflowStates.Removed;
            
            if (dbContext.ChangeTracker.HasChanges())
            {
                surveyConfig.UpdatedAt = DateTime.UtcNow;
                surveyConfig.Version += 1;

                dbContext.SurveyConfigVersions.Add(MapSurveyConfigVersion(surveyConfig));
                await dbContext.SaveChangesAsync();
            }
        }

        private SurveyConfigVersion MapSurveyConfigVersion(SurveyConfig surveyConfig)
        {
            SurveyConfigVersion surveyConfigVersion = new SurveyConfigVersion
            {
                SurveyConfigId = surveyConfig.Id,
                CreatedAt = surveyConfig.CreatedAt,
                UpdatedAt = surveyConfig.UpdatedAt,
                Version = surveyConfig.Version,
                WorkflowState = surveyConfig.WorkflowState,
                UpdatedByUserId = surveyConfig.UpdatedByUserId,
                CreatedByUserId = surveyConfig.CreatedByUserId
            };

            return surveyConfigVersion;
        }
    }
}