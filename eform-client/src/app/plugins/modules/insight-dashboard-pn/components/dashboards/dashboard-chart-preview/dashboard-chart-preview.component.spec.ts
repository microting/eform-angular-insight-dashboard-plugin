import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartPreviewComponent } from './dashboard-chart-preview.component';

describe('DashboardChartPreviewComponent', () => {
  let component: DashboardChartPreviewComponent;
  let fixture: ComponentFixture<DashboardChartPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardChartPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
