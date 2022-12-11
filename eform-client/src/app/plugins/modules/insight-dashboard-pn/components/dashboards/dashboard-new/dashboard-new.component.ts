import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InsightDashboardPnDashboardsService } from '../../../services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss'],
})
export class DashboardNewComponent implements OnInit, OnDestroy {
  dashboardCreated: EventEmitter<number> = new EventEmitter<number>();
  surveySelected: EventEmitter<number> = new EventEmitter<number>();
  selectedSurveyId: number;
  createDashboard$: Subscription;
  dashboardName: string;

  constructor(
    private dashboardsService: InsightDashboardPnDashboardsService,
    public dialogRef: MatDialogRef<DashboardNewComponent>,
    @Inject(MAT_DIALOG_DATA) public surveys: CommonDictionaryModel[] = [],
  ) {}

  hide() {
    this.dialogRef.close();
  }

  ngOnInit() {}

  createDashboard() {
    this.createDashboard$ = this.dashboardsService
      .create({
        name: this.dashboardName,
        surveyId: this.selectedSurveyId,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardCreated.emit(data.model);
        }
      });
  }

  onSurveySelected(surveyId: number) {
    this.surveySelected.emit(surveyId);
  }

  ngOnDestroy(): void {}
}
