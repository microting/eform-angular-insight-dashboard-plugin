import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InsightDashboardPnDashboardsService } from '../../../services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {TranslatePipe} from '@ngx-translate/core';
import {MatDialogTitle, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MtxSelect} from '@ng-matero/extensions/select';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss'],
  imports: [TranslatePipe, MatDialogTitle, MatDialogContent, MatDialogActions, FormsModule, MatFormField, MatLabel, MatInput, MtxSelect],
})
export class DashboardNewComponent implements OnInit, OnDestroy {
  private dashboardsService = inject(InsightDashboardPnDashboardsService);
  public dialogRef = inject(MatDialogRef<DashboardNewComponent>);
  public surveys = inject<CommonDictionaryModel[]>(MAT_DIALOG_DATA);

  dashboardCreated: EventEmitter<number> = new EventEmitter<number>();
  surveySelected: EventEmitter<number> = new EventEmitter<number>();
  selectedSurveyId: number;
  createDashboard$: Subscription;
  dashboardName: string;

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
