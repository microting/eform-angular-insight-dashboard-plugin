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

namespace InsightDashboard.Pn.Controllers;

using System.IO;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Models.RawData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Services.RawDataService;

[Authorize]
public class RawDataController : Controller
{
    private readonly IRawDataService _rawDataService;

    public RawDataController(IRawDataService rawDataService)
    {
        _rawDataService = rawDataService;
    }

    [HttpPost]
    [Route("api/insight-dashboard-pn/dashboard-items/raw-data")]
    public async Task<OperationDataResult<RawDataListModel>> GetRawData(
        [FromBody] RawDataRequestModel requestModel)
    {
        return await _rawDataService.GetRawData(requestModel);
    }

    /// <summary>
    /// Download the full, unpaged raw data set as xlsx.
    /// </summary>
    /// <returns code="200">Return excel blob</returns>
    /// <returns code="400">Error message</returns>
    [HttpGet]
    [Route("api/insight-dashboard-pn/dashboard-items/raw-data/export")]
    [ProducesResponseType(typeof(string), 400)]
    public async Task ExportRawData([FromQuery] RawDataExportRequestModel requestModel)
    {
        // The service writes the file in batches; we only stream and clean up.
        var exportResult = await _rawDataService.ExportToFile(
            requestModel.DashboardId, requestModel.DashboardItemId);

        var filePath = exportResult.Success ? exportResult.Model : null;

        const int bufferSize = 4086;
        var buffer = new byte[bufferSize];

        Response.OnStarting(async () =>
        {
            try
            {
                if (!exportResult.Success)
                {
                    var bytes = Encoding.UTF8.GetBytes(exportResult.Message);
                    Response.ContentLength = bytes.Length;
                    Response.ContentType = "text/plain";
                    Response.StatusCode = 400;
                    await Response.Body.WriteAsync(bytes, 0, bytes.Length);
                    await Response.Body.FlushAsync();
                }
                else
                {
                    await using var excelStream = new FileStream(filePath, FileMode.Open);
                    int bytesRead;
                    Response.ContentLength = excelStream.Length;
                    Response.ContentType =
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    while ((bytesRead = excelStream.Read(buffer, 0, buffer.Length)) > 0 &&
                           !HttpContext.RequestAborted.IsCancellationRequested)
                    {
                        await Response.Body.WriteAsync(buffer, 0, bytesRead);
                        await Response.Body.FlushAsync();
                    }
                }
            }
            finally
            {
                if (!string.IsNullOrEmpty(filePath) && System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
        });
    }
}
