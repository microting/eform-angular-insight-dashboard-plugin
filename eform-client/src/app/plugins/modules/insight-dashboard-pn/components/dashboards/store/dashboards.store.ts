import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface DashboardsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): DashboardsState {
  return <DashboardsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
    },
    total: 0,
  };
}

export const dashboardsPersistStorage = persistState({
  include: ['dashboards'],
  key: 'insightDashboardPn',
  preStorageUpdate(storeName, state: DashboardsState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dashboards' })
export class DashboardsStore extends Store<DashboardsState> {
  constructor() {
    super(createInitialState());
  }
}

export const dashboardsPersistProvider = {
  provide: 'persistStorage',
  useValue: dashboardsPersistStorage,
  multi: true,
};
