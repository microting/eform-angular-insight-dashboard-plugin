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
using Infrastructure.Models.RawData;

/// <summary>
/// Writes rows to a sheet as they arrive, so the caller never has to hold the
/// whole export in memory.
/// </summary>
public interface IRawDataExcelWriter : IDisposable
{
    void WriteRow(Dictionary<string, object> row);

    /// <summary>Closes the sheet and finalises the workbook. Must be called on success.</summary>
    void Complete();
}

public interface IRawDataExcelService
{
    string CreateFilePath();

    /// <summary>
    /// Opens a workbook and writes the header row. The caller streams data rows
    /// into the returned writer and calls Complete when done.
    /// </summary>
    IRawDataExcelWriter CreateWriter(string destFile, IReadOnlyList<RawDataColumnModel> columns);
}
