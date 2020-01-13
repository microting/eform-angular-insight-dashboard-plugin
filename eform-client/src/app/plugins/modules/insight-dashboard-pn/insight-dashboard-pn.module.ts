import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedPnModule} from '../shared/shared-pn.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EformSharedModule} from '../../../common/modules/eform-shared/eform-shared.module';
import {InsightDashboardPnLayoutComponent} from './layouts';

import {InsightDashboardPnRoutingModule} from './insight-dashboard-pn-routing.module';
import {CasesModule} from '../../../modules';
import {InsightDashboardPnDashboards, InsightDashboardPnSettingsService, InsightDashboardPnSurveyConfigs} from './services';
import {
  DashboardCopyComponent,
  DashboardDeleteComponent,
  DashboardEditComponent,
  DashboardNewComponent,
  DashboardsPageComponent,
  DashboardViewComponent,
  InsightDashboardSettingsComponent, SurveyConfigurationDeleteComponent,
  SurveyConfigurationEditComponent,
  SurveyConfigurationNewComponent,
  SurveyConfigurationsPageComponent, SurveyConfigurationStatusComponent
} from './components';
import {DashboardEditConfigurationComponent} from './components/dashboards/dashboard-edit-configuration/dashboard-edit-configuration.component';

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
    CasesModule
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
    DashboardEditConfigurationComponent,
    SurveyConfigurationDeleteComponent,
    DashboardDeleteComponent,
    DashboardCopyComponent
  ],
  providers: [InsightDashboardPnSettingsService, InsightDashboardPnDashboards, InsightDashboardPnSurveyConfigs]
})

export class InsightDashboardPnModule {
}
