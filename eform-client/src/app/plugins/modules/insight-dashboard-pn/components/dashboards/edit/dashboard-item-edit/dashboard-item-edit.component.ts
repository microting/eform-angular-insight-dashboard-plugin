import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {
  DashboardChartTypesEnum,
  DashboardItemFieldsEnum,
  DashboardItemQuestionTypesEnum,
  DashboardPeriodUnitsEnum
} from '../../../../const/enums';
import {DashboardItemModel, DashboardItemQuestionModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardDictionariesService} from '../../../../services';
import {TranslateService} from '@ngx-translate/core';
import {CommonDictionaryExtendedModel} from '../../../../models/common-dictionary-extended.model';
import {CollapseDirective} from 'angular-bootstrap-md/collapse';
import {InsightDashboardPnCollapseService} from '../../../../services/insight-dashboard-pn-collapse.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-item-edit',
  templateUrl: './dashboard-item-edit.component.html',
  styleUrls: ['./dashboard-item-edit.component.scss']
})
export class DashboardItemEditComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('collapse', { static: true }) collapse: CollapseDirective;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() questions: DashboardItemQuestionModel[] = [];
  @Input() surveyId = 1;
  @Input() locationsTags: CommonDictionaryExtendedModel[] = [];
  @Output() addNewItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() copyItem: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() dashboardItemChanged: EventEmitter<DashboardItemModel> = new EventEmitter<DashboardItemModel>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  firstQuestionType: DashboardItemQuestionTypesEnum = DashboardItemQuestionTypesEnum.Other;
  filterAnswers: CommonDictionaryModel[] = [];
  questionAnswers: CommonDictionaryModel[] = [];
  loadAnswersSub$: Subscription;
  collapseSub$: Subscription;
  filteredQuestions: CommonDictionaryModel[] = [];
  allCharts = [];
  availableCharts = [];

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
      fullName = this.questions.find(x => x.id === this.dashboardItem.firstQuestionId).name;
    }
    if (this.dashboardItem.period && this.firstQuestionType !== DashboardItemQuestionTypesEnum.Text) {
      fullName += ' - ' + this.periodUnits[this.dashboardItem.period];
    }
    if (this.dashboardItem.chartType && this.firstQuestionType !== DashboardItemQuestionTypesEnum.Text) {
      if (this.allCharts.length) {
        fullName += ' - ' + this.allCharts.find(x => x.id === this.dashboardItem.chartType).name;
      }
    }
    return fullName;
  }

  constructor(private dictionariesService: InsightDashboardPnDashboardDictionariesService,
              private translateService: TranslateService, private collapseService: InsightDashboardPnCollapseService) {
  }

  ngOnInit() {
    this.collapseSub$ = this.collapseService.collapse.subscribe(collapsed => {
      if (!collapsed && this.dashboardItem.collapsed) {
        this.dashboardItem.collapsed = false;
        this.collapse.toggle();
        this.resizeCollapse();
      }
      if (collapsed && !this.dashboardItem.collapsed) {
        this.dashboardItem.collapsed = true;
        this.collapse.toggle();
      }
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
        this.dashboardItem.firstQuestionType = this.questions.find(x => x.id === value).type as DashboardItemQuestionTypesEnum;
        this.firstQuestionType = this.dashboardItem.firstQuestionType;

        this.fillInitialChartOptions(this.dashboardItem.period);
      }

      if (fieldName === DashboardItemFieldsEnum.filterQuestionId) {
        this.dashboardItem[DashboardItemFieldsEnum.filterAnswerId] = null;
        this.loadAnswers(true);
      }
      // change available chart types depends on period
      if (fieldName === DashboardItemFieldsEnum.period
        || fieldName === DashboardItemFieldsEnum.calculateAverage
        || fieldName === DashboardItemFieldsEnum.compareEnabled) {
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
          ...this.allCharts.slice(DashboardChartTypesEnum.Line, DashboardChartTypesEnum.VerticalBar - 2)
        ];
      } else {
        this.availableCharts = [
          this.allCharts[DashboardChartTypesEnum.Line - 1],
          ...this.allCharts.slice(DashboardChartTypesEnum.HorizontalBarStacked, DashboardChartTypesEnum.HorizontalBarStackedGrouped)
        ];
      }
    }

    if (this.dashboardItem.calculateAverage) {
      if (this.dashboardItem.period !== DashboardPeriodUnitsEnum.Total) {
        this.availableCharts = [this.allCharts[DashboardChartTypesEnum.Line - 1]];
      } else {
        this.availableCharts = [];
      }
    }
  }

  private fillInitialChartOptions(period: DashboardPeriodUnitsEnum | null) {
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
      this.setAvailableCharts();
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
    const newValue = +e.target.value;
    if (!this.dashboardItem.compareLocationsTags) {
      this.dashboardItem.compareLocationsTags = [];
    }
    if (locationTag.isTag) {
      const foundTagIndex = this.dashboardItem.compareLocationsTags.findIndex(x => x.tagId === locationTag.id);
      if (foundTagIndex > -1) {
        if (newValue > 0) {
          this.dashboardItem.compareLocationsTags[foundTagIndex] = {tagId: locationTag.id, position: newValue, locationId: null};
        } else {
          this.dashboardItem.compareLocationsTags.splice(foundTagIndex, 1);
        }
      } else {
        if (newValue) {
          this.dashboardItem.compareLocationsTags.push({tagId: locationTag.id, position: newValue, locationId: null});
        }
      }
    } else {
      const foundLocationIndex = this.dashboardItem.compareLocationsTags.findIndex(x => x.locationId === locationTag.id);
      if (foundLocationIndex > -1) {
        if (newValue > 0) {
          this.dashboardItem.compareLocationsTags[foundLocationIndex] = {locationId: locationTag.id, position: newValue, tagId: null};
        } else {
          this.dashboardItem.compareLocationsTags.splice(foundLocationIndex, 1);
        }
      } else {
        if (newValue) {
          this.dashboardItem.compareLocationsTags.push({locationId: locationTag.id, position: newValue, tagId: null});
        }
      }
    }
    this.fieldChanged(this.dashboardItem.compareLocationsTags, DashboardItemFieldsEnum.compareLocationsTags);
  }

  getCurrentLocationValue(locationTag: CommonDictionaryExtendedModel) {
    if (this.dashboardItem && this.dashboardItem.compareLocationsTags) {
      if (locationTag.isTag) {
        const foundCurrentValue = this.dashboardItem.compareLocationsTags.find(x => x.tagId === locationTag.id);
        return foundCurrentValue ? foundCurrentValue.position : null;
      } else {
        const foundCurrentValue = this.dashboardItem.compareLocationsTags.find(x => x.locationId === locationTag.id);
        return foundCurrentValue ? foundCurrentValue.position : null;
      }
    }
    return null;
  }

  resizeCollapse() {
    // collapse resize trigger to recalculate size
    this.collapse.resize();
  }
}
