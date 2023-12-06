import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardModel, DashboardsListModel,} from '../../../models';
import {Subject, Subscription} from 'rxjs';
import {
  DashboardCopyComponent,
  DashboardDeleteComponent,
  DashboardNewComponent,
} from '../..';
import {InsightDashboardPnDashboardDictionariesService} from '../../../services';
import {
  CommonDictionaryModel, PaginationModel,
} from 'src/app/common/models';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {DashboardsStateService} from '../store/dashboards-state.service';
import {
  selectDashboardsFiltersName,
  selectDashboardsPaginationAsPaginationModel,
  selectDashboardsPaginationIsSortDsc,
  selectDashboardsPaginationSort
} from '../../../state/dashboards/dashboards.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-insight-dashboard-dashboards',
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.scss'],
})
export class DashboardsPageComponent implements OnInit, OnDestroy {
  dashboardsListModel: DashboardsListModel = new DashboardsListModel();
  searchSubject = new Subject();
  availableSurveys: CommonDictionaryModel[] = [];

  getAllSub$: Subscription;
  getSurveysSub$: Subscription;
  dashboardCopyComponentAfterClosedSub$: Subscription;
  dashboardDeleteComponentAfterClosedSub$: Subscription;
  dashboardCreatedSub$: Subscription;
  public selectDashboardsPaginationIsSortDsc$ = this.store.select(selectDashboardsPaginationIsSortDsc);
  public selectDashboardsPaginationSort$ = this.store.select(selectDashboardsPaginationSort);
  public selectDashboardsPaginationAsPaginationModel$ = this.store.select(selectDashboardsPaginationAsPaginationModel);
  public selectDashboardsFiltersName$ = this.store.select(selectDashboardsFiltersName);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Dashboard name'), field: 'dashboardName', sortProp: {id: 'Name'}, sortable: true},
    {header: this.translateService.stream('Survey Name'), field: 'surveyName'},
    {
      header: this.translateService.stream('Location/Tag name'),
      field: 'locations',
      formatter: (dashboard: DashboardModel) => dashboard.locationName ? dashboard.locationName : dashboard.tagName
    },
    {
      header: this.translateService.stream('Date From'),
      field: 'dateFrom',
      type: 'date',
      typeParameter: {format: 'yyyy/MM/dd', timezone: 'UTC'}
    },
    {
      header: this.translateService.stream('Date To'),
      field: 'dateTo',
      type: 'date',
      typeParameter: {format: 'yyyy/MM/dd', timezone: 'UTC'}
    },
    {
      header: this.translateService.stream('Actions'),
      field: 'actions',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'visibility',
          tooltip: this.translateService.stream('View Dashboard'),
          click: (dashboard: DashboardModel) => this.openViewPage(dashboard),
          class: 'dashboardViewBtn',
        },
        {
          color: 'accent',
          type: 'icon',
          icon: 'edit',
          tooltip: this.translateService.stream('Edit Dashboard'),
          click: (dashboard: DashboardModel) => this.openEditPage(dashboard),
          class: 'dashboardEditBtn',
        },
        {
          color: 'accent',
          type: 'icon',
          icon: 'content_copy',
          tooltip: this.translateService.stream('Copy Dashboard'),
          click: (dashboard: DashboardModel) => this.openCopyModal(dashboard),
          class: 'dashboardCopyBtn',
        },
        {
          color: 'warn',
          type: 'icon',
          icon: 'delete',
          tooltip: this.translateService.stream('Delete Dashboard'),
          click: (dashboard: DashboardModel) => this.openDeleteModal(dashboard),
          class: 'dashboardDeleteBtn',
        },
      ]
    },
  ];

  constructor(
    private dictionariesService: InsightDashboardPnDashboardDictionariesService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private dashboardsStateService: DashboardsStateService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.dashboardsStateService.updateNameFilter(val);
      this.getDashboardsList();
    });
  }

  ngOnInit() {
    this.getDashboardsList();
    this.getSurveys();
  }

  getDashboardsList() {
    this.getAllSub$ = this.dashboardsStateService.getAll().subscribe((data) => {
      if (data && data.success) {
        this.dashboardsListModel = data.model;
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

  sortTable(sort: Sort) {
    this.dashboardsStateService.onSortTable(sort.active);
    this.getDashboardsList();
  }

  onSearchInputChanged(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

  openEditPage(dashboard: DashboardModel) {
    this.router
      .navigate(['/plugins/insight-dashboard-pn/dashboard/edit/', dashboard.id])
      .then();
  }

  openViewPage(dashboard: DashboardModel) {
    this.router
      .navigate(['/plugins/insight-dashboard-pn/dashboard/', dashboard.id])
      .then();
  }

  openCreateModal() {
    const newDashboardModal = this.dialog.open(DashboardNewComponent, dialogConfigHelper(this.overlay, this.availableSurveys));
    this.dashboardCreatedSub$ = newDashboardModal.componentInstance.dashboardCreated.subscribe(x => {
      newDashboardModal.close();
      this.navigateToNewDashboard(x);
    });
  }

  openCopyModal(model: DashboardModel) {
    this.dashboardCopyComponentAfterClosedSub$ = this.dialog.open(DashboardCopyComponent,
      dialogConfigHelper(this.overlay, model))
      .afterClosed().subscribe(data => data ? this.getDashboardsList() : undefined);
  }

  openDeleteModal(model: DashboardModel) {
    this.dashboardDeleteComponentAfterClosedSub$ = this.dialog.open(DashboardDeleteComponent,
      dialogConfigHelper(this.overlay, model))
      .afterClosed().subscribe(data => data ? this.onDashboardDeleted() : undefined);
  }

  ngOnDestroy(): void {
  }

  navigateToNewDashboard(newDashboardId: number) {
    this.router
      .navigate(['../dashboard/edit', newDashboardId], {
        relativeTo: this.route,
      })
      .then();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.dashboardsStateService.updatePagination(paginationModel);
    this.getDashboardsList();
  }

  onDashboardDeleted() {
    this.getDashboardsList();
  }
}
