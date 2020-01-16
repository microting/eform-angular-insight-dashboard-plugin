import {Component, OnInit} from '@angular/core';
import {DashboardChartTypes} from '../../../const/enums';

@Component({
  selector: 'app-dashboard-block',
  templateUrl: './dashboard-block.component.html',
  styleUrls: ['./dashboard-block.component.scss']
})
export class DashboardBlockComponent implements OnInit {
  isCollapsed = true;
  selectedChartType: DashboardChartTypes = 1;
  chartSelectValues = [{id: DashboardChartTypes.Line, value: 'Line'},
    {id: DashboardChartTypes.Pie, value: 'Pie'},
    {id: DashboardChartTypes.HorizontalBar, value: 'Horizontal Bar'},
    {id: DashboardChartTypes.HorizontalBarStacked, value: 'Stacked Horizontal Bar'},
    {id: DashboardChartTypes.HorizontalBarGrouped, value: 'Grouped Horizontal Bar'},
    {id: DashboardChartTypes.VerticalBar, value: 'Vertical Bar'},
    {id: DashboardChartTypes.VerticalBarStacked, value: 'Stacked Vertical Bar'},
    {id: DashboardChartTypes.VerticalBarGrouped, value: 'Grouped Vertical Bar'}];

  get chartTypes() {
    return DashboardChartTypes;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
