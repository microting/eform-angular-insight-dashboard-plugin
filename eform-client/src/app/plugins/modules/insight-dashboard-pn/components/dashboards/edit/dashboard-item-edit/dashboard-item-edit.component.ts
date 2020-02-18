import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChildren} from '@angular/core';
import {DashboardChartTypesEnum, DashboardItemFieldsEnum, DashboardPeriodUnitsEnum} from '../../../../const/enums';
import {DashboardItemModel, DashboardItemQuestionModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardDictionariesService} from '../../../../services';
import {TranslateService} from '@ngx-translate/core';
import {CommonDictionaryExtendedModel} from '../../../../models/common-dictionary-extended.model';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-item-edit',
  templateUrl: './dashboard-item-edit.component.html',
  styleUrls: ['./dashboard-item-edit.component.scss']
})
export class DashboardItemEditComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChildren('collapse') collapse: any;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() questions: DashboardItemQuestionModel[] = [];
  @Input() surveyId = 1;
  @Input() locationsTags: CommonDictionaryExtendedModel[] = [];
  @Output() addNewItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() copyItem: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() dashboardItemChanged: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  filterAnswers: CommonDictionaryModel[] = [];
  questionAnswers: CommonDictionaryModel[] = [];
  loadAnswersSub$: Subscription;
  filteredQuestions: CommonDictionaryModel[] = [];
  allCharts = [];
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

  constructor(private dictionariesService: InsightDashboardPnDashboardDictionariesService, private translateService: TranslateService) {
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

  loadAnswers(isFilter: boolean) {
    this.loadAnswersSub$ = this.dictionariesService.getFilterAnswers({
      filterQuestionId: isFilter ? this.dashboardItem.filterQuestionId : this.dashboardItem.firstQuestionId
    })
      .subscribe((data) => {
        if (data && data.success) {
          if (isFilter) {
            this.filterAnswers = data.model;
          } else {
            this.questionAnswers = data.model;
          }
        }
      });
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardItem) {
      const currentValue = changes.dashboardItem.currentValue as DashboardItemModel;

      // load answers on change fields
      this.dashboardItem[DashboardItemFieldsEnum.firstQuestionId] = currentValue.firstQuestionId;
      this.dashboardItem[DashboardItemFieldsEnum.filterQuestionId] = currentValue.filterQuestionId;
      this.loadAnswers(true);
      this.loadAnswers(false);

      // change available chart types depends on period
      this.fillChartsOptions(currentValue.period);
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
        this.dashboardItem[DashboardItemFieldsEnum.calculateAverage] = false;

        // immutable remove element on position to trigger change detection
        const index = this.questions.findIndex(data => data.id === value);
        this.filteredQuestions = [...this.questions.slice(0, index), ...this.questions.slice(index + 1)];
        this.loadAnswers(true);

        // Load answers to ignore
        this.loadAnswers(false);
        this.dashboardItem.ignoredAnswerValues = [];

        // Set is smiley for model
        this.dashboardItem.isFirstQuestionSmiley = this.questions.find(x => x.id === value).isSmiley;

        this.fillChartsOptions(this.dashboardItem.period);
      }

      if (fieldName === DashboardItemFieldsEnum.filterQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.loadAnswers(true);
      }
      // change available chart types depends on period
      if (fieldName === DashboardItemFieldsEnum.period) {
        this.dashboardItem[DashboardItemFieldsEnum.chartType] = null;

        // If total is changed - show only particular charts
        this.setCharts(value, this.dashboardItem.calculateAverage);
      }
      if (fieldName === DashboardItemFieldsEnum.calculateAverage) {
        if (value) {
          // depends on period set related charts
          if (this.dashboardItem.period !== DashboardPeriodUnitsEnum.Total) {
            this.availableCharts = [this.allCharts[DashboardChartTypesEnum.Line - 1],
              this.allCharts[DashboardChartTypesEnum.HorizontalBarStackedGrouped - 1]];
          } else {
            this.availableCharts = [this.allCharts[DashboardChartTypesEnum.HorizontalBarStackedGrouped - 1]];
          }

        } else {
          this.setCharts(this.dashboardItem.period, this.dashboardItem.calculateAverage);
        }
        this.dashboardItem.chartType = null;
      }
    }
  }

  setCharts(period: DashboardPeriodUnitsEnum, calculateAverage: boolean) {
    if (calculateAverage) {
      this.availableCharts = [
        this.allCharts[DashboardChartTypesEnum.HorizontalBarStackedGrouped - 1]];
      if (period !== DashboardPeriodUnitsEnum.Total) {
        this.availableCharts = [...this.availableCharts, ...this.allCharts[DashboardChartTypesEnum.Line - 1]];
      }
    } else {
      if (period === DashboardPeriodUnitsEnum.Total) {
        this.availableCharts = [...this.allCharts.slice(0, 0), ...this.allCharts.slice(DashboardChartTypesEnum.HorizontalBar)];
      } else {
        this.availableCharts = [...this.allCharts];
      }
    }
  }

  private fillChartsOptions(period: DashboardPeriodUnitsEnum | null) {
    setTimeout(() => {
      const charts = [{
        id: DashboardChartTypesEnum.Line,
        name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.Line])
      }, {
        id: DashboardChartTypesEnum.Pie,
        name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.Pie])
      },
        {
          id: DashboardChartTypesEnum.HorizontalBar,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBar])
        },
        {
          id: DashboardChartTypesEnum.VerticalBar,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBar])
        },

        {
          id: DashboardChartTypesEnum.HorizontalBarStacked,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarStacked])
        },
        {
          id: DashboardChartTypesEnum.HorizontalBarGrouped,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarGrouped])
        },
        {
          id: DashboardChartTypesEnum.VerticalBarStacked,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBarStacked])
        },
        {
          id: DashboardChartTypesEnum.VerticalBarGrouped,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBarGrouped])
        },
        {
          id: DashboardChartTypesEnum.HorizontalBarStackedGrouped,
          name: this.translateService.instant(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarStackedGrouped])
        }];
      this.allCharts = [...charts];
      if (period === null) {
        this.availableCharts = [...this.allCharts];
      } else {
        this.setCharts(period, this.dashboardItem.calculateAverage);
      }
    }, 1000);
  }

  addToArrayIgnoredValues(e: any, answerId: number) {
    const foundAnswer = this.dashboardItem.ignoredAnswerValues.find(x => x.answerId === answerId);
    if (e.target.checked) {
      this.dashboardItem.ignoredAnswerValues.push({answerId: answerId, id: foundAnswer ? foundAnswer.id : null});
    } else {
      this.dashboardItem.ignoredAnswerValues = this.dashboardItem.ignoredAnswerValues.filter(x => x.answerId !== answerId);
    }
    this.fieldChanged(this.dashboardItem.ignoredAnswerValues, DashboardItemFieldsEnum.ignoredAnswerValues);
  }

  isAnswerIgnored(id: number) {
    return this.dashboardItem.ignoredAnswerValues && this.dashboardItem.ignoredAnswerValues.findIndex(x => x.answerId === id) > -1;
  }

  onLocationPositionChanged(e: any, locationTag: CommonDictionaryExtendedModel) {
    debugger;
    const newValue = +e.target.value;
    if (locationTag.isTag) {
      const foundTagIndex = this.dashboardItem.compareLocationsTags.findIndex(x => x.tagId === locationTag.id);
      if (foundTagIndex > 0) {
        this.dashboardItem.compareLocationsTags[foundTagIndex] = {tagId: locationTag.id, position: newValue, locationId: null};
      } else {
        this.dashboardItem.compareLocationsTags.push({tagId: locationTag.id, position: newValue, locationId: null});
      }
    } else {
      const foundLocationIndex = this.dashboardItem.compareLocationsTags.findIndex(x => x.locationId === locationTag.id);
      if (foundLocationIndex > 0) {
        this.dashboardItem.compareLocationsTags[foundLocationIndex] = {locationId: locationTag.id, position: newValue, tagId: null};
      } else {
        this.dashboardItem.compareLocationsTags.push({locationId: locationTag.id, position: newValue, tagId: null});
      }
    }
    this.fieldChanged(this.dashboardItem.compareLocationsTags, DashboardItemFieldsEnum.compareLocationsTags);
  }

  getCurrentLocationValue(locationTag: CommonDictionaryExtendedModel) {
    if (this.dashboardItem && this.dashboardItem.compareLocationsTags) {
      const foundCurrentValue = this.dashboardItem.compareLocationsTags.find(x => x.locationId === locationTag.id);
      return foundCurrentValue ? foundCurrentValue.position : null;
    } return null;

  }
}
