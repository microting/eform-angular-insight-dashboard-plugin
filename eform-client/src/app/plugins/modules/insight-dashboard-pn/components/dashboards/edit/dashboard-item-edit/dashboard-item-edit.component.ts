import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  DashboardChartTypesEnum,
  DashboardItemFieldsEnum,
  DashboardItemQuestionTypesEnum,
  DashboardPeriodUnitsEnum,
} from '../../../../const/enums';
import {
  DashboardAnswerDatesModel,
  DashboardItemModel,
  DashboardItemQuestionModel,
  LabelValueExtendedModel,
} from '../../../../models';
import {CommonDictionaryModel} from 'src/app/common/models';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription, zip} from 'rxjs';
import {
  InsightDashboardPnDashboardDictionariesService,
  InsightDashboardPnDashboardItemsService,
} from '../../../../services';
import {TranslateService} from '@ngx-translate/core';
import {InsightDashboardPnCollapseService} from '../../../../services/insight-dashboard-pn-collapse.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-item-edit',
  templateUrl: './dashboard-item-edit.component.html',
  styleUrls: ['./dashboard-item-edit.component.scss'],
})
export class DashboardItemEditComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() questions: DashboardItemQuestionModel[] = [];
  @Input() selectedSurveyId = 1;
  @Input() dashboardId = 1;
  @Input() locationsTags: LabelValueExtendedModel[] = [];
  @Input() selectedTagId: number;
  @Input() selectedLocationId: number;
  @Input() selectedAnswerDates: DashboardAnswerDatesModel;
  @Output() addNewItem: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  copyItem: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output()
  dashboardItemChanged: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  firstQuestionType: DashboardItemQuestionTypesEnum =
    DashboardItemQuestionTypesEnum.Other;
  filterAnswers: CommonDictionaryModel[] = [];
  questionAnswers: CommonDictionaryModel[] = [];
  loadAnswersSub$: Subscription;
  collapseSub$: Subscription;
  filteredQuestions: CommonDictionaryModel[] = [];
  allCharts = [];
  availableCharts = [];
  periods = [];
  translatePeriodsSub$: Subscription;

  get periodUnits() {
    return DashboardPeriodUnitsEnum;
  }

  get itemFields() {
    return DashboardItemFieldsEnum;
  }

  get questionTypes() {
    return DashboardItemQuestionTypesEnum;
  }

  get dashboardItemFullName() {
    let fullName = '';
    if (this.dashboardItem.firstQuestionId && this.questions.length > 0) {
      if (
        this.questions.find(
          (x) => x.id === this.dashboardItem.firstQuestionId
        ) === undefined
      ) {
        fullName = 'Removed';
      } else {
        fullName = this.questions.find(
          (x) => x.id === this.dashboardItem.firstQuestionId
        ).name;
      }
    }
    if (
      this.dashboardItem.period &&
      this.firstQuestionType !== DashboardItemQuestionTypesEnum.Text
    ) {
      fullName +=
        ' - ' +
        this.translateService.instant(
          this.periodUnits[this.dashboardItem.period]
        );
    }
    if (
      this.dashboardItem.chartType &&
      this.firstQuestionType !== DashboardItemQuestionTypesEnum.Text
    ) {
      if (this.allCharts.length) {
        fullName +=
          ' - ' +
          this.allCharts.find((x) => x.id === this.dashboardItem.chartType)
            .name;
      }
    }
    return fullName;
  }

  constructor(
    private dictionariesService: InsightDashboardPnDashboardDictionariesService,
    private translateService: TranslateService,
    private collapseService: InsightDashboardPnCollapseService,
    private dashboardItemService: InsightDashboardPnDashboardItemsService
  ) {
  }

  ngOnInit() {
    this.collapseSub$ = this.collapseService.collapse.subscribe((collapsed) => {
      if (!collapsed && this.dashboardItem.collapsed) {
        this.dashboardItem.collapsed = false;
      }
      if (collapsed && !this.dashboardItem.collapsed) {
        this.dashboardItem.collapsed = true;
      }
    });
    this.translatePeriodsSub$ = zip(
      this.translateService.stream(this.periodUnits[this.periodUnits.Week]),
      this.translateService.stream(this.periodUnits[this.periodUnits.Month]),
      this.translateService.stream(this.periodUnits[this.periodUnits.Quarter]),
      this.translateService.stream(this.periodUnits[this.periodUnits.SixMonth]),
      this.translateService.stream(this.periodUnits[this.periodUnits.Year]),
      this.translateService.stream(this.periodUnits[this.periodUnits.Total]),
    ).subscribe(([week, month, quarter, sixMonth, year, total]) => {
      this.periods = [
        {id: this.periodUnits.Week, name: week},
        {id: this.periodUnits.Month, name: month},
        {id: this.periodUnits.Quarter, name: quarter},
        {id: this.periodUnits.SixMonth, name: sixMonth},
        {id: this.periodUnits.Year, name: year},
        {id: this.periodUnits.Total, name: total}
      ];
    });
  }

  addNew(position: number) {
    this.addNewItem.emit(position);
  }

  copy(model: DashboardItemModel) {
    model = {...model, collapsed: false};
    this.copyItem.emit(model);
  }

  delete(position: number) {
    this.deleteItem.emit(position);
  }

  loadAnswers(isFilter: boolean) {
    if (isFilter && this.dashboardItem.filterQuestionId) {
      this.loadAnswersSub$ = this.dictionariesService
        .getFilterAnswers({
          filterQuestionId: this.dashboardItem.filterQuestionId,
        })
        .subscribe((data) => {
          if (data && data.success) {
            this.filterAnswers = data.model;
          }
        });
    } else if (this.dashboardItem.firstQuestionId) {
      this.loadAnswersSub$ = this.dictionariesService
        .getFilterAnswers({
          filterQuestionId: this.dashboardItem.firstQuestionId,
        })
        .subscribe((data) => {
          if (data && data.success) {
            this.questionAnswers = data.model;
          }
        });
    }
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardItem) {
      const currentValue = changes.dashboardItem
        .currentValue as DashboardItemModel;

      // load answers on change fields
      this.dashboardItem[DashboardItemFieldsEnum.firstQuestionId] =
        currentValue.firstQuestionId;
      this.dashboardItem[DashboardItemFieldsEnum.filterQuestionId] =
        currentValue.filterQuestionId;
      this.loadAnswers(true);
      this.loadAnswers(false);

      // set separate property for smiley
      this.firstQuestionType = currentValue.firstQuestionType;

      // change available chart types depends on period
      this.fillInitialChartOptions(currentValue.period);
    }
    if (changes && changes.questions) {
      this.filteredQuestions = [...this.questions];
    }
  }

  fieldChanged(value: any, fieldName: string) {
    if (
      this.dashboardItem[fieldName] !== value ||
      fieldName === DashboardItemFieldsEnum.compareLocationsTags ||
      fieldName === DashboardItemFieldsEnum.ignoredAnswerValues
    ) {
      this.dashboardItem[fieldName] = value;
      this.dashboardItemChanged.emit(this.dashboardItem);

      // remove filters on change
      if (fieldName === DashboardItemFieldsEnum.firstQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterQuestionId] = null;
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.dashboardItem[DashboardItemFieldsEnum.calculateAverage] = false;

        // immutable remove element on position to trigger change detection
        const index = this.questions.findIndex((data) => data.id === value);
        this.filteredQuestions = [
          ...this.questions.slice(0, index),
          ...this.questions.slice(index + 1),
        ];
        this.loadAnswers(true);

        // Load answers to ignore
        this.loadAnswers(false);
        this.dashboardItem.ignoredAnswerValues = [];

        // Set is smiley for model
        this.dashboardItem.firstQuestionType = this.questions.find(
          (x) => x.id === value
        ).type as DashboardItemQuestionTypesEnum;
        this.firstQuestionType = this.dashboardItem.firstQuestionType;

        this.fillInitialChartOptions(this.dashboardItem.period);
      }

      if (fieldName === DashboardItemFieldsEnum.filterQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.loadAnswers(true);
      }
      // change available chart types depends on period
      if (
        fieldName === DashboardItemFieldsEnum.period ||
        fieldName === DashboardItemFieldsEnum.calculateAverage ||
        fieldName === DashboardItemFieldsEnum.compareEnabled
      ) {
        this.setAvailableCharts(true);
      }
    }
  }

  setAvailableCharts(forceNewChartSelection?: boolean) {
    if (forceNewChartSelection) {
      this.dashboardItem.chartType = null;
    }
    this.availableCharts = [...this.allCharts];

    if (this.dashboardItem && this.dashboardItem.period) {
      if (this.dashboardItem.period === DashboardPeriodUnitsEnum.Total) {
        this.availableCharts = [
          ...this.allCharts.slice(
            DashboardChartTypesEnum.Line,
            DashboardChartTypesEnum.VerticalBar - 1
          ),
        ];
      } else {
        this.availableCharts = [
          this.allCharts[DashboardChartTypesEnum.Line - 1],
          ...this.allCharts.slice(
            DashboardChartTypesEnum.HorizontalBarStacked - 1,
            DashboardChartTypesEnum.HorizontalBarStackedGrouped
          ),
        ];
      }
    }

    if (this.dashboardItem.calculateAverage) {
      if (this.dashboardItem.period !== DashboardPeriodUnitsEnum.Total) {
        this.availableCharts = [
          this.allCharts[DashboardChartTypesEnum.Line - 1],
        ];
      } else {
        this.availableCharts = [];
      }
    }
  }

  private fillInitialChartOptions(period: DashboardPeriodUnitsEnum | null) {
    zip(
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.Line]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.Pie]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.PieGrid]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBar]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBar]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarStacked]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarGrouped]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBarStacked]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.VerticalBarGrouped]),
      this.translateService.stream(DashboardChartTypesEnum[DashboardChartTypesEnum.HorizontalBarStackedGrouped]),
    ).subscribe(([
                   line,
                   pie,
                   pieGrid,
                   horizontalBar,
                   verticalBar,
                   horizontalBarStacked,
                   horizontalBarGrouped,
                   verticalBarStacked,
                   verticalBarGrouped,
                   horizontalBarStackedGrouped]) => {
      const charts = [
        {
          id: DashboardChartTypesEnum.Line,
          name: line,
        },
        {
          id: DashboardChartTypesEnum.Pie,
          name: pie,
        },
        {
          id: DashboardChartTypesEnum.PieGrid,
          name: pieGrid,
        },
        {
          id: DashboardChartTypesEnum.HorizontalBar,
          name: horizontalBar,
        },
        {
          id: DashboardChartTypesEnum.VerticalBar,
          name: verticalBar,
        },
        {
          id: DashboardChartTypesEnum.HorizontalBarStacked,
          name: horizontalBarStacked,
        },
        {
          id: DashboardChartTypesEnum.HorizontalBarGrouped,
          name: horizontalBarGrouped,
        },
        {
          id: DashboardChartTypesEnum.VerticalBarStacked,
          name: verticalBarStacked,
        },
        {
          id: DashboardChartTypesEnum.VerticalBarGrouped,
          name: verticalBarGrouped,
        },
        {
          id: DashboardChartTypesEnum.HorizontalBarStackedGrouped,
          name: horizontalBarStackedGrouped,
        },
      ];
      this.allCharts = [...charts];
      this.setAvailableCharts();
    });
  }

  addToArrayIgnoredValues(checked: boolean, answerId: number) {
    const foundAnswer = this.dashboardItem.ignoredAnswerValues.find(
      (x) => x.answerId === answerId
    );
    if (checked) {
      this.dashboardItem.ignoredAnswerValues.push({
        answerId: answerId,
        id: foundAnswer ? foundAnswer.id : null,
      });
    } else {
      this.dashboardItem.ignoredAnswerValues = this.dashboardItem.ignoredAnswerValues.filter(
        (x) => x.answerId !== answerId
      );
    }
    this.fieldChanged(
      this.dashboardItem.ignoredAnswerValues,
      DashboardItemFieldsEnum.ignoredAnswerValues
    );
  }

  isAnswerIgnored(id: number) {
    return (
      this.dashboardItem.ignoredAnswerValues &&
      this.dashboardItem.ignoredAnswerValues.findIndex(
        (x) => x.answerId === id
      ) > -1
    );
  }

  onLocationPositionChanged(e: any, locationTag: LabelValueExtendedModel) {
    const newValue = +e.target.value;
    if (!this.dashboardItem.compareLocationsTags) {
      this.dashboardItem.compareLocationsTags = [];
    }
    if (locationTag.isTag) {
      const foundTagIndex = this.dashboardItem.compareLocationsTags.findIndex(
        (x) => x.tagId === locationTag.value
      );
      if (foundTagIndex > -1) {
        if (newValue > 0) {
          this.dashboardItem.compareLocationsTags[foundTagIndex] = {
            tagId: locationTag.value,
            position: newValue,
            locationId: null,
          };
        } else {
          this.dashboardItem.compareLocationsTags.splice(foundTagIndex, 1);
        }
      } else {
        if (newValue) {
          this.dashboardItem.compareLocationsTags.push({
            tagId: locationTag.value,
            position: newValue,
            locationId: null,
          });
        }
      }
    } else {
      const foundLocationIndex = this.dashboardItem.compareLocationsTags.findIndex(
        (x) => x.locationId === locationTag.value
      );
      if (foundLocationIndex > -1) {
        if (newValue > 0) {
          this.dashboardItem.compareLocationsTags[foundLocationIndex] = {
            locationId: locationTag.value,
            position: newValue,
            tagId: null,
          };
        } else {
          this.dashboardItem.compareLocationsTags.splice(foundLocationIndex, 1);
        }
      } else {
        if (newValue) {
          this.dashboardItem.compareLocationsTags.push({
            locationId: locationTag.value,
            position: newValue,
            tagId: null,
          });
        }
      }
    }
    this.fieldChanged(
      this.dashboardItem.compareLocationsTags,
      DashboardItemFieldsEnum.compareLocationsTags
    );
  }

  getCurrentLocationValue(locationTag: LabelValueExtendedModel) {
    if (this.dashboardItem && this.dashboardItem.compareLocationsTags) {
      if (locationTag.isTag) {
        const foundCurrentValue = this.dashboardItem.compareLocationsTags.find(
          (x) => x.tagId === locationTag.value
        );
        return foundCurrentValue ? foundCurrentValue.position : null;
      } else {
        const foundCurrentValue = this.dashboardItem.compareLocationsTags.find(
          (x) => x.locationId === locationTag.value
        );
        return foundCurrentValue ? foundCurrentValue.position : null;
      }
    }
    return null;
  }
}
