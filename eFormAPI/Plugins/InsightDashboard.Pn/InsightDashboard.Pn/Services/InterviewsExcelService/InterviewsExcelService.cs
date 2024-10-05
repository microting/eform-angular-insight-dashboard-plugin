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

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace InsightDashboard.Pn.Services.InterviewsExcelService;

using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Security.Claims;
using Infrastructure.Consts;
using Infrastructure.Enum.Excel;
using Infrastructure.Models.Export;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

public class InterviewsExcelService(
    ILogger<InterviewsExcelService> logger,
    IHttpContextAccessor httpAccessor)
    : IInterviewsExcelService
{
    public bool WriteInterviewsExportToExcelFile(List<InterviewsExportModel> excelModel, string destFile)
    {
        // Create a new Spreadsheet document
        using SpreadsheetDocument spreadsheetDocument =
            SpreadsheetDocument.Create(destFile, SpreadsheetDocumentType.Workbook);
        // Create the workbook part
        WorkbookPart workbookPart = spreadsheetDocument.AddWorkbookPart();
        workbookPart.Workbook = new Workbook();

        // Create a worksheet part
        WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
        worksheetPart.Worksheet = new Worksheet(new SheetData());

        // Add Sheets to the workbook
        Sheets sheets = spreadsheetDocument.WorkbookPart!.Workbook.AppendChild(new Sheets());

        // Append a new sheet and associate it with the workbook
        Sheet sheet = new Sheet()
        {
            Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart),
            SheetId = 1,
            Name = "Interviews"
        };
        sheets.Append(sheet);

        // Get the sheet data to populate
        SheetData sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

        // Get the column count and start from the specified row
        int colCount = ExcelConsts.Interviews.ColCount; // Assuming `ColCount` is defined
        int rowIndex = ExcelConsts.Interviews.StartRow;

        // Iterate through each excelModel row
        foreach (var excelRow in excelModel)
        {
            Row row = new Row() { RowIndex = (uint)rowIndex };

            for (var col = ExcelConsts.Interviews.StartCol; col <= colCount; col++)
            {
                var columnIndex = (InterviewsExport)col;

                if (columnIndex > 0)
                {
                    var columnName = columnIndex.ToString();
                    if (!string.IsNullOrEmpty(columnName))
                    {
                        var value = excelRow?.GetType().GetProperty(columnName)?.GetValue(excelRow, null);

                        if (value != null)
                        {
                            Cell cell = new Cell() { CellReference = GetCellReference(rowIndex, col) };

                            if (value is DateTime dateTime)
                            {
                                cell.DataType = CellValues.String;
                                cell.CellValue = new CellValue(dateTime.ToString(CultureInfo.InvariantCulture));
                            }
                            else if (value is decimal decimalValue)
                            {
                                cell.DataType = CellValues.Number;
                                cell.CellValue =
                                    new CellValue(decimalValue.ToString("0.00", CultureInfo.InvariantCulture));
                            }
                            else
                            {
                                cell.DataType = CellValues.String;
                                cell.CellValue = new CellValue(value.ToString());
                            }

                            row.Append(cell);
                        }
                    }
                }
            }

            sheetData!.Append(row);
            rowIndex++;
        }

        // Save the workbook
        workbookPart.Workbook.Save();

        return true;
    }

    // Helper method to get cell reference like "A1", "B2", etc.
    private string GetCellReference(int rowIndex, int colIndex)
    {
        return $"{GetColumnName(colIndex)}{rowIndex}";
    }

    // Helper method to convert a column index (1-based) to an Excel column name (e.g. 1 -> A, 27 -> AA)
    private string GetColumnName(int index)
    {
        int dividend = index;
        string columnName = String.Empty;
        while (dividend > 0)
        {
            int modulo = (dividend - 1) % 26;
            columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
            dividend = (dividend - modulo) / 26;
        }

        return columnName;
    }

    #region Working with file system

    private int UserId
    {
        get
        {
            string value = httpAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return value == null ? 0 : int.Parse(value);
        }
    }

    private static string GetExcelStoragePath()
    {
        string path = Path.Combine(PathHelper.GetStoragePath(), "excel-storage");
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        return path;
    }

    /// <summary>
    /// Will return filename for excel file
    /// </summary>
    /// <returns></returns>
    private static string BuildFileNameForExcelFile(int userId, string templateId)
    {
        return $"{templateId}-{userId}-{DateTime.UtcNow.Ticks}.xlsx";
    }

    /// <summary>
    /// Get path and filename for particular user
    /// </summary>
    /// <returns></returns>
    private static string GetFilePathForUser(int userId, string templateId)
    {
        string filesDir = GetExcelStoragePath();
        string destFile = Path.Combine(filesDir, BuildFileNameForExcelFile(userId, templateId));
        return destFile;
    }

    /// <summary>
    /// Copy template file to new excel file
    /// </summary>
    /// <param name="templateId">The template identifier.</param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException">userId</exception>
    public string CopyTemplateForNewAccount(string templateId)
    {
        string destFile = null;
        try
        {
            var userId = UserId;
            if (userId <= 0)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var assembly = typeof(EformInsightDashboardPlugin).GetTypeInfo().Assembly;
            var resourceStream = assembly.GetManifestResourceStream(
                $"InsightDashboard.Pn.Resources.Templates.{templateId}.xlsx");

            destFile = GetFilePathForUser(userId, templateId);
            if (File.Exists(destFile))
            {
                File.Delete(destFile);
            }

            using var fileStream = File.Create(destFile!);
            resourceStream?.Seek(0, SeekOrigin.Begin);
            resourceStream?.CopyTo(fileStream);

            return destFile;
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            if (File.Exists(destFile))
            {
                File.Delete(destFile);
            }

            return null;
        }
    }

    #endregion
}