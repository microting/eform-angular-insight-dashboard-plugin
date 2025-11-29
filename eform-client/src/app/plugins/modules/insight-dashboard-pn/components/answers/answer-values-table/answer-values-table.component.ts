import {Component, inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {AnswerModel} from '../../../models/answer';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-answer-values-table',
  templateUrl: './answer-values-table.component.html',
  styleUrls: ['./answer-values-table.component.scss'],
})
export class AnswerValuesTableComponent implements OnInit, OnChanges {
  private translateService = inject(TranslateService);

  @Input() answerModel: AnswerModel;
  @Input() toolbarTemplate!: TemplateRef<any>;
  answerFullTable = [];

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'microtingUid', class: 'answerValueId'},
    {header: this.translateService.stream('FinishedAt'), field: 'finishedAt', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Duration'), field: 'answerDuration'},
    {header: this.translateService.stream('Site'), field: 'siteName'},
    {header: this.translateService.stream('Unit'), field: 'unitId'},
    {header: this.translateService.stream('Language'), field: 'languageName'},
    {header: this.translateService.stream('Value'), field: 'value', class: 'answerValueLanguage'},
    {header: this.translateService.stream('Question'), field: 'question', class: 'answerValueValue'},
    {header: this.translateService.stream('Option'), field: 'option', class: 'answerValueTranslation'},
  ];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.answerModel) {
      this.answerFullTable = [];
      this.answerModel.answerValues.forEach(x => {
        x.translations.forEach(y => {
          this.answerFullTable = [...this.answerFullTable,
            {
              microtingUid: this.answerModel.microtingUid,
              finishedAt: this.answerModel.finishedAt,
              answerDuration: this.answerModel.answerDuration,
              siteName: this.answerModel.siteName,
              unitId: this.answerModel.unitId,
              languageName: y.languageName,
              value: x.value,
              question: x.question,
              option: y.value,
            }
          ];
        });
      });
    }
  }
}
