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
/// Single home for "which answers belong to this dashboard item".
///
/// ChartDataHelpers.CalculateDashboardItem and CalculateDashboardItemByWeight both
/// build the same filtered AnswerValue query, and the raw data table has to select
/// exactly the same answers or its row count will not reconcile with the chart it
/// sits under. All three now compose the methods below instead of repeating the
/// predicates, so they cannot drift apart.
/// </summary>
public static class AnswerFilterHelper
{
    /// <summary>
    /// The filter every caller shares: workflow state, date range, survey, the
    /// optional filter question/answer pair, and the measured question.
    ///
    /// Note this deliberately does NOT filter Answer.WorkflowState - the charts
    /// never have, and adding it here would silently change every chart. The raw
    /// data table applies it separately in BuildAnswerQuery.
    /// </summary>
    public static IQueryable<AnswerValue> BuildFilteredAnswerValues(
        MicrotingDbContext sdkContext,
        DashboardItem dashboardItem,
        int dashboardSurveyId,
        DashboardEditAnswerDates answerDates)
    {
        // No Includes here. The filter-question step below closes over this
        // queryable to build a correlated subquery, and a subquery carrying
        // Includes is a translation hazard; BuildAnswerQuery would inherit the
        // same problem. The chart callers attach their own Includes to the
        // returned query, exactly as they did before this was extracted.
        var answerQueryable = sdkContext.AnswerValues
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
            // Restrict to answers that also carry the filter question's chosen
            // option. Expressed as a correlated subquery over the same scope the
            // original two-step used, so the generated set is identical without
            // the round trip.
            var filterScope = answerQueryable;

            answerQueryable = answerQueryable
                .Where(x => filterScope.Any(y =>
                    y.AnswerId == x.AnswerId
                    && y.QuestionId == dashboardItem.FilterQuestionId
                    && y.OptionId == dashboardItem.FilterAnswerId))
                .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
        }
        else
        {
            answerQueryable = answerQueryable
                .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
        }

        return answerQueryable;
    }

    /// <summary>
    /// Dashboard-level location/tag. A location wins over a tag; they are never
    /// combined. Applied unconditionally for text questions, and only when compare
    /// is off for everything else - compared charts scope by their own compare set.
    /// </summary>
    public static IQueryable<AnswerValue> ApplyLocationFilter(
        IQueryable<AnswerValue> answerQueryable,
        int? dashboardLocationId,
        int? dashboardLocationTagId)
    {
        if (dashboardLocationId != null)
        {
            return answerQueryable.Where(x => x.Answer.SiteId == dashboardLocationId);
        }

        if (dashboardLocationTagId != null)
        {
            return answerQueryable.Where(x =>
                x.Answer.Site.SiteTags.Any(y => y.TagId == dashboardLocationTagId));
        }

        return answerQueryable;
    }

    /// <summary>
    /// Options the dashboard item excludes from its calculation. The column is
    /// named AnswerId but holds options.Id.
    /// </summary>
    public static int[] GetIgnoredOptionIds(DashboardItem dashboardItem) =>
        dashboardItem.IgnoredAnswerValues
            .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.AnswerId)
            .ToArray();

    public static IQueryable<AnswerValue> ApplyIgnoredOptions(
        IQueryable<AnswerValue> answerQueryable,
        int[] ignoredOptionIds) =>
        ignoredOptionIds.Length == 0
            ? answerQueryable
            : answerQueryable.Where(x => !ignoredOptionIds.Contains(x.OptionId));

    /// <summary>
    /// The answers behind one dashboard item, for the raw data table.
    ///
    /// Adds Answer.WorkflowState filtering on top of the shared filter. The delete
    /// path sets that alongside AnswerValue.WorkflowState, so this does not change
    /// counts in practice.
    /// </summary>
    public static IQueryable<Answer> BuildAnswerQuery(
        MicrotingDbContext sdkContext,
        DashboardItem dashboardItem,
        int dashboardSurveyId,
        int? dashboardLocationId,
        int? dashboardLocationTagId,
        DashboardEditAnswerDates answerDates)
    {
        var answerValues = BuildFilteredAnswerValues(
                sdkContext, dashboardItem, dashboardSurveyId, answerDates)
            .Where(x => x.Answer.WorkflowState != Constants.WorkflowStates.Removed);

        if (!dashboardItem.CompareEnabled)
        {
            answerValues = ApplyLocationFilter(
                answerValues, dashboardLocationId, dashboardLocationTagId);
        }

        answerValues = ApplyIgnoredOptions(answerValues, GetIgnoredOptionIds(dashboardItem));

        var answerIds = IsComparedData(dashboardItem)
            ? ComparedAnswerIds(answerValues, dashboardItem, dashboardLocationId, dashboardLocationTagId)
            : NonComparedAnswerIds(answerValues, dashboardLocationId, dashboardLocationTagId);

        return sdkContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => answerIds.Contains(x.Id));
    }

    /// <summary>
    /// Mirrors the isComparedData decision ChartDataHelpers makes.
    /// </summary>
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

    /// <summary>
    /// With neither a location nor a tag the chart renders nothing, so the raw
    /// table must be empty too.
    /// </summary>
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
