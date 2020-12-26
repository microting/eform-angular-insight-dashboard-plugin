export class AnswerModel {
  id: number;
  microtingUId: number;
  values: AnswerValuesModel[] = [];
}

export class AnswerValuesModel {
  id: number;
  value: string;
  translations: AnswerValueTranslationModel[];
}

export class AnswerValueTranslationModel {
  languageId: number;
  languageName: string;
  value: string;
}
