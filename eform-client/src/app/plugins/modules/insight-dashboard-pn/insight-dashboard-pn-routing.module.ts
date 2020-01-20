import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InsightDashboardPnLayoutComponent} from './layouts';
import {AdminGuard, AuthGuard} from '../../../common/guards';
import {
  DashboardEditComponent,
  DashboardsPageComponent,
  DashboardViewComponent,
  InsightDashboardSettingsComponent,
  SurveyConfigurationsPageComponent
} from './components';

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
        path: 'dashboard/:dashboardId',
        canActivate: [AuthGuard],
        component: DashboardViewComponent
      },
      {
        path: 'dashboard/edit/:dashboardId',
        canActivate: [AuthGuard],
        component: DashboardEditComponent
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
