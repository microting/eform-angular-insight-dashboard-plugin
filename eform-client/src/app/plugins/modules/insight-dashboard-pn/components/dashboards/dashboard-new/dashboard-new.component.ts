import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../../common/models/common';

@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() surveys: CommonDictionaryModel[] = [];
  @Output() dashboardCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() surveySelected: EventEmitter<number> = new EventEmitter<number>();
  selectedSurveyId: number;
  spinnerStatus = false;
  locationsTags: CommonDictionaryModel[] = [];
  selectedLocationTagId: number;

  constructor() { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

  createDashboard() {

  }

  onSurveySelected(surveyId: number) {
    this.surveySelected.emit(surveyId);
  }
}
