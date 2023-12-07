import {CommonPaginationState} from 'src/app/common/models';
import {Action, createReducer, on} from '@ngrx/store';
import {
  updateDashboardsFilters,
  updateDashboardsPagination
} from './dashboards.actions';

export interface DashboardsState {
  pagination: CommonPaginationState;
  filters: { nameFilter: string };
  total: number;
}

export const initialDashboardsState: DashboardsState = {
  pagination: {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
    pageIndex: 0,
    total: 0
  },
  filters: {
    nameFilter: '',
  },
  total: 0,
};

export const _reducer = createReducer(
  initialDashboardsState,
  on(updateDashboardsFilters, (state, payload) => ({
      ...state,
      filters: {
        nameFilter: payload.nameFilter,
      }
    }
  )),
  on(updateDashboardsPagination, (state, payload) => ({
      ...state,
      pagination: {
        ...state.pagination,
        offset: payload.offset,
        isSortDsc: payload.isSortDsc,
        sort: payload.sort,
        pageIndex: payload.pageIndex,
        pageSize: payload.pageSize,
        total: payload.total
      },
    }
  ))
);

export function reducer(state: DashboardsState | undefined, action: Action) {
  return _reducer(state, action);
}
