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

namespace InsightDashboard.Pn.Test.Helpers
{
    using System;
    using Infrastructure.Models.Dashboards;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Newtonsoft.Json;
    using NUnit.Framework;

    public static class DashboardHelpers
    {
        public static DashboardViewModel GetSingleDashBoard()
        {
            var singleString = FileHelper.ReadFileFromResources("single-data");
            return JsonConvert.DeserializeObject<DashboardViewModel>(singleString);
        }
        public static DashboardViewModel GetMultiDashBoard()
        {
            var singleString = FileHelper.ReadFileFromResources("multi-data");
            return JsonConvert.DeserializeObject<DashboardViewModel>(singleString);
        }
        public static DashboardViewModel GetMultiStackedDashBoard()
        {
            var singleString = FileHelper.ReadFileFromResources("multi-stacked-data");
            return JsonConvert.DeserializeObject<DashboardViewModel>(singleString);
        }

        public static DashboardItem GetDashboardItemFromModel(DashboardItemViewModel viewModel)
        {
            var rnd = new Random();

            var dashboardItem = new DashboardItem
            {
                Id = viewModel.Id,
                UpdatedByUserId = rnd.Next(1, 255),
                CreatedByUserId = rnd.Next(1, 255),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                WorkflowState = Constants.WorkflowStates.Created,
                Position = viewModel.Position,
                CompareEnabled = viewModel.CompareEnabled,
                CalculateAverage = viewModel.CalculateAverage,
                DashboardId = viewModel.Id,
                ChartType = viewModel.ChartType,
                Period = viewModel.Period,
                FilterAnswerId = viewModel.FilterAnswerId,
                FilterQuestionId = viewModel.FilterQuestionId,
                FirstQuestionId = viewModel.FirstQuestionId,
            };

            return dashboardItem;
        }
        public static DashboardItemViewModel CopyDashboardItem(DashboardItemViewModel viewModel)
        {
            var dashboardItem = new DashboardItemViewModel
            {
                Position = viewModel.Position,
                CompareEnabled = viewModel.CompareEnabled,
                CalculateAverage = viewModel.CalculateAverage,
                ChartType = viewModel.ChartType,
                Period = viewModel.Period,
                FilterAnswerId = viewModel.FilterAnswerId,
                FilterQuestionId = viewModel.FilterQuestionId,
                FirstQuestionId = viewModel.FirstQuestionId,
                FilterAnswerName = viewModel.FilterAnswerName,
                FilterQuestionName = viewModel.FilterQuestionName,
                Id = viewModel.Id,
                FirstQuestionName = viewModel.FirstQuestionName,
            };

            return dashboardItem;
        }

        public static void CheckData(
            DashboardItemViewModel originalItem,
            DashboardItemViewModel processedItem)
        {
            Assert.AreEqual(
                originalItem.Id,
                processedItem.Id);
            Assert.AreEqual(
                originalItem.CalculateAverage,
                processedItem.CalculateAverage);
            Assert.AreEqual(
                originalItem.ChartType,
                processedItem.ChartType);
            Assert.AreEqual(
                originalItem.CompareEnabled,
                processedItem.CompareEnabled);
            Assert.AreEqual(
                originalItem.Period,
                processedItem.Period);
            Assert.AreEqual(
                originalItem.Position,
                processedItem.Position);
            Assert.AreEqual(
                originalItem.Position,
                processedItem.Position);
            Assert.AreEqual(
                originalItem.ChartData.Single.Count,
                processedItem.ChartData.Single.Count);
            Assert.AreEqual(
                originalItem.ChartData.Multi.Count,
                processedItem.ChartData.Multi.Count);
            Assert.AreEqual(
                originalItem.ChartData.MultiStacked.Count,
                processedItem.ChartData.MultiStacked.Count);

            // Single data
            for (var index = 0; index < originalItem.ChartData.Single.Count; index++)
            {
                var dataOriginal = originalItem.ChartData.Single[index];
                var dataProcessed = processedItem.ChartData.Single[index];

                Assert.AreEqual(dataOriginal.Name, dataProcessed.Name);
                Assert.AreEqual(dataOriginal.Value, dataProcessed.Value);
            }

            // Multi data
            for (var index = 0; index < originalItem.ChartData.Multi.Count; index++)
            {
                var dataOriginal = originalItem.ChartData.Multi[index];
                var dataProcessed = processedItem.ChartData.Multi[index];

                Assert.AreEqual(dataOriginal.Name, dataProcessed.Name);

                for (var i = 0; i < dataOriginal.Series.Count; i++)
                {
                    var originalSeries = dataOriginal.Series[i];
                    var originalProcessed = dataProcessed.Series[i];

                    Assert.AreEqual(originalSeries.Name, originalProcessed.Name);
                    Assert.AreEqual(originalSeries.Value, originalProcessed.Value);
                }
            }

            // Multi stacked data
            for (var index = 0; index < originalItem.ChartData.MultiStacked.Count; index++)
            {
                var dataOriginal = originalItem.ChartData.MultiStacked[index];
                var dataProcessed = processedItem.ChartData.MultiStacked[index];

                Assert.AreEqual(dataOriginal.Id, dataProcessed.Id);
                Assert.AreEqual(dataOriginal.Name, dataProcessed.Name);

                for (var i = 0; i < dataOriginal.Series.Count; i++)
                {
                    var originalSeries = dataOriginal.Series[i];
                    var processedSeries = dataProcessed.Series[i];

                    Assert.AreEqual(originalSeries.Name, processedSeries.Name);

                    for (var y = 0; y < originalSeries.Series.Count; y++)
                    {
                        var originalSeriesSeries = originalSeries.Series[y];
                        var processedSeriesSeries = processedSeries.Series[y];

                        Assert.AreEqual(originalSeriesSeries.Name, processedSeriesSeries.Name);
                        Assert.AreEqual(originalSeriesSeries.Value, processedSeriesSeries.Value);
                    }
                }
            }
        }
    }
}