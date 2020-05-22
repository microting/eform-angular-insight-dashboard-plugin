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
    using Models.Dashboards;
    using Models.Dashboards.RawData;
    using Services.Common.InsightDashboardLocalizationService;

    public class DashboardViewChartRawDataModel
    {
        public List<string> RawHeaders { get; set; } // Table headers
            = new List<string>();

        public List<DashboardViewChartRawDataItemModel> RawDataItems { get; set; }
            = new List<DashboardViewChartRawDataItemModel>();
        public List<DashboardViewChartRawDataItemModel> InvertedRawDataItems { get; set; }
            = new List<DashboardViewChartRawDataItemModel>();
    }


    public static class ChartRawDataHelpers
    {
        public static DashboardViewChartRawDataModel ConvertMultiStackedData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataMultiStackedModel> multiStackedData,
            List<DashboardViewChartDataMultiStackedModel> multiStackedRawData,
            bool isMulti)
        {
            var result = new DashboardViewChartRawDataModel();
            var multiStackedDataResult = new List<DashboardViewChartRawDataItemModel>();

            // Get element with max Option count
            var maxOptionObject = multiStackedData
                    .Select(location => location.Series.OrderByDescending(item => item.Series.Count)
                        .First())
                    .Select(x => x.Series)
                    .FirstOrDefault();

            if (maxOptionObject == null)
            {
                throw new Exception($"{nameof(maxOptionObject)} is null");
            }


            // Add global headers
            foreach (var dataMultiModel in maxOptionObject)
            {
                result.RawHeaders.Add(dataMultiModel.Name); // Option name
            }

            // Location
            // // Year name
            // // // Option
            // // // // Value
            foreach (var dataMultiStackedModel in multiStackedData)
            {
                var chartRawDataModel = new DashboardViewChartRawDataItemModel
                {
                    RawValueName = dataMultiStackedModel.Name, // Location
                };

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
                            rawDataList[y].Percents[i] = (decimal) dataSingleModel.Value;
                            rawDataList[y].Amounts[i] = dataSingleModel.DataCount;
                        }

                        // calculate total
                        var lastRow = dataMultiModel.Series.Count;

                        rawDataList[lastRow].Percents[i] = dataMultiModel.Series
                            .Where(x => x.Value != null)
                            .Sum(x => (decimal) x.Value);

                        if (isMulti)
                        {
                            rawDataList[lastRow].Amounts[i] = dataMultiModel.AnswersCount;
                        }
                        else
                        {
                            rawDataList[lastRow].Amounts[i] = dataMultiModel.Series
                                .Sum(x => x.DataCount);
                        }
                    }

                    chartRawDataModel.RawDataValues = rawDataList;
                }

                multiStackedDataResult.Add(chartRawDataModel);
            }



            // Year
            // // Location
            // // // Option
            // // // // Value



            result.RawDataItems = multiStackedDataResult;
            return result;
        }


        public static DashboardViewChartRawDataModel ConvertMultiData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataMultiModel> multiData,
            bool isLineData,
            bool isMulti)
        {
            var result = new DashboardViewChartRawDataModel();

            if (multiData.Count == 0)
            {
                return result;
            }

            var chartRawDataModel = new DashboardViewChartRawDataItemModel
            {
                RawValueName = string.Empty, // Empty location
            };

            // If it's data for line chart - it should be inverted
            if (isLineData)
            {
                // Get element with max columns
                var maxColumnsObject = multiData
                    .OrderByDescending(item => item.Series.Count)
                    .First();

                // Headers
                foreach (var dataSingleModel in maxColumnsObject.Series)
                {
                    result.RawHeaders.Add(dataSingleModel.Name); // Year name
                }

                // Rows
                var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

                // Get row names
                foreach (var multiModel in multiData)
                {
                    var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                    {
                        ValueName = multiModel.Name,
                        Percents = new decimal[maxColumnsObject.Series.Count],
                        Amounts = new decimal[maxColumnsObject.Series.Count],
                    };

                    rawDataList.Add(rawDataValuesModel);
                }

                // Add total row
                var totalRow = new DashboardViewChartRawDataValuesModel
                {
                    ValueName = localizationService.GetString("Total"),
                    Percents = new decimal[maxColumnsObject.Series.Count],
                    Amounts = new decimal[maxColumnsObject.Series.Count],
                };

                rawDataList.Add(totalRow);

                // by Item
                for (var i = 0; i < multiData.Count; i++)
                {
                    var dataMultiModel = multiData[i];

                    // by week
                    for (var y = 0; y < dataMultiModel.Series.Count; y++)
                    {
                        var dataSingleModel = dataMultiModel.Series[y];

                        rawDataList[i].Amounts[y] = dataSingleModel.DataCount;
                        rawDataList[i].Percents[y] = (decimal) dataSingleModel.Value;
                    }
                }


                // calculate total
                var lastRow = multiData.Count;
                for (var i = 0; i < maxColumnsObject.Series.Count; i++)
                {
                    decimal totalValue = 0;
                    decimal totalAmounts = 0;
                    foreach (var rowData in rawDataList)
                    {
                        totalValue += rowData.Percents[i];
                        totalAmounts += rowData.Amounts[i];
                    }

                    rawDataList[lastRow].Percents[i] = totalValue;
                    rawDataList[lastRow].Amounts[i] = totalAmounts;
                }

                chartRawDataModel.RawDataValues = rawDataList;
            }
            else
            {
                // Headers
                foreach (var multiModel in multiData)
                {
                    result.RawHeaders.Add(multiModel.Name); // Year name
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
                        rawDataList[y].Percents[i] = (decimal) dataSingleModel.Value;
                        rawDataList[y].Amounts[i] = dataSingleModel.DataCount;
                    }

                    // calculate total
                    var lastRow = maxObject.Series.Count;

                    rawDataList[lastRow].Percents[i] = dataMultiModel.Series
                        .Where(x => x.Value != null)
                        .Sum(x => (decimal) x.Value);

                    if (isMulti)
                    {
                        rawDataList[lastRow].Amounts[i] = dataMultiModel.AnswersCount;
                    }
                    else
                    {
                        rawDataList[lastRow].Amounts[i] = dataMultiModel.Series
                            .Sum(x => x.DataCount);
                    }
                }

                chartRawDataModel.RawDataValues = rawDataList;
            }

            result.RawDataItems.Add(chartRawDataModel);
            return result;
        }

        public static DashboardViewChartRawDataModel ConvertSingleData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataSingleModel> singleData)
        {
            const int columnsCount = 1;
            var result = new DashboardViewChartRawDataModel();
            var chartRawDataModel = new DashboardViewChartRawDataItemModel
            {
                RawValueName = string.Empty, // Empty location
            };

            // Headers
            result.RawHeaders.Add(
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
                rawDataList[y].Percents[0] = (decimal) dataSingleModel.Value;
                rawDataList[y].Amounts[0] = dataSingleModel.DataCount;
            }

            // calculate total
            var lastRow = singleData.Count;

            rawDataList[lastRow].Percents[0] = singleData
                .Where(x => x.Value != null)
                .Sum(x => (decimal) x.Value);

            rawDataList[lastRow].Amounts[0] = singleData
                .Sum(x => x.DataCount);

            chartRawDataModel.RawDataValues = rawDataList;
            result.RawDataItems.Add(chartRawDataModel);
            return result;
        }
    }
}