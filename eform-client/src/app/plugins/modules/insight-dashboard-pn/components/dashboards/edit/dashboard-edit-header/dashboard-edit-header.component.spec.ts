import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {AuthStateService} from 'src/app/common/store';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardEditHeaderComponent } from './dashboard-edit-header.component';

describe('DashboardEditHeaderComponent', () => {
  let fixture: ComponentFixture<DashboardEditHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEditHeaderComponent],
      providers: commonProviders([
        { provide: AuthStateService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardEditHeaderComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
