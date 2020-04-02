import {Component, Input, OnInit} from '@angular/core';
import {DashboardViewItemModel} from '../../../../models/dashboard/dashboard-view/dashboard-view-item.model';

@Component({
  selector: 'app-dashboard-chart-data-view',
  templateUrl: './dashboard-chart-data-view.component.html',
  styleUrls: ['./dashboard-chart-data-view.component.scss']
})
export class DashboardChartDataViewComponent implements OnInit {
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  constructor() { }

  ngOnInit() {
  }

}
