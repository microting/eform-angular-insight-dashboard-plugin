namespace InsightDashboard.Pn.Infrastructure.Models.Dashboards
{
    using System.Collections.Generic;

    public class DashboardViewChartDataMultiStackedModel
    {
        public string Name { get; set; }

        public List<DashboardViewChartDataMultiModel> Series { get; set; }
            = new List<DashboardViewChartDataMultiModel>();
    }
}