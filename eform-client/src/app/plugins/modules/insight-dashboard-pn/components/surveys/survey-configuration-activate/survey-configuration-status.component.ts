import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {SurveyConfigModel} from '../../../models/survey/survey-config.model';

@Component({
  selector: 'app-survey-configuration-status',
  templateUrl: './survey-configuration-status.component.html',
  styleUrls: ['./survey-configuration-status.component.scss']
})
export class SurveyConfigurationStatusComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() configStatusChanged: EventEmitter<SurveyConfigModel> = new EventEmitter<SurveyConfigModel>();
  selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel();
  spinnerStatus = false;

  constructor(private surveyConfigsService: InsightDashboardPnSurveyConfigsService) {
  }

  ngOnInit() {
  }

  show(model: SurveyConfigModel) {
    this.selectedSurveyConfig = model;
    this.frame.show();
  }

  changeSurveyConfigStatus() {
    this.spinnerStatus = true;
    this.surveyConfigsService.changeStatus({surveyId: this.selectedSurveyConfig.id, isActive: !this.selectedSurveyConfig.isActive})
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.configStatusChanged.emit();
        }
        this.spinnerStatus = false;
      });
  }
}
