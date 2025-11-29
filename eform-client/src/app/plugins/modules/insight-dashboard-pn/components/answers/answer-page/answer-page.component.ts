import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {InsightDashboardPnAnswersService} from '../../../services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {AnswerModel} from '../../../models/answer';
import {AnswerDeleteModalComponent} from '../';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  selector: 'app-answer-page',
  templateUrl: './answer-page.component.html',
  styleUrls: ['./answer-page.component.scss'],
})
export class AnswerPageComponent implements OnInit, OnDestroy {
  private answersService = inject(InsightDashboardPnAnswersService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  searchAnswerMicrotingUId: number;
  answer: AnswerModel = new AnswerModel();
  searchAnswerId: string;

  answerSub$: Subscription;
  deleteAnswerSub$: Subscription;
  deleteAnswerModalSub$: Subscription;

  ngOnInit(): void {
  }

  openAnswerDeleteModal() {
    const answerDeleteModal = this.dialog.open(AnswerDeleteModalComponent, dialogConfigHelper(this.overlay));
    this.deleteAnswerModalSub$ = answerDeleteModal.componentInstance.deleteAnswer.subscribe(() => {
      this.deleteAnswer(answerDeleteModal);
    });
  }

  getAnswer() {
    this.answer = new AnswerModel();
    this.searchAnswerId = this.searchAnswerId.replace(/\./g, '');
    this.searchAnswerMicrotingUId = parseInt(this.searchAnswerId, 10);
    this.answerSub$ = this.answersService
      .getAnswer(this.searchAnswerMicrotingUId)
      .subscribe((data) => {
        if (data && data.success) {
          this.answer = data.model;
        }
      });
  }

  deleteAnswer(answerDeleteModal: MatDialogRef<AnswerDeleteModalComponent>) {
    this.deleteAnswerSub$ = this.answersService
      .deleteAnswer(this.answer.microtingUid)
      .subscribe(() => {
        this.answer = new AnswerModel();
        this.searchAnswerMicrotingUId = null;
        answerDeleteModal.close();
      });
  }

  ngOnDestroy(): void {
  }
}
