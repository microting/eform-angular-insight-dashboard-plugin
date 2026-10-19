import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { commonProviders } from '../../../../testing/common-providers';
import { DashboardInterviewsEditComponent } from './dashboard-interviews-edit.component';

describe('DashboardInterviewsEditComponent', () => {
  let fixture: ComponentFixture<DashboardInterviewsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInterviewsEditComponent],
      providers: commonProviders([
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardInterviewsEditComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
