import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { InsightDashboardPnDashboardItemsService } from '../../../../services';
import { saveAs } from 'file-saver';
import { DashboardViewModel, DashboardViewItemModel} from '../../../../models';
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {TranslateService} from "@ngx-translate/core";

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-interviews-view',
  templateUrl: './dashboard-interviews-view.component.html',
  styleUrls: ['./dashboard-interviews-view.component.scss'],
})
export class DashboardInterviewsViewComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private dashboardItemsService = inject(InsightDashboardPnDashboardItemsService);

  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  exportSub$: Subscription;


  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Date'), field: 'date',
      type: 'date',
      typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Tag'), field: 'locationName'},
    { header: this.translateService.stream('Comments'), field: 'commentary', },
  ]

  ngOnInit() {}

  exportToCsv() {
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
