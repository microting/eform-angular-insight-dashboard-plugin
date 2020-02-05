import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';
import {DashboardViewChartDataModel} from './dashboard-view-chart-data.model';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';

export class DashboardViewItemModel {
  id: number;
  firstQuestionName: string;
  filterQuestionName: string;
  filterAnswerName: string;

  ignoredAnswerValues: any[];
  calculateAverage: boolean;
  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareModel[];

  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;
  chartData: DashboardViewChartDataModel;
}
