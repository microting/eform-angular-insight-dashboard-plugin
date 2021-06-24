import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DashboardModel, DashboardsListModel } from '../../../models';
import { Subject, Subscription } from 'rxjs';
import {
  DashboardCopyComponent,
  DashboardDeleteComponent,
  DashboardEditComponent,
  DashboardNewComponent,
} from '../..';
import { InsightDashboardPnDashboardDictionariesService } from '../../../services';
import {
  CommonDictionaryModel,
  TableHeaderElementModel,
} from '../../../../../../common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardsStateService } from '../store';
import { debounceTime } from 'rxjs/operators';

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

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'Name',
      elementId: 'dashboardNameTableHeader',
      sortable: true,
      visibleName: 'Dashboard name',
    },
    { name: 'Survey name', elementId: '', sortable: false },
    { name: 'Location/Tag name', elementId: '', sortable: false },
    { name: 'Date From', elementId: '', sortable: false },
    { name: 'Date To', elementId: '', sortable: false },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private dictionariesService: InsightDashboardPnDashboardDictionariesService,
    private router: Router,
    private route: ActivatedRoute,
    public dashboardsStateService: DashboardsStateService
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

  sortTable(sort: string) {
    this.dashboardsStateService.onSortTable(sort);
    this.getDashboardsList();
  }

  changePage(offset: any) {
    this.dashboardsStateService.changePage(offset);
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

  onPageSizeChanged(pageSize: number) {
    this.dashboardsStateService.updatePageSize(pageSize);
    this.getDashboardsList();
  }

  onDashboardDeleted() {
    this.dashboardsStateService.onDelete();
    this.getDashboardsList();
  }
}
