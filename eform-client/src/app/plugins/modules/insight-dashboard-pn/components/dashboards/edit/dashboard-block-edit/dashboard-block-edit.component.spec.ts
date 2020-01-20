import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBlockEditComponent } from './dashboard-block-edit.component';

describe('DashboardBlockComponent', () => {
  let component: DashboardBlockEditComponent;
  let fixture: ComponentFixture<DashboardBlockEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBlockEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBlockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
