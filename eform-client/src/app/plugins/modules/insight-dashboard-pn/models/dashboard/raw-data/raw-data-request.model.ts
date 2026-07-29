export class RawDataRequestModel {
  dashboardId: number;
  dashboardItemId: number;
  pageSize = 25;
  offset = 0;
  sort = 'finishedAt';
  isSortDsc = true;
}

export class RawDataExportRequestModel {
  dashboardId: number;
  dashboardItemId: number;
}
