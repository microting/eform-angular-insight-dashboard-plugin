import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {InstallationsAssignModel, InstallationsListModel, InstallationsRequestModel} from '../models';
import {CustomersPnModel, CustomersPnRequestModel} from '../../customers-pn/models/customer';
import {CustomerPnMethods} from '../../customers-pn/services';

export let InstallationsMethods = {
  Get: 'api/insight-dashboard-pn/installations',
  Create: 'api/insight-dashboard-pn/installations/create',
  Assign: 'api/insight-dashboard-pn/installations/assign',
  Retract: 'api/insight-dashboard-pn/installations/retract',
  Archive: 'api/insight-dashboard-pn/installations/archive',
  Excel: 'api/insight-dashboard-pn/installations/excel',
};
@Injectable()
export class InsightDashboardService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllCustomers(model: CustomersPnRequestModel): Observable<OperationDataResult<CustomersPnModel>> {
    return this.post(CustomerPnMethods.CustomerPn + '/get-all', model);
  }

  getList(request: InstallationsRequestModel): Observable<OperationDataResult<InstallationsListModel>> {
    return this.get(InstallationsMethods.Get, request);
  }

  getSingle(id: number): Observable<OperationDataResult<InstallationsListModel>> {
    return this.get(InstallationsMethods.Get + '/' + id);
  }

  create(customerId: number): Observable<OperationResult> {
    return this.post(InstallationsMethods.Create, customerId);
  }

  assign(model: InstallationsAssignModel): Observable<OperationResult> {
    return this.post(InstallationsMethods.Assign, model);
  }

  retract(id: number): Observable<OperationResult> {
    return this.post(InstallationsMethods.Retract, id);
  }

  archive(id: number): Observable<OperationResult> {
    return this.post(InstallationsMethods.Archive, id);
  }

  excel(id: number): Observable<any> {
    return this.getBlobData(InstallationsMethods.Excel + '/' + id);
  }
}
