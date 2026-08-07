import { Component, inject, Input, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { InsightDashboardPnDashboardItemsService } from '../../../../services';
import { saveAs } from 'file-saver';
import { DashboardViewModel, DashboardViewItemModel} from '../../../../models';
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {TranslateService} from "@ngx-translate/core";
import {
  buildTsv,
  downloadTsv,
  tsvFileName,
} from '../../../../helpers/tsv-export.helper';

const DATE_FORMAT = 'dd.MM.y HH:mm:ss';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-interviews-view',
  templateUrl: './dashboard-interviews-view.component.html',
  styleUrls: ['./dashboard-interviews-view.component.scss'],
  standalone: false,
})
export class DashboardInterviewsViewComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private dashboardItemsService = inject(InsightDashboardPnDashboardItemsService);
  private locale = inject(LOCALE_ID);

  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  exportSub$: Subscription;


  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Date'), field: 'date',
      type: 'date',
      typeParameter: {format: DATE_FORMAT}},
    {header: this.translateService.stream('Tag'), field: 'locationName'},
    { header: this.translateService.stream('Comments'), field: 'commentary', },
  ]

  get canExport(): boolean {
    return !!this.itemModel.textQuestionData && this.itemModel.textQuestionData.length > 0;
  }

  ngOnInit() {}

  exportToCsv() {
    if (!this.canExport) {
      return;
    }
    // The grid already holds every interview - there is no paging here - so the
    // file is built from what is on screen without going back to the server.
    downloadTsv(
      tsvFileName(
        this.dashboardViewModel.dashboardName,
        this.itemModel.position,
        'interviews'
      ),
      buildTsv([
        {
          headers: ['Date', 'Tag', 'Comments'].map((key) =>
            this.translateService.instant(key)
          ),
          rows: this.itemModel.textQuestionData.map((interview) => [
            interview.date ? formatDate(interview.date, DATE_FORMAT, this.locale) : '',
            interview.locationName,
            interview.commentary,
          ]),
        },
      ])
    );
  }

  exportToExcel() {
    this.exportSub$ = this.dashboardItemsService
      .exportInterviewsToExcel({
        dashboardId: this.dashboardViewModel.id,
        itemId: this.itemModel.id,
      })
      .subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(
          blob,
          `${this.dashboardViewModel.dashboardName}_interviews.xlsx`
        );
      });
  }

  ngOnDestroy(): void {}
}
