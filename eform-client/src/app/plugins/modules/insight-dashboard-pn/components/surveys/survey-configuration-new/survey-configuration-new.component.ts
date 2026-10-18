import {
  Component,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {CommonDictionaryModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';

import {TranslatePipe} from '@ngx-translate/core';
import {MatDialogTitle, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MtxSelect} from '@ng-matero/extensions/select';

@Component({
  selector: 'app-survey-configuration-new',
  templateUrl: './survey-configuration-new.component.html',
  styleUrls: ['./survey-configuration-new.component.scss'],
  imports: [TranslatePipe, MatDialogTitle, MatDialogContent, MatDialogActions, NgFor, FormsModule, MatCheckbox, MatFormField, MatLabel, MtxSelect],
})
export class SurveyConfigurationNewComponent implements OnInit {
  private surveyConfigsService = inject(InsightDashboardPnSurveyConfigsService);
  public dialogRef = inject(MatDialogRef<SurveyConfigurationNewComponent>);
  private model = inject<{ locations: CommonDictionaryModel[], surveys: CommonDictionaryModel[] }>(MAT_DIALOG_DATA);

  locations: CommonDictionaryModel[] = [];
  surveys: CommonDictionaryModel[] = [];
  configCreated: EventEmitter<void> = new EventEmitter<void>();
  selectedSurveyId: number;
  selectedLocations: number[] = [];

  constructor() {
    this.locations = this.model.locations;
    this.surveys = this.model.surveys;
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
