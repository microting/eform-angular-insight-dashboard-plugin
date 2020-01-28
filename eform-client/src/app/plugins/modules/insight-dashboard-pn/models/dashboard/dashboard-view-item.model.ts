import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';
import {DashboardViewChartDataModel} from './dashboard-view-chart-data.model';

export class DashboardViewItemModel {
  id: number;
  firstQuestionName: string;
  filterQuestionName: string;
  filterAnswerName: string;
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;
  chartData: DashboardViewChartDataModel;
}
