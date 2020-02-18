namespace InsightDashboard.Pn.Infrastructure.Models.Dashboards
{
    using System.Collections.Generic;

    public class DashboardViewChartDataMultiStackedModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<DashboardViewChartDataMultiModel> Series { get; set; }
            = new List<DashboardViewChartDataMultiModel>();
    }
}