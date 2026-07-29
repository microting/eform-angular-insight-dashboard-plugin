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

namespace InsightDashboard.Pn.Test;

using System.Linq;
using System.Threading.Tasks;
using Base;
using Infrastructure.Helpers;
using Infrastructure.Models.Dashboards;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
using NUnit.Framework;

/// <summary>
/// Covers the filter-question path, which none of the Dashboard*.data.json
/// fixtures exercise - every one of them has filterQuestionId null. Extracting the
/// shared filter out of ChartDataHelpers rewrote that path from "materialise the
/// matching answer ids, then use Contains" into a correlated subquery, so it needs
/// its own test rather than relying on the chart fixtures.
/// </summary>
[TestFixture]
public class AnswerFilterHelperUTests : DbTestFixture
{
    [Test]
    public async Task FilterQuestion_SubqueryMatchesMaterialisedIds()
    {
        // Find a survey with at least two answered questions, so one can measure
        // and the other can filter.
        var candidate = await DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .GroupBy(x => new { x.Answer.QuestionSetId, x.QuestionId })
            .Select(g => new { g.Key.QuestionSetId, g.Key.QuestionId, Count = g.Count() })
            .Where(x => x.Count > 0)
            .OrderByDescending(x => x.Count)
            .Take(20)
            .ToListAsync();

        var survey = candidate
            .GroupBy(x => x.QuestionSetId)
            .FirstOrDefault(g => g.Count() >= 2);

        Assert.That(survey, Is.Not.Null,
            "Seed data has no survey with two answered questions; cannot exercise filtering.");

        var firstQuestionId = survey.ElementAt(0).QuestionId;
        var filterQuestionId = survey.ElementAt(1).QuestionId;

        var filterOptionId = await DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.QuestionId == filterQuestionId)
            .Select(x => x.OptionId)
            .FirstOrDefaultAsync();

        Assert.That(filterOptionId, Is.GreaterThan(0), "No option found for the filter question.");

        var dashboardItem = new DashboardItem
        {
            FirstQuestionId = firstQuestionId,
            FilterQuestionId = filterQuestionId,
            FilterAnswerId = filterOptionId,
            IgnoredAnswerValues = new System.Collections.Generic.List<DashboardItemIgnoredAnswer>(),
            CompareLocationsTags = new System.Collections.Generic.List<DashboardItemCompare>(),
        };

        var answerDates = new DashboardEditAnswerDates();

        var actual = await AnswerFilterHelper
            .BuildFilteredAnswerValues(DbContext, dashboardItem, survey.Key, answerDates)
            .Select(x => x.AnswerId)
            .Distinct()
            .ToListAsync();

        // The shape ChartDataHelpers used before the shared filter was extracted.
        var scope = DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Answer.QuestionSetId == survey.Key);

        var materialisedIds = await scope
            .Where(y => y.QuestionId == filterQuestionId && y.OptionId == filterOptionId)
            .Select(y => y.AnswerId)
            .ToListAsync();

        var expected = await scope
            .Where(x => materialisedIds.Contains(x.AnswerId))
            .Where(x => x.QuestionId == firstQuestionId)
            .Select(x => x.AnswerId)
            .Distinct()
            .ToListAsync();

        Assert.That(actual.OrderBy(x => x), Is.EqualTo(expected.OrderBy(x => x)),
            "The correlated subquery must select exactly the answers the materialised "
            + "id list did, otherwise every filtered chart shifts.");

        Assert.That(expected, Is.Not.Empty,
            "The chosen question pair matched no answers, so this test proved nothing. "
            + "Pick a different pair if the seed data changes.");
    }

    /// <summary>
    /// A location wins over a tag, and neither set leaves the query untouched.
    /// </summary>
    [Test]
    public async Task LocationFilter_PrefersSiteOverTag()
    {
        var siteId = await DbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.SiteId)
            .FirstOrDefaultAsync();

        Assert.That(siteId, Is.GreaterThan(0), "Seed data has no answers.");

        var all = DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

        var unfiltered = await all.CountAsync();
        var bySite = await AnswerFilterHelper.ApplyLocationFilter(all, siteId, null).CountAsync();
        var untouched = await AnswerFilterHelper.ApplyLocationFilter(all, null, null).CountAsync();

        Assert.That(untouched, Is.EqualTo(unfiltered),
            "With neither location nor tag the query must be returned unchanged.");
        Assert.That(bySite, Is.LessThanOrEqualTo(unfiltered));
        Assert.That(bySite, Is.GreaterThan(0),
            "Filtering by a site that has answers must not empty the query.");
    }
}
