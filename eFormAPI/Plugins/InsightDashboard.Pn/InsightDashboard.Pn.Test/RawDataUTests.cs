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

using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Base;
using Helpers;
using Infrastructure.Helpers;
using Infrastructure.Models.RawData;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using NUnit.Framework;

/// <summary>
/// Verifies the raw data table shows what it is supposed to show.
///
/// Two things are checked here that nothing else covers:
///   1. The table's row set reconciles with the chart above it - that is the
///      entire contract of AnswerFilterHelper.
///   2. Cells render the answer, not the SDK's synthetic option keyword.
/// </summary>
[TestFixture]
public class RawDataUTests : DbTestFixture
{
    private const int DanishLanguageId = 1;

    private static IReadOnlyList<int> PreferredLanguages => new[] { DanishLanguageId };

    /// <summary>
    /// The row count must equal the number of distinct answers the chart plotted.
    /// Compared against an independently written query rather than against
    /// AnswerFilterHelper itself, so the two cannot drift together.
    /// </summary>
    [Test]
    public async Task RawData_RowSet_MatchesChartAnswers()
    {
        CultureInfo.CurrentCulture = new CultureInfo("da");
        await DatabaseHelper.AddTotalTag(DbContext);

        var dashboardViews = DashboardHelpers.GetChartDataDashBoards();
        var comparisons = 0;

        foreach (var (dashboardView, templateName) in dashboardViews)
        {
            foreach (var itemViewModel in dashboardView.Items)
            {
                var dashboardItem = DashboardHelpers.GetDashboardItemFromModel(itemViewModel);

                // Text items are deliberately not supported by the raw data table.
                var questionType = await DbContext.Questions
                    .AsNoTracking()
                    .Where(x => x.Id == dashboardItem.FirstQuestionId)
                    .Select(x => x.QuestionType)
                    .FirstOrDefaultAsync();

                if (questionType == Constants.QuestionTypes.Text)
                {
                    continue;
                }

                var answerDates = new Infrastructure.Models.Dashboards.DashboardEditAnswerDates
                {
                    Today = dashboardView.AnswerDates.Today,
                    DateFrom = dashboardView.AnswerDates.DateFrom,
                    DateTo = dashboardView.AnswerDates.DateTo,
                };

                var actual = await AnswerFilterHelper
                    .BuildAnswerQuery(
                        DbContext,
                        dashboardItem,
                        dashboardView.SurveyId,
                        dashboardView.LocationId,
                        dashboardView.TagId,
                        answerDates)
                    .Select(x => x.Id)
                    .ToListAsync();

                var expected = await ExpectedAnswerIds(
                    dashboardItem,
                    dashboardView.SurveyId,
                    dashboardView.LocationId,
                    dashboardView.TagId,
                    answerDates);

                Assert.That(
                    actual.OrderBy(x => x),
                    Is.EqualTo(expected.OrderBy(x => x)),
                    $"Row set diverged from the chart's answers for template {templateName}, "
                    + $"item {itemViewModel.Position} (question {dashboardItem.FirstQuestionId}).");

                // Every returned answer must genuinely carry a value for the
                // measured question, otherwise it could not have fed the chart.
                if (actual.Count > 0)
                {
                    var withoutFirstQuestion = await DbContext.Answers
                        .AsNoTracking()
                        .Where(x => actual.Contains(x.Id))
                        .Where(x => !DbContext.AnswerValues.Any(v =>
                            v.AnswerId == x.Id
                            && v.QuestionId == dashboardItem.FirstQuestionId
                            && v.WorkflowState != Constants.WorkflowStates.Removed))
                        .CountAsync();

                    Assert.That(withoutFirstQuestion, Is.Zero,
                        $"{withoutFirstQuestion} answers have no value for the measured question "
                        + $"in template {templateName}.");
                }

                comparisons++;
            }
        }

        Assert.That(comparisons, Is.GreaterThan(0),
            "No dashboard items were compared - the fixtures did not load.");
    }

