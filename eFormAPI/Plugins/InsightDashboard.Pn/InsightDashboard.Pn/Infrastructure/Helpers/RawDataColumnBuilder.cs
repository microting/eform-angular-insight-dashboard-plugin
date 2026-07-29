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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Models.RawData;

public static class RawDataColumnBuilder
{
    /// <summary>
    /// Fallback smiley labels, used only when a smiley option has no translation
    /// of its own. Mirrors ChartDataHelpers.cs:60-68. 999 means "don't know".
    /// </summary>
    private static readonly Dictionary<int, string> SmileyFallbackLabels = new()
    {
        { 100, "Meget glad" },
        { 75, "Glad" },
        { 50, "Neutral" },
        { 25, "Sur" },
        { 0, "Meget sur" },
        { 999, "Ved ikke" },
    };

    public static string SmileyFallbackLabel(int weightValue) =>
        SmileyFallbackLabels.TryGetValue(weightValue, out var label) ? label : null;

    public static List<RawDataColumnModel> BuildAnswerColumns() => new()
    {
        AnswerColumn(RawDataFields.Id, "Id", sortable: true),
        AnswerColumn(RawDataFields.MicrotingUid, "Microting UID", sortable: true),
        AnswerColumn(RawDataFields.FinishedAt, "Finished at", sortable: true),
        AnswerColumn(RawDataFields.AnswerDuration, "Duration", sortable: true),
        AnswerColumn(RawDataFields.SiteName, "Site", sortable: true),
        AnswerColumn(RawDataFields.TagNames, "Tags", sortable: false),
        AnswerColumn(RawDataFields.UnitMicrotingUid, "Unit", sortable: true),
        AnswerColumn(RawDataFields.LanguageName, "Language", sortable: true),
        AnswerColumn(RawDataFields.SurveyConfigurationName, "Survey config", sortable: true),
        AnswerColumn(RawDataFields.QuestionSetName, "Survey", sortable: false, hidden: true),
        AnswerColumn(RawDataFields.TimeZone, "Time zone", sortable: false, hidden: true),
        AnswerColumn(RawDataFields.UtcAdjusted, "UTC adjusted", sortable: false, hidden: true),
        AnswerColumn(RawDataFields.CreatedAt, "Created at", sortable: true, hidden: true),
        AnswerColumn(RawDataFields.UpdatedAt, "Updated at", sortable: true, hidden: true),
        AnswerColumn(RawDataFields.Version, "Version", sortable: false, hidden: true),
        AnswerColumn(RawDataFields.WorkflowState, "Workflow state", sortable: true, hidden: true),
        AnswerColumn(RawDataFields.SiteId, "Site id", sortable: false, hidden: true),
        AnswerColumn(RawDataFields.UnitId, "Unit id", sortable: false, hidden: true),
        AnswerColumn(RawDataFields.LanguageId, "Language id", sortable: false, hidden: true),
    };

    private static RawDataColumnModel AnswerColumn(
        string field, string header, bool sortable, bool hidden = false) =>
        new()
        {
            Field = field,
            Header = header,
            Kind = RawDataColumnKinds.Answer,
            Sortable = sortable,
            DefaultHidden = hidden,
        };

    public static async Task<RawDataSchema> BuildAsync(
        MicrotingDbContext sdkContext,
        int questionSetId,
        IReadOnlyList<int> preferredLanguageIds)
    {
        var schema = new RawDataSchema { Columns = BuildAnswerColumns() };

        var questions = await sdkContext.Questions
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.QuestionSetId == questionSetId)
            .OrderBy(x => x.QuestionIndex)
            .Select(x => new { x.Id, x.QuestionType })
            .ToListAsync();

        if (questions.Count == 0)
        {
            return schema;
        }

        var questionIds = questions.Select(x => x.Id).ToList();

