namespace InsightDashboard.Pn.Controllers
{
    using System.Threading.Tasks;
    using Infrastructure.Models.Dashboards;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.DashboardService;

    [Authorize]
    public class DashboardsController : Controller
    {
        private readonly IDashboardService _dashboardService;

        public DashboardsController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/dashboards")]
        public async Task<OperationDataResult<DashboardsListModel>> GetAll([FromBody] DashboardsRequestModel requestModel)
        {
            return await _dashboardService.GetAll(requestModel);
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dashboards/view/{id}")]
        public async Task<OperationDataResult<DashboardViewModel>> GetSingleForView(int id)
        {
            return await _dashboardService.GetSingleForView(id);
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dashboards/edit/{id}")]
        public async Task<OperationDataResult<DashboardEditModel>> GetSingleForEdit(int id)
        {
            return await _dashboardService.GetSingleForEdit(id);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/dashboards/create")]
        public async Task<OperationDataResult<int>> Create([FromBody] DashboardCreateModel requestModel)
        {
            return await _dashboardService.Create(requestModel);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/dashboards/copy/{id}")]
        public async Task<OperationResult> Copy(int id)
        {
            return await _dashboardService.Copy(id);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/dashboards/update")]
        public async Task<OperationResult> Update([FromBody] DashboardEditModel editModel)
        {
            return await _dashboardService.Update(editModel);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/dashboards/delete/{id}")]
        public async Task<OperationResult> Remove(int id)
        {
            return await _dashboardService.Remove(id);
        }
    }
}
