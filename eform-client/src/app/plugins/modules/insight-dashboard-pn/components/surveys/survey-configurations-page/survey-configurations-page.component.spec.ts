import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {InsightDashboardPnDashboardDictionariesService} from '../../../services';
import {SitesService} from 'src/app/common/services';
import {SurveysStateService} from '../store/surveys-state.service';
import { commonProviders } from '../../../testing/common-providers';
import { SurveyConfigurationsPageComponent } from './survey-configurations-page.component';

describe('SurveyConfigurationsPageComponent', () => {
  let fixture: ComponentFixture<SurveyConfigurationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyConfigurationsPageComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnSurveyConfigsService, useValue: {} },
        { provide: InsightDashboardPnDashboardDictionariesService, useValue: {} },
        { provide: SitesService, useValue: {} },
        { provide: SurveysStateService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(SurveyConfigurationsPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
