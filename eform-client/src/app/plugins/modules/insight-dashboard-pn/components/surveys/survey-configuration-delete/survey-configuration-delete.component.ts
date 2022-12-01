import {
  Component,
  EventEmitter,
  Inject,
  Output,
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
  @Output() surveyConfigDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService,
    public dialogRef: MatDialogRef<SurveyConfigurationDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public surveyConfig: SurveyConfigModel = new SurveyConfigModel(),
  ) {}

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
