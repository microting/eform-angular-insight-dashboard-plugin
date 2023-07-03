import {Component, Input, OnInit} from '@angular/core';
import {
  DashboardChartTypesEnum,
  DashboardItemQuestionTypesEnum,
  DashboardPeriodUnitsEnum,
} from '../../../../const/enums';
import {DashboardViewModel, DashboardViewItemModel} from '../../../../models';
import {format, set} from 'date-fns';

@Component({
  selector: 'app-dashboard-block-view',
  templateUrl: './dashboard-block-view.component.html',
  styleUrls: ['./dashboard-block-view.component.scss'],
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

  constructor() {
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
