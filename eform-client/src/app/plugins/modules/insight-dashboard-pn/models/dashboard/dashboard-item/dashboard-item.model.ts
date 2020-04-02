import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum, DashboardPeriodUnitsEnum} from '../../../const/enums';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';
import {DashboardItemIgnoredAnswerModel} from './dashboard-item-ignored-answer.model';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  firstQuestionType: DashboardItemQuestionTypesEnum;
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
  answersLength = 0;

  // Helper fields
  collapsed: boolean;

}

