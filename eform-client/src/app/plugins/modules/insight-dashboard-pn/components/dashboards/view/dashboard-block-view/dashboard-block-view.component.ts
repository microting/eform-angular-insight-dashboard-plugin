import { Component, OnInit } from '@angular/core';
import {DashboardChartTypes} from '../../../../const/enums';

@Component({
  selector: 'app-dashboard-block-view',
  templateUrl: './dashboard-block-view.component.html',
  styleUrls: ['./dashboard-block-view.component.scss']
})
export class DashboardBlockViewComponent implements OnInit {
  selectedChartType = DashboardChartTypes.HorizontalBar;
  constructor() { }

  ngOnInit() {
  }

}
