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
namespace InsightDashboard.Pn.Services.WordService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Drawing;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using DashboardService;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

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
            Debugger.Break();
            try
            {
                var reportDataResult = await _dashboardService
                    .GetSingleForView(
                        dashboardId,
                        true);

                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<Stream>(false, reportDataResult.Message);
                }

                var dashboardView = reportDataResult.Model;

                // Read html and template
                var resourceString = "InsightDashboard.Pn.Resources.Templates.WordExport.page.html";
                var assembly = Assembly.GetExecutingAssembly();
                var resourceStream = assembly.GetManifestResourceStream(resourceString);
                string html;
                using (var reader = new StreamReader(resourceStream ?? throw new InvalidOperationException($"{nameof(resourceStream)} is null")))
                {
                    html = reader.ReadToEnd();
                }

                resourceString = "InsightDashboard.Pn.Resources.Templates.WordExport.file.docx";
                var docxFileResourceStream = assembly.GetManifestResourceStream(resourceString);
                var docxFileStream = new MemoryStream();
                await docxFileResourceStream.CopyToAsync(docxFileStream);

                var word = new WordProcessor(docxFileStream);

                // Add dashboard page

                html = html.Replace("{%DashboardName%}", dashboardView.DashboardName);
                html = html.Replace("{%SurveyName%}", dashboardView.SurveyName);
                html = html.Replace("{%TagList%}", dashboardView.TagName);

                html = html.Replace("{%PeriodFrom%}", dashboardView.AnswerDates.DateFrom.ToString());

                if (dashboardView.AnswerDates.Today)
                {
                    html = html.Replace("{%PeriodTo%}", DateTime.Now.ToString(CultureInfo.InvariantCulture));
                }
                else
                {
                    html = html.Replace("{%PeriodTo%}", dashboardView.AnswerDates.DateTo.ToString());
                }

                var itemsHtml = "";
                foreach (var dashboardItem in dashboardView.Items)
                {
                    var isText = dashboardItem.FirstQuestionType == "text";

                    itemsHtml += @"<div style=""page-break-before:always"">";

                    itemsHtml += $@"<p><span style=""font-weight:bold"">Question:</span> {dashboardItem.FirstQuestionName}</p>";

                    if (!string.IsNullOrEmpty(dashboardItem.FilterQuestionName))
                    {
                        itemsHtml += $@"<p><span style=""font-weight:bold"">Filter question:</span> {dashboardItem.FilterQuestionName}</p>";
                    }
                    if (!string.IsNullOrEmpty(dashboardItem.FilterAnswerName))
                    {
                        itemsHtml += $@"<p><span style=""font-weight:bold"">Filter answer:</span> {dashboardItem.FilterAnswerName}</p>";
                    }

                    if (isText)
                    {
                        itemsHtml += @"<br/>";
                        itemsHtml += @"<table width=""100%"" border=""1"">";

                        // Table header
                        itemsHtml += @"<tr style=""background-color:#f5f5f5;font-weight:bold"">";
                        itemsHtml += $@"<td>Date</td>";
                        itemsHtml += $@"<td>Tag</td>";
                        itemsHtml += $@"<td>Comments</td>";
                        itemsHtml += @"</tr>";

                        foreach (var dataModel in dashboardItem.TextQuestionData)
                        {
                            itemsHtml += @"<tr>";
                            itemsHtml += $@"<td>{dataModel.Date:dd-MM-yyyy}</td>";
                            itemsHtml += $@"<td>{dataModel.LocationName}</td>";
                            itemsHtml += $@"<td>{dataModel.Commentary}</td>";
                            itemsHtml += @"</tr>";
                        }
                        itemsHtml += @"</table>";
                    }
                    else
                    {
                        itemsHtml += @"<p><img src=""data:image/png;base64,{pngBase64String}"" width=""650px"" alt=""Image"" /></p>";


                        var imageFile = files.FirstOrDefault(x => x.FileName == dashboardItem.Id.ToString());


                        using (Image image = Image.FromStream(imageFile.OpenReadStream()))
                        {
                            using (MemoryStream m = new MemoryStream())
                            {
                                image.Save(m, image.RawFormat);
                                byte[] imageBytes = m.ToArray();

                                // Convert byte[] to Base64 String
                                string base64String = Convert.ToBase64String(imageBytes);
                                html = html.Replace("{pngBase64String}", base64String);
                            }
                        }


                        // Tables
                        foreach (var dataModel in dashboardItem.ChartData.RawData)
                        {
                            itemsHtml += @"<br/>";
                            itemsHtml += @"<table style=""background-color:#f5f5f5"" width=""100%"" border=""1"">";

                            // Table header
                            itemsHtml += @"<tr style=""font-weight:bold"">";
                            itemsHtml += $@"<td>{dataModel.RawValueName}</td>";

                            foreach (var rawHeader in dataModel.RawHeaders)
                            {
                                itemsHtml += $@"<td>{rawHeader}</td>";
                            }

                            itemsHtml += @"</tr>";

                            // Table percents and average
                            for (var i = 0; i < dataModel.RawDataValues.Count; i++)
                            {
                                var dataValue = dataModel.RawDataValues[i];

                                if (i == dataModel.RawDataValues.Count - 1)
                                {
                                    itemsHtml += @"<tr style=""font-weight:bold"">";
                                }
                                else
                                {
                                    itemsHtml += @"<tr>";
                                }

                                itemsHtml += $@"<td>{dataValue.ValueName}</td>";

                                foreach (var valuePercent in dataValue.Percents)
                                {
                                    if (dashboardItem.CalculateAverage)
                                    {
                                        itemsHtml += $@"<td>{valuePercent}</td>";
                                    }
                                    else
                                    {
                                        itemsHtml += $@"<td>{valuePercent}%</td>";
                                    }
                                }

                                itemsHtml += @"</tr>";
                            }

                            itemsHtml += @"<tr><td></td></tr>";

                            // Table amounts
                            for (var i = 0; i < dataModel.RawDataValues.Count; i++)
                            {
                                var dataValue = dataModel.RawDataValues[i];

                                if (i == dataModel.RawDataValues.Count - 1)
                                {
                                    itemsHtml += @"<tr style=""font-weight:bold"">";
                                }
                                else
                                {
                                    itemsHtml += @"<tr>";
                                }

                                itemsHtml += $@"<td>{dataValue.ValueName}</td>";
                                foreach (var valueAmount in dataValue.Amounts)
                                {
                                    itemsHtml += $@"<td>{valueAmount}</td>";
                                }

                                itemsHtml += @"</tr>";
                            }
                        }

                        itemsHtml += @"</table>";
                    }

                    itemsHtml += @"<div/>";
                }

                html = html.Replace("{%ItemList%}", itemsHtml);

                word.AddHtml(html);
                word.Dispose();
                return new OperationDataResult<Stream>(true, docxFileStream);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<Stream>(
                    false,
                    _localizationService.GetString(""));
            }
        }
    }
}
