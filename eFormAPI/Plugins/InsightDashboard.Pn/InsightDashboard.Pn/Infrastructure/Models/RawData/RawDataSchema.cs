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

namespace InsightDashboard.Pn.Infrastructure.Models.RawData;

using System.Collections.Generic;

public class RawDataQuestionMeta
{
    public int QuestionId { get; set; }
    public bool IsSmiley { get; set; }
    public bool IsMulti { get; set; }

    /// <summary>Raw SDK question type, e.g. "text", "number", "list".</summary>
    public string QuestionType { get; set; }

    /// <summary>One of RawDataColumnKinds; decides how a cell value is resolved.</summary>
    public string Kind { get; set; }

    /// <summary>Row-dictionary key for a single-value question. Null when IsMulti.</summary>
    public string Field { get; set; }

    /// <summary>Row-dictionary key per option. Populated only when IsMulti.</summary>
    public Dictionary<int, string> OptionFieldByOptionId { get; set; } = new();

    public Dictionary<int, string> OptionNameByOptionId { get; set; } = new();

    public Dictionary<int, int> WeightValueByOptionId { get; set; } = new();

    /// <summary>All field keys for this question, used to pre-fill "not answered".</summary>
    public List<string> OptionFields { get; set; } = new();
}

public class RawDataSchema
{
    public List<RawDataColumnModel> Columns { get; set; } = new();
    public List<RawDataQuestionMeta> Questions { get; set; } = new();
}
