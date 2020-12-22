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


namespace InsightDashboard.Pn.Test
{
    using Base;
    using NUnit.Framework;
    using System.Linq;
    using Infrastructure.Models.Answers;
    using Microting.eForm.Infrastructure.Constants;
    using Newtonsoft.Json;
    using System.Threading.Tasks;
    using Helpers;
    using Microsoft.EntityFrameworkCore;

    [TestFixture]
    public class AnswersUTests : DbTestFixture
    {
        private AnswerViewModel _answerForTest;
        protected override void DoSetup()
        {
            _answerForTest = JsonConvert.DeserializeObject<AnswerViewModel>(FileHelper.ReadFileFromResources("TestAnswer"));
        }

        [Test]
        public void Answer_Get()
        {
            var answer = DbContext.Answers
                .Where(x=>x.MicrotingUid == 1413005)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(answers => new AnswerViewModel()
                {
                    MicrotingUId = (int)answers.MicrotingUid,
                    Id = answers.Id,
                    Values = DbContext.AnswerValues
                        .Where(answerValues => answerValues.AnswerId == answers.Id)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(a => new AnswerValuesViewModel()
                        {
                            Value = a.Value,
                            Id = a.Id,
                            Translations = DbContext.OptionTranslations
                                .Where(x => x.OptionId == a.OptionId)
                                .AsQueryable()
                                .Select(translations => new AnswerValueTranslationModel()
                                {
                                    Value = translations.Name,
                                    LanguageId = translations.LanguageId,
                                    LanguageName = DbContext.Languages.FirstOrDefault(x => x.Id == translations.LanguageId).Name
                                }).ToList()
                        }).ToList()
                }).FirstOrDefault();

            Assert.NotNull(answer);
            Assert.AreEqual(answer.Id, _answerForTest.Id);
            Assert.AreEqual(answer.MicrotingUId, _answerForTest.MicrotingUId);
            for(var i = 0; i < _answerForTest.Values.Count; i++)
            {
                var answerValues = answer.Values[i];
                var answerValuesForTest = _answerForTest.Values[i];
                Assert.AreEqual(answerValues.Id, answerValuesForTest.Id);
                Assert.AreEqual(answerValues.Value, answerValuesForTest.Value);
                for(var j = 0; j < answerValuesForTest.Translations.Count; j++)
                {
                    var translationsForTest = answerValuesForTest.Translations[j];
                    var translations = answerValues.Translations[j];
                    Assert.AreEqual(translations.LanguageId, translationsForTest.LanguageId);
                    Assert.AreEqual(translations.LanguageName, translationsForTest.LanguageName);
                    Assert.AreEqual(translations.Value, translationsForTest.Value);
                }
            }
        }

        [Test]
        public async Task Delete_Answer()
        {
            var answer = await DbContext.Answers
                .Where(x => x.MicrotingUid == 1413005)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .FirstOrDefaultAsync();

            var answersValues = await DbContext.AnswerValues
                .Where(x => x.AnswerId == answer.Id)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .ToListAsync();
            Assert.IsNotEmpty(answersValues);

            foreach(var answersValue in answersValues)
            {
                await answersValue.Delete(DbContext);
            }

            Assert.AreNotEqual(answer, default);
            await answer.Delete(DbContext);

            var answerAfterDelete = await DbContext.Answers
                .Where(x => x.MicrotingUid == 1413005)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .FirstOrDefaultAsync();

            var answersValuesAfterDelete = DbContext.AnswerValues
                .Where(x => x.AnswerId == answer.Id)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .ToList();

            Assert.IsEmpty(answersValuesAfterDelete);
            Assert.AreEqual(answerAfterDelete, default);

        }
    }
}