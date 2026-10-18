import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {InsightDashboardPnDashboardDictionariesService} from '../../../../services';
import {DragulaService} from 'ng2-dragula';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardEditComponent } from './dashboard-edit.component';

describe('DashboardEditComponent', () => {
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEditComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnDashboardsService, useValue: {} },
        { provide: InsightDashboardPnDashboardDictionariesService, useValue: {} },
        { provide: DragulaService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardEditComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
