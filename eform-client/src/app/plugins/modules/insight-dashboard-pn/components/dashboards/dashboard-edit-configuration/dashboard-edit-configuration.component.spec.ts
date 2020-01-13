import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEditConfigurationComponent } from './dashboard-edit-configuration.component';

describe('DashboardEditConfigurationComponent', () => {
  let component: DashboardEditConfigurationComponent;
  let fixture: ComponentFixture<DashboardEditConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEditConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
