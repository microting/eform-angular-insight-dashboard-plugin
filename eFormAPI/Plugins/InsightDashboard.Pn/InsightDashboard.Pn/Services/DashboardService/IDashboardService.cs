namespace InsightDashboard.Pn.Services.DashboardService
{
    using System.Threading.Tasks;
    using Infrastructure.Models.Dashboards;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface IDashboardService
    {
        Task<OperationDataResult<DashboardsListModel>> GetAll(DashboardsRequestModel requestModel);
        Task<OperationResult> Create(DashboardCreateModel createModel);
        Task<OperationResult> Copy(int dashboardId);
        Task<OperationResult> Update(DashboardEditModel editModel);
        Task<OperationResult> Remove(int dashboardId);
        Task<OperationDataResult<DashboardViewModel>> GetSingleForView(int dashboardId);
        Task<OperationDataResult<DashboardEditModel>> GetSingleForEdit(int dashboardId);
    }
}