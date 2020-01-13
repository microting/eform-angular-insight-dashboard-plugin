namespace InsightDashboard.Pn.Services
{
    using Abstractions;
    using Microsoft.Extensions.Localization;
    using Microting.eFormApi.BasePn.Localization.Abstractions;
    using Pn;

    public class InsightDashboardLocalizationService : IInsightDashboardLocalizationService
    {
        private readonly IStringLocalizer _localizer;
        
        // ReSharper disable once SuggestBaseTypeForParameter
        public InsightDashboardLocalizationService(IEformLocalizerFactory factory)
        {
            _localizer = factory.Create(typeof(EformInsightDashboardPlugin));
        }
        
        public string GetString(string key)
        {
            var str = _localizer[key];
            return str.Value;
        }

        public string GetString(string format, params object[] args)
        {
            var message = _localizer[format];

            return message?.Value == null ? null : string.Format(message.Value, args);
        }
    }
}