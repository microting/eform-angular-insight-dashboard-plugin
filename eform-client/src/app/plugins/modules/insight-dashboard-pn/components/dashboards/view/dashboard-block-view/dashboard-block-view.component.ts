import {Component, Input, OnInit} from '@angular/core';
import {
  DashboardChartTypesEnum,
  DashboardItemQuestionTypesEnum,
  DashboardPeriodUnitsEnum,
} from '../../../../const/enums';
import {DashboardViewModel, DashboardViewItemModel} from '../../../../models';
import {format, set} from 'date-fns';

import {TranslatePipe} from '@ngx-translate/core';
import {NgIf, NgFor} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {DashboardChartDataViewComponent} from '../dashboard-chart-data-view/dashboard-chart-data-view.component';
import {DashboardChartViewComponent} from '../dashboard-chart-view/dashboard-chart-view.component';
import {DashboardInterviewsViewComponent} from '../dashboard-interviews-view/dashboard-interviews-view.component';
import {DashboardRawDataViewComponent} from '../dashboard-raw-data-view/dashboard-raw-data-view.component';

@Component({
  selector: 'app-dashboard-block-view',
  templateUrl: './dashboard-block-view.component.html',
  styleUrls: ['./dashboard-block-view.component.scss'],
  imports: [TranslatePipe, NgIf, NgFor, MatCard, MatCardContent, DashboardChartDataViewComponent, DashboardChartViewComponent, DashboardInterviewsViewComponent, DashboardRawDataViewComponent],
})
export class DashboardBlockViewComponent implements OnInit {
  @Input() position: number;
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  get periodUnits() {
    return DashboardPeriodUnitsEnum;
  }

  get questionType() {
    return DashboardItemQuestionTypesEnum;
  }

  get dateFrom() {
    if (this.dashboardViewModel && this.dashboardViewModel.answerDates && this.dashboardViewModel.answerDates.dateFrom) {
      return format(this.setDate(this.dashboardViewModel.answerDates.dateFrom as Date), 'yyyy/MM/dd');
    }
    return '--';
  }

  get dateTo() {
    if (this.dashboardViewModel && this.dashboardViewModel.answerDates && this.dashboardViewModel.answerDates.dateTo) {
      return format(this.setDate(this.dashboardViewModel.answerDates.dateTo as Date), 'yyyy/MM/dd');
    }
    return '--';
  }

  ngOnInit() {
  }

  setDate(date: Date): Date {
    return set(date, {
      date: date.getUTCDate(),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  }
}
