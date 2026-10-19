import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import { commonProviders } from '../../../testing/common-providers';
import { SurveyConfigurationStatusComponent } from './survey-configuration-status.component';

describe('SurveyConfigurationStatusComponent', () => {
  let fixture: ComponentFixture<SurveyConfigurationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyConfigurationStatusComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnSurveyConfigsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(SurveyConfigurationStatusComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
