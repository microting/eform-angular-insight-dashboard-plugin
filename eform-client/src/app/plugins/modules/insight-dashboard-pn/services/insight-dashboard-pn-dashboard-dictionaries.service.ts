import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
} from '../../../../common/models';
import {
  DashboardItemAnswerRequestModel,
  DashboardItemQuestionModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

const DictionariesMethods = {
  GetSurveys: 'api/insight-dashboard-pn/dictionary/surveys',
  GetLocationsBySurvey:
    'api/insight-dashboard-pn/dictionary/locations-by-survey',
  GetQuestions: 'api/insight-dashboard-pn/dictionary/questions',
  GetFilterAnswers: 'api/insight-dashboard-pn/dictionary/filter-answers',
  GetTags: 'api/insight-dashboard-pn/dictionary/locations-tags',
};

@Injectable()
export class InsightDashboardPnDashboardDictionariesService {
  constructor(private apiBaseService: ApiBaseService) {}

  getQuestions(
    surveyId: number
  ): Observable<OperationDataResult<Array<DashboardItemQuestionModel>>> {
    return this.apiBaseService.get(
      DictionariesMethods.GetQuestions + '/' + surveyId
    );
  }

  getFilterAnswers(
    model: DashboardItemAnswerRequestModel
  ): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(DictionariesMethods.GetFilterAnswers, model);
  }

  getSurveys(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(DictionariesMethods.GetSurveys);
  }

  getTags(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(DictionariesMethods.GetTags);
  }

  getLocationBySurveyId(
    surveyId?: number
  ): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(
      DictionariesMethods.GetLocationsBySurvey + '/' + surveyId
    );
  }
}
