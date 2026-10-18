import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardCopyComponent } from './dashboard-copy.component';

describe('DashboardCopyComponent', () => {
  let fixture: ComponentFixture<DashboardCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCopyComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardCopyComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