        var questionTranslations = await sdkContext.QuestionTranslations
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => questionIds.Contains(x.QuestionId))
            .Select(x => new { x.QuestionId, x.LanguageId, x.Name })
            .ToListAsync();

        var options = await sdkContext.Options
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => questionIds.Contains(x.QuestionId))
            .OrderBy(x => x.OptionIndex)
            .Select(x => new { x.Id, x.QuestionId, x.WeightValue })
            .ToListAsync();

        var optionIds = options.Select(x => x.Id).ToList();

        var optionTranslations = await sdkContext.OptionTranslations
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => optionIds.Contains(x.OptionId))
            .Select(x => new { x.OptionId, x.LanguageId, x.Name })
            .ToListAsync();

        var questionNumber = 0;
        foreach (var question in questions)
        {
            questionNumber++;

            var questionName = RawDataTranslations.Pick(
                questionTranslations
                    .Where(t => t.QuestionId == question.Id)
                    .Select(t => (t.LanguageId, t.Name))
                    .ToList(),
                preferredLanguageIds);

            var questionLabel = $"{questionNumber} – {questionName}";
            var questionOptions = options.Where(o => o.QuestionId == question.Id).ToList();

            var isSmiley = IsSmileyType(question.QuestionType);
            var isMulti = question.QuestionType == Constants.QuestionTypes.Multi;

            var meta = new RawDataQuestionMeta
            {
                QuestionId = question.Id,
                IsSmiley = isSmiley,
                IsMulti = isMulti,
                QuestionType = question.QuestionType,
                Kind = isMulti ? RawDataColumnKinds.MultiOption : KindFor(question.QuestionType, isSmiley),
            };

            foreach (var option in questionOptions)
            {
                meta.WeightValueByOptionId[option.Id] = option.WeightValue;
                meta.OptionNameByOptionId[option.Id] = RawDataTranslations.Pick(
                    optionTranslations
                        .Where(t => t.OptionId == option.Id)
                        .Select(t => (t.LanguageId, t.Name))
                        .ToList(),
                    preferredLanguageIds);
            }

            if (isMulti)
            {
                foreach (var option in questionOptions)
                {
                    var field = $"q{question.Id}_o{option.Id}";
                    meta.OptionFieldByOptionId[option.Id] = field;
                    meta.OptionFields.Add(field);

                    schema.Columns.Add(new RawDataColumnModel
                    {
                        Field = field,
                        Header = $"{questionLabel} › {meta.OptionNameByOptionId[option.Id]}",
                        Kind = RawDataColumnKinds.MultiOption,
                        Sortable = false,
                        DefaultHidden = false,
                        QuestionId = question.Id,
                        OptionId = option.Id,
                    });
                }
            }
            else
            {
                meta.Field = $"q{question.Id}";
                meta.OptionFields.Add(meta.Field);

                schema.Columns.Add(new RawDataColumnModel
                {
                    Field = meta.Field,
                    Header = questionLabel,
                    Kind = KindFor(question.QuestionType, isSmiley),
                    Sortable = false,
                    DefaultHidden = false,
                    QuestionId = question.Id,
                });
            }

            schema.Questions.Add(meta);
        }

        return schema;
    }

    private static string KindFor(string questionType, bool isSmiley)
    {
        if (isSmiley)
        {
            return RawDataColumnKinds.Smiley;
        }

        return questionType switch
        {
            Constants.QuestionTypes.List => RawDataColumnKinds.Single,
            Constants.QuestionTypes.Buttons => RawDataColumnKinds.Single,
            Constants.QuestionTypes.Number => RawDataColumnKinds.Number,
            Constants.QuestionTypes.Text => RawDataColumnKinds.Text,
            Constants.QuestionTypes.TextEamil => RawDataColumnKinds.Text,
            Constants.QuestionTypes.ZipCode => RawDataColumnKinds.Text,
            _ => RawDataColumnKinds.Other,
        };
    }

    /// <summary>
    /// Mirrors Question.IsSmiley() without needing a Question entity instance.
    /// </summary>
    private static bool IsSmileyType(string questionType) => questionType switch
    {
        Constants.QuestionTypes.Smiley => true,
        Constants.QuestionTypes.Smiley2 => true,
        Constants.QuestionTypes.Smiley3 => true,
        Constants.QuestionTypes.Smiley4 => true,
        Constants.QuestionTypes.Smiley5 => true,
        Constants.QuestionTypes.Smiley6 => true,
        Constants.QuestionTypes.Smiley7 => true,
        Constants.QuestionTypes.Smiley8 => true,
        Constants.QuestionTypes.Smiley9 => true,
        Constants.QuestionTypes.Smiley10 => true,
        _ => false,
    };
}
