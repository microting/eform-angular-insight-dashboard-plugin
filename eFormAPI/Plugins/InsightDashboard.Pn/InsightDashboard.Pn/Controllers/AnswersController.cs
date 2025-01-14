﻿/*
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

using System.Threading.Tasks;
using Infrastructure.Models.Answers;
using Services.AnswersService;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class AnswersController : Controller
{
    private readonly IAnswersService _answersService;

    public AnswersController(IAnswersService dashboardService)
    {
        _answersService = dashboardService;
    }
    [HttpGet]
    [Route("api/insight-dashboard-pn/answers/{microtingUid}")]
    public async Task<OperationDataResult<AnswerViewModel>> GetAnswersByMicrotingUid(int microtingUid)
    {
        return await _answersService.GetAnswerByMicrotingUid(microtingUid);
    }

    [HttpDelete]
    [Route("api/insight-dashboard-pn/answers/{microtingUid}")]
    public async Task<OperationResult> DeleteAnswersByMicrotingUid(int microtingUid)
    {
        return await _answersService.DeleteAnswerByMicrotingUid(microtingUid);
    }
}