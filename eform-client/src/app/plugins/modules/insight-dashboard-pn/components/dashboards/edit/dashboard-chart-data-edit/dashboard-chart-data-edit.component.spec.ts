import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardChartDataEditComponent } from './dashboard-chart-data-edit.component';

describe('DashboardChartDataEditComponent', () => {
  let fixture: ComponentFixture<DashboardChartDataEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChartDataEditComponent],
      providers: commonProviders([
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardChartDataEditComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
