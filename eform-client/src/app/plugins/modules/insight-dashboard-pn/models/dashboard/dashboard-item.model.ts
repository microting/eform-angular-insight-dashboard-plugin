import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  firstQuestionName: string;
  filterQuestionId: number;
  filterQuestionName: string;
  filterAnswerId: number;
  collapsed: boolean;
  filterAnswerName: string;
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;
  position: number;

  compareEnabled: boolean;
  compareChartType: number;
}
