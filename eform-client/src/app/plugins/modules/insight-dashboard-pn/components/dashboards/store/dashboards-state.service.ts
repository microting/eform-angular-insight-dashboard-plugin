import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  PaginationModel,
} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {map} from 'rxjs/operators';
import {InsightDashboardPnDashboardsService} from '../../../services';
import {DashboardsListModel} from '../../../models';
import {Store} from '@ngrx/store';
import {
  selectDashboardsFilters,
  selectDashboardsPagination
} from '../../../state/dashboards/dashboards.selector';
import {
  updateDashboardsFilters,
  updateDashboardsPagination
} from '../../../state/dashboards/dashboards.actions';

@Injectable({providedIn: 'root'})
export class DashboardsStateService {
  private store = inject(Store);
  private service = inject(InsightDashboardPnDashboardsService);

  currentFilters: { nameFilter: string };
  currentPagination: CommonPaginationState;

  constructor() {
    this.store.select(selectDashboardsPagination).subscribe(x => this.currentPagination = x);
    this.store.select(selectDashboardsFilters).subscribe(x => this.currentFilters = x);
  }

  getAll(): Observable<OperationDataResult<DashboardsListModel>> {
    return this.service
      .getAll({
        ...this.currentPagination,
        // ...this.currentFilters,
        searchString: this.currentFilters.nameFilter,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(updateDashboardsPagination({...this.currentPagination, total: response.model.total}));
          }
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateDashboardsFilters({nameFilter: nameFilter}));
    this.store.dispatch(updateDashboardsPagination({...this.currentPagination, offset: 0}));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(updateDashboardsPagination({
      ...this.currentPagination,
      sort: localPageSettings.sort,
      isSortDsc: localPageSettings.isSortDsc
    }));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(updateDashboardsPagination({...this.currentPagination, pageSize: pagination.pageSize, offset: pagination.offset}));
  }
}
