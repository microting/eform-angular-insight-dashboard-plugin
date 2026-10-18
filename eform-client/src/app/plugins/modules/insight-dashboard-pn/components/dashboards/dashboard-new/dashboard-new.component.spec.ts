import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardsService} from '../../../services';
import { commonProviders } from '../../../testing/common-providers';
import { DashboardNewComponent } from './dashboard-new.component';

describe('DashboardNewComponent', () => {
  let fixture: ComponentFixture<DashboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNewComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardNewComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
