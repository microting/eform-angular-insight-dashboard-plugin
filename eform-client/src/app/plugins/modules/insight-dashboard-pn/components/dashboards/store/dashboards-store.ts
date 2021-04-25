import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface DashboardsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): DashboardsState {
  return <DashboardsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

export const dashboardsPersistStorage = persistState({
  include: ['insightDashboardPnDashboards'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'insightDashboardPnDashboards' })
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
