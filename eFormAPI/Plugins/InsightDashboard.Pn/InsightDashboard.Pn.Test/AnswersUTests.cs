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

        // Taken from the lookup's own output rather than from AnswerValues
        // directly. The lookup inner-joins QuestionTranslations on
        // value.QuestionId == translation.Id - which is a known defect, see the
        // note on GetAnswerQueryByMicrotingUid - so a value picked straight from
        // the table may not be visible to it, and the count assertion below would
        // then fail for a reason unrelated to workflow state.
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
    /// Picks an answer the detail lookup can actually return. That query inner-joins
    /// Sites and Units, so an answer with a null UnitId is invisible to it regardless
    /// of workflow state, and choosing one would make the tests above fail for the
    /// wrong reason. Ordered so the choice is deterministic rather than left to the
    /// storage engine.
    /// </summary>
    private async Task<AnswerSubject> LiveAnswerVisibleToTheLookup() =>
        await DbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.MicrotingUid != null)
            .Where(x => x.UnitId != null)
            .Where(x => DbContext.Units.Any(u => u.Id == x.UnitId))
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

    private sealed class AnswerSubject
    {
        public int Id { get; init; }

        public int MicrotingUid { get; init; }
    }
}