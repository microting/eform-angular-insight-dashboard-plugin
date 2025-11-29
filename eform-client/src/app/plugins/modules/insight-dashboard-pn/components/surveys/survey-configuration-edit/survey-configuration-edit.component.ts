import {
  Component,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InsightDashboardPnSurveyConfigsService } from '../../../services';
import { SurveyConfigModel } from '../../../models/survey/survey-config.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-survey-configuration-edit',
  templateUrl: './survey-configuration-edit.component.html',
  styleUrls: ['./survey-configuration-edit.component.scss'],
})
export class SurveyConfigurationEditComponent implements OnInit {
  private surveyConfigsService = inject(InsightDashboardPnSurveyConfigsService);
  public dialogRef = inject(MatDialogRef<SurveyConfigurationEditComponent>);
  private model = inject<{surveyConfig: SurveyConfigModel, locations: CommonDictionaryModel[], surveys: CommonDictionaryModel[]}>(MAT_DIALOG_DATA);

  locations: CommonDictionaryModel[] = [];
  surveys: CommonDictionaryModel[] = [];
  configUpdated: EventEmitter<void> = new EventEmitter<void>();
  extendedLocations: { id: number; name: string; isChecked: boolean }[] = [];
  selectedLocations: number[] = [];
  selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel();

  constructor() {
    this.locations = this.model.locations;
    this.surveys = this.model.surveys;
    this.selectedSurveyConfig = this.model.surveyConfig;
    this.extendedLocations = this.locations.map((x) => {
      return {
        id: x.id,
        name: x.name,
        isChecked: this.model.surveyConfig.locations.findIndex((y) => y.id === x.id) > -1,
      };
    });
    this.selectedLocations = this.model.surveyConfig.locations.map((x) => x.id);
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnInit() {}

  updateConfig() {
    this.surveyConfigsService
      .update({
        locationsIds: this.selectedLocations,
        surveyId: this.selectedSurveyConfig.surveyId,
        id: this.selectedSurveyConfig.id,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
          this.configUpdated.emit();
        }
      });
  }

  addToArray(checked: boolean, locationId: number) {
    if (checked) {
      this.selectedLocations.push(locationId);
    } else {
      this.selectedLocations = this.selectedLocations.filter(
        (x) => x !== locationId
      );
    }
  }
}
