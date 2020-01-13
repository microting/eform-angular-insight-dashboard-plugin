namespace InsightDashboard.Pn.Controllers
{
    using System.Threading.Tasks;
    using Abstractions;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.InsightDashboardBase.Infrastructure.Models;

    public class InsightDashboardSettingsController : Controller
    {
        private readonly IInsightDashboardPnSettingsService _insightDashboardPnSettingsService;

        public InsightDashboardSettingsController(IInsightDashboardPnSettingsService insightDashboardPnSettingsService)
        {
            _insightDashboardPnSettingsService = insightDashboardPnSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/insight-dashboard-pn/settings")]
        public async Task<OperationDataResult<InsightDashboardBaseSettings>> GetSettings()
        {
            return await _insightDashboardPnSettingsService.GetSettings();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/insight-dashboard-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] InsightDashboardBaseSettings baseSettings)
        {
            return await _insightDashboardPnSettingsService.UpdateSettings(baseSettings);
        }

        
    }
}