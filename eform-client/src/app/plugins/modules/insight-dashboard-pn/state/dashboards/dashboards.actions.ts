import {createAction, props} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const updateDashboardsFilters = createAction(
  '[Dashboards] Update filters',
  props<{nameFilter: string}>()
);

export const updateDashboardsPagination = createAction(
  '[Dashboards] Update pagination',
  props<CommonPaginationState>()
);
