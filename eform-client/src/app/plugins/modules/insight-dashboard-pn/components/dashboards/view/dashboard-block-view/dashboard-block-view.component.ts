import {Component, Input, OnInit} from '@angular/core';
import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../../../const/enums';
import {DashboardViewItemModel} from '../../../../models/dashboard/dashboard-view-item.model';

@Component({
  selector: 'app-dashboard-block-view',
  templateUrl: './dashboard-block-view.component.html',
  styleUrls: ['./dashboard-block-view.component.scss']
})
export class DashboardBlockViewComponent implements OnInit {
  @Input() position: number;
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();

  get chartTypes() { return DashboardChartTypesEnum; }
  get periodUnits() { return DashboardPeriodUnitsEnum; }


  constructor() { }

  ngOnInit() {
  }

}
