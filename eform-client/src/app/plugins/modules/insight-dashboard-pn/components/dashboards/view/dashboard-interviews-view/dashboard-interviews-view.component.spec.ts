import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslatePipe} from '@ngx-translate/core';
import {of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DashboardInterviewsViewComponent} from './dashboard-interviews-view.component';
import {InsightDashboardPnDashboardItemsService} from '../../../../services';
import * as tsvExport from '../../../../helpers/tsv-export.helper';
import {captureDownloads} from '../../../../testing/capture-downloads';


@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DashboardInterviewsViewComponent', () => {
  let component: DashboardInterviewsViewComponent;
  let fixture: ComponentFixture<DashboardInterviewsViewComponent>;
  let downloadSpy: ReturnType<typeof captureDownloads>['downloads'];
  let restoreDownloads: () => void;

  const dashboardItemsServiceMock = {
    exportInterviewsToExcel: vi.fn(() => of(new Blob())),
  };

  const setUp = (textQuestionData: any[]) => {
    component.dashboardViewModel = {id: 9, dashboardName: 'My board'} as any;
    component.itemModel = {id: 4, position: 2, textQuestionData} as any;
    fixture.detectChanges();
  };

  const exportedTsv = (): string => downloadSpy.mock.calls[0][1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInterviewsViewComponent],
      providers: [
        provideNoopAnimations(),
        {provide: LOCALE_ID, useValue: 'en-US'},
        {
          provide: InsightDashboardPnDashboardItemsService,
          useValue: dashboardItemsServiceMock,
        },
        {
          provide: TranslateService,
          useValue: {
            stream: (key: string) => of(key),
            get: (key: string) => of(key),
            instant: (key: string) => key,
          },
        },
      ],
    })
      .overrideComponent(DashboardInterviewsViewComponent, {
        remove: {imports: [TranslatePipe]},
        add: {imports: [MockTranslatePipe]},
      })
      .compileComponents();
  });

  beforeEach(() => {

    ({downloads: downloadSpy, restore: restoreDownloads} = captureDownloads());
    fixture = TestBed.createComponent(DashboardInterviewsViewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => restoreDownloads());

  it('should create', () => {
    setUp([]);
    expect(component).toBeTruthy();
  });

  describe('canExport', () => {
    it('is false without any interviews', () => {
      setUp([]);
      expect(component.canExport).toBe(false);
    });

    it('is true once there is an interview', () => {
      setUp([{date: new Date(2026, 2, 2), locationName: 'A', commentary: 'B'}]);
      expect(component.canExport).toBe(true);
    });
  });

  describe('exportToCsv', () => {
    it('writes the grid headers and one record per interview', () => {
      setUp([
        {
          date: new Date(2026, 2, 2, 8, 14, 22),
          locationName: 'Location 1',
          commentary: 'All good',
        },
      ]);
      component.exportToCsv();

      expect(exportedTsv()).toBe(
        `${tsvExport.TSV_BOM}` +
          'Date\tTag\tComments\r\n' +
          '02.03.2026 08:14:22\tLocation 1\tAll good\r\n'
      );
    });

    it('names the file after the dashboard and the item position', () => {
      setUp([{date: new Date(2026, 2, 2), locationName: 'A', commentary: 'B'}]);
      component.exportToCsv();
      expect(downloadSpy.mock.calls[0][0]).toBe('My board_2_interviews.csv');
    });

    it('quotes a comment that carries a tab or a line break', () => {
      setUp([
        {
          date: new Date(2026, 2, 2, 8, 14, 22),
          locationName: 'Location 1',
          commentary: 'first\tsecond\nthird',
        },
      ]);
      component.exportToCsv();

      expect(exportedTsv()).toContain('"first\tsecond\nthird"');
    });

    it('leaves the date cell empty rather than throwing on a missing date', () => {
      setUp([{date: null, locationName: 'Location 1', commentary: 'All good'}]);
      component.exportToCsv();

      expect(exportedTsv().split('\r\n')[1]).toBe('\tLocation 1\tAll good');
    });

    it('does nothing when there are no interviews', () => {
      setUp([]);
      component.exportToCsv();
      expect(downloadSpy).not.toHaveBeenCalled();
    });
  });

  describe('exportToExcel', () => {
    it('requests the workbook for this dashboard item and saves it', () => {
      setUp([{date: new Date(2026, 2, 2), locationName: 'A', commentary: 'B'}]);

      component.exportToExcel();

      expect(dashboardItemsServiceMock.exportInterviewsToExcel).toHaveBeenCalledWith({
        dashboardId: 9,
        itemId: 4,
      });
    });

    it('is reachable from the template', () => {
      setUp([{date: new Date(2026, 2, 2), locationName: 'A', commentary: 'B'}]);

      // The method existed for years with no caller, which is why the defects
      // in the workbook it produces were never noticed.
      const button = fixture.nativeElement.querySelector(
        '#dashboardInterviewsExport2'
      );
      expect(button).not.toBeNull();
    });
  });
});
