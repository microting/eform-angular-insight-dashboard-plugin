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
using System.Linq;
using Microting.eForm.Infrastructure.Data.Entities;

/// <summary>
/// Keyset ("seek") paging over answers, ordered newest first.
///
/// The export cannot use Skip/Take. Its answer query filters on an IN subquery -
/// for compared items a Union over AnswerValues - so every OFFSET batch would make
/// the database re-evaluate that subquery, re-sort the whole matching set and throw
/// away the rows it had already returned. That is quadratic in the number of rows,
/// which is worse than the memory problem batching set out to solve.
///
/// Seeking on (FinishedAt, Id) instead is linear and index-friendly. It also pins
/// the export to a consistent view: answers finished while the export runs sort
/// above the cursor and are simply never seen, whereas with OFFSET they would shift
/// every later window and duplicate rows across batch boundaries.
/// </summary>
public static class RawDataPaging
{
    /// <summary>
    /// Orders newest first. Id breaks ties so the order is total - without it,
    /// answers sharing a timestamp have no defined position and a cursor cannot
    /// resume reliably.
    /// </summary>
    public static IOrderedQueryable<Answer> OrderNewestFirst(IQueryable<Answer> answers) =>
        answers.OrderByDescending(x => x.FinishedAt).ThenByDescending(x => x.Id);

    /// <summary>
    /// Restricts to answers strictly after the cursor in that order. A null cursor
    /// means the first batch.
    /// </summary>
    public static IQueryable<Answer> AfterCursor(
        IQueryable<Answer> answers,
        DateTime? lastFinishedAt,
        int? lastId)
    {
        if (lastFinishedAt == null || lastId == null)
        {
            return OrderNewestFirst(answers);
        }

        return OrderNewestFirst(answers.Where(x =>
            x.FinishedAt < lastFinishedAt
            || (x.FinishedAt == lastFinishedAt && x.Id < lastId)));
    }
}
