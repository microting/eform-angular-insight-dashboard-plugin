import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {SharedPnService} from '../../../../shared/services';
import {DashboardModel, DashboardsListModel} from '../../../models';
import {DashboardsRequestModel} from '../../../models/dashboard/dashboards-request.model';
import {Subject} from 'rxjs';
import {DashboardSortColumns, insightDashboardPnSettings, SurveyConfigsSortColumns} from '../../../const';
import {DashboardCopyComponent, DashboardDeleteComponent, DashboardEditComponent, DashboardNewComponent} from '../..';

@Component({
  selector: 'app-insight-dashboard-dashboards',
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.scss']
})
export class DashboardsPageComponent implements OnInit {
  @ViewChild('newDashboardModal') newDashboardModal: DashboardNewComponent;
  @ViewChild('copyDashboardModal') copyDashboardModal: DashboardCopyComponent;
  @ViewChild('editDashboardModal') editDashboardModal: DashboardEditComponent;
  @ViewChild('deleteDashboardModal') deleteDashboardModal: DashboardDeleteComponent;
  dashboardsListModel: DashboardsListModel = new DashboardsListModel();
  dashboardsRequestModel: DashboardsRequestModel = new DashboardsRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus = false;
  searchSubject = new Subject();

  get sortCols() {
    return DashboardSortColumns;
  }

  constructor(private sharedPnService: SharedPnService) { }

  ngOnInit() {
    this.getLocalPageSettings();

    this.dashboardsListModel = {
      total: 1,
      dashboardList: [
        {id: 1, locationName: 'My funny location', surveyName: 'My funny survey', dashboardName: 'Top dashboard'}
      ]
    };
  }

  getDashboardsList() {

  }


  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.dashboardsRequestModel.offset = e;
      this.getDashboardsList();
    }
  }

  onSearchInputChanged(e: any) {
    this.searchSubject.next(e.target.value);
  }

  getSortIcon(sort: string): string {
    if (this.dashboardsRequestModel.sort === sort) {
      return this.dashboardsRequestModel.isSortDsc ? 'expand_more' : 'expand_less';
    } else {
      return 'unfold_more';
    }
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService
      .getLocalPageSettings(insightDashboardPnSettings, 'Dashboards')
      .settings;
    this.getDashboardsList();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      insightDashboardPnSettings,
      this.localPageSettings,
      'Dashboards'
    );
    this.getDashboardsList();
  }


  openCreateModal() {
    this.newDashboardModal.show();
  }

  openEditPage(dashboard: DashboardModel) {

  }

  openViewPage(dashboard: DashboardModel) {

  }

  openCopyModal() {
    this.copyDashboardModal.show();
  }

  openDeleteModal(dashboard: DashboardModel) {
    this.deleteDashboardModal.show();
  }
}
