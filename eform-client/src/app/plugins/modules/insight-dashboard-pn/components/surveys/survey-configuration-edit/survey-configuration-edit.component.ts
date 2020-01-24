import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../../common/models/common';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {SurveyConfigModel} from '../../../models/survey/survey-config.model';

@Component({
  selector: 'app-survey-configuration-edit',
  templateUrl: './survey-configuration-edit.component.html',
  styleUrls: ['./survey-configuration-edit.component.scss']
})
export class SurveyConfigurationEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() locations: CommonDictionaryModel[] = [];
  @Input() surveys: CommonDictionaryModel[] = [];
  @Output() configUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedSurveyId: number;
  extendedLocations: { id: number, name: string, isChecked: boolean }[] = [];
  selectedLocations: number[] = [];
  selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel();


  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService
  ) {
  }

  show(surveyConfig: SurveyConfigModel) {
    this.selectedSurveyConfig = surveyConfig;
    this.extendedLocations = surveyConfig.locations.map(x => {
      return {id: x.id, name: x.name, isChecked: this.locations.findIndex(y => y.id === x.id) > -1};
    });
    this.selectedLocations = surveyConfig.locations.map(x => x.id);
    this.frame.show();
  }

  ngOnInit() {
  }

  updateConfig() {
    this.spinnerStatus = true;
    this.surveyConfigsService.update({
      locationsIds: this.selectedLocations,
      surveyId: this.selectedSurveyId,
      id: this.selectedSurveyConfig.id
    })
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.configUpdated.emit();
        }
        this.spinnerStatus = false;
      });
  }

  addToArray(e: any, locationId: number) {
    if (e.target.checked) {
      this.selectedLocations.push(locationId);
    } else {
      this.selectedLocations = this.selectedLocations.filter(x => x !== locationId);
    }
  }
}
