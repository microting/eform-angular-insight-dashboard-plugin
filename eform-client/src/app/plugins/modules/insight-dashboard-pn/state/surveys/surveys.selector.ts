import {selectInsightDashboardState} from '../insight-dashboard.state';
import {createSelector} from '@ngrx/store';
import {PaginationModel} from 'src/app/common/models';

export const selectSurveys =
  createSelector(selectInsightDashboardState, (state) => state.surveysState);
export const selectSurveysPagination =
  createSelector(selectSurveys, (state) => state.pagination);
export const selectSurveysPaginationIsSortDsc =
  createSelector(selectSurveysPagination, (state) => state.isSortDsc ? 'desc' : 'asc');
export const selectSurveysPaginationSort =
  createSelector(selectSurveysPagination, (state) => state.sort);
export const selectSurveysFilters =
  createSelector(selectSurveys, (state) => state.filters);
export const selectSurveysPaginationAsPaginationModel =
  createSelector(selectSurveysPagination, (pgn):PaginationModel => ({total: pgn.total, offset: pgn.offset, pageSize: pgn.pageSize}))
export const selectSurveysFiltersName =
  createSelector(selectSurveysFilters, (state) => state.nameFilter);
