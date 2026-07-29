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

namespace InsightDashboard.Pn.Infrastructure.Helpers;

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
using Microting.InsightDashboardBase.Infrastructure.Enums;
using Models.Dashboards;

/// <summary>
/// Selects the answers that feed a single dashboard item.
///
/// This MUST stay behaviourally identical to the answer-selection half of
/// ChartDataHelpers.CalculateDashboardItem, otherwise the raw data table will
/// disagree with the chart it sits under. Line references below point at
/// ChartDataHelpers.cs as of the commit that introduced this file.
///
/// Two deliberate deviations:
///   1. Answer.WorkflowState is also filtered (ChartDataHelpers filters only
///      AnswerValue.WorkflowState). The delete path sets both together, so this
///      does not change counts in practice.
///   2. The filter-question step uses a correlated subquery instead of
///      materialising answer ids with ToList(). Semantically identical, one
///      fewer round trip.
/// </summary>
public static class AnswerFilterHelper
{
    public static IQueryable<Answer> BuildAnswerQuery(
        MicrotingDbContext sdkContext,
        DashboardItem dashboardItem,
        int dashboardSurveyId,
        int? dashboardLocationId,
        int? dashboardLocationTagId,
        DashboardEditAnswerDates answerDates)
    {
        // ChartDataHelpers.cs:135-142
        var answerValues = sdkContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Answer.WorkflowState != Constants.WorkflowStates.Removed)
            .AsQueryable();

        // ChartDataHelpers.cs:144-154
        if (answerDates.Today)
        {
            var dateTimeNow = DateTime.Now;
            answerDates.DateTo = new DateTime(
                dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day, 23, 59, 59);
        }

        // ChartDataHelpers.cs:156-166
        if (answerDates.DateFrom != null)
        {
            answerValues = answerValues.Where(x => x.Answer.FinishedAt >= answerDates.DateFrom);
        }

        if (answerDates.DateTo != null)
        {
            answerValues = answerValues.Where(x => x.Answer.FinishedAt <= answerDates.DateTo);
        }

        // ChartDataHelpers.cs:170-171
        answerValues = answerValues.Where(x => x.Answer.QuestionSetId == dashboardSurveyId);

        // ChartDataHelpers.cs:173-190
        if (dashboardItem.FilterQuestionId != null && dashboardItem.FilterAnswerId != null)
        {
            var filterScope = answerValues;
            answerValues = answerValues
                .Where(x => filterScope.Any(y =>
                    y.AnswerId == x.AnswerId
                    && y.QuestionId == dashboardItem.FilterQuestionId
                    && y.OptionId == dashboardItem.FilterAnswerId))
                .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
        }
        else
        {
            answerValues = answerValues.Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
        }

        // ChartDataHelpers.cs:223-236 - this block only runs when compare is OFF
        if (!dashboardItem.CompareEnabled)
        {
            if (dashboardLocationId != null)
            {
                answerValues = answerValues.Where(x => x.Answer.SiteId == dashboardLocationId);
            }
            else if (dashboardLocationTagId != null)
            {
                answerValues = answerValues.Where(x =>
                    x.Answer.Site.SiteTags.Any(y => y.TagId == dashboardLocationTagId));
            }
        }

        // ChartDataHelpers.cs:240-252 - ignored answer OPTIONS. The column is
        // misleadingly named AnswerId but holds options.Id.
        var ignoredOptionIds = dashboardItem.IgnoredAnswerValues
            .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.AnswerId)
            .ToArray();

        if (ignoredOptionIds.Length > 0)
        {
            answerValues = answerValues.Where(x => !ignoredOptionIds.Contains(x.OptionId));
        }

        var answerIds = IsComparedData(dashboardItem)
            ? ComparedAnswerIds(answerValues, dashboardItem, dashboardLocationId, dashboardLocationTagId)
            : NonComparedAnswerIds(answerValues, dashboardLocationId, dashboardLocationTagId);

        return sdkContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => answerIds.Contains(x.Id));
    }

    // ChartDataHelpers.cs:121-133
    private static bool IsComparedData(DashboardItem dashboardItem)
    {
        if (dashboardItem.ChartType != DashboardChartTypes.GroupedStackedBarChart
            && dashboardItem.ChartType != DashboardChartTypes.Line)
        {
            return false;
        }

        if (dashboardItem.CompareEnabled)
        {
            return true;
        }

        return dashboardItem.ChartType == DashboardChartTypes.Line && dashboardItem.CalculateAverage;
    }

    // ChartDataHelpers.cs:255-390 - union of the per-tag queries and the site query
    private static IQueryable<int> ComparedAnswerIds(
        IQueryable<AnswerValue> answerValues,
        DashboardItem dashboardItem,
        int? dashboardLocationId,
        int? dashboardLocationTagId)
    {
        var tagIds = dashboardItem.CompareEnabled
            ? dashboardItem.CompareLocationsTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.TagId != null)
                .Select(x => (int)x.TagId)
                .ToList()
            : dashboardLocationTagId != null
                ? new List<int> { (int)dashboardLocationTagId }
                : new List<int>();

        var siteIds = dashboardItem.CompareEnabled
            ? dashboardItem.CompareLocationsTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.LocationId != null)
                .Select(x => (int)x.LocationId)
                .ToList()
            : dashboardLocationId != null
                ? new List<int> { (int)dashboardLocationId }
                : new List<int>();

        var byTag = answerValues
            .Where(x => x.Answer.Site.SiteTags.Any(y => y.TagId != null && tagIds.Contains((int)y.TagId)))
            .Select(x => x.AnswerId);

        var bySite = answerValues
            .Where(x => siteIds.Contains(x.Answer.SiteId))
            .Select(x => x.AnswerId);

        return byTag.Union(bySite).Distinct();
    }

    // ChartDataHelpers.cs:392-490 - when neither location nor tag is set the
    // chart renders nothing, so the raw table must be empty too.
    private static IQueryable<int> NonComparedAnswerIds(
        IQueryable<AnswerValue> answerValues,
        int? dashboardLocationId,
        int? dashboardLocationTagId)
    {
        if (dashboardLocationId == null && dashboardLocationTagId == null)
        {
            return answerValues.Where(x => false).Select(x => x.AnswerId);
        }

        return answerValues.Select(x => x.AnswerId).Distinct();
    }
}
