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

/// <summary>
/// Question and option text lives only in QuestionTranslations / OptionTranslations,
/// keyed by LanguageId. Answer.LanguageId is NOT usable for this - Core.SaveAnswer
/// hardcodes it to the Danish row - so the raw data table resolves text by the
/// logged-in user's language, then the survey's deployed languages, then anything
/// non-removed.
/// </summary>
public static class RawDataTranslations
{
    public static async Task<List<int>> GetPreferredLanguageIdsAsync(
        MicrotingDbContext sdkContext,
        int questionSetId,
        int userLanguageId)
    {
        var surveyLanguageIds = await sdkContext.LanguageQuestionSets
            .AsNoTracking()
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.QuestionSetId == questionSetId)
            .Select(x => x.LanguageId)
            .ToListAsync();

        var preferred = new List<int> { userLanguageId };
        preferred.AddRange(surveyLanguageIds.Where(x => x != userLanguageId));
        return preferred;
    }

    public static string Pick(
        IReadOnlyList<(int LanguageId, string Name)> translations,
        IReadOnlyList<int> preferredLanguageIds)
    {
        foreach (var languageId in preferredLanguageIds)
        {
            var match = translations.FirstOrDefault(x => x.LanguageId == languageId);
            if (!string.IsNullOrEmpty(match.Name))
            {
                return match.Name;
            }
        }

        return translations
            .Select(x => x.Name)
            .FirstOrDefault(x => !string.IsNullOrEmpty(x));
    }
}
