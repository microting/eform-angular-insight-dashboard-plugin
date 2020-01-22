namespace InsightDashboard.Pn.Services.DictionaryService
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public interface IDictionaryService
    {
        Task<OperationDataResult<List<CommonDictionaryModel>>> GetSurveys();
        Task<OperationDataResult<List<CommonDictionaryModel>>> GetFirstQuestions(int surveyId);
        Task<OperationDataResult<List<CommonDictionaryModel>>> GetLocationsBySurveyId(int surveyId);
    }
}