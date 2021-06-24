import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface SurveysState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): SurveysState {
  return <SurveysState>{
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

const surveysPersistStorage = persistState({
  include: ['surveys'],
  key: 'insightDashboardPn',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'surveys' })
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
