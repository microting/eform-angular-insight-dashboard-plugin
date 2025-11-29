import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from '../../../../common/models';
import {
  SurveyConfigCreateModel,
  SurveyConfigsListModel,
  SurveyConfigUpdateModel,
  SurveyConfigUpdateStatusModel,
  SurveyConfigsRequestModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let SurveyConfigsMethods = {
  Get: 'api/insight-dashboard-pn/survey-configs',
  GetSurveys: 'api/insight-dashboard-pn/survey-configs/surveys',
  Create: 'api/insight-dashboard-pn/survey-configs/create',
  Update: 'api/insight-dashboard-pn/survey-configs/update',
  Status: 'api/insight-dashboard-pn/survey-configs/status',
  Delete: 'api/insight-dashboard-pn/survey-configs/delete',
};
@Injectable({providedIn: 'root'})
export class InsightDashboardPnSurveyConfigsService {
  private apiBaseService = inject(ApiBaseService);

  getAll(
    model: SurveyConfigsRequestModel
  ): Observable<OperationDataResult<SurveyConfigsListModel>> {
    return this.apiBaseService.post(SurveyConfigsMethods.Get, model);
  }

  changeStatus(
    model: SurveyConfigUpdateStatusModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(SurveyConfigsMethods.Status, model);
  }

  create(model: SurveyConfigCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(SurveyConfigsMethods.Create, model);
  }

  update(model: SurveyConfigUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.post(SurveyConfigsMethods.Update, model);
  }

  remove(id: number): Observable<OperationResult> {
    return this.apiBaseService.post(
      SurveyConfigsMethods.Delete + '?id=' + id,
      {}
    );
  }
}
