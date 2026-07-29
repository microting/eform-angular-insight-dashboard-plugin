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

using System;
using System.Collections.Generic;
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
            IgnoredAnswerValues = new List<DashboardItemIgnoredAnswer>(),
            CompareLocationsTags = new List<DashboardItemCompare>(),
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

        Assert.That(expected, Is.Not.Empty,
            "The chosen question pair matched no answers, so comparing the two "
            + "implementations would prove nothing. Pick a different pair if the seed "
            + "data changes.");

        Assert.That(actual.OrderBy(x => x), Is.EqualTo(expected.OrderBy(x => x)),
            "The correlated subquery must select exactly the answers the materialised "
            + "id list did, otherwise every filtered chart shifts.");
    }

    /// <summary>
    /// The case where Contains-over-a-list and Any-over-a-subquery could most
    /// plausibly diverge: the filter question IS the measured question, so the
    /// membership test and the question predicate apply to the same rows.
    /// </summary>
    [Test]
    public async Task FilterQuestion_SameAsMeasuredQuestion_MatchesMaterialisedIds()
    {
        var pick = await DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .GroupBy(x => new { x.Answer.QuestionSetId, x.QuestionId, x.OptionId })
            .Select(g => new { g.Key.QuestionSetId, g.Key.QuestionId, g.Key.OptionId, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .FirstOrDefaultAsync();

        Assert.That(pick, Is.Not.Null, "Seed data has no answer values.");

        var dashboardItem = new DashboardItem
        {
            FirstQuestionId = pick.QuestionId,
            FilterQuestionId = pick.QuestionId,
            FilterAnswerId = pick.OptionId,
            IgnoredAnswerValues = new List<DashboardItemIgnoredAnswer>(),
            CompareLocationsTags = new List<DashboardItemCompare>(),
        };

        var actual = await AnswerFilterHelper
            .BuildFilteredAnswerValues(
                DbContext, dashboardItem, pick.QuestionSetId, new DashboardEditAnswerDates())
            .Select(x => x.AnswerId)
            .Distinct()
            .ToListAsync();

        var scope = DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Answer.QuestionSetId == pick.QuestionSetId);

        var materialisedIds = await scope
            .Where(y => y.QuestionId == pick.QuestionId && y.OptionId == pick.OptionId)
            .Select(y => y.AnswerId)
            .ToListAsync();

        var expected = await scope
            .Where(x => materialisedIds.Contains(x.AnswerId))
            .Where(x => x.QuestionId == pick.QuestionId)
            .Select(x => x.AnswerId)
            .Distinct()
            .ToListAsync();

        Assert.That(expected, Is.Not.Empty, "Chosen option matched no answers.");
        Assert.That(actual.OrderBy(x => x), Is.EqualTo(expected.OrderBy(x => x)));
    }

    /// <summary>
    /// A multi-select answer carries several values for one question, so the
    /// materialised id list contained duplicates where the subquery does not.
    /// Both are membership tests, and this pins that they agree.
    /// </summary>
    [Test]
    public async Task FilterQuestion_AnswerWithRepeatedQuestion_MatchesMaterialisedIds()
    {
        var repeated = await DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .GroupBy(x => new { x.AnswerId, x.QuestionId })
            .Where(g => g.Count() > 1)
            .Select(g => new { g.Key.AnswerId, g.Key.QuestionId })
            .FirstOrDefaultAsync();

        if (repeated == null)
        {
            Assert.Ignore("Seed data has no answer carrying multiple values for one question.");
        }

        var context = await DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.AnswerId == repeated.AnswerId && x.QuestionId == repeated.QuestionId)
            .Select(x => new { x.OptionId, x.Answer.QuestionSetId })
            .FirstAsync();

        var dashboardItem = new DashboardItem
        {
            FirstQuestionId = repeated.QuestionId,
            FilterQuestionId = repeated.QuestionId,
            FilterAnswerId = context.OptionId,
            IgnoredAnswerValues = new List<DashboardItemIgnoredAnswer>(),
            CompareLocationsTags = new List<DashboardItemCompare>(),
        };

        var actual = await AnswerFilterHelper
            .BuildFilteredAnswerValues(
                DbContext, dashboardItem, context.QuestionSetId, new DashboardEditAnswerDates())
            .Select(x => x.AnswerId)
            .Distinct()
            .ToListAsync();

        Assert.That(actual, Does.Contain(repeated.AnswerId),
            "An answer with repeated values for the filter question must still be selected.");
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

        var tagId = await DbContext.Tags
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();

        var unfiltered = await all.CountAsync();
        var bySite = await AnswerFilterHelper.ApplyLocationFilter(all, siteId, null).CountAsync();
        var untouched = await AnswerFilterHelper.ApplyLocationFilter(all, null, null).CountAsync();

        Assert.That(untouched, Is.EqualTo(unfiltered),
            "With neither location nor tag the query must be returned unchanged.");
        Assert.That(bySite, Is.GreaterThan(0),
            "Filtering by a site that has answers must not empty the query.");

        if (tagId > 0)
        {
            // The precedence this test is named for: a site beats a tag, and the
            // two are never combined.
            var both = await AnswerFilterHelper
                .ApplyLocationFilter(all, siteId, tagId)
                .CountAsync();

            Assert.That(both, Is.EqualTo(bySite),
                "A location must win over a tag rather than intersecting with it.");
        }
    }

    /// <summary>
    /// The batching the export depends on: seeking through answers in small windows
    /// must yield every answer exactly once, in the same order a single unbatched
    /// read would. This is what Skip/Take could not guarantee cheaply, and it is the
    /// whole point of the keyset rewrite.
    /// </summary>
    [Test]
    public async Task KeysetPaging_StitchesBatchesIntoTheFullSetExactlyOnce()
    {
        var answers = DbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

        var expected = await RawDataPaging.OrderNewestFirst(answers)
            .Select(x => x.Id)
            .ToListAsync();

        Assert.That(expected, Is.Not.Empty, "Seed data has no answers to page through.");

        const int batchSize = 3;
        var stitched = new List<int>();
        DateTime? cursorFinishedAt = null;
        int? cursorId = null;
        var guard = 0;

        while (true)
        {
            var batch = await RawDataPaging
                .AfterCursor(answers, cursorFinishedAt, cursorId)
                .Take(batchSize)
                .Select(x => new { x.Id, x.FinishedAt })
                .ToListAsync();

            if (batch.Count == 0)
            {
                break;
            }

            stitched.AddRange(batch.Select(x => x.Id));
            cursorFinishedAt = batch[^1].FinishedAt;
            cursorId = batch[^1].Id;

            Assert.That(++guard, Is.LessThan(expected.Count + 10),
                "The cursor stopped advancing - paging would loop forever.");
        }

        Assert.That(stitched, Is.EqualTo(expected),
            "Stitched batches must equal a single ordered read, in order.");
        Assert.That(stitched.Distinct().Count(), Is.EqualTo(stitched.Count),
            "No answer may appear in two batches.");
    }

    /// <summary>
    /// Answers sharing a FinishedAt are exactly where paging breaks without a total
    /// order, so they must not straddle a batch boundary incorrectly.
    /// </summary>
    [Test]
    public async Task KeysetPaging_HandlesAnswersSharingATimestamp()
    {
        var duplicated = await DbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .GroupBy(x => x.FinishedAt)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .FirstOrDefaultAsync();

        if (duplicated == default)
        {
            Assert.Ignore("Seed data has no answers sharing a FinishedAt.");
        }

        var answers = DbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.FinishedAt == duplicated);

        var expected = await RawDataPaging.OrderNewestFirst(answers).Select(x => x.Id).ToListAsync();

        var stitched = new List<int>();
        DateTime? cursorFinishedAt = null;
        int? cursorId = null;

        while (true)
        {
            var batch = await RawDataPaging
                .AfterCursor(answers, cursorFinishedAt, cursorId)
                .Take(1)
                .Select(x => new { x.Id, x.FinishedAt })
                .ToListAsync();

            if (batch.Count == 0)
            {
                break;
            }

            stitched.Add(batch[0].Id);
            cursorFinishedAt = batch[0].FinishedAt;
            cursorId = batch[0].Id;
        }

        Assert.That(stitched, Is.EqualTo(expected),
            "One-row batches through a timestamp collision must still cover it exactly once.");
    }
}
