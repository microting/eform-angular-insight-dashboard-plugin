import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InsightDashboardPnLayoutComponent} from './layouts';
import {AdminGuard, AuthGuard, PermissionGuard} from '../../../common/guards';
import {DashboardsPageComponent, InsightDashboardSettingsComponent, SurveyConfigurationsPageComponent} from './components';
import {InsightDashboardPnClaims} from './const';

export const routes: Routes = [
  {
    path: '',
    component: InsightDashboardPnLayoutComponent,
    // TODO: Add permissions
    // canActivate: [PermissionGuard],
    // data: {requiredPermission: InsightDashboardPnClaims.accessInsightDashboardPlugin},
    children: [
      {
        path: 'dashboards',
        canActivate: [AuthGuard],
        component: DashboardsPageComponent
      },
      {
        path: 'surveys',
        canActivate: [AuthGuard],
        component: SurveyConfigurationsPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: InsightDashboardSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsightDashboardPnRoutingModule {
}
