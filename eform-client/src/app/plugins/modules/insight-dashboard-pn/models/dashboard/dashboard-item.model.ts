import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../const/enums';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  firstQuestionName: string;
  filterQuestionId: number;
  filterQuestionName: string;
  filterAnswerId: number;
  filterAnswerName: string;
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;
  position: number;
}
