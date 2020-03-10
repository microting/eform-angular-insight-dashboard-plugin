import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DashboardEditModel, DashboardItemModel} from '../../../../models';
import {DashboardFieldsEnum, DashboardItemFieldsEnum} from '../../../../const/enums';
import {CommonDictionaryExtendedModel} from '../../../../models/common-dictionary-extended.model';
import * as moment from 'moment';
import {parse} from 'date-fns';

@Component({
  selector: 'app-dashboard-edit-header',
  templateUrl: './dashboard-edit-header.component.html',
  styleUrls: ['./dashboard-edit-header.component.scss']
})
export class DashboardEditHeaderComponent implements OnInit, OnChanges {
  @Input() dashboardEditModel: DashboardEditModel = new DashboardEditModel;
  @Input() availableLocationsTags: CommonDictionaryExtendedModel[] = [];
  @Output() dashboardChanged: EventEmitter<DashboardEditModel> = new EventEmitter<DashboardEditModel>();
  selectedLocationId: number | null;
  reportTagId: number | null;
  selectedLocationTagId: number;
  selectedDateRange = [];

  get dashboardFields() {
    return DashboardFieldsEnum;
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    debugger;
    if (changes && changes.dashboardEditModel) {
      const currentValue = changes.dashboardEditModel.currentValue as DashboardEditModel;
      this.selectedLocationTagId = currentValue.tagId ? currentValue.tagId : currentValue.locationId;

      if (currentValue.answerDates) {
        if (this.selectedDateRange) {
          this.selectedDateRange = [
            currentValue.answerDates.dateFrom ? parse(currentValue.answerDates.dateFrom) : null,
            currentValue.answerDates.dateTo ? parse(currentValue.answerDates.dateTo) : null
          ];
        } else {
          this.selectedDateRange = [currentValue.answerDates.dateFrom, currentValue.answerDates.dateTo];
        }
      }
    }
  }

  fieldChanged(value: any, fieldName: string) {
    debugger;
    switch (fieldName) {
      case DashboardFieldsEnum.dashboardName:
        this.dashboardEditModel.dashboardName = value;
        break;
      case DashboardFieldsEnum.dateFrom:
        this.dashboardEditModel.answerDates.dateFrom = value ? value.format('YYYY/MM/DD') : null;
        break;
      case DashboardFieldsEnum.dateTo:
        this.dashboardEditModel.answerDates.dateTo = value ? value.format('YYYY/MM/DD') : null;
        break;
      case DashboardFieldsEnum.today:
        this.dashboardEditModel.answerDates.today = value;
        break;
      case DashboardFieldsEnum.tagId:
        this.dashboardEditModel.tagId = value;
        break;
      case DashboardFieldsEnum.locationId:
        this.dashboardEditModel.locationId = value;
        break;
    }
    this.dashboardChanged.emit(this.dashboardEditModel);
  }


  onLocationTagSelected(model: any) {
    if (model.isTag) {
      this.reportTagId = model.id;
      this.selectedLocationId = null;
      this.fieldChanged(model.id, DashboardFieldsEnum.tagId);
    } else {
      this.selectedLocationId = model.id;
      this.reportTagId = null;
      this.fieldChanged(model.id, DashboardFieldsEnum.locationId);
    }
  }

  clearDateTo() {
    this.selectedDateRange = [this.selectedDateRange[0], null];
    this.fieldChanged(null, DashboardFieldsEnum.dateTo);
  }

  clearDateFrom() {
    this.selectedDateRange = [null, this.selectedDateRange[1]];
    this.fieldChanged(null, DashboardFieldsEnum.dateFrom);
  }
}
