﻿/*
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

namespace InsightDashboard.Pn.Infrastructure.Models.Dashboards;

using System.Collections.Generic;
using Microting.InsightDashboardBase.Infrastructure.Enums;

public class DashboardItemViewModel
{
    public int Id { get; set; }
    public string FirstQuestionName { get; set; }
    public string FirstQuestionType { get; set; }
    public string FilterQuestionName { get; set; }
    public string FilterAnswerName { get; set; }
    public int FirstQuestionId { get; set; }
    public int? FilterQuestionId { get; set; }
    public int? FilterAnswerId { get; set; }
    public DashboardPeriodUnits Period { get; set; }
    public DashboardChartTypes ChartType { get; set; }
    public bool CompareEnabled { get; set; }
    public bool CalculateAverage { get; set; }
    public int Position { get; set; }

    public DashboardViewChartDataModel ChartData { get; set; }
        = new DashboardViewChartDataModel();
    public List<DashboardItemCompareModel> CompareLocationsTags { get; set; }
        = new List<DashboardItemCompareModel>();
    public List<DashboardItemIgnoredAnswerModel> IgnoredAnswerValues { get; set; }
        = new List<DashboardItemIgnoredAnswerModel>();

    public List<DashboardItemTextQuestionDataModel> TextQuestionData { get; set; }
        = new List<DashboardItemTextQuestionDataModel>();
}