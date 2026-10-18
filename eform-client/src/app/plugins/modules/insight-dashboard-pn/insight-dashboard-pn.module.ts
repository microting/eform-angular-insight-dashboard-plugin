import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {InsightDashboardPnLayoutComponent} from './layouts';
import {InsightDashboardPnRouting} from './insight-dashboard-pn-routing';
import {
  InsightDashboardPnAnswersService,
  InsightDashboardPnDashboardDictionariesService,
  InsightDashboardPnDashboardItemsService,
  InsightDashboardPnDashboardsService,
  InsightDashboardPnRawDataService,
  InsightDashboardPnSettingsService,
  InsightDashboardPnSurveyConfigsService,
} from './services';
import {
  AnswerDeleteModalComponent,
  AnswerPageComponent,
  AnswerValuesTableComponent,
  DashboardBlockViewComponent,
  DashboardChartDataEditComponent,
  DashboardChartDataViewComponent,
  DashboardChartEditComponent,
  DashboardChartViewComponent,
  DashboardCopyComponent,
  DashboardDeleteComponent,
  DashboardEditComponent,
  DashboardEditHeaderComponent,
  DashboardInterviewsEditComponent,
  DashboardInterviewsViewComponent,
  DashboardItemEditComponent,
  DashboardNewComponent,
  DashboardRawDataViewComponent,
  DashboardsPageComponent,
  DashboardViewComponent,
  InsightDashboardSettingsComponent,
  SurveyConfigurationDeleteComponent,
  SurveyConfigurationEditComponent,
  SurveyConfigurationNewComponent,
  SurveyConfigurationsPageComponent,
  SurveyConfigurationStatusComponent,
} from './components';
import {DragulaModule} from 'ng2-dragula';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import * as dashboardsReducer from './state/dashboards/dashboards.reducer';
import * as surveysReducer from './state/surveys/surveys.reducer';

@NgModule({
  imports: [
    InsightDashboardPnRouting,
    TranslateModule,
    MatDialogModule,
    DragulaModule,
    StoreModule.forFeature('insightDashboardPn', {
      dashboardsState: dashboardsReducer.reducer,
      surveysState: surveysReducer.reducer,
    }),
    InsightDashboardPnLayoutComponent,
    InsightDashboardSettingsComponent,
    SurveyConfigurationsPageComponent,
    DashboardsPageComponent,
    DashboardNewComponent,
    SurveyConfigurationNewComponent,
    SurveyConfigurationEditComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    SurveyConfigurationStatusComponent,
    SurveyConfigurationDeleteComponent,
    DashboardDeleteComponent,
    DashboardCopyComponent,
    DashboardItemEditComponent,
    DashboardChartEditComponent,
    DashboardChartViewComponent,
    DashboardBlockViewComponent,
    DashboardEditHeaderComponent,
    DashboardInterviewsEditComponent,
    DashboardChartDataEditComponent,
    DashboardChartDataViewComponent,
    AnswerPageComponent,
    AnswerValuesTableComponent,
    AnswerDeleteModalComponent,
    DashboardInterviewsViewComponent,
    DashboardRawDataViewComponent,
  ],
  providers: [
    InsightDashboardPnSettingsService,
    InsightDashboardPnDashboardsService,
    InsightDashboardPnSurveyConfigsService,
    InsightDashboardPnDashboardDictionariesService,
    InsightDashboardPnDashboardItemsService,
    InsightDashboardPnAnswersService,
    InsightDashboardPnRawDataService,
  ],
})
export class InsightDashboardPnModule {
}
