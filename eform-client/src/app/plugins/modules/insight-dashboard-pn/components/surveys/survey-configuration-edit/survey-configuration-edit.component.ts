import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InsightDashboardPnSurveyConfigsService } from '../../../services';
import { SurveyConfigModel } from '../../../models/survey/survey-config.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AreaRuleUpdateModel} from 'src/app/plugins/modules/backend-configuration-pn/models';

@Component({
  selector: 'app-survey-configuration-edit',
  templateUrl: './survey-configuration-edit.component.html',
  styleUrls: ['./survey-configuration-edit.component.scss'],
})
export class SurveyConfigurationEditComponent implements OnInit {
  locations: CommonDictionaryModel[] = [];
  surveys: CommonDictionaryModel[] = [];
  configUpdated: EventEmitter<void> = new EventEmitter<void>();
  extendedLocations: { id: number; name: string; isChecked: boolean }[] = [];
  selectedLocations: number[] = [];
  selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel();

  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService,
    public dialogRef: MatDialogRef<SurveyConfigurationEditComponent>,
    @Inject(MAT_DIALOG_DATA) model: {surveyConfig: SurveyConfigModel, locations: CommonDictionaryModel[], surveys: CommonDictionaryModel[]}
  ) {
    this.locations = model.locations;
    this.surveys = model.surveys;
    this.selectedSurveyConfig = model.surveyConfig;
    this.extendedLocations = this.locations.map((x) => {
      return {
        id: x.id,
        name: x.name,
        isChecked: model.surveyConfig.locations.findIndex((y) => y.id === x.id) > -1,
      };
    });
    this.selectedLocations = model.surveyConfig.locations.map((x) => x.id);
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
