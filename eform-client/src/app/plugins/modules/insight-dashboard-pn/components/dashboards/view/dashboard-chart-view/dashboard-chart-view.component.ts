import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {DashboardChartTypesEnum} from '../../../../const/enums';
import *  as domtoimage from 'dom-to-image';
import {saveAs} from 'file-saver';
import {DashboardViewItemModel} from '../../../../models/dashboard/dashboard-view/dashboard-view-item.model';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Store} from '@ngrx/store';
import {selectIsDarkMode} from 'src/app/state/auth/auth.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-chart-view',
  templateUrl: './dashboard-chart-view.component.html',
  styleUrls: ['./dashboard-chart-view.component.scss'],
  standalone: false,
})
export class DashboardChartViewComponent implements OnChanges, OnDestroy {
  private store = inject(Store);

  @Input() chartPosition: number;
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  darkTHeme: boolean;
  getDarkThemeSub$: Subscription;

  /** One entry per answer category present anywhere in the chart. */
  legendEntries: {name: string; value: string}[] = [];

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  line: any[];
  multi: any[];
  pie: any[];
  verticalView: any[] = [1200, 400];
  horizontalView: any[] = [1200, 800];
  pieView: any[] = [1500, 400];
  stackedView = [60, 400];
  multiChartView: any[] = [800, 400];

  colorScheme = {
    domain: [
      '#3f51b5',
      '#ff9800',
      '#8bc34a',
      '#00bcd4',
      '#9e9e9e',
      '#9c27b0',
      '#ffc107',
      '#009688',
      '#cddc39',
      '#2196f3',
    ],
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'below';
  legendAdvanced = false;
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Percents';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 20;
  animations = true;

  customColors = [
    {
      name: 'Meget glad', // 100
      value: '#007E33',
    },
    {
      name: 'Glad', // 75
      value: '#00C851',
    },
    {
      name: 'Neutral', // 50
      value: '#ffbb33',
    },
    {
      name: 'Sur', // 25
      value: '#ff4444',
    },
    {
      name: 'Meget sur', // 0
      value: '#CC0000',
    },
    {
      name: 'Ved ikke', // 999
      value: '#0099CC',
    },
  ];

  constructor() {
    Object.assign(this, {line});
    Object.assign(this, {multi});
    Object.assign(this, {pie});
    this.getDarkThemeSub$ = this.store.select(selectIsDarkMode).subscribe(
      (isDarkTheme) => {
        this.darkTHeme = isDarkTheme;
      }
    );
  }

  copyChart() {
    const context = this;
    const scale = 2;
    const node = document.getElementById(`copyableChart${this.chartPosition}`);
    setTimeout(
      () =>
        domtoimage
          .toBlob(node, {
            // add greater scaling
            height: node.offsetHeight * scale,
            width:
              this.itemModel.chartType ===
              DashboardChartTypesEnum.HorizontalBarStackedGrouped
                ? node.scrollWidth * scale
                : node.offsetWidth * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left',
              width: node.offsetWidth + 'px',
              height: node.offsetHeight + 'px',
            },
          })
          .then(async function (data) {
            // use newest Clipboard API
            const navi = navigator as any;
            try {
              const blob = data;
              await navi.clipboard.write([
                // @ts-ignore
                new ClipboardItem({
                  [blob.type]: blob,
                }),
              ]);
              // context.spinnerStatus = false;
            } catch (e) {
              // context.spinnerStatus = false;
              console.error(e, e.message);
            }
          })
          .catch(function (error) {
            console.error('Chart could not be copied', error);
          }),
      100
    );
  }

  /**
   * Downloads the banded chart as a PNG. The captured node carries the title, so
   * the title is rendered into the image rather than composited afterwards.
   */
  downloadChart() {
    const scale = 2;
    const node = document.getElementById(`copyableChart${this.chartPosition}`);
    if (!node) {
      return;
    }
    const fileName = `${this.itemModel.firstQuestionName || 'chart'}.png`
      .replace(/[\\/:*?"<>|]/g, '_');

    setTimeout(
      () =>
        domtoimage
          .toBlob(node, {
            // A real option, unlike the '#FFFFFF' + '!important;' style string
            // the older charts use, which is not valid CSS and only appears to
            // work because the per-band elements paint their own background.
            bgcolor: '#FFFFFF',
            height: node.offsetHeight * scale,
            // The bands overflow the scroll container, so the full content width
            // is what has to be captured.
            width: node.scrollWidth * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left',
              width: node.offsetWidth + 'px',
              height: node.offsetHeight + 'px',
            },
          })
          .then((blob) => saveAs(blob, fileName))
          .catch((error) =>
            console.error('Chart could not be downloaded', error)
          ),
      100
    );
  }

  /** "Nord (20_2H–22_2H)" - the band's name and the periods it spans. */
  bandLabel(band: {name: string; series?: {name: string}[]}): string {
    const periods = band && band.series ? band.series : [];
    if (!periods.length) {
      return band ? band.name : '';
    }
    const first = periods[0].name;
    const last = periods[periods.length - 1].name;
    return first === last
      ? `${band.name} (${first})`
      : `${band.name} (${first}–${last})`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.itemModel) {
      this.buildLegendEntries();
    }
  }

