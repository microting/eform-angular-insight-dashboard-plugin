import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedPnModule } from '../shared/shared-pn.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { InsightDashboardPnLayoutComponent } from './layouts';

import { InsightDashboardPnRoutingModule } from './insight-dashboard-pn-routing.module';
import { CasesModule } from 'src/app/modules';
import {
  InsightDashboardPnAnswersService,
  InsightDashboardPnDashboardDictionariesService,
  InsightDashboardPnDashboardItemsService,
  InsightDashboardPnDashboardsService,
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
  DashboardsPageComponent,
  DashboardViewComponent,
  InsightDashboardSettingsComponent,
  SurveyConfigurationDeleteComponent,
  SurveyConfigurationEditComponent,
  SurveyConfigurationNewComponent,
  SurveyConfigurationsPageComponent,
  SurveyConfigurationStatusComponent,
} from './components';
import { DragulaModule } from 'ng2-dragula';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  DashboardsStateService,
  dashboardsPersistProvider,
} from './components/dashboards/store';
import {
  SurveysStateService,
  surveysPersistProvider,
} from './components/surveys/store';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import {MatButtonModule} from '@angular/material/button';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MtxSelectModule} from '@ng-matero/extensions/select';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    InsightDashboardPnRoutingModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    CasesModule,
    DragulaModule,
    CollapseModule,
    NgxChartsModule,
    OwlDateTimeModule,
    MatButtonModule,
    MtxGridModule,
    MatInputModule,
    MatDialogModule,
    MtxSelectModule,
  ],
  declarations: [
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
    DashboardInterviewsViewComponent,
    AnswerPageComponent,
    AnswerValuesTableComponent,
    AnswerDeleteModalComponent,
  ],
  providers: [
    InsightDashboardPnSettingsService,
    InsightDashboardPnDashboardsService,
    InsightDashboardPnSurveyConfigsService,
    InsightDashboardPnDashboardDictionariesService,
    InsightDashboardPnDashboardItemsService,
    InsightDashboardPnAnswersService,
    DashboardsStateService,
    SurveysStateService,
    dashboardsPersistProvider,
    surveysPersistProvider,
  ],
})
export class InsightDashboardPnModule {}
