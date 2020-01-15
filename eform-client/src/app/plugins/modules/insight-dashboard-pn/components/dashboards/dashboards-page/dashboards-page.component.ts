import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {SharedPnService} from '../../../../shared/services';
import {DashboardModel, DashboardsListModel} from '../../../models';
import {DashboardsRequestModel} from '../../../models/dashboard/dashboards-request.model';
import {Subject, Subscription} from 'rxjs';
import {DashboardSortColumns, insightDashboardPnSettings} from '../../../const';
import {DashboardCopyComponent, DashboardDeleteComponent, DashboardEditComponent, DashboardNewComponent} from '../..';
import {
  InsightDashboardPnDashboardsService,
  InsightDashboardPnLocationsService,
  InsightDashboardPnSurveyConfigsService
} from '../../../services';
import {CommonDictionaryModel} from '../../../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-insight-dashboard-dashboards',
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.scss']
})
export class DashboardsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newDashboardModal') newDashboardModal: DashboardNewComponent;
  @ViewChild('copyDashboardModal') copyDashboardModal: DashboardCopyComponent;
  @ViewChild('editDashboardModal') editDashboardModal: DashboardEditComponent;
  @ViewChild('deleteDashboardModal') deleteDashboardModal: DashboardDeleteComponent;
  dashboardsListModel: DashboardsListModel = new DashboardsListModel();
  dashboardsRequestModel: DashboardsRequestModel = new DashboardsRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus = false;
  searchSubject = new Subject();
  availableSurveys: CommonDictionaryModel[] = [];
  availableTags: CommonDictionaryModel[] = [];
  getAllSub$: Subscription;
  getSurveysSub$: Subscription;
  getTagsSub$: Subscription;

  get sortCols() {
    return DashboardSortColumns;
  }

  constructor(private sharedPnService: SharedPnService,
              private dashboardService: InsightDashboardPnDashboardsService,
              private surveyConfigsService: InsightDashboardPnSurveyConfigsService,
              private locationsService: InsightDashboardPnLocationsService) {
  }

  ngOnInit() {
    this.getLocalPageSettings();
    // this.getSurveys();
    this.dashboardsListModel = {
      total: 1,
      dashboardList: [
        {id: 1, locationName: 'My funny location', surveyName: 'My funny survey', dashboardName: 'Top dashboard'}
      ]
    };
  }

  getDashboardsList() {
    this.spinnerStatus = true;
    this.dashboardsRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.dashboardsRequestModel.sort = this.localPageSettings.sort;
    this.dashboardsRequestModel.pageSize = this.localPageSettings.pageSize;

    this.getAllSub$ = this.dashboardService.getAll(this.dashboardsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.dashboardsListModel = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  getSurveys() {
    this.spinnerStatus = true;
    this.getSurveysSub$ = this.surveyConfigsService.getAvailableSurveys().subscribe((data) => {
      if (data && data.success) {
        this.availableSurveys = data.model;
      }
      this.spinnerStatus = false;
    });
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
    // TODO: UNCOMMENT
    // this.getDashboardsList();
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

  openCopyModal(model: DashboardModel) {
    this.copyDashboardModal.show(model);
  }

  openDeleteModal(model: DashboardModel) {
    this.deleteDashboardModal.show(model);
  }

  getLocationTags(surveyId: number) {
    this.spinnerStatus = true;
    this.getTagsSub$ = this.locationsService.getAll(surveyId).subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  ngOnDestroy(): void {
  }
}
