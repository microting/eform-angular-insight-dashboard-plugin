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
    using System.Collections.Generic;
    using System.Linq;
    using Models.Dashboards;
    using Models.Dashboards.RawData;
    using Services.Common.InsightDashboardLocalizationService;

    public static class ChartRawDataHelpers
    {
        public static List<DashboardViewChartRawDataModel> ConvertMultiStackedData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataMultiStackedModel> multiStackedData)
        {
            var result = new List<DashboardViewChartRawDataModel>();
            foreach (var dataMultiStackedModel in multiStackedData)
            {
                var chartRawDataModel = new DashboardViewChartRawDataModel
                {
                    RawValueName = dataMultiStackedModel.Name, // Location
                };

                // Headers
                foreach (var dataMultiModel in dataMultiStackedModel.Series)
                {
                    chartRawDataModel.RawHeaders.Add(dataMultiModel.Name); // Year name
                }

                // Rows
                if (dataMultiStackedModel.Series.Any())
                {
                    var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

                    // Get element with max rows
                    var maxObject = dataMultiStackedModel.Series
                        .OrderByDescending(item => item.Series.Count)
                        .First();

                    // Get row names
                    foreach (var singleModel in maxObject.Series)
                    {
                        var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                        {
                            ValueName = singleModel.Name,
                            Percents = new decimal[dataMultiStackedModel.Series.Count],
                            Amounts = new decimal[dataMultiStackedModel.Series.Count],
                        };

                        rawDataList.Add(rawDataValuesModel);
                    }

                    // Add total row
                    var totalRow = new DashboardViewChartRawDataValuesModel
                    {
                        ValueName = localizationService.GetString("Total"),
                        Percents = new decimal[dataMultiStackedModel.Series.Count],
                        Amounts = new decimal[dataMultiStackedModel.Series.Count],
                    };

                    rawDataList.Add(totalRow);

                    // by week
                    for (var i = 0; i < dataMultiStackedModel.Series.Count; i++)
                    {
                        var dataMultiModel = dataMultiStackedModel.Series[i];

                        // by Item
                        for (var y = 0; y < dataMultiModel.Series.Count; y++)
                        {
                            var dataSingleModel = dataMultiModel.Series[y];
                            if (dataSingleModel.Value != null)
                            {
                                rawDataList[y].Percents[i] = (decimal) dataSingleModel.Value;
                            }
                            else
                            {
                                rawDataList[y].Percents[i] = 0;
                            }

                            rawDataList[y].Amounts[i] = dataSingleModel.DataCount;
                        }

                        // calculate total
                        var lastRow = dataMultiModel.Series.Count + 1;

                        rawDataList[lastRow].Percents[i] = dataMultiModel.Series
                            .Where(x => x.Value != null)
                            .Sum(x => (decimal) x.Value);

                        rawDataList[lastRow].Amounts[i] = dataMultiModel.Series
                            .Sum(x => x.DataCount);
                    }

                    chartRawDataModel.RawDataValues = rawDataList;
                }

                result.Add(chartRawDataModel);
            }

            return result;
        }


        public static List<DashboardViewChartRawDataModel> ConvertMultiData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataMultiModel> multiData)
        {
            var result = new List<DashboardViewChartRawDataModel>();

            var chartRawDataModel = new DashboardViewChartRawDataModel
            {
                RawValueName = string.Empty, // Empty location
            };

            // Headers
            foreach (var multiModel in multiData)
            {
                chartRawDataModel.RawHeaders.Add(multiModel.Name); // Year name
            }

            // Rows
            var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

            // Get element with max rows
            var maxObject = multiData
                .OrderByDescending(item => item.Series.Count)
                .First();

            // Get row names
            foreach (var singleModel in maxObject.Series)
            {
                var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                {
                    ValueName = singleModel.Name,
                    Percents = new decimal[multiData.Count],
                    Amounts = new decimal[multiData.Count],
                };

                rawDataList.Add(rawDataValuesModel);
            }

            // Add total row
            var totalRow = new DashboardViewChartRawDataValuesModel
            {
                ValueName = localizationService.GetString("Total"),
                Percents = new decimal[multiData.Count],
                Amounts = new decimal[multiData.Count],
            };

            rawDataList.Add(totalRow);

            // by week
            for (var i = 0; i < multiData.Count; i++)
            {
                var dataMultiModel = multiData[i];

                // by Item
                for (var y = 0; y < dataMultiModel.Series.Count; y++)
                {
                    var dataSingleModel = dataMultiModel.Series[y];
                    if (dataSingleModel.Value != null)
                    {
                        rawDataList[y].Percents[i] = (decimal) dataSingleModel.Value;
                    }
                    else
                    {
                        rawDataList[y].Percents[i] = 0;
                    }

                    rawDataList[y].Amounts[i] = dataSingleModel.DataCount;
                }

                // calculate total
                var lastRow = dataMultiModel.Series.Count + 1;

                rawDataList[lastRow].Percents[i] = dataMultiModel.Series
                    .Where(x => x.Value != null)
                    .Sum(x => (decimal) x.Value);

                rawDataList[lastRow].Amounts[i] = dataMultiModel.Series
                    .Sum(x => x.DataCount);
            }

            chartRawDataModel.RawDataValues = rawDataList;
            result.Add(chartRawDataModel);
            return result;
        }

        public static List<DashboardViewChartRawDataModel> ConvertSingleData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataSingleModel> singleData)
        {
            const int columnsCount = 1;
            var result = new List<DashboardViewChartRawDataModel>();
            var chartRawDataModel = new DashboardViewChartRawDataModel
            {
                RawValueName = string.Empty, // Empty location
            };

            // Headers
            chartRawDataModel.RawHeaders.Add(
                localizationService.GetString("TotalPeriod"));

            // Rows
            var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

            // Get row names
            foreach (var singleModel in singleData)
            {
                var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                {
                    ValueName = singleModel.Name,
                    Percents = new decimal[columnsCount],
                    Amounts = new decimal[columnsCount],
                };

                rawDataList.Add(rawDataValuesModel);
            }

            var totalRow = new DashboardViewChartRawDataValuesModel
            {
                ValueName = localizationService.GetString("Total"),
                Percents = new decimal[columnsCount],
                Amounts = new decimal[columnsCount],
            };

            rawDataList.Add(totalRow);

            // by Item
            for (var y = 0; y < singleData.Count; y++)
            {
                var dataSingleModel = singleData[y];
                if (dataSingleModel.Value != null)
                {
                    rawDataList[y].Percents[0] = (decimal) dataSingleModel.Value;
                }
                else
                {
                    rawDataList[y].Percents[0] = 0;
                }

                rawDataList[y].Amounts[0] = dataSingleModel.DataCount;
            }

            // calculate total
            var lastRow = singleData.Count + 1;

            rawDataList[lastRow].Percents[0] = singleData
                .Where(x => x.Value != null)
                .Sum(x => (decimal) x.Value);

            rawDataList[lastRow].Amounts[0] = singleData
                .Sum(x => x.DataCount);

            chartRawDataModel.RawDataValues = rawDataList;
            result.Add(chartRawDataModel);
            return result;
        }
    }
}