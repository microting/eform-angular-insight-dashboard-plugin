import {Component, Input, OnInit} from '@angular/core';
import {AnswerValuesModel} from '../../../models/answer';

@Component({
  selector: 'app-answer-values-table',
  templateUrl: './answer-values-table.component.html',
  styleUrls: ['./answer-values-table.component.scss']
})
export class AnswerValuesTableComponent implements OnInit {
  @Input() answerValues: AnswerValuesModel[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
