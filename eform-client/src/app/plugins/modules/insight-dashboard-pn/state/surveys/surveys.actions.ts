import {createAction, props} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const updateSurveysFilters = createAction(
  '[Surveys] Update filters',
  props<{nameFilter: string}>()
);

export const updateSurveysPagination = createAction(
  '[Surveys] Update pagination',
  props<CommonPaginationState>()
);
