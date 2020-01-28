import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardDictionariesService, InsightDashboardPnDashboardsService} from '../../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardEditModel, DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';
import {DashboardChartTypesEnum} from '../../../../const/enums';
import {DragulaService} from 'ng2-dragula';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-edit-configuration',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss']
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  updateDashboardSub$: Subscription;
  filterQuestionsSub$: Subscription;
  getDashboardSub$: Subscription;
  dashboardEditModel: DashboardEditModel = new DashboardEditModel();
  questions: CommonDictionaryModel[] = [];
  selectedDashboardId: number;
  spinnerStatus = false;

  constructor(private dashboardsService: InsightDashboardPnDashboardsService, private router: Router, private route: ActivatedRoute,
              private dashboardItemsService: InsightDashboardPnDashboardDictionariesService, private dragulaService: DragulaService) {
    // dragulaService.createGroup('ITEMS', {
    //   moves: (el, source, handle, sibling) => !el.classList.contains('no-drag')
    // });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedDashboardId = params['dashboardId'];
      this.getDashboardForEdit(this.selectedDashboardId);
    });
  }

  updateDashboard() {
    this.spinnerStatus = true;
    this.updateDashboardSub$ = this.dashboardsService.update(this.dashboardEditModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['../../', this.dashboardEditModel.id], {relativeTo: this.route}).then();
        }
        this.spinnerStatus = false;
      });
  }

  getDashboardForEdit(dashboardId: number) {
    this.getDashboardSub$ = this.dashboardsService.getSingleForEdit(dashboardId)
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardEditModel = data.model;
        }
        this.getFilterQuestions(data.model.surveyId);
        this.spinnerStatus = false;
      });
  }

  getFilterQuestions(surveyId: number) {
    this.filterQuestionsSub$ = this.dashboardItemsService.getQuestions(surveyId)
      .subscribe((data) => {
        if (data && data.success) {
          this.questions = data.model;
        }
      });
  }

  onAddNewBlock(position: number) {
    const newItem = new DashboardItemModel();
    newItem.chartType = DashboardChartTypesEnum.Line;
    this.dashboardEditModel.items.splice(position, 0, newItem);
    this.actualizeBlockPositions();
  }

  onCopyBlock(model: DashboardItemModel) {
    const modelCopy = {...model};
    delete modelCopy.id;
    this.dashboardEditModel.items.splice(model.position, 0, modelCopy);
    this.actualizeBlockPositions();
  }

  onDeleteBlock(position: number) {
    // Remove block on specific position
    this.dashboardEditModel.items =
      this.dashboardEditModel.items
        .filter(x => x.position !== position);
    this.actualizeBlockPositions();
  }

  ngOnDestroy(): void {
  }

  actualizeBlockPositions() {
    // Actualize position after any actions
    for (let i = 0; i < this.dashboardEditModel.items.length; i++) {
      this.dashboardEditModel.items[i].position = i + 1;
    }
  }

  dragulaPositionChanged() {
    this.actualizeBlockPositions();
  }

  onDashboardItemChanged(model: DashboardItemModel) {
    const foundDashboardItem = this.dashboardEditModel.items.findIndex(x => x.position === model.position);
    this.dashboardEditModel.items[foundDashboardItem] = model;
  }
}
