import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {CommonDictionaryModel, OperationDataResult} from '../../../../common/models';

export let LocationMethods = {
  Get: 'api/insight-dashboard-pn/locations'
};

@Injectable()
export class InsightDashboardPnLocationsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAll(surveyId?: number): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(LocationMethods.Get, {surveyId: surveyId});
  }
}
