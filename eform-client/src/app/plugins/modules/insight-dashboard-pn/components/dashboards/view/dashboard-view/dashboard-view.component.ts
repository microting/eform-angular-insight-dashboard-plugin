import {Component, OnDestroy, OnInit} from '@angular/core';
import html2canvas from 'html2canvas';
import {convertInlineStyleSVG} from '../../../../helpers/chart-svg.helper';
import {DashboardChartTypesEnum} from '../../../../const/enums';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {DashboardViewModel} from '../../../../models';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  spinnerStatus = false;
  selectedDashboardId: number;
  getDashboardSub$: Subscription;
  dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  constructor(private dashboardsService: InsightDashboardPnDashboardsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedDashboardId = params['dashboardId'];
      // TODO: Uncomment
      // this.getDashboardForView(this.selectedDashboardId);
    });
  }

  getDashboardForView(dashboardId: number) {
    this.getDashboardSub$ = this.dashboardsService.getSingleForView(dashboardId)
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardViewModel = data.model;
        }
        this.spinnerStatus = false;
      });
  }

  ngOnDestroy(): void {
  }
}
