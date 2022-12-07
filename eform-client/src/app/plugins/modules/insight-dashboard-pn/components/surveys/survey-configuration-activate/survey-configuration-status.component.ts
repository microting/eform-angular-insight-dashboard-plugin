import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import { InsightDashboardPnSurveyConfigsService } from '../../../services';
import { SurveyConfigModel } from '../../../models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-survey-configuration-status',
  templateUrl: './survey-configuration-status.component.html',
  styleUrls: ['./survey-configuration-status.component.scss'],
})
export class SurveyConfigurationStatusComponent implements OnInit {
  configStatusChanged: EventEmitter<SurveyConfigModel> = new EventEmitter<SurveyConfigModel>();

  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService,
    public dialogRef: MatDialogRef<SurveyConfigurationStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel(),
  ) {
  }

  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }

  changeSurveyConfigStatus() {
    this.surveyConfigsService
      .changeStatus({
        id: this.selectedSurveyConfig.id,
        isActive: !this.selectedSurveyConfig.isActive,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
          this.configStatusChanged.emit();
        }
      });
  }
}
