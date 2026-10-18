import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardBlockViewComponent } from './dashboard-block-view.component';

describe('DashboardBlockViewComponent', () => {
  let fixture: ComponentFixture<DashboardBlockViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBlockViewComponent],
      providers: commonProviders([
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardBlockViewComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
