import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'port/angular-bootstrap-md';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedPnModule } from '../shared/shared-pn.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EformSharedModule } from '../../../common/modules/eform-shared/eform-shared.module';
import {InsightDashboardPnLayoutComponent} from './layouts';

import {InsightDashboardPnRoutingModule} from './insight-dashboard-pn-routing.module';
import {CasesModule} from '../../../modules';
import {InsightDashboardPnSettingsService, InsightDashboardService} from './services';
import {
  InstallationAssignComponent,
  InstallationCheckingSettingsComponent,
  InstallationNewComponent,
  InstallationRetractComponent,
  InstallationsPageComponent,
  RemovalPageComponent
} from './components';

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
    InstallationCheckingSettingsComponent,
    InstallationAssignComponent,
    InstallationNewComponent,
    InstallationRetractComponent,
    InstallationsPageComponent,
    RemovalPageComponent
  ],
  providers: [InsightDashboardPnSettingsService, InsightDashboardService]
})

export class InsightDashboardPnModule { }
