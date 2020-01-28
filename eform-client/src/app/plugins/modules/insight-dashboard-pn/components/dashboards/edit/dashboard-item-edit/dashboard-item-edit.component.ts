import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChildren} from '@angular/core';
import {DashboardChartTypesEnum, DashboardItemFieldsEnum, DashboardPeriodUnitsEnum} from '../../../../const/enums';
import {DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardDictionariesService} from '../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-item-edit',
  templateUrl: './dashboard-item-edit.component.html',
  styleUrls: ['./dashboard-item-edit.component.scss']
})
export class DashboardItemEditComponent implements OnInit, OnDestroy {
  @ViewChildren('collapse') collapse: any;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() questions: CommonDictionaryModel[] = [];
  @Input() surveyId = 1;
  @Output() addNewItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() copyItem: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() dashboardItemChanged: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  filterAnswers: CommonDictionaryModel[] = [];
  loadAnswersSub$: Subscription;

  get periodUnits() {
    return DashboardPeriodUnitsEnum;
  }

  get itemFields() {
    return DashboardItemFieldsEnum;
  }

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  constructor(private dictionariesService: InsightDashboardPnDashboardDictionariesService) {
  }

  ngOnInit() {
  }

  addNew(position: number) {
    this.addNewItem.emit(position);
  }

  copy(model: DashboardItemModel) {
    this.copyItem.emit(model);
  }

  delete(position: number) {
    this.deleteItem.emit(position);
  }

  loadAnswers() {
    this.loadAnswersSub$ = this.dictionariesService.getFilterAnswers({
      filterQuestion: this.dashboardItem.filterQuestionId,
      firstQuestion: this.dashboardItem.firstQuestionId
    })
      .subscribe((data) => {
        if (data && data.success) {
          this.filterAnswers = data.model;
        }
      });
  }

  ngOnDestroy(): void {
  }

  fieldChanged(value: any, fieldName: string) {
    if (this.dashboardItem[fieldName] !== value) {
      this.dashboardItem[fieldName] = value;
      this.dashboardItemChanged.emit(this.dashboardItem);

      // remove filters on change
      if (fieldName === DashboardItemFieldsEnum.firstQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterQuestionId] = null;
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.loadAnswers();
      }
      if (fieldName === DashboardItemFieldsEnum.filterQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.loadAnswers();
      }
    }
  }
}
