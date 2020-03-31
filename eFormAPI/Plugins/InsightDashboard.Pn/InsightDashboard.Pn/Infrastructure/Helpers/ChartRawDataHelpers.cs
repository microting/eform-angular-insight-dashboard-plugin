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

                    // by week
                    for (var i = 0; i < dataMultiStackedModel.Series.Count; i++)
                    {
                        var dataMultiModel = dataMultiStackedModel.Series[i];

                        // by Item
                        for (var y = 0; y < dataMultiModel.Series.Count; y++)
                        {
                            var dataSingleModel = dataMultiModel.Series[y];
                            rawDataList[y].Percents[i] = (decimal)dataSingleModel.Value;
                            rawDataList[y].Amounts[i] = dataSingleModel.DataCount;
                        }
                    }

                    chartRawDataModel.RawDataValues = rawDataList;
                }

                result.Add(chartRawDataModel);
            }

            return result;
        }


        public static List<DashboardViewChartRawDataModel> ConvertMultiData(
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
            }

            chartRawDataModel.RawDataValues = rawDataList;
            result.Add(chartRawDataModel);
            return result;
        }

        public static List<DashboardViewChartRawDataModel> ConvertSingleData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataSingleModel> singleData)
        {
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
                    Percents = new decimal[1],
                    Amounts = new decimal[1],
                };

                rawDataList.Add(rawDataValuesModel);
            }

            // by Item
            for (var y = 0; y < singleData.Count; y++)
            {
                var dataSingleModel = singleData[y];
                rawDataList[y].Percents[1] = (decimal)dataSingleModel.Value;
                rawDataList[y].Amounts[1] = dataSingleModel.DataCount;
            }

            chartRawDataModel.RawDataValues = rawDataList;
            result.Add(chartRawDataModel);
            return result;
        }
    }
}
