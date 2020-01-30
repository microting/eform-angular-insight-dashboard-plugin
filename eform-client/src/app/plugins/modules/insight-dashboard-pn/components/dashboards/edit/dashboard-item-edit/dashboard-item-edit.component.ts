import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChildren} from '@angular/core';
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
export class DashboardItemEditComponent implements OnInit, OnDestroy, OnChanges {
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
  filteredQuestions: CommonDictionaryModel[] = [];
  allCharts = [
    {id: DashboardChartTypesEnum.Pie, name: DashboardChartTypesEnum[DashboardChartTypesEnum.Pie]},
    {id: DashboardChartTypesEnum.HorizontalBar, name: DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBar]},
    {id: DashboardChartTypesEnum.VerticalBar, name: DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBar]},
    {id: DashboardChartTypesEnum.Line, name: DashboardChartTypesEnum[DashboardChartTypesEnum.Line]},
    {id: DashboardChartTypesEnum.HorizontalBarStacked, name: DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarStacked]},
    {id: DashboardChartTypesEnum.HorizontalBarGrouped, name: DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarGrouped]},
    {id: DashboardChartTypesEnum.VerticalBarStacked, name: DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBarStacked]},
    {id: DashboardChartTypesEnum.VerticalBarGrouped, name: DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBarGrouped]}
  ];
  availableCharts = [];

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
    this.availableCharts = [...this.allCharts];
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardItem) {
      const currentValue = changes.dashboardItem.currentValue as DashboardItemModel;

      this.dashboardItem[DashboardItemFieldsEnum.firstQuestionId] = currentValue.firstQuestionId;
      this.dashboardItem[DashboardItemFieldsEnum.filterQuestionId] = currentValue.filterQuestionId;
      this.loadAnswers();
    }
    if (changes && changes.questions) {
      this.filteredQuestions = [...this.questions];
    }
  }

  fieldChanged(value: any, fieldName: string) {
    if (this.dashboardItem[fieldName] !== value) {
      this.dashboardItem[fieldName] = value;
      this.dashboardItemChanged.emit(this.dashboardItem);

      // remove filters on change
      if (fieldName === DashboardItemFieldsEnum.firstQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterQuestionId] = null;
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;

        // immutable remove element on position to trigger change detection
        const index = this.questions.findIndex(data => data.id === value);
        this.filteredQuestions = [...this.questions.slice(0, index), ...this.questions.slice(index + 1)];
        this.loadAnswers();
      }

      if (fieldName === DashboardItemFieldsEnum.filterQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.loadAnswers();
      }
      // change available chart types depends on period
      if (fieldName === DashboardItemFieldsEnum.period) {
        this.dashboardItem[DashboardItemFieldsEnum.chartType] = null;

        if (value !== DashboardPeriodUnitsEnum.Total) {
          this.availableCharts = [...this.allCharts.slice(0, 0), ...this.allCharts.slice(3)];
        } else {
          this.availableCharts = [...this.allCharts];
        }
      }
    }
  }
}
