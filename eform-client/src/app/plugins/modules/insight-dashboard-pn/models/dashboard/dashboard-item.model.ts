import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';
import {DashboardItemIgnoredAnswerModel} from './dashboard-item-ignored-answer.model';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  isFirstQuestionSmiley: boolean;
  filterQuestionId: number;
  filterAnswerId: number;
  filterAnswerName: string;
  ignoredAnswerValues: DashboardItemIgnoredAnswerModel[];
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;

  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareModel[];

  calculateAverage: boolean;

  position: number;

  // Helper fields
  collapsed: boolean;

}

