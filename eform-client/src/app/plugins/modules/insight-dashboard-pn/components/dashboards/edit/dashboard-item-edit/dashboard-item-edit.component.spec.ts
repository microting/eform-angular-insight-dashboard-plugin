import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardDictionariesService} from '../../../../services';
import {InsightDashboardPnDashboardItemsService} from '../../../../services';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardItemEditComponent } from './dashboard-item-edit.component';

describe('DashboardItemEditComponent', () => {
  let fixture: ComponentFixture<DashboardItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardItemEditComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardDictionariesService, useValue: {} },
        { provide: InsightDashboardPnDashboardItemsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardItemEditComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
