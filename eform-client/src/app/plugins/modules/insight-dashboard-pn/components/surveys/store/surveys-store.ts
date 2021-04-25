import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface SurveysState {
  pagination: CommonPaginationState;
}

export function createInitialState(): SurveysState {
  return <SurveysState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

const surveysPersistStorage = persistState({
  include: ['insightDashboardPnSurveys'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'insightDashboardPnSurveys' })
export class SurveysStore extends Store<SurveysState> {
  constructor() {
    super(createInitialState());
  }
}

export const surveysPersistProvider = {
  provide: 'persistStorage',
  useValue: surveysPersistStorage,
  multi: true,
};
