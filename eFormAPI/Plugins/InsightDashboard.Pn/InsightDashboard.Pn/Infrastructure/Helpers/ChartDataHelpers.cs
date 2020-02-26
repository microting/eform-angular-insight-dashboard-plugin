namespace InsightDashboard.Pn.Infrastructure.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure;
    using Microting.eForm.Infrastructure.Constants;
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
            Dashboard dashboard)
        {
            var languages = await sdkContext.languages.ToListAsync();
            foreach (var language in languages)
            {
                dashboardItemModel.FirstQuestionName = await sdkContext.QuestionTranslations
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Question.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Language.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                    .Where(x => x.Language.Id == language.Id)
                    .Select(x => x.Name)
                    .FirstOrDefaultAsync();

                if (dashboardItemModel.FirstQuestionName != null)
                {
                    break;
                }
            }

            if (dashboardItem.FilterQuestionId != null)
            {
                foreach (var language in languages)
                {
                    dashboardItemModel.FilterQuestionName = await sdkContext.QuestionTranslations
                        .AsNoTracking()
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Question.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Language.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.QuestionId == dashboardItem.FilterQuestionId)
                        .Where(x => x.Language.Id == language.Id)
                        .Select(x => x.Name)
                        .FirstOrDefaultAsync();

                    if (dashboardItemModel.FilterQuestionName != null)
                    {
                        break;
                    }
                }
            }

            if (dashboardItem.FilterAnswerId != null)
            {
                foreach (var language in languages)
                {
                    dashboardItemModel.FilterAnswerName = await sdkContext.OptionTranslations
                        .AsNoTracking()
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.option.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Language.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.OptionId == dashboardItem.FilterAnswerId)
                        .Where(x => x.Language.Id == language.Id)
                        .Select(x => x.Name)
                        .FirstOrDefaultAsync();

                    if (dashboardItemModel.FilterAnswerName != null)
                    {
                        break;
                    }
                }
            }

            // Chart data
            bool singleData;
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
            else
            {
                isComparedData = false;
            }

            var answerQueryable = sdkContext.answer_values
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

            answerQueryable = answerQueryable
                .Where(x => x.Answer.QuestionSetId == dashboard.SurveyId);

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
                if (dashboard.LocationId != null)
                {
                    answerQueryable = answerQueryable
                        .Where(x => x.Answer.SiteId == dashboard.LocationId);
                }
            }

            if (dashboardItem.IgnoredAnswerValues
                .Any(x => x.WorkflowState != Constants.WorkflowStates.Removed))
            {
                var optionIds = dashboardItem.IgnoredAnswerValues
                    .Select(x => x.AnswerId)
                    .ToArray();

                answerQueryable = answerQueryable
                    .Where(x => !optionIds.Contains(x.OptionId));
            }

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

            var data = answerQueryable
                .Select(x => new
                {
                    Name = x.Value,
                    Finished = x.Answer.FinishedAt,
                    LocationName = x.Answer.Site.Name,
                    LocationId = x.Answer.SiteId,
                    Weight = x.Option.WeightValue,
                    OptionIndex = x.Option.OptionsIndex,
                })
                .OrderBy(t => t.OptionIndex)
                .ToList();

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
                        Value = GetDataPercentage(x.Count(), count),
                    })
                    .ToList();

                dashboardItemModel.ChartData.Single.AddRange(groupedData);
            }
            else
            {
 
                var multiData = new List<DashboardViewChartDataMultiModel>();
                var multiStackedData = new List<DashboardViewChartDataMultiStackedModel>();
                switch (dashboardItemModel.Period)
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
                                                    Name = i.Key,
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
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                Name = y.Key,
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                    Name = i.Key,
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
                                            .GroupBy(ms => $"{ms.Finished:yy-MMM}")
                                            .Select(y => new DashboardViewChartDataSingleModel
                                            {
                                                Name = y.Key,
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                Name = y.Key,
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                        .GroupBy(item => $"{item.Finished:yy}-K{((item.Finished.Month - 1) / 3) + 1}")
                                        .Select(y => new DashboardViewChartDataMultiModel
                                        {
                                            Name = y.Key, // Quarter name
                                            Series = y
                                                .GroupBy(g => g.Name)
                                                .Select(i => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = i.Key,
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
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                Name = y.Key,
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                    Name = i.Key,
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
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
                                                    : GetDataPercentage(y.Count(), x.Count()),
                                            })
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                multiData = data
                                    .GroupBy(item => $"{item.Finished:yy}-{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                    .Select(x => new DashboardViewChartDataMultiModel
                                    {
                                        Name = x.Key,
                                        Series = x.GroupBy(y => y.Name)
                                            .Select(y => new DashboardViewChartDataSingleModel
                                            {
                                                Name = y.Key,
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                    Name = i.Key,
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
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                                Name = y.Key,
                                                Value = dashboardItem.CalculateAverage
                                                    ? (decimal) y.Average(k => k.Weight)
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
                                Name = x.Key,
                                Value = dashboardItem.CalculateAverage
                                    ? (decimal) x.Average(k => k.Weight)
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
                        dashboardItemModel.ChartData.Multi.AddRange(multiData);
                    }
                    else
                    {
                        var lineData = new List<DashboardViewChartDataMultiModel>();
                        foreach (var line in lines)
                        {
                            var multiItem = new DashboardViewChartDataMultiModel
                            {
                                Name = line
                            };

                            foreach (var groupedItem in multiData)
                            {
                                foreach (var item in groupedItem.Series)
                                {
                                    if (item.Name == line)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = groupedItem.Name,
                                            Value = item.Value,
                                        };
                                        multiItem.Series.Add(singleItem);
                                    }
                                }
                            }

                            lineData.Add(multiItem);
                        }

                        dashboardItemModel.ChartData.Multi.AddRange(lineData);
                    }
                }
                else
                {
                    multiStackedData =
                        ChartHelpers.SortLocationPosition(
                            multiStackedData,
                            dashboardItem);
                    dashboardItemModel.ChartData.Multi.AddRange(multiData);
                    dashboardItemModel.ChartData.MultiStacked.AddRange(multiStackedData);
                }
            }
        }

        public static int GetDataPercentage(int subCount, int totalCount)
        {
            var value = Math.Round(((decimal)subCount * 100) / totalCount, 2);
            return decimal.ToInt32(value);
        }
    }
}