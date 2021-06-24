import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from '../../../../common/models';
import { InsightDashboardBaseSettingsModel } from '../models';
import { ApiBaseService } from 'src/app/common/services';

export const InsightDashboardSettingsMethods = {
  Settings: 'api/insight-dashboard-pn/settings',
};

@Injectable()
export class InsightDashboardPnSettingsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllSettings(): Observable<OperationDataResult<any>> {
    return this.apiBaseService.get(InsightDashboardSettingsMethods.Settings);
  }

  updateSettings(
    model: InsightDashboardBaseSettingsModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      InsightDashboardSettingsMethods.Settings,
      model
    );
  }
}
