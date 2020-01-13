import {Component, OnInit, ViewChild} from '@angular/core';
import {SurveyConfigModel} from '../../../models/survey-config.model';

@Component({
  selector: 'app-survey-configuration-edit',
  templateUrl: './survey-configuration-edit.component.html',
  styleUrls: ['./survey-configuration-edit.component.scss']
})
export class SurveyConfigurationEditComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;
  constructor() { }

  show(surveyConfig: SurveyConfigModel) {
    this.frame.show();
  }

  ngOnInit() {
  }

}
