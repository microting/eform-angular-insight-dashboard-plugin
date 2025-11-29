import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {DashboardEditModel, LabelValueExtendedModel} from '../../../../models';
import {set} from 'date-fns';
import {AuthStateService} from 'src/app/common/store';
import {FormControl, FormGroup} from '@angular/forms';
import * as R from 'ramda';

@Component({
  selector: 'app-dashboard-edit-header',
  templateUrl: './dashboard-edit-header.component.html',
  styleUrls: ['./dashboard-edit-header.component.scss'],
  standalone: false,
})
export class DashboardEditHeaderComponent implements OnInit, OnChanges {
  private authStateService = inject(AuthStateService);

  @Input() dashboardEditModel: DashboardEditModel = new DashboardEditModel();
  @Input() availableLocationsTags: LabelValueExtendedModel[] = [];
  @Output()
  dashboardChanged: EventEmitter<DashboardEditModel> = new EventEmitter<DashboardEditModel>();
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      dashboardName: new FormControl(''),
      dateRange: new FormGroup({
        dateFrom: new FormControl(null),
        dateTo: new FormControl(null),
      }),
      location: new FormControl(null), // {isTag: boolean; label: string; value: number;}
      today: new FormControl(false),
    });
    this.form.valueChanges/*.pipe(skip(1))*/.subscribe(value => {
      const dashboardEditModel = {
        ...this.dashboardEditModel,
        dashboardName: value.dashboardName,
        tagId: value.location && value.location.isTag ? value.location.value : null,
        tagName: value.location && value.location.isTag ? value.location.label : null,
        locationId: value.location && !value.location.isTag ? value.location.value : null,
        locationName: value.location && !value.location.isTag ? value.location.label : null,
        answerDates: {
          today: value.today,
          dateFrom: value.dateRange.dateFrom || null,
          dateTo: value.dateRange.dateTo || null
        }
      };
      if (dashboardEditModel.id && !R.equals(dashboardEditModel, this.dashboardEditModel)) {
        this.dashboardChanged.emit(dashboardEditModel);
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardEditModel && changes.dashboardEditModel.currentValue.id) {
      const currentValue = changes.dashboardEditModel.currentValue as DashboardEditModel;
      if (!changes.dashboardEditModel.previousValue.id) {
        const setDate = (date) => {
          return set(date, {
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            date: date.getUTCDate(),
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
          });
        };
        this.form.patchValue({
          dashboardName: currentValue.dashboardName || '',
          location: currentValue.locationId
            ? {isTag: false, label: currentValue.locationName, value: currentValue.locationId}
            : currentValue.tagId
              ? {isTag: true, label: currentValue.tagName, value: currentValue.tagId}
              : null,
          dateRange: {
            dateFrom: (currentValue.answerDates.dateFrom && setDate((currentValue.answerDates.dateFrom as Date))) || null,
            dateTo: (currentValue.answerDates.dateTo && setDate((currentValue.answerDates.dateTo as Date))) || null,
          },
          today: currentValue.answerDates.today || false,
        }, {emitEvent: false});
      }
    }
  }
}
