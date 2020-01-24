import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../../common/models/common';
import {InsightDashboardPnDashboardsService} from '../../../services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {CommonDictionaryExtendedModel} from '../../../models/common-dictionary-extended.model';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Input() surveys: CommonDictionaryModel[] = [];
  @Input() availableLocationsTags: CommonDictionaryExtendedModel[] = [];
  @Output() dashboardCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() surveySelected: EventEmitter<number> = new EventEmitter<number>();
  selectedSurveyId: number;
  spinnerStatus = false;
  selectedLocationId: number | null;
  reportTagId: number | null;
  createDashboard$: Subscription;
  dashboardName: string;
  selectedLocationTagId: number;


  constructor(private dashboardsService: InsightDashboardPnDashboardsService) {
  }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

  createDashboard() {
    this.spinnerStatus = true;
    this.createDashboard$ = this.dashboardsService.create({
      name: this.dashboardName,
      surveyId: this.selectedSurveyId,
      locationId: this.selectedLocationId,
      reportTagId: this.reportTagId
    }).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.dashboardCreated.emit();
      }
      this.spinnerStatus = false;
    });
  }

  onSurveySelected(surveyId: number) {
    this.surveySelected.emit(surveyId);

    // Clear selectors on reselect
    this.selectedLocationId = null;
    this.reportTagId = null;
    this.selectedLocationTagId = null;
  }

  ngOnDestroy(): void {
  }

  onLocationTagSelected(model: any) {
    if (model.isTag) {
      this.reportTagId = model.id;
      this.selectedLocationId = null;
    } else {
      this.selectedLocationId = model.id;
      this.reportTagId = null;
    }
  }
}
