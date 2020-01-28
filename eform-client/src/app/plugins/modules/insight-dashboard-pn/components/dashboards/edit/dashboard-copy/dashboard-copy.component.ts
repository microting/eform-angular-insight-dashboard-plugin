import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {DashboardModel} from '../../../../models';

@Component({
  selector: 'app-dashboard-copy',
  templateUrl: './dashboard-copy.component.html',
  styleUrls: ['./dashboard-copy.component.scss']
})
export class DashboardCopyComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() dashboardCopied: EventEmitter<void> = new EventEmitter<void>()
  spinnerStatus = false;
  dashboard: DashboardModel = new DashboardModel();

  constructor(private dashboardService: InsightDashboardPnDashboardsService) { }

  show(model: DashboardModel) {
    this.dashboard = model;
    this.frame.show();
  }

  ngOnInit() {
  }

  copyDashboard() {
    this.spinnerStatus = true;
    this.dashboardService.copy(this.dashboard.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.dashboardCopied.emit();
        }
        this.spinnerStatus = false;
      });
  }
}
