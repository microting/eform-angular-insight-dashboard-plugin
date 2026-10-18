import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {AuthStateService} from 'src/app/common/store';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardChartEditComponent } from './dashboard-chart-edit.component';

describe('DashboardChartEditComponent', () => {
  let fixture: ComponentFixture<DashboardChartEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChartEditComponent],
      providers: commonProviders([
        { provide: AuthStateService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardChartEditComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
