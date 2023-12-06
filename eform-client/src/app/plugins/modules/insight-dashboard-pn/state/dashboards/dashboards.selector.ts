import {selectInsightDashboardState} from '../insight-dashboard.state';
import {createSelector} from '@ngrx/store';
import {PaginationModel} from 'src/app/common/models';

export const selectDashboards =
  createSelector(selectInsightDashboardState, (state) => state.dashboardsState);
export const selectDashboardsPagination =
  createSelector(selectDashboards, (state) => state.pagination);
export const selectDashboardsPaginationIsSortDsc =
  createSelector(selectDashboardsPagination, (state) => state.isSortDsc ? 'desc' : 'asc');
export const selectDashboardsPaginationSort =
  createSelector(selectDashboardsPagination, (state) => state.sort);
export const selectDashboardsFilters =
  createSelector(selectDashboards, (state) => state.filters);
export const selectDashboardsPaginationAsPaginationModel =
  createSelector(selectDashboardsPagination, (pgn):PaginationModel => ({total: pgn.total, offset: pgn.offset, pageSize: pgn.pageSize}))
export const selectDashboardsFiltersName =
  createSelector(selectDashboardsFilters, (state) => state.nameFilter);
