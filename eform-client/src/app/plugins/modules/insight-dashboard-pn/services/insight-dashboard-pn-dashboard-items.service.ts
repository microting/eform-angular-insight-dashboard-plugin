import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DashboardItemExportRequestModel,
  DashboardItemPreviewRequestModel,
  DashboardViewItemModel,
} from '../models';
import { OperationDataResult } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const DashboardItemMethods = {
  ExportInterviews:
    'api/insight-dashboard-pn/dashboard-items/export-interviews',
  Preview: 'api/insight-dashboard-pn/dashboard-items/preview',
};
@Injectable()
export class InsightDashboardPnDashboardItemsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getItemPreview(
    model: DashboardItemPreviewRequestModel
  ): Observable<OperationDataResult<DashboardViewItemModel>> {
    return this.apiBaseService.post(DashboardItemMethods.Preview, model);
  }

  exportInterviewsToExcel(
    model: DashboardItemExportRequestModel
  ): Observable<any> {
    return this.apiBaseService.getBlobData(
      DashboardItemMethods.ExportInterviews,
      model
    );
  }
}
