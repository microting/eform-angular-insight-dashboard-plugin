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

namespace InsightDashboard.Pn.Test.Helpers;

using System;
using System.Collections.Generic;
using System.Linq;
using Infrastructure.Models.Dashboards;
using Microting.eForm.Infrastructure.Constants;
using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
using Newtonsoft.Json;
using NUnit.Framework;

public static class DashboardHelpers
{
    public static DashboardViewModel GetDashboardViewModel(string name)
    {
        var singleString = FileHelper.ReadFileFromResources(name);
        return JsonConvert.DeserializeObject<DashboardViewModel>(singleString);
    }

    public static Dictionary<DashboardViewModel, string> GetChartDataDashBoards()
    {
        var result = new Dictionary<DashboardViewModel, string>();

        var name = "DashboardHorizontalBar.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardLine.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardLineScore.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardMultiChart.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardStackedBar.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardStackedGrouped.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardTotal.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardTotalN.data";
        result.Add(GetDashboardViewModel(name), name);
        name = "DashboardVerticalBar.data";
        result.Add(GetDashboardViewModel(name), name);

        return result;
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
            CompareLocationsTags = viewModel.CompareLocationsTags
                .Select(x => new DashboardItemCompare()
                {
                    LocationId = x.LocationId,
                    Position = x.Position,
                    TagId = x.TagId
                })
                .ToList(),
            IgnoredAnswerValues = viewModel.IgnoredAnswerValues
                .Select(x => new DashboardItemIgnoredAnswer()
                {
                    AnswerId = x.AnswerId,
                })
                .ToList(),
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
            CompareLocationsTags = viewModel.CompareLocationsTags,
            IgnoredAnswerValues = viewModel.IgnoredAnswerValues,
            FirstQuestionType = viewModel.FirstQuestionType,
        };

