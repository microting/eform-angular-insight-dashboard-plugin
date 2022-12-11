import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {DashboardModel} from '../../../../models';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-copy',
  templateUrl: './dashboard-copy.component.html',
  styleUrls: ['./dashboard-copy.component.scss'],
})
export class DashboardCopyComponent implements OnInit {
  dashboardCopied: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dashboardService: InsightDashboardPnDashboardsService,
    public dialogRef: MatDialogRef<DashboardCopyComponent>,
    @Inject(MAT_DIALOG_DATA) public dashboard: DashboardModel = new DashboardModel(),
  ) {
  }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  copyDashboard() {
    this.dashboardService.copy(this.dashboard.id).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
        this.dashboardCopied.emit();
      }
    });
  }
}
