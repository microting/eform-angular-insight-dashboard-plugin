import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {DashboardEditModel} from '../../../../models/dashboard/dashboard-edit.model';
import {ActivatedRoute, Router} from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-edit-configuration',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss']
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  updateDashboardSub$: Subscription;
  getDashboardSub$: Subscription;
  dashboardEditModel: DashboardEditModel = new DashboardEditModel();
  selectedDashboardId: number;
  spinnerStatus = false;

  constructor(private dashboardsService: InsightDashboardPnDashboardsService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedDashboardId = params['dashboardId'];
      // TODO: Uncomment
      // this.getDashboardForEdit(this.selectedDashboardId);
    });
  }

  updateDashboard() {
    // TODO: Real model
    this.spinnerStatus = true;
    const model = new DashboardEditModel();
    model.id = 1;
    this.updateDashboardSub$ = this.dashboardsService.update(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['../../', model.id]).then();
        }
        this.spinnerStatus = false;
      });
  }

  getDashboardForEdit(dashboardId: number) {
    this.getDashboardSub$ = this.dashboardsService.getSingleForEdit(dashboardId)
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardEditModel = data.model;
        }
        this.spinnerStatus = false;
      });
  }

  onAddNewBlock() {
    // TODO: Make logic
  }

  onCopyBlock() {
    // TODO: Make logic
  }

  onDeleteBlock() {
    // TODO: Make logic
  }

  ngOnDestroy(): void {
  }
}
