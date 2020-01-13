import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {SurveyConfigsListModel} from '../models';
import {SurveyConfigsRequestModel} from '../models/survey-configs-request.model';

export let SurveyConfigsMethods = {
  Get: 'api/insight-dashboard-pn/survey-configs',
  Create: 'api/insight-dashboard-pn/survey-configs/create',
  Update: 'api/insight-dashboard-pn/survey-configs/update',
  Activate: 'api/insight-dashboard-pn/survey-configs/activate',
  Deactivate: 'api/insight-dashboard-pn/survey-configs/deactivate'
};
@Injectable()
export class InsightDashboardPnSurveyConfigs extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAll(model: SurveyConfigsRequestModel): Observable<OperationDataResult<SurveyConfigsListModel>> {
    return this.post(SurveyConfigsMethods.Get, model);
  }

  getSingle(id: number): Observable<OperationDataResult<SurveyConfigsListModel>> {
    return this.get(SurveyConfigsMethods.Get + '/' + id);
  }

  activate(id: number): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Activate + '/' + id, {});
  }

  deactivate(id: number): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Deactivate + '/' , {});
  }

  create(model: any): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Create, model);
  }

  update(model: any): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Create, model);
  }
}
