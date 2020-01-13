namespace InsightDashboard.Pn.Infrastructure.Data.Seed.Data
{
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

    public class InsightDashboardConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "InsightDashboardBaseSettings:MaxNumberOfWorkers",
                Value = "4"
            },
            new PluginConfigurationValue()
            {
                Name = "InsightDashboardBaseSettings:MaxParallelism",
                Value = "25000"
            },
            new PluginConfigurationValue()
            {
                Name = "InsightDashboardBaseSettings:SdkConnectionString",
                Value = "..."
            }
        };
    }
}