import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SurveysState, SurveysStore } from './surveys-store';

@Injectable({ providedIn: 'root' })
export class SurveysQuery extends Query<SurveysState> {
  constructor(protected store: SurveysStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectNameFilter$ = this.select((state) => state.pagination.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
