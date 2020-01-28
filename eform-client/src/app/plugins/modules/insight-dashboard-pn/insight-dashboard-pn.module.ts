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
  InsightDashboardPnDashboardsService,
  InsightDashboardPnSettingsService,
  InsightDashboardPnSurveyConfigsService
} from './services';
import {
  DashboardItemEditComponent,
  DashboardChartEditComponent,
  DashboardChartViewComponent,
  DashboardBlockViewComponent,
  DashboardCopyComponent,
  DashboardDeleteComponent,
  DashboardEditComponent,
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
    NgxChartsModule
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
    DashboardBlockViewComponent
  ],
  providers: [InsightDashboardPnSettingsService, InsightDashboardPnDashboardsService,
    InsightDashboardPnSurveyConfigsService, InsightDashboardPnDashboardDictionariesService]
})

export class InsightDashboardPnModule {
}
