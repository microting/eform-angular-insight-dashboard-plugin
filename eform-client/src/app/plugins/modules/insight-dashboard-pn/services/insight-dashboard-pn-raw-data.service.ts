import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  RawDataExportRequestModel,
  RawDataListModel,
  RawDataRequestModel,
} from '../models';
import {OperationDataResult} from 'src/app/common/models';
import {ApiBaseService} from 'src/app/common/services';

const RawDataMethods = {
  RawData: 'api/insight-dashboard-pn/dashboard-items/raw-data',
  Export: 'api/insight-dashboard-pn/dashboard-items/raw-data/export',
};

@Injectable()
export class InsightDashboardPnRawDataService {
  private apiBaseService = inject(ApiBaseService);

  getRawData(
    model: RawDataRequestModel
  ): Observable<OperationDataResult<RawDataListModel>> {
    return this.apiBaseService.post(RawDataMethods.RawData, model);
  }

  exportToExcel(model: RawDataExportRequestModel): Observable<any> {
    return this.apiBaseService.getBlobData(RawDataMethods.Export, model);
  }
}
