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

using System.Linq;
using Models.Answers;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;

public class AnswerHelper
{
    /// <summary>
    /// Looks up one answer for display. Soft-deleted answers, and soft-deleted
    /// values belonging to a live answer, are excluded - the same rule
    /// AnswerFilterHelper.WhereAnswerIsLive applies to the charts and the raw
    /// data table.
    ///
    /// Both filters were previously commented out, so a deleted answer was still
    /// returned and rendered as though it were live. Nothing marked it: neither
    /// AnswerViewModel nor AnswerValuesViewModel carries WorkflowState, so the
    /// page had no way to say otherwise.
    ///
    /// The answer's unit is optional, so an answer without one comes back with
    /// UnitId null instead of being dropped, and the question text is resolved
    /// through QuestionTranslation.QuestionId.
    ///
    /// The two ForDelete queries below deliberately stay unfiltered.
    /// AnswersService.DeleteAnswerByMicrotingUid has to be able to fetch an
    /// already-removed answer in order to report that it is already removed.
    /// </summary>
    public static IQueryable<AnswerViewModel> GetAnswerQueryByMicrotingUid(int microtingUid,
        MicrotingDbContext dbContext)
    {
        // Navigations rather than explicit joins. Answer.Unit is optional, so EF
        // emits a LEFT JOIN and an answer with no unit is still returned; the
        // previous inner join silently dropped those answers, which surfaced as an
        // indistinguishable "answer not found".
        var answersQueryable = dbContext.Answers
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.MicrotingUid == microtingUid)
            .Select(answer => new AnswerViewModel()
            {
                Id = answer.Id,
                MicrotingUid = (int)answer.MicrotingUid,
                UnitId = answer.Unit.MicrotingUid,
                FinishedAt = answer.FinishedAt,
                AnswerDuration = answer.AnswerDuration,
                SiteName = answer.Site.Name,
                AnswerValues = dbContext.AnswerValues
                    .Where(value => value.AnswerId == answer.Id)
                    .Where(value => value.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(value => new AnswerValuesViewModel()
                    {
                        Value = value.Value,
                        Id = value.Id,
                        // Correlated lookup instead of a join. The join here matched
                        // AnswerValue.QuestionId against QuestionTranslation.Id - a
                        // different key - so the question text was whichever
                        // translation happened to share that number. It also dropped
                        // any value with no such row. Matching on QuestionId is the
                        // real relationship; taking the first non-removed translation
                        // keeps one row per value, which a corrected join would not
                        // once a question has more than one language.
                        //
                        // TODO: lowest Id is insertion order, not a language choice.
                        // On a multi-language survey this can pair a question in one
                        // language with an option value in another, on the same row -
                        // the grid shows the option's language in its own column.
                        // RawDataTranslations.GetPreferredLanguageIdsAsync already
                        // resolves this properly (user language, then the survey's,
                        // then anything live) and should be threaded in here.
                        Question = dbContext.QuestionTranslations
                            .Where(translation => translation.QuestionId == value.QuestionId)
                            .Where(translation =>
                                translation.WorkflowState != Constants.WorkflowStates.Removed)
                            .OrderBy(translation => translation.Id)
                            .Select(translation => translation.Name)
                            .FirstOrDefault(),
                        Translations = dbContext.OptionTranslations
                            .Where(x => x.OptionId == value.OptionId)
                            .Select(translations => new AnswerValueTranslationModel()
                            {
                                Value = translations.Name,
                                LanguageId = translations.LanguageId,
                                LanguageName = dbContext.Languages
                                    .FirstOrDefault(x => x.Id == translations.LanguageId).Name
                            }).ToList()
                    }).ToList()
            });
        return answersQueryable;
    }

    public static IQueryable<Answer> GetAnswerQueryByMicrotingUidForDelete(int microtingUid,
        MicrotingDbContext dbContext)
    {
        var answerQuery = dbContext.Answers
            .Where(x => x.MicrotingUid == microtingUid);

        return answerQuery;
    }

    public static IQueryable<AnswerValue> GetAnswerValuesQueryByAnswerIdForDelete(int answerId,
        MicrotingDbContext dbContext)
    {
        var answersValuesQuery = dbContext.AnswerValues
            .Where(x => x.AnswerId == answerId);

        return answersValuesQuery;
    }
}