        return dashboardItem;
    }

    public static void CheckData(
        DashboardItemViewModel originalItem,
        DashboardItemViewModel processedItem,
        DashboardViewModel originalViewModel,
        string templateName)
    {
        var originalItemString = JsonConvert.SerializeObject(originalItem);
        var processedItemString = JsonConvert.SerializeObject(processedItem);

        // Build info
        var message = $"Check data for template: \"{templateName}\"\n" +
                      $"Dashboard id: {originalViewModel.Id}\n" +
                      $"Dashboard name: {originalViewModel.DashboardName}\n" +
                      "Dashboard item:\n" +
                      $"Id: {originalItem.Id}\n" +
                      $"Chart type: {originalItem.ChartType}\n" +
                      $"Calculate average: {originalItem.CalculateAverage}\n" +
                      $"Compare enabled: {originalItem.CompareEnabled}\n" +
                      $"Period: {originalItem.Period}\n" +
                      $"Position: {originalItem.Position}\n" +
                      $"First question: ({originalItem.FirstQuestionId}, {originalItem.FirstQuestionName})" +
                      "\n\n" +
                      $"Original item: \n{originalItemString}" +
                      "\n\n" +
                      $"Processed item: \n{processedItemString}" +
                      "\n\n" +
                      "Test error: \n";

        Assert.That(
            originalItem.Id, Is.EqualTo(
                processedItem.Id),
            message);
        Assert.That(
            originalItem.CalculateAverage, Is.EqualTo(
                processedItem.CalculateAverage),
            message);
        Assert.That(
            originalItem.ChartType, Is.EqualTo(
                processedItem.ChartType),
            message);
        Assert.That(
            originalItem.CompareEnabled, Is.EqualTo(
                processedItem.CompareEnabled),
            message);
        Assert.That(
            originalItem.Period, Is.EqualTo(
                processedItem.Period),
            message);
        Assert.That(
            originalItem.Position, Is.EqualTo(
                processedItem.Position),
            message);
        Assert.That(
            originalItem.Position, Is.EqualTo(
                processedItem.Position),
            message);
        Assert.That(
            originalItem.ChartData.Single.Count, Is.EqualTo(
                processedItem.ChartData.Single.Count),
            message);
        Assert.That(
            originalItem.ChartData.Multi.Count, Is.EqualTo(
                processedItem.ChartData.Multi.Count),
            message);
        Assert.That(
            originalItem.ChartData.MultiStacked.Count, Is.EqualTo(
                processedItem.ChartData.MultiStacked.Count),
            message);

        // Single data
        for (var index = 0; index < originalItem.ChartData.Single.Count; index++)
        {
            var dataOriginal = originalItem.ChartData.Single[index];
            var dataProcessed = processedItem.ChartData.Single[index];

            Assert.That(
                dataOriginal.Name, Is.EqualTo(
                    dataProcessed.Name),
                message);
            Assert.That(
                dataOriginal.Value, Is.EqualTo(
                    dataProcessed.Value),
                message);
        }

        // Multi data
        for (var index = 0; index < originalItem.ChartData.Multi.Count; index++)
        {
            var dataOriginal = originalItem.ChartData.Multi[index];
            var dataProcessed = processedItem.ChartData.Multi[index];

            Assert.That(
                dataOriginal.Name, Is.EqualTo(
                    dataProcessed.Name),
                message);

            for (var i = 0; i < dataOriginal.Series.Count; i++)
            {
                var originalSeries = dataOriginal.Series[i];
                var originalProcessed = dataProcessed.Series[i];

                Assert.That(
                    originalSeries.Name, Is.EqualTo(
                        originalProcessed.Name),
                    message);
                Assert.That(
                    originalSeries.Value, Is.EqualTo(
                        originalProcessed.Value),
                    message);
            }
        }

        // Multi stacked data
        for (var index = 0; index < originalItem.ChartData.MultiStacked.Count; index++)
        {
            var dataOriginal = originalItem.ChartData.MultiStacked[index];
            var dataProcessed = processedItem.ChartData.MultiStacked[index];

            Assert.That(
                dataOriginal.Id, Is.EqualTo(
                    dataProcessed.Id),
                message);
            Assert.That(
                dataOriginal.Name, Is.EqualTo(
                    dataProcessed.Name),
                message);

            for (var i = 0; i < dataOriginal.Series.Count; i++)
            {
                var originalSeries = dataOriginal.Series[i];
                var processedSeries = dataProcessed.Series[i];

                Assert.That(
                    originalSeries.Name, Is.EqualTo(
                        processedSeries.Name),
                    message);

                for (var y = 0; y < originalSeries.Series.Count; y++)
                {
                    var originalSeriesSeries = originalSeries.Series[y];
                    var processedSeriesSeries = processedSeries.Series[y];

                    Assert.That(
                        originalSeriesSeries.Name, Is.EqualTo(
                            processedSeriesSeries.Name),
                        message);
                    Assert.That(
                        originalSeriesSeries.Value, Is.EqualTo(
                            processedSeriesSeries.Value),
                        message);
                }
            }
        }

        // Raw chart data
        for (var x = 0; x < originalItem.ChartData.RawData.Count; x++)
        {
            var rawDataItemOriginal = originalItem.ChartData.RawData[x];
            var rawDataItemProcessed = processedItem.ChartData.RawData[x];

            // Check table header
            for (var i = 0; i < rawDataItemOriginal.RawHeaders.Count; i++)
            {
                Assert.That(
                    rawDataItemOriginal.RawHeaders[i], Is.EqualTo(
                        rawDataItemProcessed.RawHeaders[i]),
                    message);
            }

            for (var index = 0; index < rawDataItemOriginal.RawDataItems.Count; index++)
            {
                var dataOriginal = rawDataItemOriginal.RawDataItems[index];
                var dataProcessed = rawDataItemProcessed.RawDataItems[index];

                Assert.That(
                    dataOriginal.RawValueName, Is.EqualTo(
                        dataProcessed.RawValueName),
                    message);
                Assert.That(
                    dataOriginal.RawDataValues.Count, Is.EqualTo(
                        dataProcessed.RawDataValues.Count),
                    message);

                // Check table data
                for (var i = 0; i < dataOriginal.RawDataValues.Count; i++)
                {
                    var originalSeries = dataOriginal.RawDataValues[i];
                    var processedSeries = dataProcessed.RawDataValues[i];

                    Assert.That(
                        originalSeries.ValueName, Is.EqualTo(
                            processedSeries.ValueName),
                        message);

                    // Values
                    for (var y = 0; y < originalSeries.Amounts.Length; y++)
                    {
                        var originalValue = originalSeries.Percents[y];
                        var processedValue = processedSeries.Percents[y];

                        Assert.That(
                            originalValue, Is.EqualTo(
                                processedValue),
                            message);
                    }

                    // Amounts
                    for (var y = 0; y < originalSeries.Amounts.Length; y++)
                    {
                        var originalAmount = originalSeries.Amounts[y];
                        var processedAmount = processedSeries.Amounts[y];

                        Assert.That(
                            originalAmount, Is.EqualTo(
                                processedAmount),
                            message);
                    }
                }
            }
        }
    }
}