import {
  Component,
  EventEmitter,
  Inject,
  OnInit
} from '@angular/core';
import {DashboardModel} from '../../../../models';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-delete',
  templateUrl: './dashboard-delete.component.html',
  styleUrls: ['./dashboard-delete.component.scss'],
})
export class DashboardDeleteComponent implements OnInit {
  dashboardDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dashboardService: InsightDashboardPnDashboardsService,
    public dialogRef: MatDialogRef<DashboardDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dashboard: DashboardModel = new DashboardModel(),
  ) {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnInit() {
  }

  deleteDashboard() {
    this.dashboardService.remove(this.dashboard.id).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
        this.dashboardDeleted.emit();
      }
    });
  }
}
