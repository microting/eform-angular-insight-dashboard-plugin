import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {DashboardEditModel, LabelValueExtendedModel} from '../../../../models';
import {DashboardFieldsEnum} from '../../../../const/enums';
import {format, parse, parseISO, parseJSON,} from 'date-fns';
import {DateTimeAdapter} from '@danielmoncada/angular-datetime-picker';
import {AuthStateService} from 'src/app/common/store';
import {FormControl, FormGroup} from '@angular/forms';
import * as R from 'ramda';

@Component({
  selector: 'app-dashboard-edit-header',
  templateUrl: './dashboard-edit-header.component.html',
  styleUrls: ['./dashboard-edit-header.component.scss'],
})
export class DashboardEditHeaderComponent implements OnInit, OnChanges {
  @Input() dashboardEditModel: DashboardEditModel = new DashboardEditModel();
  @Input() availableLocationsTags: LabelValueExtendedModel[] = [];
  @Output()
  dashboardChanged: EventEmitter<DashboardEditModel> = new EventEmitter<DashboardEditModel>();
  form: FormGroup;
  private standartDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;

  get dashboardFields() {
    return DashboardFieldsEnum;
  }

  constructor(
    dateTimeAdapter: DateTimeAdapter<any>,
    authStateService: AuthStateService) {
    dateTimeAdapter.setLocale(authStateService.currentUserLocale);
    this.form = new FormGroup({
      dashboardName: new FormControl(''),
      dateRange: new FormControl([null, null]), // [dateFrom: Date, dateTo: Date]
      location: new FormControl(null), // {isTag: boolean; label: string; value: number;}
      today: new FormControl(false),
    });
    this.form.valueChanges.subscribe(value => {
      const dashboardEditModel = {
        ...this.dashboardEditModel,
        dashboardName: value.dashboardName,
        tagId: value.location && value.location.isTag ? value.location.value : null,
        tagName: value.location && value.location.isTag ? value.location.label : null,
        locationId: value.location && !value.location.isTag ? value.location.value : null,
        locationName: value.location && !value.location.isTag ? value.location.label : null,
        answerDates: {
          today: value.today,
          dateFrom: value.dateRange[0] ? format(value.dateRange[0], this.standartDateTimeFormat) : null,
          dateTo: value.dateRange[1] ? format(value.dateRange[1], this.standartDateTimeFormat) : null
        }
      };
      if(!R.equals(dashboardEditModel, this.dashboardEditModel)) {
        this.dashboardChanged.emit(dashboardEditModel);
      }
    })
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardEditModel) {
      const currentValue = changes.dashboardEditModel.currentValue as DashboardEditModel;
      const dashboardEditModel = {
        ...this.dashboardEditModel,
        dashboardName: this.form.value.dashboardName,
        tagId: this.form.value.location && this.form.value.location.isTag ? this.form.value.location.value : null,
        tagName: this.form.value.location && this.form.value.location.isTag ? this.form.value.location.label : null,
        locationId: this.form.value.location && !this.form.value.location.isTag ? this.form.value.location.value : null,
        locationName: this.form.value.location && !this.form.value.location.isTag ? this.form.value.location.label : null,
        answerDates: {
          today: this.form.value.today,
          dateFrom: this.form.value.dateRange[0] ? format(this.form.value.dateRange[0], this.standartDateTimeFormat) : null,
          dateTo: this.form.value.dateRange[1] ? format(this.form.value.dateRange[1], this.standartDateTimeFormat) : null
        }
      };
      if(!R.equals(dashboardEditModel, this.dashboardEditModel)) {
        if (currentValue.answerDates && currentValue.answerDates.dateFrom && currentValue.answerDates.dateTo) {
          this.form.get('dateRange')
            .setValue([
              parse(currentValue.answerDates.dateFrom, this.standartDateTimeFormat, new Date()),
              parse(currentValue.answerDates.dateTo, this.standartDateTimeFormat, new Date())
            ], {emitEvent: false});
          this.form.get('today')
            .setValue(currentValue.answerDates.today || false, {emitEvent: false});
        }
        this.form.patchValue({
          dashboardName: currentValue.dashboardName || '',
          location: currentValue.locationId
            ? {isTag: false, label: currentValue.locationName, value: currentValue.locationId}
            : currentValue.tagId
              ? {isTag: true, label: currentValue.tagName, value: currentValue.tagId}
              : null,
        }, {emitEvent: false});
      }
    }
  }
}
