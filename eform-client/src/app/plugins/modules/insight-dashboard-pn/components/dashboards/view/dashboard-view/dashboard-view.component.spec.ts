import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardViewComponent } from './dashboard-view.component';

describe('DashboardViewComponent', () => {
  let fixture: ComponentFixture<DashboardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardViewComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardViewComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
