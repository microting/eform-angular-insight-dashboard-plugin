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

namespace Microting.InsightDashboardBase.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Threading.Tasks;
    using eForm.Infrastructure.Constants;
    using Infrastructure.Data.Entities;
    using Microsoft.EntityFrameworkCore;
    using NUnit.Framework;

    [TestFixture]
    public class SurveyConfigUTests : DbTestFixture
    {
        [Test]
        public async Task SurveyConfig_Create_DoesCreate()
        {
            // Arrange
            Random rnd = new Random();

            SurveyConfig surveyConfig = new SurveyConfig
            {
                UpdatedByUserId = rnd.Next(1, 255),
                CreatedByUserId = rnd.Next(1, 255)
            };

            // Act
            await surveyConfig.Create(DbContext);

            // Assert
            SurveyConfig dbSurveyConfig = DbContext.SurveyConfigs.AsNoTracking().First();
            List<SurveyConfig> surveyConfigs = DbContext.SurveyConfigs.AsNoTracking().ToList();
            SurveyConfigVersion dbSurveyConfigVersion = DbContext.SurveyConfigVersions.AsNoTracking().First();
            List<SurveyConfigVersion> surveyConfigVersions = DbContext.SurveyConfigVersions.AsNoTracking().ToList();

            Assert.NotNull(dbSurveyConfig);
            Assert.NotNull(dbSurveyConfigVersion);
            Assert.AreEqual(1, surveyConfigs.Count);
            Assert.AreEqual(1, surveyConfigVersions.Count);

            Assert.AreEqual(surveyConfig.Id, dbSurveyConfig.Id);
            Assert.AreEqual(surveyConfig.Version, dbSurveyConfig.Version);
            Assert.AreEqual(surveyConfig.WorkflowState, dbSurveyConfig.WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(CultureInfo.InvariantCulture), dbSurveyConfig.CreatedAt.ToString(CultureInfo.InvariantCulture));
            Assert.AreEqual(surveyConfig.CreatedByUserId, dbSurveyConfig.CreatedByUserId);
            Assert.AreEqual(surveyConfig.UpdatedAt.ToString(), dbSurveyConfig.UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, dbSurveyConfig.UpdatedByUserId);
        }

        [Test]
        public async Task SurveyConfig_Update_DoesUpdate()
        {
            // Arrange
            Random rnd = new Random();

            SurveyConfig surveyConfig = new SurveyConfig
            {
                UpdatedByUserId = rnd.Next(1, 255),
                CreatedByUserId = rnd.Next(1, 255)
            };

            await surveyConfig.Create(DbContext);

            // Act
            var oldUpdatedAt = surveyConfig.UpdatedAt.GetValueOrDefault();

            await surveyConfig.Update(DbContext);

            // Assert
            SurveyConfig dbSurveyConfig = DbContext.SurveyConfigs.AsNoTracking().First();
            List<SurveyConfig> surveyConfigs = DbContext.SurveyConfigs.AsNoTracking().ToList();
            List<SurveyConfigVersion> surveyConfigVersion = DbContext.SurveyConfigVersions.AsNoTracking().ToList();

            Assert.NotNull(dbSurveyConfig);
            Assert.AreEqual(1, surveyConfigs.Count);
            Assert.AreEqual(2, surveyConfigVersion.Count);

            Assert.AreEqual(surveyConfig.Id, dbSurveyConfig.Id);
            Assert.AreEqual(surveyConfig.Version, dbSurveyConfig.Version);
            Assert.AreEqual(surveyConfig.WorkflowState, dbSurveyConfig.WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(CultureInfo.InvariantCulture), dbSurveyConfig.CreatedAt.ToString(CultureInfo.InvariantCulture));
            Assert.AreEqual(surveyConfig.CreatedByUserId, dbSurveyConfig.CreatedByUserId);
            Assert.AreEqual(surveyConfig.UpdatedAt.ToString(), dbSurveyConfig.UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, dbSurveyConfig.UpdatedByUserId);

            Assert.AreEqual(surveyConfig.Id, surveyConfigVersion[0].SurveyConfigId);
            Assert.AreEqual(1, surveyConfigVersion[0].Version);
            Assert.AreEqual(surveyConfig.WorkflowState, surveyConfigVersion[0].WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(), surveyConfigVersion[0].CreatedAt.ToString());
            Assert.AreEqual(surveyConfig.CreatedByUserId, surveyConfigVersion[0].CreatedByUserId);
            Assert.AreEqual(oldUpdatedAt.ToString(), surveyConfigVersion[0].UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, surveyConfigVersion[0].UpdatedByUserId);

            Assert.AreEqual(surveyConfig.Id, surveyConfigVersion[1].SurveyConfigId);
            Assert.AreEqual(2, surveyConfigVersion[1].Version);
            Assert.AreEqual(surveyConfig.WorkflowState, surveyConfigVersion[1].WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(), surveyConfigVersion[1].CreatedAt.ToString());
            Assert.AreEqual(surveyConfig.CreatedByUserId, surveyConfigVersion[1].CreatedByUserId);
            Assert.AreEqual(surveyConfig.UpdatedAt.ToString(), surveyConfigVersion[1].UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, surveyConfigVersion[1].UpdatedByUserId);
        }

        [Test]
        public async Task SurveyConfig_Delete_DoesDelete()
        {
            // Arrange
            Random rnd = new Random();

            SurveyConfig surveyConfig = new SurveyConfig
            {
                UpdatedByUserId = rnd.Next(1, 255),
                CreatedByUserId = rnd.Next(1, 255)
            };

            await surveyConfig.Create(DbContext);

            // Act
            var oldUpdatedAt = surveyConfig.UpdatedAt.GetValueOrDefault();

            await surveyConfig.Delete(DbContext);

            // Assert
            SurveyConfig dbSurveyConfig = DbContext.SurveyConfigs.AsNoTracking().First();
            List<SurveyConfig> surveyConfigs = DbContext.SurveyConfigs.AsNoTracking().ToList();
            List<SurveyConfigVersion> surveyConfigVersion = DbContext.SurveyConfigVersions.AsNoTracking().ToList();

            Assert.NotNull(dbSurveyConfig);
            Assert.AreEqual(1, surveyConfigs.Count);
            Assert.AreEqual(2, surveyConfigVersion.Count);

            Assert.AreEqual(surveyConfig.Id, dbSurveyConfig.Id);
            Assert.AreEqual(surveyConfig.Version, dbSurveyConfig.Version);
            Assert.AreEqual(Constants.WorkflowStates.Removed, dbSurveyConfig.WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(), dbSurveyConfig.CreatedAt.ToString());
            Assert.AreEqual(surveyConfig.CreatedByUserId, dbSurveyConfig.CreatedByUserId);
            Assert.AreEqual(surveyConfig.UpdatedAt.ToString(), dbSurveyConfig.UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, dbSurveyConfig.UpdatedByUserId);

            Assert.AreEqual(surveyConfig.Id, surveyConfigVersion[0].SurveyConfigId);
            Assert.AreEqual(1, surveyConfigVersion[0].Version);
            Assert.AreEqual(Constants.WorkflowStates.Created, surveyConfigVersion[0].WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(), surveyConfigVersion[0].CreatedAt.ToString());
            Assert.AreEqual(surveyConfig.CreatedByUserId, surveyConfigVersion[0].CreatedByUserId);
            Assert.AreEqual(oldUpdatedAt.ToString(), surveyConfigVersion[0].UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, surveyConfigVersion[0].UpdatedByUserId);

            Assert.AreEqual(surveyConfig.Id, surveyConfigVersion[1].SurveyConfigId);
            Assert.AreEqual(2, surveyConfigVersion[1].Version);
            Assert.AreEqual(Constants.WorkflowStates.Removed, surveyConfigVersion[1].WorkflowState);
            Assert.AreEqual(surveyConfig.CreatedAt.ToString(), surveyConfigVersion[1].CreatedAt.ToString());
            Assert.AreEqual(surveyConfig.CreatedByUserId, surveyConfigVersion[1].CreatedByUserId);
            Assert.AreEqual(surveyConfig.UpdatedAt.ToString(), surveyConfigVersion[1].UpdatedAt.ToString());
            Assert.AreEqual(surveyConfig.UpdatedByUserId, surveyConfigVersion[1].UpdatedByUserId);
        }
    }
}