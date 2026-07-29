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
using Infrastructure.Models.RawData;
using NUnit.Framework;
using Services.RawDataExcelService;

/// <summary>
/// Covers the streaming xlsx writer that replaced the whole-sheet DOM. These need
/// no database: each writes a workbook to a temp file and reads it back.
/// </summary>
[TestFixture]
public class RawDataExportUTests
{
    private string _file;

    private static List<RawDataColumnModel> Columns() =>
    [
        new() { Field = "id", Header = "Id", Kind = RawDataColumnKinds.Answer },
        new() { Field = "siteName", Header = "Site", Kind = RawDataColumnKinds.Answer },
        new() { Field = "q7", Header = "1 - Tilfredshed", Kind = RawDataColumnKinds.Smiley },
    ];

    [SetUp]
    public void SetUp() =>
        _file = Path.Combine(Path.GetTempPath(), $"rawdata-{Guid.NewGuid():N}.xlsx");

    [TearDown]
    public void TearDown()
    {
        if (File.Exists(_file))
        {
            File.Delete(_file);
        }
    }

    private static List<List<string>> ReadSheet(string path)
    {
        using var document = SpreadsheetDocument.Open(path, false);
        var worksheetPart = document.WorkbookPart!.WorksheetParts.First();

        return worksheetPart.Worksheet
            .Descendants<Row>()
            .Select(row => row.Elements<Cell>()
                .Select(cell => cell.CellValue?.Text ?? string.Empty)
                .ToList())
            .ToList();
    }

    [Test]
    public void Writer_WritesHeaderAndEveryRowStreamedToIt()
    {
        var service = new RawDataExcelService(null);

        using (var writer = service.CreateWriter(_file, Columns()))
        {
            // Comfortably more than one export batch, so this exercises the case
            // the batching exists for.
            for (var i = 1; i <= 5000; i++)
            {
                writer.WriteRow(new Dictionary<string, object>
                {
                    ["id"] = i,
                    ["siteName"] = $"Site {i}",
                    ["q7"] = "Glad (75)",
                });
            }

            writer.Complete();
        }

        var sheet = ReadSheet(_file);

        Assert.That(sheet.Count, Is.EqualTo(5001), "Header plus every streamed row.");
        Assert.That(sheet[0], Is.EqualTo(new List<string> { "Id", "Site", "1 - Tilfredshed" }));
        Assert.That(sheet[1], Is.EqualTo(new List<string> { "1", "Site 1", "Glad (75)" }));
        Assert.That(sheet[5000], Is.EqualTo(new List<string> { "5000", "Site 5000", "Glad (75)" }));
    }

    [Test]
    public void Writer_KeepsColumnsAlignedWhenValuesAreMissing()
    {
        var service = new RawDataExcelService(null);

        using (var writer = service.CreateWriter(_file, Columns()))
        {
            // No siteName. The cell must be skipped at its own reference rather
            // than shifted left, or every later column in the row would be wrong.
            writer.WriteRow(new Dictionary<string, object> { ["id"] = 1, ["q7"] = "Sur (25)" });
            writer.Complete();
        }

        using var document = SpreadsheetDocument.Open(_file, false);
        var cells = document.WorkbookPart!.WorksheetParts.First().Worksheet
            .Descendants<Row>().Last().Elements<Cell>().ToList();

        Assert.That(cells.Count, Is.EqualTo(2));
        Assert.That(cells[0].CellReference?.Value, Is.EqualTo("A2"));
        Assert.That(cells[1].CellReference?.Value, Is.EqualTo("C2"),
            "A missing value must leave a gap rather than shifting later columns.");
    }

    [Test]
    public void Writer_StripsControlCharactersThatWouldCorruptTheWorkbook()
    {
        var service = new RawDataExcelService(null);

        // A vertical tab is illegal in XML. Written raw, Excel refuses the file.
        var hostile = "Bad\vvalue";

        using (var writer = service.CreateWriter(_file, Columns()))
        {
            writer.WriteRow(new Dictionary<string, object>
            {
                ["id"] = 1,
                ["siteName"] = "Site",
                ["q7"] = hostile,
            });
            writer.Complete();
        }

        // Reopening is itself the assertion: an illegal character throws here.
        var sheet = ReadSheet(_file);

        Assert.That(sheet.Count, Is.EqualTo(2));
        Assert.That(sheet[1][2], Is.EqualTo("Badvalue"));
        Assert.That(sheet[1][2], Does.Not.Contain('\v'));
    }

    [Test]
    public void Writer_KeepsTabsAndNewlinesWhichAreLegal()
    {
        var service = new RawDataExcelService(null);

        using (var writer = service.CreateWriter(_file, Columns()))
        {
            writer.WriteRow(new Dictionary<string, object>
            {
                ["id"] = 1,
                ["q7"] = "line one\nline two",
            });
            writer.Complete();
        }

        var sheet = ReadSheet(_file);
        Assert.That(sheet[1][1], Does.Contain("line one"));
        Assert.That(sheet[1][1], Does.Contain("line two"));
    }

    [Test]
    public void Writer_ProducesAnEmptyButValidWorkbookWhenNothingMatches()
    {
        var service = new RawDataExcelService(null);

        using (var writer = service.CreateWriter(_file, Columns()))
        {
            writer.Complete();
        }

        var sheet = ReadSheet(_file);
        Assert.That(sheet.Count, Is.EqualTo(1), "Header only.");
    }

    [Test]
    public void Writer_DisposingWithoutCompletingDoesNotThrow()
    {
        var service = new RawDataExcelService(null);

        // The failure path: the service abandons the writer and deletes the
        // partial file. Disposing must not mask the original exception.
        Assert.DoesNotThrow(() =>
        {
            using var writer = service.CreateWriter(_file, Columns());
            writer.WriteRow(new Dictionary<string, object> { ["id"] = 1 });
        });
    }
}
