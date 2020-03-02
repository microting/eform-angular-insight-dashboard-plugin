import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';
import {DashboardViewChartDataModel} from './dashboard-view-chart-data.model';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';
import {DashboardItemIgnoredAnswerModel} from './dashboard-item-ignored-answer.model';

export class DashboardViewItemModel {
  id: number;
  firstQuestionName: string;
  firstQuestionId: number;
  filterQuestionName: string;
  filterQuestionId: number | null;
  filterAnswerName: string;
  filterAnswerId: number | null;

  ignoredAnswerValues: DashboardItemIgnoredAnswerModel[];
  calculateAverage: boolean;
  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareModel[];

  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;
  chartData: DashboardViewChartDataModel;
}
