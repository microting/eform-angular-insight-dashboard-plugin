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

namespace InsightDashboard.Pn.Infrastructure.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Microting.InsightDashboardBase.Infrastructure.Enums;
    using Models.Dashboards;
    using Services.Common.InsightDashboardLocalizationService;

    public static class ChartDataHelpers
    {
        public static async Task CalculateDashboardItem(
            DashboardItemViewModel dashboardItemModel,
            MicrotingDbContext sdkContext,
            DashboardItem dashboardItem,
            IInsightDashboardLocalizationService localizationService,
            int? dashboardLocationId,
            int dashboardSurveyId,
            DashboardEditAnswerDates answerDates)
        {
            // Chart data
            bool singleData;
            List<KeyValuePair<int, string>> smileyLabels = new List<KeyValuePair<int, string>>()
            {
                new KeyValuePair<int, string>(100, "Meget glad"), new KeyValuePair<int, string>(75, "Glad"),
                new KeyValuePair<int, string>(50, "Neutral"), new KeyValuePair<int, string>(25, "Sur"),
                new KeyValuePair<int, string>(0, "Meget sur"), new KeyValuePair<int, string>(999, "Ved ikke")
            };
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
                case DashboardChartTypes.GroupedStackedBarChart:
                    singleData = false;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            bool isStackedData;
            if (
                dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart
                && dashboardItem.CompareEnabled
                && dashboardItem.CalculateAverage == false)
            {
                isStackedData = true;
            }
            else
            {
                isStackedData = false;
            }

            bool isComparedData = false;
            if (dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart
                || dashboardItem.ChartType == DashboardChartTypes.Line)
            {
                if (dashboardItem.CompareEnabled)
                {
                    isComparedData = true;
                }
                else if (dashboardItem.ChartType == DashboardChartTypes.Line && dashboardItem.CalculateAverage)
                {
                    isComparedData = true;
                }
            }

            var answerQueryable = sdkContext.answer_values
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

            if (answerDates.Today)
            {
                var dateTimeNow = DateTime.Now;
                answerDates.DateTo = new DateTime(
                    dateTimeNow.Year,
                    dateTimeNow.Month,
                    dateTimeNow.Day,
                    23,
                    59,
                    59);
            }

            if (answerDates.DateFrom != null)
            {
                answerQueryable = answerQueryable
                    .Where(x => x.Answer.FinishedAt >= answerDates.DateFrom);
            }

            if (answerDates.DateTo != null)
            {
                answerQueryable = answerQueryable
                    .Where(x => x.Answer.FinishedAt <= answerDates.DateTo);
            }

            answerQueryable = answerQueryable
                .Where(x => x.Answer.QuestionSetId == dashboardSurveyId);

            if (dashboardItem.FilterQuestionId != null && dashboardItem.FilterAnswerId != null)
            {
                var answerIds = answerQueryable
                    .Where(y => y.QuestionId == dashboardItem.FilterQuestionId &&
                                y.OptionId == dashboardItem.FilterAnswerId)
                    .Select(y => y.AnswerId)
                    .ToList();

                answerQueryable = answerQueryable
                    .Where(x => answerIds
                        .Contains(x.AnswerId))
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
            }
            else
            {
                answerQueryable = answerQueryable
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
            }

            // Question type == Text
            if (dashboardItemModel.FirstQuestionType == Constants.QuestionTypes.Text)
            {
                if (dashboardLocationId != null)
                {
                    answerQueryable = answerQueryable
                        .Where(x => x.Answer.SiteId == dashboardLocationId);
                }

                var textData = await answerQueryable
                    .Select(x => new DashboardItemTextQuestionDataModel
                    {
                        Date = x.Answer.FinishedAt,
                        LocationName = x.Answer.Site.Name,
                        Commentary = x.Value,
                        Id = x.Answer.Id,
                    })
                    .OrderBy(t => t.Date)
                    .ToListAsync();

                dashboardItemModel.TextQuestionData.AddRange(textData);
            }
            else
            {
                // Question type != Text
                if (dashboardItem.CompareEnabled)
                {
                    var siteIds = dashboardItem.CompareLocationsTags
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.LocationId != null)
                        .Select(x => (int) x.LocationId)
                        .ToList();

                    answerQueryable = answerQueryable
                        .Where(x => siteIds.Contains(x.Answer.SiteId));
                }
                else
                {
                    if (dashboardLocationId != null)
                    {
                        answerQueryable = answerQueryable
                            .Where(x => x.Answer.SiteId == dashboardLocationId);
                    }
                }

                List<options> ignoreOptions = new List<options>();

                if (dashboardItem.IgnoredAnswerValues
                    .Any(x => x.WorkflowState != Constants.WorkflowStates.Removed))
                {
                    var optionIds = dashboardItem.IgnoredAnswerValues
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => x.AnswerId)
                        .ToArray();

                    answerQueryable = answerQueryable
                        .Where(x => !optionIds.Contains(x.OptionId));

                    ignoreOptions = await sdkContext.options.Where(x => optionIds.Contains(x.Id)).ToListAsync();
                }

                var data = await answerQueryable
                    .Select(x => new
                    {
                        Name = x.Question.IsSmiley() ? x.Option.WeightValue.ToString() : x.Value,
                        Finished = x.Answer.FinishedAt,
                        LocationName = x.Answer.Site.Name,
                        LocationId = x.Answer.SiteId,
                        Weight = x.Option.WeightValue,
                        OptionIndex = x.Option.OptionsIndex,
                        IsSmiley = x.Question.IsSmiley()
                    })
                    .OrderBy(t => t.Finished)
                    .ToListAsync();

                bool isSmiley = data.Any() && data.First().IsSmiley;

                List<string> lines;
                if (dashboardItem.CalculateAverage)
                {
                    lines = data
                        .GroupBy(x => x.LocationName)
                        .OrderBy(x => x.Key)
                        .Select(x => x.Key)
                        .ToList();
                }
                else
                {
                    lines = data
                        .GroupBy(x => x.Name)
                        .OrderBy(x => x.Key)
                        .Select(x => x.Key)
                        .ToList();
                }

                if (singleData)
                {
                    var count = data.Count;

                    var groupedData = data
                        .GroupBy(x => x.Name)
                        .Select(x => new DashboardViewChartDataSingleModel
                        {
                            Name = x.Key,
                            DataCount = x.Count(),
                            Value = GetDataPercentage(x.Count(), count),
                        })
                        .ToList();

                    if (isSmiley)
                    {
                        var tmpData = new List<DashboardViewChartDataSingleModel>();
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                            tmpData.Add(new DashboardViewChartDataSingleModel {Name = "100", Value = 0});
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                            tmpData.Add(new DashboardViewChartDataSingleModel {Name = "75", Value = 0});
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                            tmpData.Add(new DashboardViewChartDataSingleModel {Name = "50", Value = 0});
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                            tmpData.Add(new DashboardViewChartDataSingleModel {Name = "25", Value = 0});
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                            tmpData.Add(new DashboardViewChartDataSingleModel {Name = "0", Value = 0});
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                            tmpData.Add(new DashboardViewChartDataSingleModel {Name = "999", Value = 0});

                        foreach (var dashboardViewChartDataSingleModel in groupedData)
                        {
                            switch (@dashboardViewChartDataSingleModel.Name)
                            {
                                case "100":
                                    tmpData[0].Name = smileyLabels.Single(z => z.Key == 100).Value;
                                    tmpData[0].Value = dashboardViewChartDataSingleModel.Value;
                                    tmpData[0].DataCount = dashboardViewChartDataSingleModel.DataCount;
                                    break;
                                case "75":
                                    tmpData[1].Name = smileyLabels.Single(z => z.Key == 75).Value;
                                    tmpData[1].Value = dashboardViewChartDataSingleModel.Value;
                                    tmpData[1].DataCount = dashboardViewChartDataSingleModel.DataCount;
                                    break;
                                case "50":
                                    tmpData[2].Name = smileyLabels.Single(z => z.Key == 50).Value;
                                    tmpData[2].Value = dashboardViewChartDataSingleModel.Value;
                                    tmpData[2].DataCount = dashboardViewChartDataSingleModel.DataCount;
                                    break;
                                case "25":
                                    tmpData[3].Name = smileyLabels.Single(z => z.Key == 25).Value;
                                    tmpData[3].Value = dashboardViewChartDataSingleModel.Value;
                                    tmpData[3].DataCount = dashboardViewChartDataSingleModel.DataCount;
                                    break;
                                case "0":
                                    tmpData[4].Name = smileyLabels.Single(z => z.Key == 0).Value;
                                    tmpData[4].Value = dashboardViewChartDataSingleModel.Value;
                                    tmpData[4].DataCount = dashboardViewChartDataSingleModel.DataCount;
                                    break;
                                case "999":
                                    tmpData[5].Name = smileyLabels.Single(z => z.Key == 999).Value;
                                    tmpData[5].Value = dashboardViewChartDataSingleModel.Value;
                                    tmpData[5].DataCount = dashboardViewChartDataSingleModel.DataCount;
                                    break;
                            }
                        }

                        groupedData = tmpData;
                    }

                    // isSmiley ? _smileyLabels.Single(z => z.Key == int.Parse(x.Key)).Value : x.Key
                    // dashboardItemModel.ChartData.Single.AddRange(groupedData);

                    var rawData = ChartRawDataHelpers.ConvertSingleData(localizationService, groupedData);
                    dashboardItemModel.ChartData.RawData.AddRange(rawData);
                    dashboardItemModel.ChartData.Single.AddRange(groupedData);
                }
                else
                {
                    var multiData = new List<DashboardViewChartDataMultiModel>();
                    var multiStackedData = new List<DashboardViewChartDataMultiStackedModel>();
                    switch (dashboardItem.Period)
                    {
                        case DashboardPeriodUnits.Week:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => x.LocationName)
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationId).FirstOrDefault(),
                                        Name = x.Key.ToString(), // Location name
                                        Series = x
                                            .GroupBy(y => ChartHelpers.GetWeekString(y.Finished))
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Week name
                                                Series = y
                                                    .GroupBy(g => g.Name)
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key)).Value
                                                            : i.Key,
                                                        DataCount = i.Count(),
                                                        Value = GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(x => x.LocationName)
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            Series = x
                                                .GroupBy(y => ChartHelpers.GetWeekString(y.Finished))
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(x => ChartHelpers.GetWeekString(x.Finished))
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            Series = x.GroupBy(y => y.Name)
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key)).Value
                                                        : y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Month:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => x.LocationName)
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationId).FirstOrDefault(),
                                        Name = x.Key.ToString(), // Location name
                                        Series = x
                                            .GroupBy(ms => $"{ms.Finished:yy-MMM}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Month name
                                                Series = y
                                                    .GroupBy(g => g.Name)
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key)).Value
                                                            : i.Key,
                                                        DataCount = i.Count(),
                                                        Value = GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .ToList(),
                                            })
                                            // .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(x => x.LocationName)
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            Series = x
                                                .GroupBy(ms => $"{ms.Finished:yy-MMM}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(ms => $"{ms.Finished:yy-MMM}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            Series = x.GroupBy(y => y.Name)
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key)).Value
                                                        : y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Quarter:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => x.LocationName)
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationId).FirstOrDefault(),
                                        Name = x.Key.ToString(), // Location name
                                        Series = x
                                            .GroupBy(item =>
                                                $"{item.Finished:yy}-K{((item.Finished.Month - 1) / 3) + 1}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Quarter name
                                                Series = y
                                                    .GroupBy(g => g.Name)
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key)).Value
                                                            : i.Key,
                                                        DataCount = i.Count(),
                                                        Value = GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .ToList(),
                                            })
                                            .OrderByDescending(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => y.LocationName)
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            Series = x.GroupBy(item =>
                                                    $"{item.Finished:yy}-K{((item.Finished.Month - 1) / 3) + 1}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(item => $"{item.Finished:yy}-K{((item.Finished.Month - 1) / 3) + 1}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            Series = x.GroupBy(y => y.Name)
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key)).Value
                                                        : y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.SixMonth:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => x.LocationName)
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationId).FirstOrDefault(),
                                        Name = x.Key.ToString(), // Location name
                                        Series = x
                                            .GroupBy(item =>
                                                $"{item.Finished:yy}-{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // SixMonth name
                                                Series = y
                                                    .GroupBy(g => g.Name)
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key)).Value
                                                            : i.Key,
                                                        DataCount = i.Count(),
                                                        Value = GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => y.LocationName)
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            Series = x
                                                .GroupBy(item =>
                                                    $"{item.Finished:yy}-{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(item =>
                                            $"{item.Finished:yy}-{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            Series = x.GroupBy(y => y.Name)
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key)).Value
                                                        : y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Year:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => x.LocationName)
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationId).FirstOrDefault(),
                                        Name = x.Key.ToString(), // Location name
                                        Series = x
                                            .GroupBy(ms => $"{ms.Finished:yyyy}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Year name
                                                Series = y
                                                    .GroupBy(g => g.Name)
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key)).Value
                                                            : i.Key,
                                                        DataCount = i.Count(),
                                                        Value = GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => y.LocationName)
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            Series = x
                                                .GroupBy(ms => $"{ms.Finished:yyyy}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(ms => $"{ms.Finished:yyyy}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            Series = x.GroupBy(y => y.Name)
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key)).Value
                                                        : y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Total:
                            var totalPeriod = new DashboardViewChartDataMultiModel
                            {
                                Name = localizationService.GetString("TotalPeriod")
                            };

                            totalPeriod.Series = data
                                .GroupBy(x => x.Name)
                                .Select(x => new DashboardViewChartDataSingleModel
                                {
                                    Name = isSmiley ? smileyLabels.Single(z => z.Key == int.Parse(x.Key)).Value : x.Key,
                                    DataCount = x.Count(),
                                    Value = dashboardItem.CalculateAverage
                                        ? GetAverageDataPercentage(x.Average(k => k.Weight))
                                        : GetDataPercentage(x.Count(), data.Count),
                                })
                                .ToList();


                            multiData.Add(totalPeriod);
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }

                    if (dashboardItem.ChartType == DashboardChartTypes.Line)
                    {
                        if (dashboardItem.CalculateAverage)
                        {
                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, multiData);
                            dashboardItemModel.ChartData.RawData.AddRange(rawData);
                            dashboardItemModel.ChartData.Multi.AddRange(multiData);
                        }
                        else
                        {
                            var lineData = new List<DashboardViewChartDataMultiModel>();
                            foreach (var line in lines)
                            {
                                var multiItem = new DashboardViewChartDataMultiModel
                                {
                                    Name = isSmiley ? smileyLabels.Single(z => z.Key == int.Parse(line)).Value : line,
                                };

                                foreach (var groupedItem in multiData)
                                {
                                    foreach (var item in groupedItem.Series)
                                    {
                                        if (item.Name == (isSmiley
                                                ? smileyLabels.Single(z => z.Key == int.Parse(line)).Value
                                                : line))
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = groupedItem.Name,
                                                Value = item.Value,
                                                DataCount = item.DataCount,
                                            };
                                            multiItem.Series.Add(singleItem);
                                        }
                                    }
                                }

                                lineData.Add(multiItem);
                            }

                            List<string> columnNames = new List<string>();
                            List<string> lineNames = new List<string>();

                            foreach (var model in lineData)
                            {
                                if (!lineNames.Contains(model.Name))
                                {
                                    lineNames.Add(model.Name);
                                }

                                foreach (var dashboardViewChartDataSingleModel in model.Series)
                                {
                                    if (!columnNames.Contains(dashboardViewChartDataSingleModel.Name))
                                    {
                                        columnNames.Add(dashboardViewChartDataSingleModel.Name);
                                    }
                                }
                            }

                            columnNames.Sort();
                            lineNames.Sort();

                            var newLineData = new List<DashboardViewChartDataMultiModel>();

                            if (isSmiley)
                            {
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                        {Name = smileyLabels.Single(z => z.Key == 100).Value});
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                        {Name = smileyLabels.Single(z => z.Key == 75).Value});
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                        {Name = smileyLabels.Single(z => z.Key == 50).Value});
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                        {Name = smileyLabels.Single(z => z.Key == 25).Value});
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                        {Name = smileyLabels.Single(z => z.Key == 0).Value});
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                        {Name = smileyLabels.Single(z => z.Key == 999).Value});

                                foreach (var model in newLineData)
                                {
                                    foreach (string columnName in columnNames)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = columnName,
                                            Value = 0,
                                        };
                                        model.Series.Add(singleItem);
                                    }
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in lineData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                foreach (var lineName in lineNames)
                                {
                                    var multiItem = new DashboardViewChartDataMultiModel
                                    {
                                        Name = lineName
                                    };

                                    foreach (string columnName in columnNames)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = columnName,
                                            Value = 0,
                                        };
                                        multiItem.Series.Add(singleItem);
                                    }

                                    newLineData.Add(multiItem);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData);
                            dashboardItemModel.ChartData.RawData.AddRange(rawData);
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                    }
                    else
                    {
                        if (!isStackedData)
                        {
                            List<string> columnNames = new List<string>();
                            List<string> lineNames = new List<string>();

                            foreach (var model in multiData)
                            {
                                if (!columnNames.Contains(model.Name))
                                {
                                    columnNames.Add(model.Name);
                                }

                                foreach (var dashboardViewChartDataSingleModel in model.Series)
                                {
                                    if (!lineNames.Contains(dashboardViewChartDataSingleModel.Name))
                                    {
                                        lineNames.Add(dashboardViewChartDataSingleModel.Name);
                                    }
                                }
                            }

                            var newLineData = new List<DashboardViewChartDataMultiModel>();

                            if (isSmiley)
                            {
                                foreach (string columnName in columnNames)
                                {
                                    var model = new DashboardViewChartDataMultiModel {Name = columnName};
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                            {Name = smileyLabels.Single(z => z.Key == 100).Value, Value = 0});
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                            {Name = smileyLabels.Single(z => z.Key == 75).Value, Value = 0});
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                            {Name = smileyLabels.Single(z => z.Key == 50).Value, Value = 0});
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                            {Name = smileyLabels.Single(z => z.Key == 25).Value, Value = 0});
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                            {Name = smileyLabels.Single(z => z.Key == 0).Value, Value = 0});
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                            {Name = smileyLabels.Single(z => z.Key == 999).Value, Value = 0});
                                    newLineData.Add(model);
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in multiData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData);
                            dashboardItemModel.ChartData.RawData.AddRange(rawData);
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                        else
                        {
                            multiStackedData =
                                ChartHelpers.SortLocationPosition(
                                    multiStackedData,
                                    dashboardItem);
                            if (isSmiley)
                            {
                                var newLineData = new List<DashboardViewChartDataMultiStackedModel>();
                                List<string> columnNames = new List<string>();
                                foreach (var stackedModel in multiStackedData)
                                {
                                    foreach (var modelSeries in stackedModel.Series)
                                    {
                                        if (!columnNames.Contains(modelSeries.Name))
                                        {
                                            columnNames.Add(modelSeries.Name);
                                        }
                                    }
                                }


                                foreach (var stackedModel in multiStackedData)
                                {
                                    var model = new DashboardViewChartDataMultiStackedModel()
                                    {
                                        Name = stackedModel.Name,
                                        Id = stackedModel.Id,
                                    };


                                    foreach (string columnName in columnNames)
                                    {
                                        var innerModel = new DashboardViewChartDataMultiModel() {Name = columnName};
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                {Name = smileyLabels.Single(z => z.Key == 100).Value, Value = 0});
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                {Name = smileyLabels.Single(z => z.Key == 75).Value, Value = 0});
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                {Name = smileyLabels.Single(z => z.Key == 50).Value, Value = 0});
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                {Name = smileyLabels.Single(z => z.Key == 25).Value, Value = 0});
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                {Name = smileyLabels.Single(z => z.Key == 0).Value, Value = 0});
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                {Name = smileyLabels.Single(z => z.Key == 999).Value, Value = 0});
                                        model.Series.Add(innerModel);
                                    }

                                    foreach (var modelSeries in stackedModel.Series)
                                    {
                                        // var innerModel = new DashboardViewChartDataMultiModel() {Name = modelSeries.Name};
                                        var innerModel = model.Series.Single(x => x.Name == modelSeries.Name);

                                        // foreach (var modelSeries in model.Series)
                                        // {
                                        //     if (modelSeries.Name == series.Name)
                                        //     {
                                        //         modelSeries.Value = series.Value;
                                        //     }
                                        // }
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 100).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 75).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 50).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 25).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 0).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 999).Value, Value = 0});

                                        foreach (var innerSeries in modelSeries.Series)
                                        {
                                            foreach (var newInnerSeriesModel in innerModel.Series)
                                            {
                                                if (innerSeries.Name == newInnerSeriesModel.Name)
                                                {
                                                    newInnerSeriesModel.Value = innerSeries.Value;
                                                    newInnerSeriesModel.DataCount = innerSeries.DataCount;
                                                }
                                            }
                                        }
                                    }

                                    newLineData.Add(model);
                                }
                                dashboardItemModel.ChartData.MultiStacked.AddRange(newLineData);
                            }
                            else
                            {
                                dashboardItemModel.ChartData.MultiStacked.AddRange(multiStackedData);
                            }

                            // convert
                            var rawData = ChartRawDataHelpers.ConvertMultiStackedData(
                                localizationService,
                                dashboardItemModel.ChartData.MultiStacked);
                            dashboardItemModel.ChartData.RawData.AddRange(rawData);
                        }
                    }
                }
            }
        }

        private static int GetAverageDataPercentage(double averageValue)
        {
            var value = Math.Round((decimal) averageValue);
            return decimal.ToInt32(value);
        }

        public static int GetDataPercentage(int subCount, int totalCount)
        {
            var value = Math.Round(((decimal) subCount * 100) / totalCount, 0);
            return decimal.ToInt32(value);
        }
    }
}