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
namespace InsightDashboard.Pn.Services.WordService;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Common.InsightDashboardLocalizationService;
using DashboardService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.InsightDashboardBase.Infrastructure.Enums;
using InsightDashboard.Pn.Infrastructure.Models.Dashboards.RawData;

public class WordService : IWordService
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardService> _logger;
    private readonly IInsightDashboardLocalizationService _localizationService;

    public WordService(IDashboardService dashboardService, ILogger<DashboardService> logger, IInsightDashboardLocalizationService localizationService)
    {
        _dashboardService = dashboardService;
        _logger = logger;
        _localizationService = localizationService;
    }

    public async Task<OperationDataResult<Stream>> GenerateWordDashboard(int dashboardId, List<IFormFile> files)
    {
        try
        {
            var reportDataResult = await _dashboardService
                .GetSingleForView(
                    dashboardId,
                    false);

            if (!reportDataResult.Success)
            {
                return new OperationDataResult<Stream>(false, reportDataResult.Message);
            }

            var dashboardView = reportDataResult.Model;

            // Load the template docx
            var resourceString = "InsightDashboard.Pn.Resources.Templates.WordExport.file.docx";
            var assembly = Assembly.GetExecutingAssembly();
            var docxFileResourceStream = assembly.GetManifestResourceStream(resourceString);
            if (docxFileResourceStream == null)
            {
                throw new InvalidOperationException($"{nameof(docxFileResourceStream)} is null");
            }
            var docxFileStream = new MemoryStream();
            await docxFileResourceStream.CopyToAsync(docxFileStream);

            using (var word = new WordProcessor(docxFileStream))
            {
                // Dashboard header
                word.AddLabelValueParagraph(
                    _localizationService.GetString("Dashboard"),
                    dashboardView.DashboardName);

                word.AddLabelValueParagraph(
                    _localizationService.GetString("Survey"),
                    dashboardView.SurveyName);

                word.AddLabelValueParagraph(
                    _localizationService.GetString("LocationTag"),
                    dashboardView.LocationName ?? dashboardView.TagName);

                // Period
                if (dashboardView.AnswerDates.DateFrom != null)
                {
                    word.AddLabelValueParagraph(
                        _localizationService.GetString("PeriodFrom"),
                        dashboardView.AnswerDates.DateFrom.Value.ToString("dd-MM-yyyy"));
                }

                if (dashboardView.AnswerDates.Today)
                {
                    word.AddLabelValueParagraph(
                        _localizationService.GetString("PeriodTo"),
                        DateTime.Now.ToString("dd-MM-yyyy"));
                }
                else if (dashboardView.AnswerDates.DateTo != null)
                {
                    word.AddLabelValueParagraph(
                        _localizationService.GetString("PeriodTo"),
                        dashboardView.AnswerDates.DateTo.Value.ToString("dd-MM-yyyy"));
                }

                // Dashboard items
                foreach (var dashboardItem in dashboardView.Items)
                {
                    var isText = dashboardItem.FirstQuestionType == "text";

                    // Page break before each item
                    word.AddPageBreak();

                    word.AddLabelValueParagraph(
                        _localizationService.GetString("Question"),
                        dashboardItem.FirstQuestionName);

                    if (!string.IsNullOrEmpty(dashboardItem.FilterQuestionName))
                    {
                        word.AddLabelValueParagraph(
                            _localizationService.GetString("FilterQuestion"),
                            dashboardItem.FilterQuestionName);
                    }

                    if (!string.IsNullOrEmpty(dashboardItem.FilterAnswerName))
                    {
                        word.AddLabelValueParagraph(
                            _localizationService.GetString("FilterAnswer"),
                            dashboardItem.FilterAnswerName);
                    }

                    if (isText)
                    {
                        // Text question table
                        word.AddEmptyParagraph();

                        var headers = new List<string>
                        {
                            _localizationService.GetString("Date"),
                            _localizationService.GetString("Tag"),
                            _localizationService.GetString("Comments")
                        };

                        var rows = new List<List<TableCellData>>();
                        foreach (var dataModel in dashboardItem.TextQuestionData)
                        {
                            rows.Add(new List<TableCellData>
                            {
                                new() { Text = dataModel.Date.ToString("dd-MM-yyyy") },
                                new() { Text = dataModel.LocationName },
                                new() { Text = dataModel.Commentary }
                            });
                        }

                        word.AddTable(headers, rows);
                    }
                    else
                    {
                        // Ignored values
                        if (dashboardItem.IgnoredAnswerValues.Any())
                        {
                            var ignoredAnswerValuesString = string.Join(
                                ", ",
                                dashboardItem.IgnoredAnswerValues
                                    .Select(x => x.Name)
                                    .ToArray());

                            word.AddLabelValueParagraph(
                                _localizationService.GetString("IgnoredValues"),
                                ignoredAnswerValuesString);
                        }

                        // Chart image
                        var imageFile = files.FirstOrDefault(x => x.FileName == dashboardItem.Id.ToString());
                        if (imageFile == null)
                        {
                            throw new InvalidOperationException($"{nameof(imageFile)} is null");
                        }

                        await using (var memoryStream = new MemoryStream())
                        {
                            await imageFile.CopyToAsync(memoryStream);
                            word.AddImage(memoryStream.ToArray());
                        }

                        // Data tables
                        foreach (var rawDataItem in dashboardItem.ChartData.RawData)
                        {
                            if (dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart)
                            {
                                AddGroupedStackedTable(word, rawDataItem);
                            }
                            else
                            {
                                AddStandardTable(word, rawDataItem, dashboardItem.CalculateAverage);
                            }
                        }
                    }
                }
            } // WordProcessor.Dispose() saves and closes the document here

            docxFileStream.Position = 0;
            return new OperationDataResult<Stream>(true, docxFileStream);
        }
        catch (Exception e)
        {
            Trace.TraceError(e.Message);
            _logger.LogError(e.Message);
            return new OperationDataResult<Stream>(
                false,
                _localizationService.GetString("ErrorWhileCreatingWordFile"));
        }
    }

    /// <summary>
    /// Adds a grouped/stacked bar chart table.
    /// </summary>
    private static void AddGroupedStackedTable(WordProcessor word, DashboardViewChartRawDataModel rawDataItem)
    {
        // Build headers: empty, empty, then raw headers
        var headers = new List<string> { "", "" };
        foreach (var rawHeader in rawDataItem.RawHeaders)
        {
            headers.Add(rawHeader);
        }

        var rows = new List<List<TableCellData>>();
        var totalItemNumber = 0;

        foreach (var dataModel in rawDataItem.RawDataItems)
        {
            for (var i = 0; i < dataModel.RawDataValues.Count; i++)
            {
                var dataValue = dataModel.RawDataValues[i];
                totalItemNumber++;
                var isEven = totalItemNumber % 2 == 0;

                var row = new List<TableCellData>();

                // First column: row group name (with row span)
                if (i == 0)
                {
                    row.Add(new TableCellData
                    {
                        Text = dataModel.RawValueName,
                        RowSpan = dataModel.RawDataValues.Count
                    });
                }
                else
                {
                    row.Add(new TableCellData
                    {
                        Text = "",
                        RowSpan = -1 // continuation
                    });
                }

                // Second column: value name
                row.Add(new TableCellData
                {
                    Text = dataValue.ValueName,
                    GrayBackground = isEven
                });

                // Percent columns
                for (var percentIndex = 0; percentIndex < dataValue.Percents.Length; percentIndex++)
                {
                    var isLast = percentIndex == dataValue.Percents.Length - 1;
                    row.Add(new TableCellData
                    {
                        Text = $"{dataValue.Percents[percentIndex]}%",
                        Bold = isLast,
                        GrayBackground = isEven
                    });
                }

                // Amount columns
                for (var amountIndex = 0; amountIndex < dataValue.Amounts.Length; amountIndex++)
                {
                    var isLast = amountIndex == dataValue.Amounts.Length - 1;
                    row.Add(new TableCellData
                    {
                        Text = $"{dataValue.Amounts[amountIndex]}",
                        Bold = isLast,
                        GrayBackground = isEven
                    });
                }

                rows.Add(row);
            }
        }

        word.AddTable(headers, rows);
    }

    /// <summary>
    /// Adds standard data tables (for single and multi data charts).
    /// </summary>
    private static void AddStandardTable(WordProcessor word, DashboardViewChartRawDataModel rawDataItem, bool calculateAverage)
    {
        for (int y = 0; y < rawDataItem.RawDataItems.Count; y++)
        {
            var dataModel = rawDataItem.RawDataItems[y];

            // Headers: value name + raw headers
            var headers = new List<string> { dataModel.RawValueName };
            foreach (var rawHeader in rawDataItem.RawHeaders)
            {
                headers.Add(rawHeader);
            }

            // Percent rows
            var rows = new List<List<TableCellData>>();
            for (var i = 0; i < dataModel.RawDataValues.Count; i++)
            {
                var dataValue = dataModel.RawDataValues[i];
                var isLastRow = i == dataModel.RawDataValues.Count - 1;

                var row = new List<TableCellData>
                {
                    new() { Text = dataValue.ValueName, Bold = isLastRow }
                };

                foreach (var valuePercent in dataValue.Percents)
                {
                    var displayValue = calculateAverage
                        ? $"{valuePercent}"
                        : $"{valuePercent}%";

                    row.Add(new TableCellData { Text = displayValue, Bold = isLastRow });
                }

                rows.Add(row);
            }

            // Empty separator row
            var separatorRow = new List<TableCellData> { new() { Text = "" } };
            rows.Add(separatorRow);

            // Amount rows
            for (var i = 0; i < dataModel.RawDataValues.Count; i++)
            {
                var dataValue = dataModel.RawDataValues[i];
                var isLastRow = i == dataModel.RawDataValues.Count - 1;

                var row = new List<TableCellData>
                {
                    new() { Text = dataValue.ValueName, Bold = isLastRow }
                };

                foreach (var valueAmount in dataValue.Amounts)
                {
                    row.Add(new TableCellData { Text = $"{valueAmount}", Bold = isLastRow });
                }

                rows.Add(row);
            }

            word.AddTable(headers, rows);

            // Empty row between data models
            if (y < rawDataItem.RawDataItems.Count - 1)
            {
                word.AddEmptyParagraph();
            }
        }
    }
}