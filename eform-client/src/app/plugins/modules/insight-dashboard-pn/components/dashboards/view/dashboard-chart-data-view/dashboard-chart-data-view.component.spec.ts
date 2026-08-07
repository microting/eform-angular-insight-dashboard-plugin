import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {of} from 'rxjs';
import {Store} from '@ngrx/store';
import {DashboardChartDataViewComponent} from './dashboard-chart-data-view.component';
import {DashboardChartTypesEnum} from '../../../../const';
import * as tsvExport from '../../../../helpers/tsv-export.helper';

@Pipe({name: 'translate', standalone: false})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DashboardChartDataViewComponent', () => {
  let component: DashboardChartDataViewComponent;
  let fixture: ComponentFixture<DashboardChartDataViewComponent>;
  let downloadSpy: jest.SpyInstance;

  const block = (rawValueName: string) => ({
    rawHeaders: ['Jan 2020', 'Feb 2020'],
    rawDataItems: [
      {
        rawValueName,
        rawDataValues: [
          {valueName: 'Glad', percents: [82, 74], amounts: [41, 33]},
          {valueName: 'Total', percents: [100, 100], amounts: [50, 45]},
        ],
      },
    ],
  });

  const setUp = (
    chartType: DashboardChartTypesEnum,
    rawData: any[],
    calculateAverage = false
  ) => {
    component.dashboardViewModel = {id: 9, dashboardName: 'My board'} as any;
    component.itemModel = {
      position: 3,
      chartType,
      calculateAverage,
      chartData: {rawData},
    } as any;
    fixture.detectChanges();
  };

  const exportedTsv = (): string => downloadSpy.mock.calls[0][1];
  const exportedFileName = (): string => downloadSpy.mock.calls[0][0];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardChartDataViewComponent, MockTranslatePipe],
      providers: [{provide: Store, useValue: {select: () => of(false)}}],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    downloadSpy = jest
      .spyOn(tsvExport, 'downloadTsv')
      .mockImplementation(() => {});
    fixture = TestBed.createComponent(DashboardChartDataViewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => downloadSpy.mockRestore());

  it('should create', () => {
    setUp(DashboardChartTypesEnum.Line, [block('')]);
    expect(component).toBeTruthy();
  });

  describe('canExport', () => {
    it('is false when the item carries no chart data at all', () => {
      component.itemModel = {position: 1} as any;
      expect(component.canExport).toBe(false);
    });

    it('is false when the chart data holds no blocks', () => {
      setUp(DashboardChartTypesEnum.Line, []);
      expect(component.canExport).toBe(false);
    });

    it('is true once there is a block to export', () => {
      setUp(DashboardChartTypesEnum.Line, [block('')]);
      expect(component.canExport).toBe(true);
    });
  });

  describe('exportToCsv', () => {
    it('writes a percent section then an amount section', () => {
      setUp(DashboardChartTypesEnum.Line, [block('')]);
      component.exportToCsv();

      expect(exportedTsv()).toBe(
        `${tsvExport.TSV_BOM}` +
          '\tJan 2020\tFeb 2020\r\n' +
          'Glad\t82%\t74%\r\n' +
          'Total\t100%\t100%\r\n' +
          '\r\n' +
          '\tJan 2020\tFeb 2020\r\n' +
          'Glad\t41\t33\r\n' +
          'Total\t50\t45\r\n'
      );
    });

    it('names the file after the dashboard and the item position', () => {
      setUp(DashboardChartTypesEnum.Line, [block('')]);
      component.exportToCsv();
      expect(exportedFileName()).toBe('My board_3_chart_data.csv');
    });

    it('drops the percent sign when the item shows averages', () => {
      setUp(DashboardChartTypesEnum.Line, [block('')], true);
      component.exportToCsv();

      const percentRow = exportedTsv().split('\r\n')[1];
      expect(percentRow).toBe('Glad\t82\t74');
    });

    it('keeps percentages and amounts on one row for the stacked grouped chart', () => {
      // This chart renders both halves side by side under a single header row
      // that already names them, and carries the group in a rowSpan cell. The
      // file therefore stays one section, with the group promoted to a column.
      setUp(DashboardChartTypesEnum.HorizontalBarStackedGrouped, [
        {
          rawHeaders: ['Jan 2020', 'Feb 2020', '%', 'Jan 2020', 'Feb 2020', 'n'],
          rawDataItems: [
            {
              rawValueName: 'Location 1',
              rawDataValues: [
                {
                  valueName: 'Glad',
                  percents: [82, 74, 100],
                  amounts: [41, 33, 74],
                },
              ],
            },
            {
              rawValueName: 'Location 2',
              rawDataValues: [
                {
                  valueName: 'Glad',
                  percents: [61, 55, 100],
                  amounts: [22, 19, 41],
                },
              ],
            },
          ],
        },
      ]);
      component.exportToCsv();

      expect(exportedTsv()).toBe(
        `${tsvExport.TSV_BOM}` +
          '\t\tJan 2020\tFeb 2020\t%\tJan 2020\tFeb 2020\tn\r\n' +
          'Location 1\tGlad\t82%\t74%\t100%\t41\t33\t74\r\n' +
          'Location 2\tGlad\t61%\t55%\t100%\t22\t19\t41\r\n'
      );
    });

    it('repeats grouped headers that only name one of the two halves', () => {
      // When the block groups by period, rawHeaders covers the percentages only
      // and the screen renders a header row narrower than its own body. The file
      // has to stay rectangular, so the headers are repeated for the amounts.
      setUp(DashboardChartTypesEnum.HorizontalBarStackedGrouped, [
        {
          rawHeaders: ['16_01', '16_05'],
          rawDataItems: [
            {
              rawValueName: 'Location 1',
              rawDataValues: [
                {valueName: 'Glad', percents: [82, 74], amounts: [41, 33]},
              ],
            },
          ],
        },
      ]);
      component.exportToCsv();

      expect(exportedTsv()).toBe(
        `${tsvExport.TSV_BOM}` +
          '\t\t16_01\t16_05\t16_01\t16_05\r\n' +
          'Location 1\tGlad\t82%\t74%\t41\t33\r\n'
      );
    });

    it('pads grouped headers that cover less than the data', () => {
      // One header over four value columns: duplication reaches two, so the
      // remaining two are padded rather than left unnamed-and-missing.
      setUp(DashboardChartTypesEnum.HorizontalBarStackedGrouped, [
        {
          rawHeaders: ['16_01'],
          rawDataItems: [
            {
              rawValueName: 'Location 1',
              rawDataValues: [
                {valueName: 'Glad', percents: [82, 74], amounts: [41, 33]},
              ],
            },
          ],
        },
      ]);
      component.exportToCsv();

      expect(exportedTsv()).toBe(
        `${tsvExport.TSV_BOM}` +
          '\t\t16_01\t16_01\t\t\r\n' +
          'Location 1\tGlad\t82%\t74%\t41\t33\r\n'
      );
    });

    it('sizes a grouped section to its widest row, not its first', () => {
      // The backend sizes each location's array from that location's own option
      // count, while rawHeaders is fixed from the first location. A narrow first
      // location must not truncate the wider ones into a ragged file.
      setUp(DashboardChartTypesEnum.HorizontalBarStackedGrouped, [
        {
          rawHeaders: ['16_01', '16_05', '16_09', '16_13'],
          rawDataItems: [
            {
              rawValueName: 'Narrow',
              rawDataValues: [
                {valueName: 'Glad', percents: [82], amounts: [41]},
              ],
            },
            {
              rawValueName: 'Wide',
              rawDataValues: [
                {valueName: 'Glad', percents: [61, 39], amounts: [22, 14]},
              ],
            },
          ],
        },
      ]);
      component.exportToCsv();

      const records = exportedTsv().split('\r\n').filter((r) => r.length);
      const widths = records.map((record) => record.split('\t').length);
      expect(widths).toEqual([6, 6, 6]);
      // The short row is padded on the right, keeping its own values in place.
      expect(records[1]).toBe('Narrow\tGlad\t82%\t41\t\t');
      expect(records[2]).toBe('Wide\tGlad\t61%\t39%\t22\t14');
    });

    it('writes every block, separated by a blank record', () => {
      setUp(DashboardChartTypesEnum.Line, [block(''), block('')]);
      component.exportToCsv();

      // two sections per block, each separated by one blank record
      const blankRecords = exportedTsv()
        .split('\r\n')
        .filter((record) => record === '').length;
      // three separators plus the empty tail after the terminating CRLF
      expect(blankRecords).toBe(4);
    });

    it('does nothing when there is nothing to export', () => {
      setUp(DashboardChartTypesEnum.Line, []);
      component.exportToCsv();
      expect(downloadSpy).not.toHaveBeenCalled();
    });
  });
});
