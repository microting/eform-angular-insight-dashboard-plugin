namespace InsightDashboard.Pn.Infrastructure.Models.Dashboards
{
    public class DashboardsRequestModel
    {
        public string SearchString { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
        public string Sort { get; set; }
        public bool IsSortDsc { get; set; }
    }
}
