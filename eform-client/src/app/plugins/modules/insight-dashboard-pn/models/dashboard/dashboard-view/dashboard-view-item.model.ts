import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum, DashboardPeriodUnitsEnum} from '../../../const/enums';
import {DashboardViewChartDataModel} from './dashboard-view-chart-data.model';
import {DashboardItemCompareModel} from '../dashboard-item/dashboard-item-compare.model';
import {DashboardItemIgnoredAnswerModel} from '../dashboard-item/dashboard-item-ignored-answer.model';
import {DashboardItemCompareViewModel} from '../dashboard-item/dashboard-item-compare-view.model';
import {DashboardItemIgnoredAnswerViewModel} from '../dashboard-item/dashboard-item-ignored-answer-view.model';
import {DashboardItemTextQuestionDataModel} from '../dashboard-item/dashboard-item-text-question-data.model';

export class DashboardViewItemModel {
  id: number;
  firstQuestionName: string;
  firstQuestionId: number;
  firstQuestionType: DashboardItemQuestionTypesEnum;
  filterQuestionName: string;
  filterQuestionId: number | null;
  filterAnswerName: string;
  filterAnswerId: number | null;

  ignoredAnswerValues: DashboardItemIgnoredAnswerViewModel[];
  calculateAverage: boolean;
  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareViewModel[];

  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;
  chartData: DashboardViewChartDataModel;

  interviewsCount: number;
  textQuestionData: DashboardItemTextQuestionDataModel[];
}
