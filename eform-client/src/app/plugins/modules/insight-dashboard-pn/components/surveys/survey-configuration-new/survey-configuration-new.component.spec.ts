import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import { commonProviders } from '../../../testing/common-providers';
import { SurveyConfigurationNewComponent } from './survey-configuration-new.component';

describe('SurveyConfigurationNewComponent', () => {
  let fixture: ComponentFixture<SurveyConfigurationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyConfigurationNewComponent],
      providers: commonProviders([
        { provide: InsightDashboardPnSurveyConfigsService, useValue: {} },
      ]),
    }).compileComponents();
    fixture = TestBed.createComponent(SurveyConfigurationNewComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
