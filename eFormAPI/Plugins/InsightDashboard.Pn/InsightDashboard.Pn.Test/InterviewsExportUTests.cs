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

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Infrastructure.Consts;
using Infrastructure.Enum.Excel;
using Infrastructure.Models.Export;
using NUnit.Framework;
using Services.InterviewsExcelService;

/// <summary>
/// Covers the interviews xlsx export. Like the raw data export tests these need
/// no database - each writes a workbook to a temp file and reads it back.
///
/// The export shipped broken for a long time because nothing here existed: it
/// wrote no header row at all, and stopped one column short of Comments, which
/// is the only column an interviews export is really for.
/// </summary>
[TestFixture]
public class InterviewsExportUTests
{
    private string _file;

    [SetUp]
    public void SetUp() =>
        _file = Path.Combine(Path.GetTempPath(), $"interviews-{Guid.NewGuid():N}.xlsx");

    [TearDown]
    public void TearDown()
    {
        if (File.Exists(_file))
        {
            File.Delete(_file);
        }
    }

    private static InterviewsExcelService Service() => new(null, null);

    private static InterviewsExportModel Interview() => new()
    {
        Id = 42,
        Date = new DateTime(2021, 3, 14, 13, 45, 0),
        Question = "Her kan du evt. uddybe dine svar:",
        FilterQuestion = "Ønsker borgeren at deltage?",
        FilterAnswer = "Ja",
        Tag = "Team Nord",
        Comments = "Maden er for kold",
    };

    /// <summary>
    /// Resolves a cell to the text a reader would see. Values written as shared
    /// strings hold an index rather than the string, so reading CellValue alone
    /// silently returns a number.
    /// </summary>
    private static string Text(SpreadsheetDocument document, Cell cell)
    {
        var raw = cell.CellValue?.Text ?? string.Empty;

        if (cell.DataType?.Value == CellValues.SharedString)
        {
            return document.WorkbookPart!.SharedStringTablePart!.SharedStringTable
                .ElementAt(int.Parse(raw)).InnerText;
        }

        return cell.DataType?.Value == CellValues.InlineString ? cell.InnerText : raw;
    }

    /// <summary>Cell reference to text, so a gap is visible as a missing key.</summary>
    private static List<Dictionary<string, string>> ReadSheet(string path)
    {
        using var document = SpreadsheetDocument.Open(path, false);
        var worksheetPart = document.WorkbookPart!.WorksheetParts.First();

        return worksheetPart.Worksheet
            .Descendants<Row>()
            .Select(row => row.Elements<Cell>()
                .ToDictionary(
                    cell => cell.CellReference?.Value ?? string.Empty,
                    cell => Text(document, cell)))
            .ToList();
    }

    [Test]
    public void ColCount_CoversEveryColumnTheEnumDeclares()
    {
        // The constant was 6 while the enum declared 7, so the writer's loop
        // never reached Comments. Pinning them together stops that recurring
        // the next time a column is added.
        Assert.That(
            ExcelConsts.Interviews.ColCount,
            Is.EqualTo(Enum.GetValues<InterviewsExport>().Length));
    }

    [Test]
    public void Export_WritesAHeaderRowNamingEveryColumn()
    {
        Service().WriteInterviewsExportToExcelFile([Interview()], _file);

        var sheet = ReadSheet(_file);

        Assert.That(sheet, Is.Not.Empty, "The workbook must have a header row.");
        Assert.That(sheet[0]["A1"], Is.EqualTo("Id"));
        Assert.That(sheet[0]["B1"], Is.EqualTo("Date"));
        Assert.That(sheet[0]["G1"], Is.EqualTo("Comments"));
    }

    [Test]
    public void Export_WritesTheCommentsColumn()
    {
        Service().WriteInterviewsExportToExcelFile([Interview()], _file);

        var sheet = ReadSheet(_file);

        Assert.That(sheet[1].ContainsKey("G2"), Is.True, "Comments must be written.");
        Assert.That(sheet[1]["G2"], Is.EqualTo("Maden er for kold"));
    }

    [Test]
    public void Export_WritesEveryEnumMemberAsAColumn()
    {
        Service().WriteInterviewsExportToExcelFile([Interview()], _file);

        var sheet = ReadSheet(_file);
        var columns = Enum.GetValues<InterviewsExport>().Length;

        for (var col = 1; col <= columns; col++)
        {
            var reference = $"{(char)('A' + col - 1)}2";
            Assert.That(
                sheet[1].ContainsKey(reference) && sheet[1][reference].Length > 0,
                Is.True,
                $"{(InterviewsExport)col} should have produced a value at {reference}.");
        }
    }

    [Test]
    public void Export_KeepsColumnsAlignedWhenAValueIsNull()
    {
        var interview = Interview();
        interview.Tag = null;

        Service().WriteInterviewsExportToExcelFile([interview], _file);

        var sheet = ReadSheet(_file);

        // The gap has to stay a gap. Shifting Comments left into F would put it
        // under the Tag header without anything looking wrong.
        Assert.That(sheet[1].ContainsKey("F2"), Is.False);
        Assert.That(sheet[1]["G2"], Is.EqualTo("Maden er for kold"));
    }

    [Test]
    public void Export_FormatsDatesUnambiguously()
    {
        Service().WriteInterviewsExportToExcelFile([Interview()], _file);

        var sheet = ReadSheet(_file);

        // 03/14/2021 is unreadable to a Danish audience and sorts lexically.
        Assert.That(sheet[1]["B2"], Is.EqualTo("2021-03-14 13:45:00"));
    }

    [Test]
    public void Export_ProducesAReadableWorkbookForAnEmptyInterviewList()
    {
        Service().WriteInterviewsExportToExcelFile([], _file);

        var sheet = ReadSheet(_file);

        // Reopening it at all is half the assertion; the header must survive so
        // the user sees an empty table rather than an empty file.
        Assert.That(sheet.Count, Is.EqualTo(1));
        Assert.That(sheet[0]["A1"], Is.EqualTo("Id"));
    }
}
