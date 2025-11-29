import {
  Component,
  EventEmitter,
  inject,
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
  private dashboardService = inject(InsightDashboardPnDashboardsService);
  public dialogRef = inject(MatDialogRef<DashboardCopyComponent>);
  public dashboard = inject<DashboardModel>(MAT_DIALOG_DATA);

  dashboardCopied: EventEmitter<void> = new EventEmitter<void>();

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
