import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {DashboardsListModel, SurveyConfigsListModel} from '../models';
import {DashboardsRequestModel} from '../models/dashboard/dashboards-request.model';
import {DashboardUpdateModel} from '../models/dashboard/dashboard-update.model';

export let DashboardMethods = {
  Get: 'api/insight-dashboard-pn/dashboard',
  Create: 'api/insight-dashboard-pn/dashboard/create',
  Update: 'api/insight-dashboard-pn/dashboard/update'
};
@Injectable()
export class InsightDashboardPnDashboards extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAll(model: DashboardsRequestModel): Observable<OperationDataResult<DashboardsListModel>> {
    return this.post(DashboardMethods.Get, model);
  }

  getSingle(id: number): Observable<OperationDataResult<DashboardsListModel>> {
    return this.get(DashboardMethods.Get + '/' + id);
  }

  create(model: DashboardUpdateModel): Observable<OperationResult> {
    return this.post(DashboardMethods.Create, model);
  }

  update(model: DashboardUpdateModel): Observable<OperationResult> {
    return this.post(DashboardMethods.Update, model);
  }
}
