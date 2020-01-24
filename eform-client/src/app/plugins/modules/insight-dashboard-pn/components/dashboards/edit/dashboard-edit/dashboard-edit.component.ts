import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardItemsService, InsightDashboardPnDashboardsService} from '../../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardEditModel, DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';

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
              private dashboardItemsService: InsightDashboardPnDashboardItemsService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedDashboardId = params['dashboardId'];
      this.getDashboardForEdit(this.selectedDashboardId);
    });
    this.getFilterQuestions();
  }

  updateDashboard() {
    this.spinnerStatus = true;
    this.updateDashboardSub$ = this.dashboardsService.update(this.dashboardEditModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['../../', this.dashboardEditModel.id]).then();
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
        this.spinnerStatus = false;
      });
  }

  getFilterQuestions() {
    this.filterQuestionsSub$ = this.dashboardItemsService.getQuestions()
      .subscribe((data) => {
        if (data && data.success) {
          this.questions = data.model;
        }
      });
  }

  onAddNewBlock(position: number) {
    this.dashboardEditModel.items.splice(position, 0, new DashboardItemModel());
    this.actualizeBlockPositions();
  }

  onCopyBlock(model: DashboardItemModel) {
    this.dashboardEditModel.items.splice(model.position, 0, model);
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
      this.dashboardEditModel.items[i].position = i;
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
