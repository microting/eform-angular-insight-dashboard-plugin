import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DashboardChartTypes} from '../../../../const/enums';

@Component({
  selector: 'app-dashboard-block-edit',
  templateUrl: './dashboard-block-edit.component.html',
  styleUrls: ['./dashboard-block-edit.component.scss']
})
export class DashboardBlockEditComponent implements OnInit {
  @Output() addNewBlock: EventEmitter<void> = new EventEmitter<void>();
  @Output() copyBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteBlock: EventEmitter<any> = new EventEmitter<any>();
  isCollapsed = true;
  selectedChartType: DashboardChartTypes = 1;
  chartSelectValues = [
    {id: DashboardChartTypes.Line, value: 'Line'},
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

  addNew() {
    this.addNewBlock.emit();
  }

  copy() {
    this.copyBlock.emit();
  }

  delete() {
    this.deleteBlock.emit();
  }
}
