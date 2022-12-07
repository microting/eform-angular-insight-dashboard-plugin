import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {CommonDictionaryModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-survey-configuration-new',
  templateUrl: './survey-configuration-new.component.html',
  styleUrls: ['./survey-configuration-new.component.scss'],
})
export class SurveyConfigurationNewComponent implements OnInit {
  locations: CommonDictionaryModel[] = [];
  surveys: CommonDictionaryModel[] = [];
  configCreated: EventEmitter<void> = new EventEmitter<void>();
  selectedSurveyId: number;
  selectedLocations: number[] = [];

  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService,
    public dialogRef: MatDialogRef<SurveyConfigurationNewComponent>,
    @Inject(MAT_DIALOG_DATA) model: { locations: CommonDictionaryModel[], surveys: CommonDictionaryModel[] }
  ) {
    this.locations = model.locations;
    this.surveys = model.surveys;
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnInit() {
  }

  createConfig() {
    this.surveyConfigsService
      .create({
        locationsIds: this.selectedLocations,
        surveyId: this.selectedSurveyId,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
          this.configCreated.emit();
          this.selectedLocations = [];
        }
      });
  }

  addToArray(e: MatCheckboxChange, locationId: number) {
    if (e.checked) {
      this.selectedLocations.push(locationId);
    } else {
      this.selectedLocations = this.selectedLocations.filter(
        (x) => x !== locationId
      );
    }
  }
}
