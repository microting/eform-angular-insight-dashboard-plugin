import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DashboardRawDataViewComponent} from './dashboard-raw-data-view.component';
import {InsightDashboardPnRawDataService} from '../../../../services';

@Pipe({name: 'translate', standalone: false})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('DashboardRawDataViewComponent', () => {
  let component: DashboardRawDataViewComponent;
  let fixture: ComponentFixture<DashboardRawDataViewComponent>;

  const response = {
    success: true,
    model: {
      total: 2,
      columns: [
        {
          field: 'finishedAt', header: 'Finished at', kind: 'answer',
          defaultHidden: false, sortable: true, questionId: null, optionId: null,
        },
        {
          field: 'timeZone', header: 'Time zone', kind: 'answer',
          defaultHidden: true, sortable: false, questionId: null, optionId: null,
        },
        {
          field: 'q7_o21', header: '2 – Områder › Kantine', kind: 'multiOption',
          defaultHidden: false, sortable: false, questionId: 7, optionId: 21,
        },
      ],
      rows: [
        {finishedAt: '2026-03-02T08:14:22', timeZone: 'Europe/Copenhagen', q7_o21: 'Kantine'},
        {finishedAt: '2026-03-03T07:22:11', timeZone: 'Europe/Copenhagen', q7_o21: ''},
      ],
    },
  };

  const rawDataServiceMock = {
    getRawData: jest.fn(() => of(response)),
    exportToExcel: jest.fn(() => of(new Blob())),
  };

  beforeEach(waitForAsync(() => {
    rawDataServiceMock.getRawData.mockClear();
    TestBed.configureTestingModule({
      declarations: [DashboardRawDataViewComponent, MockTranslatePipe],
      providers: [
        {provide: InsightDashboardPnRawDataService, useValue: rawDataServiceMock},
        {
          provide: TranslateService,
          useValue: {
            stream: (key: string) => of(key),
            get: (key: string) => of(key),
            instant: (key: string) => key,
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRawDataViewComponent);
    component = fixture.componentInstance;
    component.dashboardViewModel = {id: 3, dashboardName: 'Test'} as any;
    component.itemModel = {id: 9, position: 1} as any;
    fixture.detectChanges();
  });

  it('should create without loading data', () => {
    expect(component).toBeTruthy();
    expect(component.expanded).toBe(false);
    expect(rawDataServiceMock.getRawData).not.toHaveBeenCalled();
  });

  it('loads data on first expand and does not refetch on re-expand', () => {
    component.toggle();

    expect(component.expanded).toBe(true);
    expect(component.total).toBe(2);
    expect(component.rows.length).toBe(2);
    expect(rawDataServiceMock.getRawData).toHaveBeenCalledTimes(1);

    component.toggle();
    component.toggle();

    expect(rawDataServiceMock.getRawData).toHaveBeenCalledTimes(1);
  });

  it('maps columns, hiding defaults and marking only answer columns sortable', () => {
    component.toggle();

    const [finishedAt, timeZone, optionColumn] = component.tableHeaders;

    expect(finishedAt.field).toBe('finishedAt');
    expect(finishedAt.sortable).toBe(true);
    expect(finishedAt.sortProp).toEqual({id: 'finishedAt'});

    expect(timeZone.hide).toBe(true);

    expect(optionColumn.sortable).toBe(false);
    expect(optionColumn.sortProp).toBeUndefined();
  });

  it('returns to the first page when the sort changes', () => {
    component.toggle();
    component.onPaginationChanged({total: 2, pageSize: 25, offset: 50} as any);
    expect(component.pagination.offset).toBe(50);

    component.sortTable({active: 'siteName', direction: 'asc'} as any);

    expect(component.pagination.offset).toBe(0);
    expect(component.sort).toBe('siteName');
  });

  it('refetches from page one when the item model changes while expanded', () => {
    component.toggle();
    component.onPaginationChanged({total: 2, pageSize: 25, offset: 50} as any);
    expect(rawDataServiceMock.getRawData).toHaveBeenCalledTimes(2);

    component.ngOnChanges({itemModel: {} as any});

    // Still expanded, so the stale rows are replaced rather than just dropped.
    expect(component.pagination.offset).toBe(0);
    expect(rawDataServiceMock.getRawData).toHaveBeenCalledTimes(3);
    expect(component.loaded).toBe(true);
  });

  it('drops loaded rows when the item model changes while collapsed', () => {
    component.toggle();
    expect(component.rows.length).toBe(2);
    component.toggle();

    component.ngOnChanges({itemModel: {} as any});

    expect(component.loaded).toBe(false);
    expect(component.rows.length).toBe(0);
    expect(component.tableHeaders.length).toBe(0);
    expect(component.total).toBe(0);
  });
});
