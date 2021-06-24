import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DashboardViewItemModel } from '../../../../models/dashboard/dashboard-view/dashboard-view-item.model';
import { DashboardChartTypesEnum } from 'src/app/plugins/modules/insight-dashboard-pn/const';
import { AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-chart-data-view',
  templateUrl: './dashboard-chart-data-view.component.html',
  styleUrls: ['./dashboard-chart-data-view.component.scss'],
})
export class DashboardChartDataViewComponent implements OnInit, OnDestroy {
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  darkTHeme: boolean;
  getDarkThemeSub$: Subscription;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  constructor(authStateService: AuthStateService) {
    this.getDarkThemeSub$ = authStateService.isDarkThemeAsync.subscribe(
      (isDarkTheme) => {
        this.darkTHeme = isDarkTheme;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {}
}
