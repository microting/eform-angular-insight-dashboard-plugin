namespace InsightDashboard.Pn.Infrastructure.Models.Dashboards
{
    using System;

    public class DashboardEditAnswerDates
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public bool Today { get; set; }
    }
}