import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-survey-configuration-new',
  templateUrl: './survey-configuration-new.component.html',
  styleUrls: ['./survey-configuration-new.component.scss']
})
export class SurveyConfigurationNewComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor() { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

}
