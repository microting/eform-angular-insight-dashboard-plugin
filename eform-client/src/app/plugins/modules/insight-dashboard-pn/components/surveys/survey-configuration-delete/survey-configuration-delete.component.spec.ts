import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import { commonProviders } from '../../../testing/common-providers';
import { SurveyConfigurationDeleteComponent } from './survey-configuration-delete.component';

describe('SurveyConfigurationDeleteComponent', () => {
  let fixture: ComponentFixture<SurveyConfigurationDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyConfigurationDeleteComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnSurveyConfigsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(SurveyConfigurationDeleteComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
