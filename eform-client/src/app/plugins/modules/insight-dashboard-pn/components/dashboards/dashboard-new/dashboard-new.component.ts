import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../../common/models/common';
import {InsightDashboardPnDashboardsService} from '../../../services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {DashboardCreateModel} from '../../../models';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Input() surveys: CommonDictionaryModel[] = [];
  @Output() dashboardCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() surveySelected: EventEmitter<number> = new EventEmitter<number>();
  selectedSurveyId: number;
  spinnerStatus = false;
  locationsTags: CommonDictionaryModel[] = [];
  selectedLocationTagId: number;
  createDashboard$: Subscription;


  constructor(private dashboardsService: InsightDashboardPnDashboardsService) { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

  createDashboard() {
    this.spinnerStatus = true;
    this.createDashboard$ = this.dashboardsService.create(new DashboardCreateModel()).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.dashboardCreated.emit();
      }
      this.spinnerStatus = false;
    });
  }

  onSurveySelected(surveyId: number) {
    this.surveySelected.emit(surveyId);
  }

  ngOnDestroy(): void {
  }
}
