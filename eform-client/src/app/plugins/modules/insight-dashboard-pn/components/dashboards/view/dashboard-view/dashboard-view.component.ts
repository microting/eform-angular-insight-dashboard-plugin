import {Component, OnDestroy, OnInit} from '@angular/core';
import html2canvas from 'html2canvas';
import {convertInlineStyleSVG} from '../../../../helpers/chart-svg.helper';
import {DashboardChartTypes} from '../../../../const/enums';
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

  printDiv() {
    html2canvas(document.getElementById('copyableChart'), {
      logging: false,
      scale: 3,
      onclone: clonedDoc => {
        convertInlineStyleSVG(clonedDoc, 0, DashboardChartTypes.VerticalBarGrouped);
      }
    }).then(canvas => {
      const myImage = canvas.toDataURL('image/png', 1.0);
      this.downloadURI(myImage, 'MaSimulation.png');
    });
  }

  downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    // after creating link you should delete dynamic link
    // clearDynamicLink(link);
  }

  ngOnDestroy(): void {
  }
}
