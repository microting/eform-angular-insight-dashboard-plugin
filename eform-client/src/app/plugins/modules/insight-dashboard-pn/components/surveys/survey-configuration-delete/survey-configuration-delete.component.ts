import {
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { SurveyConfigModel } from '../../../models/survey/survey-config.model';
import { InsightDashboardPnSurveyConfigsService } from '../../../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-survey-configuration-delete',
  templateUrl: './survey-configuration-delete.component.html',
  styleUrls: ['./survey-configuration-delete.component.scss'],
})
export class SurveyConfigurationDeleteComponent {
  private surveyConfigsService = inject(InsightDashboardPnSurveyConfigsService);
  public dialogRef = inject(MatDialogRef<SurveyConfigurationDeleteComponent>);
  public surveyConfig = inject<SurveyConfigModel>(MAT_DIALOG_DATA);

  surveyConfigDeleted: EventEmitter<void> = new EventEmitter<void>();

  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteSurveyConfig() {
    this.surveyConfigsService.remove(this.surveyConfig.id).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
        this.surveyConfigDeleted.emit();
      }
    });
  }
}
