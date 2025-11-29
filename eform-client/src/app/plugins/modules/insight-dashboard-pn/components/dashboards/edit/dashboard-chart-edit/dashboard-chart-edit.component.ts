import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  DashboardChartTypesEnum,
  DashboardItemQuestionTypesEnum,
  DashboardPeriodUnitsEnum,
} from '../../../../const/enums';
import { DashboardItemModel, DashboardChartDataModel} from '../../../../models';
import { CommonDictionaryModel } from 'src/app/common/models';
import { getChartData } from '../../../../helpers/preview-values-generator.helper';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-dashboard-chart-edit',
  templateUrl: './dashboard-chart-edit.component.html',
  styleUrls: ['./dashboard-chart-edit.component.scss'],
})
export class DashboardChartEditComponent implements OnChanges {
  public authStateService = inject(AuthStateService);

  @Input() chartPosition: number;
  @Input() questionType: DashboardItemQuestionTypesEnum;
  @Input() period: number;
  @Input() chartType: number;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() answers: CommonDictionaryModel[] = [];
  @Input() chartGeneratedPreviewData: DashboardChartDataModel;
  chartData: any[];
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
      value: '#007E33',
    },
    {
      name: 'Glad',
      value: '#00C851',
    },
    {
      name: 'Neutral',
      value: '#ffbb33',
    },
    {
      name: 'Sur',
      value: '#ff4444',
    },
    {
      name: 'Meget sur',
      value: '#CC0000',
    },
    {
      name: 'Ved ikke',
      value: '#0099CC',
    },
  ];

  constructor(public authStateService: AuthStateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.questionType) {
        this.chartData = [];
        const currentValue = changes.questionType
          .currentValue as DashboardItemQuestionTypesEnum;
        this.chartData = [
          ...getChartData(
            currentValue,
            this.period,
            this.dashboardItem.chartType
          ),
        ];
      }
      if (changes.period) {
        this.chartData = [];
        const currentValue = changes.period
          .currentValue as DashboardPeriodUnitsEnum;
        this.chartData = [
          ...getChartData(
            this.questionType,
            currentValue,
            this.dashboardItem.chartType
          ),
        ];
      }
      if (changes.chartType) {
        this.chartData = [];
        const currentValue = changes.chartType
          .currentValue as DashboardChartTypesEnum;
        this.chartData = [
          ...getChartData(this.questionType, this.period, currentValue),
        ];
      }
    }
  }
}
