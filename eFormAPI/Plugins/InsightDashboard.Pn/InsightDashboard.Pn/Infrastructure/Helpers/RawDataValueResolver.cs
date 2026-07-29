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
using Models.RawData;

/// <summary>
/// Turns one AnswerValue into the text a raw-data cell shows.
///
/// The option's own translated name is only meaningful for choice questions.
/// The SDK auto-generates options whose translation IS the type keyword -
/// "smiley1".."smiley6", "number", "text", "next", "na" (see
/// Question.GenerateSmileyOptions / GenerateSpecialQuestionTypes). Preferring the
/// option name for every type would therefore render "text" instead of the typed
/// answer, and "smiley1" instead of "Meget glad".
///
/// Core.SaveAnswer only overwrites AnswerValue.Value with the option name for
/// buttons/list/multi; for every other type Value holds the real answer.
/// </summary>
public static class RawDataValueResolver
{
    /// <summary>Shown when a question was not answered.</summary>
    public const string NotAnswered = "—";

    /// <summary>Name of the synthetic option the SDK creates for a skipped question.</summary>
    public const string NaOptionName = "na";

    public static bool IsSkipped(string optionName) =>
        string.Equals(optionName, NaOptionName, StringComparison.OrdinalIgnoreCase);

    public static string ResolveSingleValue(
        RawDataQuestionMeta meta, int optionId, string value, string optionName)
    {
        switch (meta.Kind)
        {
            case RawDataColumnKinds.Smiley:
            {
                // Label from the weight ladder, matching what the chart plots
                // (ChartDataHelpers.cs:60-68), not from the "smileyN" translation.
                var weightValue = meta.WeightValueByOptionId.GetValueOrDefault(optionId);
                var label = RawDataColumnBuilder.SmileyFallbackLabel(weightValue);

                return string.IsNullOrEmpty(label)
                    ? weightValue.ToString()
                    : $"{label} ({weightValue})";
            }

            case RawDataColumnKinds.Single:
                // buttons / list - the option translation is the real answer text.
                return !string.IsNullOrEmpty(optionName) ? optionName : value;

            case RawDataColumnKinds.Number:
            case RawDataColumnKinds.Text:
                // Free input lives in Value; an empty Value means the question was skipped.
                return string.IsNullOrEmpty(value) ? NotAnswered : value;

            default:
                // picture / info_text carry no answer, only a synthetic "next" option.
                return string.Empty;
        }
    }
}
