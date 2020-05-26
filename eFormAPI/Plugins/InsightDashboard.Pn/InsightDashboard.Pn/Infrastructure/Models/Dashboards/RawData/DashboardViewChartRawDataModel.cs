namespace InsightDashboard.Pn.Infrastructure.Models.Dashboards.RawData
{
    using System.Collections.Generic;

    public class DashboardViewChartRawDataModel
    {
        public List<string> RawHeaders { get; set; } // Table headers
            = new List<string>();

        public List<DashboardViewChartRawDataItemModel> RawDataItems { get; set; }
            = new List<DashboardViewChartRawDataItemModel>();
    }
}