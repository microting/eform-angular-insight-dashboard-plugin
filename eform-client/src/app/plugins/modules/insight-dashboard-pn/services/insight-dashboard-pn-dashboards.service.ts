import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from '../../../../common/models';
import {
  DashboardCreateModel,
  DashboardsListModel,
  DashboardViewModel,
  DashboardViewExportDocModel,
  DashboardEditModel,
  DashboardsRequestModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let DashboardMethods = {
  Get: 'api/insight-dashboard-pn/dashboards',
  GetForEdit: 'api/insight-dashboard-pn/dashboards/edit',
  GetForView: 'api/insight-dashboard-pn/dashboards/view',
  Create: 'api/insight-dashboard-pn/dashboards/create',
  Update: 'api/insight-dashboard-pn/dashboards/update',
  Copy: 'api/insight-dashboard-pn/dashboards/copy',
  Delete: 'api/insight-dashboard-pn/dashboards/delete',
  ExportDoc: 'api/insight-dashboard-pn/dashboards/export-doc',
};
@Injectable()
export class InsightDashboardPnDashboardsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAll(
    model: DashboardsRequestModel
  ): Observable<OperationDataResult<DashboardsListModel>> {
    return this.apiBaseService.post(DashboardMethods.Get, model);
  }

  getSingleForView(
    id: number
  ): Observable<OperationDataResult<DashboardViewModel>> {
    return this.apiBaseService.get(DashboardMethods.GetForView + '/' + id);
  }

  getSingleForEdit(
    id: number
  ): Observable<OperationDataResult<DashboardEditModel>> {
    return this.apiBaseService.get(DashboardMethods.GetForEdit + '/' + id);
  }

  create(model: DashboardCreateModel): Observable<OperationDataResult<number>> {
    return this.apiBaseService.post(DashboardMethods.Create, model);
  }

  copy(dashboardId: number): Observable<OperationResult> {
    return this.apiBaseService.post(
      DashboardMethods.Copy + '/' + dashboardId,
      {}
    );
  }

  update(model: DashboardEditModel): Observable<OperationResult> {
    return this.apiBaseService.post(DashboardMethods.Update, model);
  }

  remove(dashboardId: number): Observable<OperationResult> {
    return this.apiBaseService.post(
      DashboardMethods.Delete + '/' + dashboardId,
      {}
    );
  }

  exportToDoc(model: DashboardViewExportDocModel): Observable<any> {
    return this.apiBaseService.uploadFiles(
      DashboardMethods.ExportDoc + '/' + model.dashboardId,
      model.files,
      {},
      'blob'
    );
  }
}
