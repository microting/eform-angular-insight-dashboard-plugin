namespace InsightDashboard.Pn.Abstractions
{
    public interface IInsightDashboardLocalizationService
    {
        string GetString(string key);
        string GetString(string format, params object[] args);
    }
}