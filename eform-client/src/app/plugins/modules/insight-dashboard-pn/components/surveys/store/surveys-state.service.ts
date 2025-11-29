import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  PaginationModel,
} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {map} from 'rxjs/operators';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {SurveyConfigsListModel} from '../../../models';
import {Store} from '@ngrx/store';
import {
  selectSurveysPagination,
  selectSurveysFilters
} from '../../../state/surveys/surveys.selector';
import {
  updateSurveysFilters,
  updateSurveysPagination
} from '../../../state/surveys/surveys.actions';

@Injectable({providedIn: 'root'})
export class SurveysStateService {
  private store = inject(Store);
  private service = inject(InsightDashboardPnSurveyConfigsService);

  currentFilters: { nameFilter: string };
  currentPagination: CommonPaginationState;

  constructor() {
    this.store.select(selectSurveysPagination).subscribe(x => this.currentPagination = x);
    this.store.select(selectSurveysFilters).subscribe(x => this.currentFilters = x);
  }

  getAll(): Observable<OperationDataResult<SurveyConfigsListModel>> {
    return this.service
      .getAll({
        ...this.currentPagination,
        // ...this.currentFilters,
        searchString: this.currentFilters.nameFilter,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(updateSurveysPagination({...this.currentPagination, total: response.model.total}));
          }
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateSurveysFilters({nameFilter: nameFilter}));
    this.store.dispatch(updateSurveysPagination({...this.currentPagination, offset: 0}));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(updateSurveysPagination({
      ...this.currentPagination,
      sort: localPageSettings.sort,
      isSortDsc: localPageSettings.isSortDsc
    }));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(updateSurveysPagination({...this.currentPagination, pageSize: pagination.pageSize, offset: pagination.offset}));
  }
}
