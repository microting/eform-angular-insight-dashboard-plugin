import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChildren} from '@angular/core';
import {DashboardChartTypesEnum, DashboardPeriodUnitsEnum} from '../../../../const/enums';
import {DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardItemsService} from '../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-item-edit',
  templateUrl: './dashboard-item-edit.component.html',
  styleUrls: ['./dashboard-item-edit.component.scss']
})
export class DashboardItemEditComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren('collapse') collapse: any;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() questions: CommonDictionaryModel[] = [];
  @Output() addNewItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() copyItem: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() dashboardItemChanged: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  filterAnswers: CommonDictionaryModel[] = [];
  isCollapsed = true;
  selectedChartType: DashboardChartTypesEnum = 1;
  chartSelectValues = [
    {id: DashboardChartTypesEnum.Line, value: 'Line'},
    {id: DashboardChartTypesEnum.Pie, value: 'Pie'},
    {id: DashboardChartTypesEnum.HorizontalBar, value: 'Horizontal Bar'},
    {id: DashboardChartTypesEnum.HorizontalBarStacked, value: 'Stacked Horizontal Bar'},
    {id: DashboardChartTypesEnum.HorizontalBarGrouped, value: 'Grouped Horizontal Bar'},
    {id: DashboardChartTypesEnum.VerticalBar, value: 'Vertical Bar'},
    {id: DashboardChartTypesEnum.VerticalBarStacked, value: 'Stacked Vertical Bar'},
    {id: DashboardChartTypesEnum.VerticalBarGrouped, value: 'Grouped Vertical Bar'}];
  loadAnswersSub$: Subscription;

  get periodUnits() {
    return DashboardPeriodUnitsEnum;
  }

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  constructor(private dashboardItemsService: InsightDashboardPnDashboardItemsService) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardItem) {
      const currentValue = changes.dashboardItem.currentValue as DashboardItemModel;
      const previousValue = changes.dashboardItem.previousValue as DashboardItemModel;
      this.dashboardItemChanged.emit(changes.dashboardItem.currentValue);

      // Load values for answers
      if (currentValue.firstQuestionId && currentValue.firstQuestionId !== previousValue.firstQuestionId) {
        this.loadAnswers();
      }
      if (currentValue.filterQuestionId && currentValue.filterQuestionId !== previousValue.filterQuestionId) {
        this.loadAnswers();
      }
    }
  }

  loadAnswers() {
    this.loadAnswersSub$ = this.dashboardItemsService.getQuestions()
      .subscribe((data) => {
        if (data && data.success) {
          this.questions = data.model;
        }
      });
  }

  ngOnDestroy(): void {
  }
}
