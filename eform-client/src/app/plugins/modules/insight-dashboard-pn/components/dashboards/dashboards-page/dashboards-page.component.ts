import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {DashboardModel, DashboardsListModel,} from '../../../models';
import { Subject, Subscription } from 'rxjs';
import {
  DashboardCopyComponent,
  DashboardDeleteComponent,
  DashboardEditComponent,
  DashboardNewComponent,
} from '../..';
import { InsightDashboardPnDashboardDictionariesService } from '../../../services';
import {
  CommonDictionaryModel, PaginationModel,
} from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardsStateService } from '../store';
import { debounceTime } from 'rxjs/operators';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';

@AutoUnsubscribe()
@Component({
  selector: 'app-insight-dashboard-dashboards',
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.scss'],
})
export class DashboardsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newDashboardModal', { static: true })
  newDashboardModal: DashboardNewComponent;
  @ViewChild('copyDashboardModal', { static: true })
  copyDashboardModal: DashboardCopyComponent;
  @ViewChild('editDashboardModal', { static: true })
  editDashboardModal: DashboardEditComponent;
  @ViewChild('deleteDashboardModal', { static: true })
  deleteDashboardModal: DashboardDeleteComponent;
  dashboardsListModel: DashboardsListModel = new DashboardsListModel();
  searchSubject = new Subject();
  availableSurveys: CommonDictionaryModel[] = [];
  getAllSub$: Subscription;
  getSurveysSub$: Subscription;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Dashboard name'), field: 'dashboardName', sortProp: {id: 'Name'}, sortable: true},
    {header: this.translateService.stream('Survey Name'), field: 'surveyName'},
    {
      header: this.translateService.stream('Location/Tag name'),
      field: 'locations',
      formatter: (dashboard: DashboardModel) => dashboard.locationName ? dashboard.locationName : dashboard.tagName
    },
    {header: this.translateService.stream('Date From'), field: 'dateFrom', type: 'date', typeParameter: {format: 'yyyy/MM/dd'}},
    {header: this.translateService.stream('Date To'), field: 'dateTo', type: 'date', typeParameter: {format: 'yyyy/MM/dd'}},
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
  ]

  constructor(
    private dictionariesService: InsightDashboardPnDashboardDictionariesService,
    private router: Router,
    private route: ActivatedRoute,
    public dashboardsStateService: DashboardsStateService,
    private translateService: TranslateService,
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

  openCreateModal() {
    this.newDashboardModal.show();
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

  openCopyModal(model: DashboardModel) {
    this.copyDashboardModal.show(model);
  }

  openDeleteModal(model: DashboardModel) {
    this.deleteDashboardModal.show(model);
  }

  ngOnDestroy(): void {}

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
    this.dashboardsStateService.onDelete();
    this.getDashboardsList();
  }
}
