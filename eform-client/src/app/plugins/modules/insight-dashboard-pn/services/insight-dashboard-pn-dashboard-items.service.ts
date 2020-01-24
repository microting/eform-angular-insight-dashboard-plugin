import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {CommonDictionaryModel, OperationDataResult} from '../../../../common/models';
import {DashboardItemAnswerRequestModel} from '../models';

const LocationMethods = {
  GetQuestions: 'api/insight-dashboard-pn/dashboard-items/questions',
  GetFilterAnswers: 'api/insight-dashboard-pn/dashboard-items/filter-answers'
};

@Injectable()
export class InsightDashboardPnDashboardItemsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getQuestions(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(LocationMethods.GetQuestions);
  }

  getFilterAnswers(model: DashboardItemAnswerRequestModel): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(LocationMethods.GetFilterAnswers, model);
  }
}
