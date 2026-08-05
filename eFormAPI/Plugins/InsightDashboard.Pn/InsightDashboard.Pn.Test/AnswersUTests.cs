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

using Base;
using NUnit.Framework;
using System.Linq;
using Infrastructure.Models.Answers;
using Microting.eForm.Infrastructure.Constants;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Helpers;
using Microsoft.EntityFrameworkCore;
using InsightDashboard.Pn.Infrastructure.Helpers;

[TestFixture]
public class AnswersUTests : DbTestFixture
{
    private const int MicrotingUid = 1413005;
    private AnswerViewModel _answerForTest;
    protected override void DoSetup()
    {
        _answerForTest = JsonConvert.DeserializeObject<AnswerViewModel>(FileHelper.ReadFileFromResources("TestAnswer"));
    }

    [Test]
    public void Answer_Get()
    {
        var answer = AnswerHelper.GetAnswerQueryByMicrotingUid(MicrotingUid, DbContext).FirstOrDefault();

        Assert.That(answer, Is.Not.Null);
        Assert.That(_answerForTest.Id, Is.EqualTo(answer.Id));
        Assert.That(_answerForTest.MicrotingUid, Is.EqualTo(answer.MicrotingUid));
        for(var i = 0; i < _answerForTest.AnswerValues.Count; i++)
        {
            var answerValues = answer.AnswerValues[i];
            var answerValuesForTest = _answerForTest.AnswerValues[i];
            Assert.That(answerValuesForTest.Id, Is.EqualTo(answerValues.Id));
            Assert.That(answerValuesForTest.Value, Is.EqualTo(answerValues.Value));
            for(var j = 0; j < answerValuesForTest.Translations.Count; j++)
            {
                var translationsForTest = answerValuesForTest.Translations[j];
                var translations = answerValues.Translations[j];
                Assert.That(translationsForTest.LanguageId, Is.EqualTo(translations.LanguageId));
                Assert.That(translationsForTest.LanguageName, Is.EqualTo(translations.LanguageName));
                Assert.That(translationsForTest.Value, Is.EqualTo(translations.Value));
            }
        }
    }

    [Test]
    public async Task Delete_Answer()
    {
        var answerBeforeDelete = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(MicrotingUid, DbContext)
            .FirstOrDefaultAsync();

        var answerForBackup = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(MicrotingUid, DbContext)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        var answersValuesBeforeDelete = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(1, DbContext)
            .ToListAsync();
        var answerValuesForBackup = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(1, DbContext)
            .AsNoTracking()
            .ToListAsync();
        Assert.That(answersValuesBeforeDelete, Is.Not.Empty);

        foreach(var answersValue in answersValuesBeforeDelete)
        {
            await answersValue.Delete(DbContext);
        }

        Assert.That(answerBeforeDelete, Is.Not.Null);
        await answerBeforeDelete.Delete(DbContext);

        var answerAfterDelete = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(MicrotingUid, DbContext)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed).AsNoTracking()
            .FirstOrDefaultAsync();

