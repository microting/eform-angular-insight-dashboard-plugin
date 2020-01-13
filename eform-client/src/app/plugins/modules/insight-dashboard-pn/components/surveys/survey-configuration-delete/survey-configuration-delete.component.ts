import {Component, OnInit, ViewChild} from '@angular/core';
import {SurveyConfigModel} from '../../../models/survey-config.model';

@Component({
  selector: 'app-survey-configuration-delete',
  templateUrl: './survey-configuration-delete.component.html',
  styleUrls: ['./survey-configuration-delete.component.scss']
})
export class SurveyConfigurationDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor() { }

  show(surveyConfig: SurveyConfigModel) {
    this.frame.show();
  }

  ngOnInit() {
  }

}
