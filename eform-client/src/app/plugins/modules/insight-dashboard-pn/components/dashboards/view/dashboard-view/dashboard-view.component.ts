import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InsightDashboardPnDashboardsService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { DashboardViewModel, DashboardViewExportDocModel} from '../../../../models';
import {
  DashboardChartTypesEnum,
  DashboardItemQuestionTypesEnum,
} from '../../../../const/enums';
import * as domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import {WordIcon} from 'src/app/common/const';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  standalone: false,
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  private dashboardsService = inject(InsightDashboardPnDashboardsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  selectedDashboardId: number;
  getDashboardSub$: Subscription;
  exportToDocSub$: Subscription;
  dashboardViewModel: DashboardViewModel = new DashboardViewModel();

  constructor() {
    this.iconRegistry.addSvgIconLiteral('file-word', this.sanitizer.bypassSecurityTrustHtml(WordIcon));
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.selectedDashboardId = params['dashboardId'];
      this.getDashboardForView(this.selectedDashboardId);
    });
  }

  getDashboardForView(dashboardId: number) {
    this.getDashboardSub$ = this.dashboardsService
      .getSingleForView(dashboardId)
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardViewModel = data.model;
        }
      });
  }

  exportToDoc() {
    const context = this;
    const scale = 2;
    const exportDocModel = new DashboardViewExportDocModel();
    exportDocModel.dashboardId = this.dashboardViewModel.id;

    Promise.all(this.getParsedItemsPromise()).then((data) => {
      this.exportItemsToDoc({ ...exportDocModel, files: data });
    });
  }

  getParsedItemsPromise() {
    const scale = 2;
    const domArray = this.dashboardViewModel.items
      .filter(
        (x) => x.firstQuestionType !== DashboardItemQuestionTypesEnum.Text
      )
      .map((item) => {
        return {
          name: `copyableChart${item.position}`,
          chartType: item.chartType,
          itemId: item.id,
        };
      });
    const imageArray = [];
    const promiseArray = [];
    domArray.map((target) => {
      const node = document.getElementById(target.name);
      // noinspection JSVoidFunctionReturnValueUsed
      promiseArray.push(
        domtoimage
          .toBlob(node, {
            // add greater scaling
            height: node.offsetHeight * scale,
            width:
              target.chartType ===
              DashboardChartTypesEnum.HorizontalBarStackedGrouped
                ? node.scrollWidth * scale
                : node.offsetWidth * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left',
              width: node.offsetWidth + 'px',
              height: node.offsetHeight + 'px',
            },
          })
          .then(function (data) {
            try {
              return new File([data], `${target.itemId}`);
            } catch (e) {
              console.error(e, e.message);
              return {};
            }
          })
          .catch(function (error) {
            console.error('Chart could not be copied', error);
            return {};
          })
      );
    });

    return promiseArray;
  }

  ngOnDestroy(): void {}

  private exportItemsToDoc(model: DashboardViewExportDocModel) {
    this.exportToDocSub$ = this.dashboardsService
      .exportToDoc(model)
      .subscribe((data) => {
        if (data) {
          const blob = new Blob([data]);
          saveAs(blob, `doc.docx`);
        }
      });
  }
}
