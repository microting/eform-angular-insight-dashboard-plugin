import {CommonPaginationState} from 'src/app/common/models';
import {Action, createReducer, on} from '@ngrx/store';
import {
  updateSurveysFilters,
  updateSurveysPagination
} from './surveys.actions';

export interface SurveysState {
  pagination: CommonPaginationState;
  filters: { nameFilter: string };
  total: number;
}

export const initialSurveysState: SurveysState = {
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
  initialSurveysState,
  on(updateSurveysFilters, (state, payload) => ({
      ...state,
      filters: {
        nameFilter: payload.nameFilter,
      }
    }
  )),
  on(updateSurveysPagination, (state, payload) => ({
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

export function reducer(state: SurveysState | undefined, action: Action) {
  return _reducer(state, action);
}
