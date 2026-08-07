import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DashboardViewItemModel, DashboardViewModel} from '../../../../models';
import { DashboardChartTypesEnum } from '../../../../const';
import { AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {Store} from '@ngrx/store';
import {selectIsDarkMode} from 'src/app/state/auth/auth.selector';
import {
  TsvSection,
  buildTsv,
  downloadTsv,
  tsvFileName,
} from '../../../../helpers/tsv-export.helper';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-chart-data-view',
  templateUrl: './dashboard-chart-data-view.component.html',
  styleUrls: ['./dashboard-chart-data-view.component.scss'],
  standalone: false,
})
export class DashboardChartDataViewComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  darkTheme: boolean;
  getDarkThemeSub$: Subscription;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  get canExport(): boolean {
    const rawData = this.itemModel && this.itemModel.chartData
      ? this.itemModel.chartData.rawData
      : null;
    return !!rawData && rawData.length > 0;
  }

  constructor() {
    this.getDarkThemeSub$ = this.store.select(selectIsDarkMode).subscribe(
      (isDarkTheme) => {
        this.darkTheme = isDarkTheme;
      }
    );
  }

  ngOnInit() {}

  exportToCsv() {
    if (!this.canExport) {
      return;
    }
    downloadTsv(
      tsvFileName(
        this.dashboardViewModel.dashboardName,
        this.itemModel.position,
        'chart_data'
      ),
      buildTsv(this.buildSections())
    );
  }

  /**
   * The file reproduces the rendered table, and the two chart shapes render
   * differently.
   *
   * The stacked grouped chart puts percentages and amounts side by side in one
   * row, under one header row that already names both halves, so it exports as a
   * single section per block. Its group name lives in a rowSpan cell on screen;
   * in the file it becomes a leading column repeated on every row.
   *
   * Every other chart type stacks a percentage table above an amount table,
   * both under the same headers, so each of those becomes its own section.
   */
  private buildSections(): TsvSection[] {
    const grouped =
      this.itemModel.chartType ===
      DashboardChartTypesEnum.HorizontalBarStackedGrouped;

    const sections: TsvSection[] = [];

    for (const block of this.itemModel.chartData.rawData) {
      if (grouped) {
        const rows = block.rawDataItems.flatMap((dataItem) =>
          dataItem.rawDataValues.map((dataValue) => [
            dataItem.rawValueName,
            dataValue.valueName,
            ...dataValue.percents.map((percent) => this.formatPercent(percent)),
            ...dataValue.amounts.map((amount) => String(amount)),
          ])
        );
        // The two leading cells are the group and the value name; the rest are
        // the percentages and amounts the headers have to cover.
        const valueWidth = rows.length
          ? rows[0].length - 2
          : block.rawHeaders.length;
        sections.push({
          headers: ['', '', ...this.groupedHeaders(block.rawHeaders, valueWidth)],
          rows,
        });
        continue;
      }

      const headers = ['', ...block.rawHeaders];
      for (const dataItem of block.rawDataItems) {
        sections.push({
          headers,
          rows: dataItem.rawDataValues.map((dataValue) => [
            dataValue.valueName,
            ...dataValue.percents.map((percent) => this.formatPercent(percent)),
          ]),
        });
        sections.push({
          headers,
          rows: dataItem.rawDataValues.map((dataValue) => [
            dataValue.valueName,
            ...dataValue.amounts.map((amount) => String(amount)),
          ]),
        });
      }
    }

    return sections;
  }

  /**
   * The stacked grouped chart puts percentages and amounts side by side in one
   * row, but rawHeaders does not consistently describe both halves: when the
   * block groups by answer option it names both, when it groups by period it
   * names one and the screen renders a header row narrower than its own body.
   *
   * Size the header row to the data either way. A file whose header row is
   * narrower than its records is not a table any spreadsheet can read, so this
   * is one place the export deliberately does not reproduce the screen.
   */
  private groupedHeaders(rawHeaders: string[], valueWidth: number): string[] {
    const headers =
      rawHeaders.length >= valueWidth
        ? [...rawHeaders]
        : [...rawHeaders, ...rawHeaders];
    while (headers.length < valueWidth) {
      headers.push('');
    }
    return headers.slice(0, valueWidth);
  }

  // An average is not a percentage - the table drops the sign for those, and so
  // must the file, or the number reads as a percentage in the spreadsheet.
  private formatPercent(percent: number): string {
    return this.itemModel.calculateAverage ? String(percent) : `${percent}%`;
  }

  ngOnDestroy(): void {}
}
