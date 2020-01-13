import {Component, OnInit, ViewChild} from '@angular/core';
import {SurveyConfigsListModel} from '../../../models';
import {insightDashboardPnSettings, InstallationTypeEnum, SurveyConfigsSortColumns} from '../../../const';
import {SurveyConfigModel} from '../../../models/survey-config.model';
import {SurveyConfigsRequestModel} from '../../../models/survey-configs-request.model';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {SharedPnService} from '../../../../shared/services';
import {SurveyConfigurationEditComponent, SurveyConfigurationNewComponent} from '../..';
import {SurveyConfigurationStatusComponent} from '../survey-configuration-activate/survey-configuration-status.component';
import {SurveyConfigurationDeleteComponent} from '../survey-configuration-delete/survey-configuration-delete.component';

@Component({
  selector: 'app-insight-dashboard-surveys',
  templateUrl: './survey-configurations-page.component.html',
  styleUrls: ['./survey-configurations-page.component.scss']
})
export class SurveyConfigurationsPageComponent implements OnInit {
  @ViewChild('newSurveyConfigModal') newSurveyConfigModal: SurveyConfigurationNewComponent;
  @ViewChild('editSurveyConfigModal') editSurveyConfigModal: SurveyConfigurationEditComponent;
  @ViewChild('statusSurveyConfigModal') statusSurveyConfigModal: SurveyConfigurationStatusComponent;
  @ViewChild('deleteSurveyConfigModal') deleteSurveyConfigModal: SurveyConfigurationDeleteComponent;
  surveyConfigurationsListModel: SurveyConfigsListModel = new SurveyConfigsListModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  surveyConfigurationsRequestModel: SurveyConfigsRequestModel = new SurveyConfigsRequestModel();
  spinnerStatus = false;
  searchSubject = new Subject();

  get sortCols() {
    return SurveyConfigsSortColumns;
  }

  constructor(private sharedPnService: SharedPnService) {
    this.searchSubject.pipe(
      debounceTime(500)
    ). subscribe(val => {
      this.surveyConfigurationsRequestModel.searchString =  val.toString();
      this.getSurveyConfigsList();
    });
  }

  ngOnInit() {
    this.getLocalPageSettings();

    this.surveyConfigurationsListModel = {
      total: 1,
      surveyList: [
        {id: 1, locationName: 'My funny location', name: 'My funny survey'}
      ]
    };
  }

  getSurveyConfigsList() {
    // this.spinnerStatus = true;
    // this.installationsRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    // this.installationsRequestModel.sort = this.localPageSettings.sort;
    // this.installationsRequestModel.pageSize = this.localPageSettings.pageSize;
    // this.installationsRequestModel.type = InstallationTypeEnum.Installation;
    //
    // this.installationsService.getList(this.installationsRequestModel).subscribe((data) => {
    //   if (data && data.success) {
    //     this.installationsListModel = data.model;
    //   }
    //   this.spinnerStatus = false;
    // });
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService
      .getLocalPageSettings(insightDashboardPnSettings, 'SurveyConfigs')
      .settings;
    this.getSurveyConfigsList();
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
      this.surveyConfigurationsRequestModel.offset = e;
      this.getSurveyConfigsList();
    }
  }

  onSearchInputChanged(e: any) {
    this.searchSubject.next(e.target.value);
  }

  getSortIcon(sort: string): string {
    if (this.surveyConfigurationsRequestModel.sort === sort) {
      return this.surveyConfigurationsRequestModel.isSortDsc ? 'expand_more' : 'expand_less';
    } else {
      return 'unfold_more';
    }
  }

  openEditModal(surveyConfig: SurveyConfigModel) {
    this.editSurveyConfigModal.show(surveyConfig);
  }

  openDeleteModal(surveyConfig: SurveyConfigModel) {
    this.deleteSurveyConfigModal.show(surveyConfig);
  }

  openCreateModal() {
    this.newSurveyConfigModal.show();
  }

  openStatusModal() {
    this.statusSurveyConfigModal.show();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      insightDashboardPnSettings,
      this.localPageSettings,
      'SurveyConfigs'
    );
    this.getSurveyConfigsList();
  }

  onSurveyConfigStatusChanged($event: boolean) {

  }
}
