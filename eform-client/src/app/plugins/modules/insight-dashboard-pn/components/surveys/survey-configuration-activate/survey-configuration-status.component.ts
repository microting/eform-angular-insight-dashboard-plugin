import {
  Component,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import { InsightDashboardPnSurveyConfigsService } from '../../../services';
import { SurveyConfigModel } from '../../../models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-survey-configuration-status',
  templateUrl: './survey-configuration-status.component.html',
  styleUrls: ['./survey-configuration-status.component.scss'],
  standalone: false,
})
export class SurveyConfigurationStatusComponent implements OnInit {
  private surveyConfigsService = inject(InsightDashboardPnSurveyConfigsService);
  public dialogRef = inject(MatDialogRef<SurveyConfigurationStatusComponent>);
  public selectedSurveyConfig = inject<SurveyConfigModel>(MAT_DIALOG_DATA);

  configStatusChanged: EventEmitter<SurveyConfigModel> = new EventEmitter<SurveyConfigModel>();

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
