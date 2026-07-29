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

namespace InsightDashboard.Pn.Services.RawDataExcelService;

using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Security.Claims;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Infrastructure.Models.RawData;
using Microsoft.AspNetCore.Http;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

/// <summary>
/// Writes the raw data table to xlsx. Unlike InterviewsExcelService this does not
/// copy a template first - that service creates a fresh SpreadsheetDocument over
/// the copied template anyway, so the copy is dead weight - and the column count
/// here is decided by the survey rather than a fixed enum.
/// </summary>
public class RawDataExcelService(IHttpContextAccessor httpAccessor) : IRawDataExcelService
{
    public string CreateFilePath()
    {
        var path = Path.Combine(PathHelper.GetStoragePath(), "excel-storage");
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        return Path.Combine(path, $"raw-data-{UserId}-{DateTime.UtcNow.Ticks}.xlsx");
    }

    public bool WriteRawDataToExcelFile(RawDataListModel model, string destFile)
    {
        using var spreadsheetDocument =
            SpreadsheetDocument.Create(destFile, SpreadsheetDocumentType.Workbook);

        var workbookPart = spreadsheetDocument.AddWorkbookPart();
        workbookPart.Workbook = new Workbook();

        var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
        worksheetPart.Worksheet = new Worksheet(new SheetData());

        var sheets = spreadsheetDocument.WorkbookPart!.Workbook.AppendChild(new Sheets());
        sheets.Append(new Sheet
        {
            Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart),
            SheetId = 1,
            Name = "Raw data",
        });

        var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
        var columns = model.Columns;

        // Header row. Columns hidden in the UI are exported too - the export is
        // the complete record.
        var headerRow = new Row { RowIndex = 1U };
        for (var col = 0; col < columns.Count; col++)
        {
            headerRow.Append(new Cell
            {
                CellReference = GetCellReference(1, col + 1),
                DataType = CellValues.String,
                CellValue = new CellValue(columns[col].Header ?? string.Empty),
            });
        }

        sheetData!.Append(headerRow);

        var rowIndex = 2;
        foreach (var modelRow in model.Rows)
        {
            var row = new Row { RowIndex = (uint)rowIndex };

            for (var col = 0; col < columns.Count; col++)
            {
                var value = modelRow.GetValueOrDefault(columns[col].Field);
                if (value == null)
                {
                    continue;
                }

                var cell = new Cell { CellReference = GetCellReference(rowIndex, col + 1) };

                switch (value)
                {
                    case DateTime dateTime:
                        cell.DataType = CellValues.String;
                        cell.CellValue = new CellValue(
                            dateTime.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture));
                        break;
                    case int intValue:
                        cell.DataType = CellValues.Number;
                        cell.CellValue = new CellValue(intValue.ToString(CultureInfo.InvariantCulture));
                        break;
                    case bool boolValue:
                        cell.DataType = CellValues.String;
                        cell.CellValue = new CellValue(boolValue ? "true" : "false");
                        break;
                    default:
                        cell.DataType = CellValues.String;
                        cell.CellValue = new CellValue(value.ToString() ?? string.Empty);
                        break;
                }

                row.Append(cell);
            }

            sheetData.Append(row);
            rowIndex++;
        }

        workbookPart.Workbook.Save();
        return true;
    }

    private int UserId
    {
        get
        {
            var value = httpAccessor?.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return value == null ? 0 : int.Parse(value);
        }
    }

    private static string GetCellReference(int rowIndex, int colIndex) =>
        $"{GetColumnName(colIndex)}{rowIndex}";

    private static string GetColumnName(int index)
    {
        var dividend = index;
        var columnName = string.Empty;
        while (dividend > 0)
        {
            var modulo = (dividend - 1) % 26;
            columnName = Convert.ToChar(65 + modulo) + columnName;
            dividend = (dividend - modulo) / 26;
        }

        return columnName;
    }
}
