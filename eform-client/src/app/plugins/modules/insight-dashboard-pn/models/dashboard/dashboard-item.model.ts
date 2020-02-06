import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  firstQuestionName: string;
  filterQuestionId: number;
  filterQuestionName: string;
  filterAnswerId: number;
  collapsed: boolean;
  filterAnswerName: string;
  ignoredAnswerValues: number[];
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;

  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareModel[];

  calculateAverage: boolean;

  position: number;
}
