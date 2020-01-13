import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-survey-configuration-status',
  templateUrl: './survey-configuration-status.component.html',
  styleUrls: ['./survey-configuration-status.component.scss']
})
export class SurveyConfigurationStatusComponent implements OnInit {
  @Input() isSurveyConfigActivated: boolean;
  @ViewChild('frame') frame;
  @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  spinnerStatus = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  changeSurveyConfigStatus() {
    // TODO: Enter real status
    this.statusChanged.emit(!this.isSurveyConfigActivated);
  }
}
