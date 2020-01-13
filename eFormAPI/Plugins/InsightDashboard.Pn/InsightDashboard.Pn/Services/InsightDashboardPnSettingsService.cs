namespace InsightDashboard.Pn.Services
{
    using System;
    using System.Diagnostics;
    using System.Security.Claims;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Abstractions;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.InsightDashboardBase.Infrastructure.Data;
    using Microting.InsightDashboardBase.Infrastructure.Models;

    public class InsightDashboardPnSettingsService : IInsightDashboardPnSettingsService
    {
        private readonly ILogger<InsightDashboardPnSettingsService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly InsightDashboardPnDbContext _dbContext;
        private readonly IPluginDbOptions<InsightDashboardBaseSettings> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public InsightDashboardPnSettingsService(ILogger<InsightDashboardPnSettingsService> logger,
            IInsightDashboardLocalizationService localizationService,
            InsightDashboardPnDbContext dbContext,
            IPluginDbOptions<InsightDashboardBaseSettings> options,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
            _localizationService = localizationService;
        }
        
        public async Task<OperationDataResult<InsightDashboardBaseSettings>> GetSettings()
        {
            try
            {
                var option = _options.Value;

                if (option?.SdkConnectionString == "...")
                {
                    var connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                    var dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    var dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    var sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    await _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, UserId);
                }

                return new OperationDataResult<InsightDashboardBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<InsightDashboardBaseSettings>(false,
                    _localizationService.GetString("ErrorWhileObtainingDashboardSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(InsightDashboardBaseSettings baseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.SdkConnectionString = baseSettings.SdkConnectionString;
                }, _dbContext, UserId);

                return new OperationResult(true,
                    _localizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }
        
        public int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}