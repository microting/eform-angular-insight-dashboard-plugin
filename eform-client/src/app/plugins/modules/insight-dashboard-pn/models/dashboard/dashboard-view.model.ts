import {DashboardViewItemModel} from './dashboard-view-item.model';

export class DashboardViewModel {
  id: number;
  dashboardName: string;
  surveyName: string;
  surveyId: number;
  locationName: string;
  locationId: number | null;
  tagName: string;
  tagId: number | null;
  items: DashboardViewItemModel[];
}
