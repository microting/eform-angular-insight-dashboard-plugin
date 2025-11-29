import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DashboardViewItemModel} from '../../../../models';
import { DashboardChartTypesEnum } from '../../../../const';
import { AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {Store} from '@ngrx/store';
import {selectIsDarkMode} from 'src/app/state/auth/auth.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-chart-data-view',
  templateUrl: './dashboard-chart-data-view.component.html',
  styleUrls: ['./dashboard-chart-data-view.component.scss'],
})
export class DashboardChartDataViewComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  darkTheme: boolean;
  getDarkThemeSub$: Subscription;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  constructor() {
    this.getDarkThemeSub$ = this.store.select(selectIsDarkMode).subscribe(
      (isDarkTheme) => {
        this.darkTheme = isDarkTheme;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {}
}
