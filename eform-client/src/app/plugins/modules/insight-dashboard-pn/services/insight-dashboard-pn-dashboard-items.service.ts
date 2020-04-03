import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {DashboardItemExportRequestModel} from '../models';

const DashboardItemMethods = {
  ExportInterviews: 'api/insight-dashboard-pn/dashboard-items/export-interviews',
};
@Injectable()
export class InsightDashboardPnDashboardItemsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  exportInterviewsToExcel(model: DashboardItemExportRequestModel): Observable<any> {
    return this.getBlobData(DashboardItemMethods.ExportInterviews, model);
  }
}
