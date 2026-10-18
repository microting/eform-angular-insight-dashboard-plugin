import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardDeleteComponent } from './dashboard-delete.component';

describe('DashboardDeleteComponent', () => {
  let fixture: ComponentFixture<DashboardDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDeleteComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardDeleteComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
