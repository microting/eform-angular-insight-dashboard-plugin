import { Component, inject, OnInit } from '@angular/core';
import { InsightDashboardPnSettingsService } from '../../services';
import { InsightDashboardBaseSettingsModel } from '../../models';

import {TranslatePipe} from '@ngx-translate/core';
import {EformNewSubheaderComponent} from 'src/app/common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-insight-dashboard-settings',
  templateUrl: './insight-dashboard-settings.component.html',
  styleUrls: ['./insight-dashboard-settings.component.scss'],
  imports: [TranslatePipe, EformNewSubheaderComponent, FormsModule, MatButton, MatCard, MatCardContent, MatCardTitle, MatFormField, MatLabel, MatInput],
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
