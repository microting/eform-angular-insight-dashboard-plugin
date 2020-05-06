import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum} from '../../../../const/enums';
import {DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from 'src/app/common/models';
import {
  line,
  lineSmiley, multi,
  multiSmiley, multiStacked, multiStackedSmiley, single, singleSmiley
} from './chart-data';
import {DashboardChartDataModel} from 'src/app/plugins/modules/insight-dashboard-pn/models/dashboard/dashboard-chart-data.model';

@Component({
  selector: 'app-dashboard-chart-edit',
  templateUrl: './dashboard-chart-edit.component.html',
  styleUrls: ['./dashboard-chart-edit.component.scss']
})
export class DashboardChartEditComponent implements OnChanges {
  @Input() chartPosition: number;
  @Input() questionType: DashboardItemQuestionTypesEnum;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() dashboardItemChartData: DashboardChartDataModel;
  @Input() answers: CommonDictionaryModel[] = [];
  @Input() chartGeneratedPreviewData: DashboardChartDataModel;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  line: any[];
  multi: any[];
  multiStacked: any[];
  pie: any[];
  view: any[] = [800, 400];
  multiChartView: any[] = [800, 400];

  colorScheme = {
    domain: ['#9c27b0', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#9e9e9e']
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  showGridLines = true;
  barPadding = 8;
  roundDomains = false;
  animations = true;
  showDataLabel = false;
  noBarWhenZero = true;
  barWidth = 7;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;

  customColors = [
    {
      name: 'Meget glad',
      value: '#007E33'
    },
    {
      name: 'Glad',
      value: '#00C851'
    },
    {
      name: 'Neutral',
      value: '#ffbb33'
    },
    {
      name: 'Sur',
      value: '#ff4444'
    },
    {
      name: 'Meget sur',
      value: '#CC0000'
    },
    {
      name: 'Ved ikke',
      value: '#0099CC'
    }
  ];

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.questionType) {
      const currentValue = changes.questionType.currentValue as DashboardItemQuestionTypesEnum;
        if (currentValue === DashboardItemQuestionTypesEnum.Smiley) {
          Object.assign(this, {line: lineSmiley});
          Object.assign(this, {multi: multiSmiley});
          Object.assign(this, {pie: singleSmiley});
          Object.assign(this, {multiStacked: multiStackedSmiley});
        } else {
          Object.assign(this, {line: line});
          Object.assign(this, {multi});
          Object.assign(this, {pie: single});
          Object.assign(this, {multiStacked: multiStacked});
        }
    }
  }
}
