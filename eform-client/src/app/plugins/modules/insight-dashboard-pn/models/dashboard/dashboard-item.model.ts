import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  filterQuestionId: number;
  filterAnswerId: number;
  collapsed: boolean;
  filterAnswerName: string;
  ignoredAnswerValues: DashboardItemIgnoredAnswerModel[];
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;

  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareModel[];

  calculateAverage: boolean;

  position: number;
}

export class DashboardItemIgnoredAnswerModel {
  id: number | null;
  answerId: number;
}
