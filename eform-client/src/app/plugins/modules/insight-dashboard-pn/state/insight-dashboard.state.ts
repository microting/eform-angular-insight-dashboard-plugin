import {DashboardsState} from './dashboards/dashboards.reducer';
import {SurveysState} from './surveys/surveys.reducer';

export interface InsightDashboardState {
  dashboardsState: DashboardsState;
  surveysState: SurveysState;
}

export const selectInsightDashboardState = (state: { insightDashboardPn: InsightDashboardState }) => state.insightDashboardPn;
