import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { commonProviders } from '../../../testing/common-providers';
import { SurveyConfigurationEditComponent } from './survey-configuration-edit.component';

describe('SurveyConfigurationEditComponent', () => {
  let fixture: ComponentFixture<SurveyConfigurationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyConfigurationEditComponent],
      providers: commonProviders([
        {
          provide: MAT_DIALOG_DATA,
          useValue: {locations: [], surveys: [], surveyConfig: {locations: []}},
        },
        { provide: InsightDashboardPnSurveyConfigsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(SurveyConfigurationEditComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
