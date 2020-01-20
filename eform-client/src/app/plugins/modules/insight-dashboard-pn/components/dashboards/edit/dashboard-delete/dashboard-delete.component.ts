import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DashboardModel} from '../../../../models';
import {InsightDashboardPnDashboardsService} from '../../../../services';

@Component({
  selector: 'app-dashboard-delete',
  templateUrl: './dashboard-delete.component.html',
  styleUrls: ['./dashboard-delete.component.scss']
})
export class DashboardDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() dashboardDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  dashboard: DashboardModel = new DashboardModel();

  constructor(private dashboardService: InsightDashboardPnDashboardsService) { }

  show(model: DashboardModel) {
    this.dashboard = model;
    this.frame.show();
  }

  ngOnInit() {
  }

  deleteDashboard() {
    this.spinnerStatus = true;
    this.dashboardService.remove(this.dashboard.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.dashboardDeleted.emit();
        }
        this.spinnerStatus = false;
      });
  }
}
