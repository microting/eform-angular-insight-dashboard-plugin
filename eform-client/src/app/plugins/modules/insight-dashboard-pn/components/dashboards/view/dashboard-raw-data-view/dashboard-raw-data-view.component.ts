import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Observable, of, Subscription} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {saveAs} from 'file-saver';
import {PaginationModel} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {InsightDashboardPnRawDataService} from '../../../../services';
import {
  DashboardViewItemModel,
  DashboardViewModel,
  RawDataColumnModel,
} from '../../../../models';
import {
  buildTsv,
  downloadTsv,
  tsvFileName,
} from '../../../../helpers/tsv-export.helper';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-raw-data-view',
  templateUrl: './dashboard-raw-data-view.component.html',
  styleUrls: ['./dashboard-raw-data-view.component.scss'],
  standalone: false,
})
export class DashboardRawDataViewComponent implements OnChanges, OnDestroy {
  private translateService = inject(TranslateService);
  private rawDataService = inject(InsightDashboardPnRawDataService);
  private toastrService = inject(ToastrService);

  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();

  expanded = false;
  loading = false;
  loaded = false;
  total = 0;
  rows: any[] = [];
  tableHeaders: MtxGridColumn[] = [];
  pagination: PaginationModel = new PaginationModel(0, 25, 0);
  sort = 'finishedAt';
  isSortDsc = true;

  exportingCsv = false;

  getRawDataSub$: Subscription;
  exportSub$: Subscription;
  exportCsvSub$: Subscription;

  get sortDirection(): 'asc' | 'desc' {
    return this.isSortDsc ? 'desc' : 'asc';
  }

  get canExport(): boolean {
    return this.loaded && this.total > 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    // The dashboard view re-fetches when the period or date range changes, handing
    // us a new itemModel. Anything already loaded is now stale.
    if (changes.itemModel || changes.dashboardViewModel) {
      this.loaded = false;
      this.rows = [];
      this.tableHeaders = [];
      this.total = 0;
      this.pagination = new PaginationModel(0, this.pagination.pageSize, 0);

      if (this.expanded) {
        this.getRawData();
      }
    }
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded && !this.loaded) {
      this.getRawData();
    }
  }

  getRawData() {
    this.loading = true;
    this.getRawDataSub$ = this.rawDataService
      .getRawData({
        dashboardId: this.dashboardViewModel.id,
        dashboardItemId: this.itemModel.id,
        offset: this.pagination.offset,
        pageSize: this.pagination.pageSize,
        sort: this.sort,
        isSortDsc: this.isSortDsc,
      })
      .subscribe((data) => {
        this.loading = false;
        if (data && data.success && data.model) {
          this.loaded = true;
          this.total = data.model.total;
          this.pagination = {...this.pagination, total: data.model.total};
          this.rows = data.model.rows;
          this.tableHeaders = data.model.columns.map((column) =>
            this.toGridColumn(column)
          );
        }
      });
  }

  // Answer column headers are translation keys. Question and option headers are
  // already-resolved text from the database and must not go through translate.
  private toGridColumn(column: RawDataColumnModel): MtxGridColumn {
    const header: Observable<string> =
      column.kind === 'answer'
        ? this.translateService.stream(column.header)
        : of(column.header);

    const gridColumn: MtxGridColumn = {
      header: header,
      field: column.field,
      hide: column.defaultHidden,
      sortable: column.sortable,
    };

    if (column.sortable) {
      gridColumn.sortProp = {id: column.field};
    }

    return gridColumn;
  }

  sortTable(sort: Sort) {
    const updated = updateTableSort(sort.active, this.sort, this.isSortDsc);
    this.sort = updated.sort;
    this.isSortDsc = updated.isSortDsc;
    // A new ordering makes the current offset meaningless - go back to page one.
    this.pagination = {...this.pagination, offset: 0};
    this.getRawData();
  }

  onPaginationChanged(pagination: PaginationModel) {
    this.pagination = {
      ...this.pagination,
      pageSize: pagination.pageSize,
      offset: pagination.offset,
    };
    this.getRawData();
  }

  exportToExcel() {
    this.exportSub$ = this.rawDataService
      .exportToExcel({
        dashboardId: this.dashboardViewModel.id,
        dashboardItemId: this.itemModel.id,
      })
      .subscribe((data) => {
        saveAs(
          new Blob([data]),
          `${this.dashboardViewModel.dashboardName}_raw_data.xlsx`
        );
      });
  }

  /**
   * The grid only holds the page on screen, so the file is built from a second
   * call asking the same endpoint for every row in the order currently shown.
   * Unlike the Excel export, this one carries exactly the columns the grid is
   * showing - the column picker decides what lands in the file.
   */
  exportToCsv() {
    if (!this.canExport || this.exportingCsv) {
      return;
    }
    this.exportingCsv = true;

    // Snapshot what the grid is showing now. The dashboard can hand us a new
    // itemModel while the request is in flight, and ngOnChanges empties
    // tableHeaders - reading it in the callback would then select no columns at
    // all and quietly download a file of blank lines.
    const visibleFields = this.tableHeaders
      .filter((header) => !header.hide)
      .map((header) => header.field);
    const fileName = tsvFileName(
      this.dashboardViewModel.dashboardName,
      this.itemModel.position,
      'raw_data'
    );

    this.exportCsvSub$ = this.rawDataService
      .getRawData({
        dashboardId: this.dashboardViewModel.id,
        dashboardItemId: this.itemModel.id,
        offset: 0,
        pageSize: this.total,
        sort: this.sort,
        isSortDsc: this.isSortDsc,
      })
      .subscribe({
        next: (data) => {
          this.exportingCsv = false;
          if (!data || !data.success || !data.model) {
            // The server refuses a result larger than the export limit, and says
            // so. Swallowing that left the user with a button that did nothing.
            if (data && data.message) {
              this.toastrService.error(data.message, 'Error', {timeOut: 10000});
            }
            return;
          }
          const columns = data.model.columns.filter((column) =>
            visibleFields.includes(column.field)
          );
          downloadTsv(
            fileName,
            buildTsv([
              {
                headers: columns.map((column) => this.headerText(column)),
                rows: data.model.rows.map((row) =>
                  columns.map((column) => this.cellText(row[column.field]))
                ),
              },
            ])
          );
        },
        // A transport failure never reaches the next handler, and leaving the
        // flag set disabled the button until the page was reloaded.
        error: () => {
          this.exportingCsv = false;
        },
      });
  }

  private headerText(column: RawDataColumnModel): string {
    return column.kind === 'answer'
      ? this.translateService.instant(column.header)
      : column.header;
  }

  private cellText(value: unknown): string {
    return value === null || value === undefined ? '' : String(value);
  }

  ngOnDestroy(): void {}
}
