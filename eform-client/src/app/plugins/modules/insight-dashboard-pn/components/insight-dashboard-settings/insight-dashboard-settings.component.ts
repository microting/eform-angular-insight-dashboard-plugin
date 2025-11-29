import { Component, inject, OnInit } from '@angular/core';
import { InsightDashboardPnSettingsService } from '../../services';
import { InsightDashboardBaseSettingsModel } from '../../models';

@Component({
  selector: 'app-insight-dashboard-settings',
  templateUrl: './insight-dashboard-settings.component.html',
  styleUrls: ['./insight-dashboard-settings.component.scss'],
})
export class InsightDashboardSettingsComponent implements OnInit {
  private insightDashboardPnSettingsService = inject(InsightDashboardPnSettingsService);

  settingsModel: InsightDashboardBaseSettingsModel = new InsightDashboardBaseSettingsModel();

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    this.insightDashboardPnSettingsService
      .getAllSettings()
      .subscribe((data) => {
        if (data && data.success) {
          this.settingsModel = data.model;
        }
      });
  }

  updateSettings() {
    this.insightDashboardPnSettingsService
      .updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {
        }
      });
  }
}
