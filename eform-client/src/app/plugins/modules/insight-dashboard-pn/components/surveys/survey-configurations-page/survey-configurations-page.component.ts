import {Component, inject, OnDestroy, OnInit,} from '@angular/core';
import {SurveyConfigsListModel, SurveyConfigModel} from '../../../models';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {
  SurveyConfigurationDeleteComponent,
  SurveyConfigurationEditComponent,
  SurveyConfigurationNewComponent,
  SurveyConfigurationStatusComponent,
} from '../..';
import {
  InsightDashboardPnDashboardDictionariesService,
  InsightDashboardPnSurveyConfigsService,
} from '../../../services';
import {
  CommonDictionaryModel, PaginationModel,
} from 'src/app/common/models';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {SitesService} from 'src/app/common/services';
import {SurveysStateService} from '../store/surveys-state.service';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {
  selectSurveysFiltersName,
  selectSurveysPaginationAsPaginationModel,
  selectSurveysPaginationIsSortDsc,
  selectSurveysPaginationSort
} from '../../../state/surveys/surveys.selector';
import {Store} from '@ngrx/store';

@AutoUnsubscribe()
@Component({
  selector: 'app-insight-dashboard-surveys',
  templateUrl: './survey-configurations-page.component.html',
  styleUrls: ['./survey-configurations-page.component.scss'],
})
export class SurveyConfigurationsPageComponent implements OnInit, OnDestroy {
  private surveyConfigsService = inject(InsightDashboardPnSurveyConfigsService);
  private dictionariesService = inject(InsightDashboardPnDashboardDictionariesService);
  private sitesService = inject(SitesService);
  public surveysStateService = inject(SurveysStateService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private store = inject(Store);

  surveyConfigurationsListModel: SurveyConfigsListModel = new SurveyConfigsListModel();
  availableSurveys: CommonDictionaryModel[] = [];
  locations: CommonDictionaryModel[] = [];
  searchSubject = new Subject();

  getSurveyConfigsSub$: Subscription;
  getSurveysSub$: Subscription;
  getLocationsSub$: Subscription;
  surveyConfigurationDeleteComponentAfterClosedSub$: Subscription;
  surveyConfigurationEditComponentAfterClosedSub$: Subscription;
  surveyConfigurationNewComponentAfterClosedSub$: Subscription;
  surveyConfigurationStatusComponentAfterClosedSub$: Subscription;
  public selectDashboardsPaginationIsSortDsc$ = this.store.select(selectSurveysPaginationIsSortDsc);
  public selectDashboardsPaginationSort$ = this.store.select(selectSurveysPaginationSort);
  public selectDashboardsPaginationAsPaginationModel$ = this.store.select(selectSurveysPaginationAsPaginationModel);
  public selectDashboardsFiltersName$ = this.store.select(selectSurveysFiltersName);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Survey Name'), sortProp: {id: 'SurveyName'}, field: 'surveyName', sortable: true},
    {
      header: this.translateService.stream('Location Name'),
      field: 'locations',
      sortable: true,
      sortProp: {id: 'LocationName'},
      // @ts-ignore
      formatter: (surveyConfig: SurveyConfigModel) => surveyConfig.locations.map(location => `<p class="m-1">${location.name}</p>`).toString().replaceAll(',', '')
    },
    {
      header: this.translateService.stream('Actions'),
      field: 'actions',
      width: '160px',
      pinned: 'right',
    },
  ];

  constructor() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.surveysStateService.updateNameFilter(val);
      this.getSurveyConfigsList();
    });
  }

  ngOnInit() {
    this.getSurveyConfigsList();
    this.getLocations();
    this.getSurveys();
  }

  getSurveyConfigsList() {
    this.getSurveyConfigsSub$ = this.surveysStateService
      .getAll()
      .subscribe((data) => {
        if (data && data.success) {
          this.surveyConfigurationsListModel = data.model;
        }
      });
  }

  getSurveys() {
    this.getSurveysSub$ = this.dictionariesService
      .getSurveys()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableSurveys = data.model;
        }
      });
  }

  getLocations() {
    this.getLocationsSub$ = this.sitesService
      .getAllSitesDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.locations = data.model;
        }
      });
  }


  sortTable(sort: Sort) {
    this.surveysStateService.onSortTable(sort.active);
    this.getSurveyConfigsList();
  }

  onSearchInputChanged(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

  openEditModal(surveyConfig: SurveyConfigModel) {
    this.surveyConfigurationEditComponentAfterClosedSub$ = this.dialog.open(SurveyConfigurationEditComponent,
      dialogConfigHelper(this.overlay, {surveyConfig, locations: this.locations, surveys: this.availableSurveys}))
      .afterClosed().subscribe(data => data ? this.getSurveyConfigsList() : undefined);
  }

  openDeleteModal(surveyConfig: SurveyConfigModel) {
    this.surveyConfigurationDeleteComponentAfterClosedSub$ = this.dialog.open(SurveyConfigurationDeleteComponent,
      dialogConfigHelper(this.overlay, surveyConfig))
      .afterClosed().subscribe(data => data ? this.surveyConfigDeleted() : undefined);
  }

  openCreateModal() {
    this.surveyConfigurationNewComponentAfterClosedSub$ = this.dialog.open(SurveyConfigurationNewComponent,
      dialogConfigHelper(this.overlay, {locations: this.locations, surveys: this.availableSurveys}))
      .afterClosed().subscribe(data => data ? this.getSurveyConfigsList() : undefined);
  }

  openStatusModal(surveyConfig: SurveyConfigModel) {
    this.surveyConfigurationStatusComponentAfterClosedSub$ = this.dialog.open(SurveyConfigurationStatusComponent,
      dialogConfigHelper(this.overlay, surveyConfig))
      .afterClosed().subscribe(data => data ? this.getSurveyConfigsList() : undefined);
  }

  ngOnDestroy(): void {
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.surveysStateService.updatePagination(paginationModel);
    this.getSurveyConfigsList();
  }

  surveyConfigDeleted() {
    this.getSurveyConfigsList();
  }
}