    /// <summary>
    /// Independent restatement of "which answers feed this item", written from the
    /// spec rather than copied from AnswerFilterHelper.
    /// </summary>
    private async Task<List<int>> ExpectedAnswerIds(
        Microting.InsightDashboardBase.Infrastructure.Data.Entities.DashboardItem dashboardItem,
        int surveyId,
        int? locationId,
        int? tagId,
        Infrastructure.Models.Dashboards.DashboardEditAnswerDates answerDates)
    {
        var values = DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Answer.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Answer.QuestionSetId == surveyId)
            .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);

        if (answerDates.DateFrom != null)
        {
            values = values.Where(x => x.Answer.FinishedAt >= answerDates.DateFrom);
        }

        if (answerDates.DateTo != null)
        {
            values = values.Where(x => x.Answer.FinishedAt <= answerDates.DateTo);
        }

        if (dashboardItem.FilterQuestionId != null && dashboardItem.FilterAnswerId != null)
        {
            var filtered = await DbContext.AnswerValues
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.QuestionId == dashboardItem.FilterQuestionId)
                .Where(x => x.OptionId == dashboardItem.FilterAnswerId)
                .Select(x => x.AnswerId)
                .ToListAsync();

            values = values.Where(x => filtered.Contains(x.AnswerId));
        }

        var ignored = dashboardItem.IgnoredAnswerValues
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.AnswerId)
            .ToList();

        if (ignored.Count > 0)
        {
            values = values.Where(x => !ignored.Contains(x.OptionId));
        }

        var isCompared =
            (dashboardItem.ChartType == Microting.InsightDashboardBase.Infrastructure.Enums.DashboardChartTypes.GroupedStackedBarChart
             || dashboardItem.ChartType == Microting.InsightDashboardBase.Infrastructure.Enums.DashboardChartTypes.GroupedNormalizedStackedBarChart
             || dashboardItem.ChartType == Microting.InsightDashboardBase.Infrastructure.Enums.DashboardChartTypes.Line)
            && (dashboardItem.CompareEnabled
                || (dashboardItem.ChartType == Microting.InsightDashboardBase.Infrastructure.Enums.DashboardChartTypes.Line
                    && dashboardItem.CalculateAverage));

        if (isCompared)
        {
            var tagIds = dashboardItem.CompareEnabled
                ? dashboardItem.CompareLocationsTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.TagId != null)
                    .Select(x => (int)x.TagId).ToList()
                : tagId != null ? new List<int> { (int)tagId } : new List<int>();

            var siteIds = dashboardItem.CompareEnabled
                ? dashboardItem.CompareLocationsTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.LocationId != null)
                    .Select(x => (int)x.LocationId).ToList()
                : locationId != null ? new List<int> { (int)locationId } : new List<int>();

            var byTag = await values
                .Where(x => x.Answer.Site.SiteTags.Any(y => y.TagId != null && tagIds.Contains((int)y.TagId)))
                .Select(x => x.AnswerId).ToListAsync();

            var bySite = await values
                .Where(x => siteIds.Contains(x.Answer.SiteId))
                .Select(x => x.AnswerId).ToListAsync();

            return byTag.Concat(bySite).Distinct().ToList();
        }

        if (!dashboardItem.CompareEnabled)
        {
            if (locationId != null)
            {
                values = values.Where(x => x.Answer.SiteId == locationId);
            }
            else if (tagId != null)
            {
                values = values.Where(x => x.Answer.Site.SiteTags.Any(y => y.TagId == tagId));
            }
        }

        if (locationId == null && tagId == null)
        {
            return new List<int>();
        }

        return await values.Select(x => x.AnswerId).Distinct().ToListAsync();
    }

    /// <summary>
    /// Columns must cover every question, numbered and ordered by QuestionIndex,
    /// with multi questions expanded to one column per option.
    /// </summary>
    [Test]
    public async Task RawData_Columns_CoverEveryQuestion()
    {
        var surveyId = await DbContext.Questions
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Select(x => x.QuestionSetId)
            .FirstOrDefaultAsync();

        Assert.That(surveyId, Is.GreaterThan(0), "No question set found in the seeded database.");

        var schema = await RawDataColumnBuilder.BuildAsync(DbContext, surveyId, PreferredLanguages);

        var answerColumns = schema.Columns
            .Where(x => x.Kind == RawDataColumnKinds.Answer).ToList();

        // The fixed half of the table.
        Assert.That(answerColumns.Select(x => x.Field), Does.Contain(RawDataFields.Id));
        Assert.That(answerColumns.Select(x => x.Field), Does.Contain(RawDataFields.FinishedAt));
        Assert.That(answerColumns.Select(x => x.Field), Does.Contain(RawDataFields.SiteName));

        // Audit fields exist but stay out of the way.
        var timeZone = answerColumns.Single(x => x.Field == RawDataFields.TimeZone);
        Assert.That(timeZone.DefaultHidden, Is.True, "Time zone should be hidden by default.");

        var finishedAt = answerColumns.Single(x => x.Field == RawDataFields.FinishedAt);
        Assert.That(finishedAt.DefaultHidden, Is.False);
        Assert.That(finishedAt.Sortable, Is.True);

        var questions = await DbContext.Questions
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.QuestionSetId == surveyId)
            .OrderBy(x => x.QuestionIndex)
            .Select(x => new { x.Id, x.QuestionType })
            .ToListAsync();

        Assert.That(schema.Questions.Count, Is.EqualTo(questions.Count),
            "Every non-removed question must produce metadata.");

        Assert.That(
            schema.Questions.Select(x => x.QuestionId),
            Is.EqualTo(questions.Select(x => x.Id)),
            "Questions must keep QuestionIndex order.");

        // Question columns are numbered from 1 in QuestionIndex order.
        var questionColumns = schema.Columns
            .Where(x => x.Kind != RawDataColumnKinds.Answer).ToList();

        Assert.That(questionColumns, Is.Not.Empty);
        Assert.That(questionColumns.All(x => x.Sortable), Is.False,
            "Pivoted question columns are not sortable.");

        foreach (var meta in schema.Questions)
        {
            var columns = questionColumns.Where(x => x.QuestionId == meta.QuestionId).ToList();
            Assert.That(columns, Is.Not.Empty, $"Question {meta.QuestionId} produced no column.");

            if (meta.IsMulti)
            {
                var optionCount = await DbContext.Options
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.QuestionId == meta.QuestionId)
                    .CountAsync();

                Assert.That(columns.Count, Is.EqualTo(optionCount),
                    $"Multi question {meta.QuestionId} must expand to one column per option.");
                Assert.That(columns.All(x => x.Header.Contains('›')), Is.True,
                    "Option columns carry their question label as a prefix.");
                Assert.That(columns.All(x => x.OptionId != null), Is.True);
            }
            else
            {
                Assert.That(columns.Count, Is.EqualTo(1),
                    $"Non-multi question {meta.QuestionId} must produce exactly one column.");
            }
        }
    }

    /// <summary>
    /// The defect this guards against: the SDK names auto-generated options after
    /// the question type, so a naive implementation renders "text" and "smiley1"
    /// instead of the answer.
    /// </summary>
    [Test]
    public void RawData_Cells_ShowAnswersNotOptionKeywords()
    {
        var smiley = new RawDataQuestionMeta
        {
            QuestionId = 1,
            IsSmiley = true,
            Kind = RawDataColumnKinds.Smiley,
            WeightValueByOptionId = new Dictionary<int, int> { { 10, 75 }, { 11, 999 } },
        };

        // "smiley2" is the option's actual translation in the database.
        Assert.That(
            RawDataValueResolver.ResolveSingleValue(smiley, 10, null, "smiley2"),
            Is.EqualTo("Glad (75)"));

        Assert.That(
            RawDataValueResolver.ResolveSingleValue(smiley, 11, null, "smiley6"),
            Is.EqualTo("Ved ikke (999)"));

        var text = new RawDataQuestionMeta { QuestionId = 2, Kind = RawDataColumnKinds.Text };

        // "text" is the synthetic option name; the answer lives in Value.
        Assert.That(
            RawDataValueResolver.ResolveSingleValue(text, 20, "Toiletterne trænger", "text"),
            Is.EqualTo("Toiletterne trænger"));

        Assert.That(
            RawDataValueResolver.ResolveSingleValue(text, 20, "", "text"),
            Is.EqualTo(RawDataValueResolver.NotAnswered));

        var number = new RawDataQuestionMeta { QuestionId = 3, Kind = RawDataColumnKinds.Number };

        Assert.That(
            RawDataValueResolver.ResolveSingleValue(number, 30, "12", "number"),
            Is.EqualTo("12"));

        // Single-select is the one type where the option name IS the answer.
        var single = new RawDataQuestionMeta { QuestionId = 4, Kind = RawDataColumnKinds.Single };

        Assert.That(
            RawDataValueResolver.ResolveSingleValue(single, 40, "Produktion", "Produktion"),
            Is.EqualTo("Produktion"));

        // picture / info_text carry no answer at all.
        var other = new RawDataQuestionMeta { QuestionId = 5, Kind = RawDataColumnKinds.Other };

        Assert.That(
            RawDataValueResolver.ResolveSingleValue(other, 50, null, "next"),
            Is.EqualTo(string.Empty));

        Assert.That(RawDataValueResolver.IsSkipped("na"), Is.True);
        Assert.That(RawDataValueResolver.IsSkipped("Kantine"), Is.False);
    }
}
