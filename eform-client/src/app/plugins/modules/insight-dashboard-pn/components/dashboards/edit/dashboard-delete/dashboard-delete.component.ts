import {
  Component,
  EventEmitter,
  inject,
  OnInit
} from '@angular/core';
import {DashboardModel} from '../../../../models';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-delete',
  templateUrl: './dashboard-delete.component.html',
  styleUrls: ['./dashboard-delete.component.scss'],
  standalone: false,
})
export class DashboardDeleteComponent implements OnInit {
  private dashboardService = inject(InsightDashboardPnDashboardsService);
  public dialogRef = inject(MatDialogRef<DashboardDeleteComponent>);
  public dashboard = inject<DashboardModel>(MAT_DIALOG_DATA);

  dashboardDeleted: EventEmitter<void> = new EventEmitter<void>();

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
