import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CollapseModule, MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedPnModule} from '../shared/shared-pn.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EformSharedModule} from '../../../common/modules/eform-shared/eform-shared.module';
import {InsightDashboardPnLayoutComponent} from './layouts';

import {InsightDashboardPnRoutingModule} from './insight-dashboard-pn-routing.module';
import {CasesModule} from '../../../modules';
import {
  InsightDashboardPnDashboardDictionariesService,
  InsightDashboardPnDashboardItemsService,
  InsightDashboardPnDashboardsService,
  InsightDashboardPnSettingsService,
  InsightDashboardPnSurveyConfigsService
} from './services';
import {
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
  SurveyConfigurationStatusComponent
} from './components';
import {DragulaModule} from 'ng2-dragula';
import {NgxChartsModule} from '@microting/ngx-charts';
import {OwlDateTimeModule} from 'ng-pick-datetime-ex';

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
    OwlDateTimeModule
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
    DashboardInterviewsViewComponent
  ],
  providers: [InsightDashboardPnSettingsService, InsightDashboardPnDashboardsService,
    InsightDashboardPnSurveyConfigsService, InsightDashboardPnDashboardDictionariesService, InsightDashboardPnDashboardItemsService]
})

export class InsightDashboardPnModule {
}
