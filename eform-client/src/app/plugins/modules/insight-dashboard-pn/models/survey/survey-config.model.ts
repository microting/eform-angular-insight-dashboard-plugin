import {CommonDictionaryModel} from '../../../../../common/models/common';

export class SurveyConfigModel {
  id: number;
  surveyName: string;
  locations: CommonDictionaryModel[];
  isActive: boolean;
}
