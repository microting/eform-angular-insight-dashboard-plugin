export class AnswerModel {
  id: number;
  microtingUid: number;
  finishedAt: string;
  answerDuration: number;
  siteName: string;
  // Null when the answer has no unit. This could not be null before, because such
  // answers were dropped by an inner join and never reached the client at all.
  unitId: number | null;
  answerValues: AnswerValuesModel[] = [];
}

export class AnswerValuesModel {
  id: number;
  value: string;
  translations: AnswerValueTranslationModel[];
  question: string;
}

export class AnswerValueTranslationModel {
  languageId: number;
  languageName: string;
  value: string;
}
