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
using System.IO;
using System.Security.Claims;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Infrastructure.Models.RawData;
using Microsoft.AspNetCore.Http;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

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

    public IRawDataExcelWriter CreateWriter(string destFile, IReadOnlyList<RawDataColumnModel> columns) =>
        new RawDataExcelWriter(destFile, columns);

    private int UserId
    {
        get
        {
            var value = httpAccessor?.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return value == null ? 0 : int.Parse(value);
        }
    }

    /// <summary>
    /// Streams rows with OpenXmlWriter rather than building a SheetData DOM. The
    /// DOM approach held every cell of the export in memory at once; this holds one
    /// row, so the size of an export is no longer a memory question.
    /// </summary>
    private sealed class RawDataExcelWriter : IRawDataExcelWriter
    {
        private const string SheetName = "Raw data";

        private readonly IReadOnlyList<RawDataColumnModel> _columns;
        private readonly SpreadsheetDocument _document;
        private readonly WorkbookPart _workbookPart;
        private readonly WorksheetPart _worksheetPart;
        private readonly OpenXmlWriter _writer;

        private uint _rowIndex = 1;
        private bool _completed;
        private bool _disposed;

        public RawDataExcelWriter(string destFile, IReadOnlyList<RawDataColumnModel> columns)
        {
            _columns = columns;
            _document = SpreadsheetDocument.Create(destFile, SpreadsheetDocumentType.Workbook);
            _workbookPart = _document.AddWorkbookPart();
            _worksheetPart = _workbookPart.AddNewPart<WorksheetPart>();

            _writer = OpenXmlWriter.Create(_worksheetPart);
            _writer.WriteStartElement(new Worksheet());
            _writer.WriteStartElement(new SheetData());

            WriteHeader();
        }

        private void WriteHeader()
        {
            _writer.WriteStartElement(new Row { RowIndex = _rowIndex });

            for (var col = 0; col < _columns.Count; col++)
            {
                WriteCell(
                    GetCellReference(_rowIndex, col + 1),
                    CellValues.String,
                    Sanitise(_columns[col].Header) ?? string.Empty);
            }

            _writer.WriteEndElement();
            _rowIndex++;
        }

        public void WriteRow(Dictionary<string, object> row)
        {
            _writer.WriteStartElement(new Row { RowIndex = _rowIndex });

            for (var col = 0; col < _columns.Count; col++)
            {
                if (!row.TryGetValue(_columns[col].Field, out var value) || value == null)
                {
                    continue;
                }

                var reference = GetCellReference(_rowIndex, col + 1);

                switch (value)
                {
                    case DateTime dateTime:
                        WriteCell(reference, CellValues.String,
                            dateTime.ToString("yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture));
                        break;
                    case int intValue:
                        WriteCell(reference, CellValues.Number,
                            intValue.ToString(System.Globalization.CultureInfo.InvariantCulture));
                        break;
                    case bool boolValue:
                        WriteCell(reference, CellValues.String, boolValue ? "true" : "false");
                        break;
                    default:
                        WriteCell(reference, CellValues.String, Sanitise(value.ToString()) ?? string.Empty);
                        break;
                }
            }

            _writer.WriteEndElement();
            _rowIndex++;
        }

        private void WriteCell(string reference, CellValues type, string value)
        {
            _writer.WriteStartElement(new Cell { CellReference = reference, DataType = type });
            _writer.WriteElement(new CellValue(value));
            _writer.WriteEndElement();
        }

        /// <summary>
        /// Strips characters XML 1.0 forbids: C0 controls except tab, newline and
        /// carriage return, plus the 0xFFFE/0xFFFF non-characters. 0x7F and the C1
        /// range are legal in XML 1.0 and are kept deliberately.
        ///
        /// Well-formed surrogate pairs pass through intact. A lone surrogate would
        /// not, but MySQL's utf8mb4 validation means one cannot be stored in the
        /// first place.
        /// </summary>
        private static string Sanitise(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return value;
            }

            Span<char> buffer = value.Length <= 256 ? stackalloc char[value.Length] : new char[value.Length];
            var length = 0;

            foreach (var c in value)
            {
                if (c == '\t' || c == '\n' || c == '\r' || (c >= 0x20 && c != 0xFFFE && c != 0xFFFF))
                {
                    buffer[length++] = c;
                }
            }

            return length == value.Length ? value : new string(buffer[..length]);
        }

        public void Complete()
        {
            if (_completed)
            {
                return;
            }

            _writer.WriteEndElement(); // SheetData
            _writer.WriteEndElement(); // Worksheet
            _writer.Close();

            _workbookPart.Workbook = new Workbook();
            var sheets = _workbookPart.Workbook.AppendChild(new Sheets());
            sheets.Append(new Sheet
            {
                Id = _workbookPart.GetIdOfPart(_worksheetPart),
                SheetId = 1,
                Name = SheetName,
            });

            _workbookPart.Workbook.Save();
            _completed = true;
        }

        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            _disposed = true;

            // On the failure path Complete was never called, so close the writer
            // without finalising; the caller deletes the partial file.
            if (!_completed)
            {
                try
                {
                    _writer.Close();
                }
                catch
                {
                    // The writer may already be faulted; the file is discarded anyway.
                }
            }

            try
            {
                _document.Dispose();
            }
            catch
            {
                // Never let a close failure replace the exception being unwound;
                // the caller deletes the file either way.
            }
        }

        private static string GetCellReference(uint rowIndex, int colIndex) =>
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
}
