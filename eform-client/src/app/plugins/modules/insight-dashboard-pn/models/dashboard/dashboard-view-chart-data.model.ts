export class DashboardViewChartDataModel {
  single: DashboardViewChartDataSingleModel[];
  multi: DashboardViewChartDataMultiModel[];
}

export class DashboardViewChartDataSingleModel {
  name: string;
  value: number;
}

export class DashboardViewChartDataMultiModel {
  name: string;
  series: DashboardViewChartDataSingleModel[];
}
