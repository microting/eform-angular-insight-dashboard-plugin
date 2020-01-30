import {DashboardItemModel} from './dashboard-item.model';

export class DashboardEditModel {
  id: number;
  dashboardName: string;
  surveyId: number;
  surveyName: string;
  locationName: string;
  locationId: number;
  tagName: string;
  tagId: number;
  items: DashboardItemModel[] = [];
}
