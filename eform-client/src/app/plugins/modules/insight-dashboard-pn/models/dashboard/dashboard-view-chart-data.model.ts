export class DashboardViewChartDataModel {
  single: DashboardViewChartDataSingleModel[];
  multi: DashboardViewChartDataMultiModel[];
  multiStacked: DashboardViewChartDataMultiStackedModel[];
}

export class DashboardViewChartDataSingleModel {
  name: string;
  value: number;
}

export class DashboardViewChartDataMultiModel {
  name: string;
  series: DashboardViewChartDataSingleModel[];
}

export class DashboardViewChartDataMultiStackedModel {
  name: string;
  series: DashboardViewChartDataMultiModel[];
}
