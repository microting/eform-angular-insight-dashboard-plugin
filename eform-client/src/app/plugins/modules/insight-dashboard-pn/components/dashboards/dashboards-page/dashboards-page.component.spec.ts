import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardDictionariesService} from '../../../services';
import {DashboardsStateService} from '../store/dashboards-state.service';
import { commonProviders } from '../../../testing/common-providers';
import { DashboardsPageComponent } from './dashboards-page.component';

describe('DashboardsPageComponent', () => {
  let fixture: ComponentFixture<DashboardsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsPageComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardDictionariesService, useValue: {} },
        { provide: DashboardsStateService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardsPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