  /**
   * The legend is built from the categories actually present, the way ngx-charts
   * builds its own domain - so answer values the item ignores never appear. It
   * is the union across every band, because a category can be missing from one
   * band and present in another.
   */
  private buildLegendEntries() {
    const seen = new Set<string>();
    const entries: {name: string; value: string}[] = [];
    const bands =
      this.itemModel && this.itemModel.chartData
        ? this.itemModel.chartData.multiStacked || []
        : [];

    for (const band of bands) {
      for (const period of band.series || []) {
        for (const answer of period.series || []) {
          if (seen.has(answer.name)) {
            continue;
          }
          seen.add(answer.name);
          const known = this.customColors.find((c) => c.name === answer.name);
          entries.push({
            name: answer.name,
            value: known
              ? known.value
              : this.colorScheme.domain[
                  entries.length % this.colorScheme.domain.length
                ],
          });
        }
      }
    }

    this.legendEntries = entries;
  }

  percentageFormatting(c) {
    //console.log('c is : ' + c);
    return Math.round(c);
  }

  ngOnDestroy() {
  }
}

const pie = [
  {
    name: '0',
    value: 1.19,
  },
  {
    name: '25',
    value: 1.67,
  },
  {
    name: '50',
    value: 3.34,
  },
  {
    name: '75',
    value: 26.73,
  },
  {
    name: '100',
    value: 65.63,
  },
  {
    name: '999',
    value: 1.43,
  },
];

const line = [
  {
    name: 'Ja',
    series: [
      {
        value: 20,
        name: '16-apr',
      },
      {
        value: 80,
        name: '16-aug',
      },
      {
        value: 50,
        name: '16-sep',
      },
      {
        value: 30,
        name: '16-oct',
      },
      {
        value: 10,
        name: '16-nov',
      },
      {
        value: 67,
        name: '16-dec',
      },
      {
        value: 79,
        name: '17-jan',
      },
    ],
  },
  {
    name: 'Nej',
    series: [
      {
        value: 80,
        name: '16-apr',
      },
      {
        value: 20,
        name: '16-aug',
      },
      {
        value: 50,
        name: '16-sep',
      },
      {
        value: 70,
        name: '16-oct',
      },
      {
        value: 90,
        name: '16-nov',
      },
      {
        value: 33,
        name: '16-dec',
      },
      {
        value: 21,
        name: '17-jan',
      },
    ],
  },
];

const multi = [
  {
    name: '16-apr',
    series: [
      {
        name: 'Ja',
        value: 70,
      },
      {
        name: 'Nej',
        value: 30,
      },
    ],
  },
  {
    name: '16-aug',
    series: [
      {
        name: 'Ja',
        value: 75,
      },
      {
        name: 'Nej',
        value: 25,
      },
    ],
  },
  {
    name: '16-dec',
    series: [
      {
        name: 'Ja',
        value: 50,
      },
      {
        name: 'Nej',
        value: 50,
      },
    ],
  },
  {
    name: '16-feb',
    series: [
      {
        name: 'Ja',
        value: 30,
      },
      {
        name: 'Nej',
        value: 70,
      },
    ],
  },
  {
    name: '17-jan',
    series: [
      {
        name: 'Ja',
        value: 60,
      },
      {
        name: 'Nej',
        value: 40,
      },
    ],
  },
  {
    name: '17-feb',
    series: [
      {
        name: 'Ja',
        value: 10,
      },
      {
        name: 'Nej',
        value: 90,
      },
    ],
  },
  {
    name: '17-mar',
    series: [
      {
        name: 'Ja',
        value: 25,
      },
      {
        name: 'Nej',
        value: 75,
      },
    ],
  },
  {
    name: '17-apr',
    series: [
      {
        name: 'Ja',
        value: 5,
      },
      {
        name: 'Nej',
        value: 95,
      },
    ],
  },
  {
    name: '17-aug',
    series: [
      {
        name: 'Ja',
        value: 17,
      },
      {
        name: 'Nej',
        value: 83,
      },
    ],
  },
  {
    name: '17-sep',
    series: [
      {
        name: 'Ja',
        value: 33,
      },
      {
        name: 'Nej',
        value: 67,
      },
    ],
  },
  {
    name: '17-oct',
    series: [
      {
        name: 'Ja',
        value: 0,
      },
      {
        name: 'Nej',
        value: 100,
      },
    ],
  },
  {
    name: '17-nov',
    series: [
      {
        name: 'Ja',
        value: 15,
      },
      {
        name: 'Nej',
        value: 85,
      },
    ],
  },
  {
    name: '17-dec',
    series: [
      {
        name: 'Ja',
        value: 5,
      },
      {
        name: 'Nej',
        value: 95,
      },
    ],
  },
];
