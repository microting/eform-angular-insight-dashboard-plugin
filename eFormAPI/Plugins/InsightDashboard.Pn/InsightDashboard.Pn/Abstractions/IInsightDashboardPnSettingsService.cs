namespace InsightDashboard.Pn.Abstractions
{
    using System.Threading.Tasks;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.InsightDashboardBase.Infrastructure.Models;

    public interface IInsightDashboardPnSettingsService
    {
        Task<OperationDataResult<InsightDashboardBaseSettings>> GetSettings();
        Task<OperationResult> UpdateSettings(InsightDashboardBaseSettings baseSettings);
    }
}