        var answersValuesAfterDelete = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(1, DbContext)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed).AsNoTracking()
            .ToListAsync();

        Assert.That(answersValuesAfterDelete, Is.Empty);
        Assert.That(answerAfterDelete, Is.Null);

        answerBeforeDelete.Version = answerForBackup.Version;
        answerBeforeDelete.WorkflowState = answerForBackup.WorkflowState;
        answerBeforeDelete.UpdatedAt = answerForBackup.UpdatedAt;
        DbContext.Answers.Update(answerBeforeDelete);
        for (var i = 0; i < answersValuesBeforeDelete.Count; i++)
        {
            answersValuesBeforeDelete[i].Version = answerValuesForBackup[i].Version;
            answersValuesBeforeDelete[i].WorkflowState = answerValuesForBackup[i].WorkflowState;
            answersValuesBeforeDelete[i].UpdatedAt = answerValuesForBackup[i].UpdatedAt;
            DbContext.AnswerValues.Update(answersValuesBeforeDelete[i]);
        }

        await DbContext.SaveChangesAsync();
    }

    /// <summary>
    /// The answer detail lookup used to have its workflow-state filters commented
    /// out, so a soft-deleted answer was still returned and rendered as though it
    /// were live - AnswerViewModel carries no WorkflowState, so nothing on the page
    /// marked it. Charts and the raw data table already excluded such answers, which
    /// left this the last inconsistent reader.
    ///
    /// Runs inside a transaction that is never committed, so the shared test
    /// database is unchanged even if the process dies. MySqlRetryingExecutionStrategy
    /// refuses user-initiated transactions unless the unit runs through
    /// CreateExecutionStrategy, hence the wrapper.
    /// </summary>
    [Test]
    public async Task AnswerLookup_ExcludesSoftDeletedAnswer()
    {
        var subject = await LiveAnswerVisibleToTheLookup();

        Assert.That(subject, Is.Not.Null,
            "Seed data has no answer the detail lookup can return.");

        var before = await AnswerHelper
            .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
            .FirstOrDefaultAsync();

        Assert.That(before, Is.Not.Null,
            "The chosen answer must be visible to begin with, or this proves nothing.");

        var strategy = DbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await DbContext.Database.BeginTransactionAsync();

            // Raw SQL, not PnBase.Delete: Delete would also remove the values, and
            // then the answer-side filter alone could not be what excluded it.
            await DbContext.Database.ExecuteSqlRawAsync(
                "UPDATE Answers SET WorkflowState = 'removed' WHERE Id = {0}", subject.Id);

            var after = await AnswerHelper
                .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
                .FirstOrDefaultAsync();

            Assert.That(after, Is.Null,
                "A soft-deleted answer must not be returned by the detail lookup.");

            await transaction.RollbackAsync();
        });

        var restored = await AnswerHelper
            .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
            .FirstOrDefaultAsync();

        Assert.That(restored, Is.Not.Null,
            "Rollback failed - the shared test database is left modified.");
    }

    /// <summary>
    /// The second, independent filter: a live answer must not carry soft-deleted
    /// values. Separate test because the two filters guard different things and one
    /// could be re-commented without the other.
    /// </summary>
    [Test]
    public async Task AnswerLookup_ExcludesSoftDeletedValuesOfALiveAnswer()
    {
        var subject = await LiveAnswerVisibleToTheLookup();

        Assert.That(subject, Is.Not.Null,
            "Seed data has no answer the detail lookup can return.");

        var before = await AnswerHelper
            .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
            .FirstOrDefaultAsync();

        Assert.That(before?.AnswerValues, Is.Not.Empty,
            "The chosen answer must have values, or this proves nothing.");

        // Taken from the lookup's own output rather than from AnswerValues directly,
        // so the value is guaranteed to be one the lookup returns and the count
        // assertion below can only move because of workflow state.
        var valueId = before.AnswerValues.OrderBy(x => x.Id).First().Id;

        var strategy = DbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await DbContext.Database.BeginTransactionAsync();

            await DbContext.Database.ExecuteSqlRawAsync(
                "UPDATE AnswerValues SET WorkflowState = 'removed' WHERE Id = {0}", valueId);

            var after = await AnswerHelper
                .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
                .FirstOrDefaultAsync();

            Assert.That(after, Is.Not.Null,
                "The answer itself is still live and must still be returned.");
            Assert.That(after.AnswerValues.Count, Is.EqualTo(before.AnswerValues.Count - 1),
                "Exactly the soft-deleted value should have dropped out.");
            Assert.That(after.AnswerValues.Select(x => x.Id), Does.Not.Contain(valueId));

            await transaction.RollbackAsync();
        });

        var restored = await AnswerHelper
            .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
            .FirstOrDefaultAsync();

        Assert.That(restored?.AnswerValues.Count, Is.EqualTo(before.AnswerValues.Count),
            "Rollback failed - the shared test database is left modified.");
    }

    /// <summary>
    /// Picks an answer the detail lookup can actually return, deterministically
    /// rather than leaving the choice to the storage engine.
    ///
    /// The lookup no longer drops answers without a unit, but these tests still
    /// require one: AnswerLookup_ReturnsAnswersThatHaveNoUnit removes the unit and
    /// then asserts on the restore, which is only meaningful if there was a unit
    /// uid to restore. Hence the Units predicate, including its MicrotingUid being
    /// set - Unit.MicrotingUid is itself nullable.
    /// </summary>
    private async Task<AnswerSubject> LiveAnswerVisibleToTheLookup() =>
        await DbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.MicrotingUid != null)
            .Where(x => x.UnitId != null)
            .Where(x => DbContext.Units.Any(u => u.Id == x.UnitId && u.MicrotingUid != null))
            .Where(x => DbContext.Sites.Any(s => s.Id == x.SiteId))
            .Where(x => DbContext.AnswerValues.Any(v =>
                v.AnswerId == x.Id && v.WorkflowState != Constants.WorkflowStates.Removed))
            // The lookup matches on MicrotingUid and takes the first row. There is
            // no unique index on that column, so a shared uid would let a sibling
            // answer satisfy the query after this one is marked removed, and the
            // "is null" assertion would fail for the wrong reason.
            .Where(x => DbContext.Answers.Count(y => y.MicrotingUid == x.MicrotingUid) == 1)
            .OrderBy(x => x.Id)
            .Select(x => new AnswerSubject { Id = x.Id, MicrotingUid = (int)x.MicrotingUid })
            .FirstOrDefaultAsync();

    /// <summary>
    /// The lookup used to read the question text by joining AnswerValue.QuestionId
    /// to QuestionTranslation.Id - two different keys - so the label was whichever
    /// translation happened to share that number, and values with no such row
    /// vanished entirely.
    ///
    /// The seeded database cannot expose this: every QuestionTranslation there has
    /// Id equal to its QuestionId, so the wrong join coincidentally agrees with the
    /// right one. The test therefore builds the divergence itself - it points the
    /// row whose Id matches the question at a different question, and gives the
    /// question a translation with a distinctive name. A correct lookup reads the
    /// distinctive name; the old join reads the displaced row.
    /// </summary>
    [Test]
    public async Task AnswerLookup_ReadsQuestionTextByQuestionIdNotByTranslationId()
    {
        const string marker = "CORRECT-JOIN-MARKER";

        var subject = await LiveAnswerVisibleToTheLookup();
        Assert.That(subject, Is.Not.Null, "Seed data has no answer the lookup can return.");

        var value = await DbContext.AnswerValues
            .AsNoTracking()
            .Where(x => x.AnswerId == subject.Id)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .OrderBy(x => x.Id)
            .Select(x => new { x.Id, x.QuestionId })
            .FirstAsync();

        var questionId = value.QuestionId;

        // The row the broken join would read, and the language to reuse.
        var displaced = await DbContext.QuestionTranslations
            .AsNoTracking()
            .Where(x => x.Id == questionId)
            .Select(x => new { x.Id, x.LanguageId, x.Name })
            .FirstOrDefaultAsync();

        Assert.That(displaced, Is.Not.Null,
            "Expected the seed's Id == QuestionId shape; without it this test cannot "
            + "distinguish the two joins.");

        // QuestionTranslations.QuestionId is a foreign key, so the displaced row has
        // to point at a real question - just not this one.
        var otherQuestionId = await DbContext.Questions
            .AsNoTracking()
            .Where(x => x.Id != questionId)
            .OrderBy(x => x.Id)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();

        Assert.That(otherQuestionId, Is.GreaterThan(0),
            "Need a second question to displace the translation onto.");

        var strategy = DbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await DbContext.Database.BeginTransactionAsync();

            // Break the coincidence: the row whose Id == questionId now describes a
            // different question, so only a QuestionId match can find the real text.
            await DbContext.Database.ExecuteSqlRawAsync(
                "UPDATE QuestionTranslations SET QuestionId = {0} WHERE Id = {1}",
                otherQuestionId, displaced.Id);

            await DbContext.Database.ExecuteSqlRawAsync(
                "INSERT INTO QuestionTranslations (Version, WorkflowState, CreatedAt, UpdatedAt, "
                + "QuestionId, LanguageId, Name) VALUES (1, 'created', NOW(), NOW(), {0}, {1}, {2})",
                questionId, displaced.LanguageId, marker);

            var answer = await AnswerHelper
                .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
                .FirstOrDefaultAsync();

            Assert.That(answer, Is.Not.Null);

            // Scoped to the one value whose question was displaced. Asserting across
            // the whole answer would be self-defeating: the displaced translation is
            // moved onto another real question, and on the seeded data that question
            // belongs to this same answer, so its name legitimately reappears on a
            // different row.
            var displacedValue = answer.AnswerValues.Single(x => x.Id == value.Id);

            Assert.That(displacedValue.Question, Is.EqualTo(marker),
                "The question text must come from the translation whose QuestionId "
                + "matches the value, not from the one whose Id happens to.");
            Assert.That(displacedValue.Question, Is.Not.EqualTo(displaced.Name),
                "Reading the displaced translation means the lookup is still matching "
                + "on QuestionTranslation.Id.");

            await transaction.RollbackAsync();
        });

        var afterRollback = await DbContext.QuestionTranslations
            .AsNoTracking()
            .Where(x => x.Id == displaced.Id)
            .Select(x => x.QuestionId)
            .FirstAsync();

        Assert.That(afterRollback, Is.EqualTo(questionId),
            "Rollback failed - the shared test database is left modified.");
    }

    /// <summary>
    /// Answer.UnitId is nullable, but the lookup inner-joined Units, so an answer
    /// without a unit was dropped and the endpoint reported it as not found - the
    /// same message it gives for an answer that genuinely does not exist.
    /// </summary>
    [Test]
    public async Task AnswerLookup_ReturnsAnswersThatHaveNoUnit()
    {
        var subject = await LiveAnswerVisibleToTheLookup();
        Assert.That(subject, Is.Not.Null, "Seed data has no answer the lookup can return.");

        var strategy = DbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await DbContext.Database.BeginTransactionAsync();

            await DbContext.Database.ExecuteSqlRawAsync(
                "UPDATE Answers SET UnitId = NULL WHERE Id = {0}", subject.Id);

            var answer = await AnswerHelper
                .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
                .FirstOrDefaultAsync();

            Assert.That(answer, Is.Not.Null,
                "An answer with no unit must still be returned, not reported as missing.");
            Assert.That(answer.UnitId, Is.Null, "With no unit there is no unit uid to show.");
            Assert.That(answer.AnswerValues, Is.Not.Empty,
                "Its values must still come back.");

            await transaction.RollbackAsync();
        });

        var restored = await AnswerHelper
            .GetAnswerQueryByMicrotingUid(subject.MicrotingUid, DbContext)
            .FirstOrDefaultAsync();

        Assert.That(restored?.UnitId, Is.Not.Null,
            "Rollback failed - the shared test database is left modified.");
    }

    private sealed class AnswerSubject
    {
        public int Id { get; init; }

        public int MicrotingUid { get; init; }
    }
}