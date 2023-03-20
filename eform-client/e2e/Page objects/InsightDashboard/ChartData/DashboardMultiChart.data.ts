import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardMultiChartItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Linje',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  },
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Vandret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  },
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Vandret Grupperet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  },
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Lodret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  },
  {
    firstQuestion: 'Q13',
    firstQuestionForSelect: '13 - Q13: ...',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Lodret Grupperet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  }
];

export const dashboardMultiChartDataJson = {
  'id': 15,
  'dashboardName': 'Multi chart',
  'surveyName': 'Test-Set',
  'surveyId': 1,
  'locationName': 'Location 1',
  'locationId': 1,
  'tagName': null,
  'tagId': null,
  'answerDates': {
    'dateFrom': '2016-01-01T00:00:00',
    'dateTo': '2020-12-02T23:59:59',
    'today': true
  },
  'items': [
    {
      'id': 32,
      'firstQuestionName': 'Q13: ...',
      'firstQuestionType': 'multi',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 13,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 1,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 1,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': 'Q13: ..._1',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': '16_01',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 3,
                'optionIndex': 1
              },
              {
                'name': '16_05',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 2,
                'optionIndex': 1
              },
              {
                'name': '16_09',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 3,
                'optionIndex': 1
              },
              {
                'name': '16_13',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_14',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 4,
                'optionIndex': 1
              },
              {
                'name': '16_18',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '16_23',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_27',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 1
              },
              {
                'name': '16_31',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 6,
                'optionIndex': 1
              },
              {
                'name': '16_36',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '16_40',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 6,
                'optionIndex': 1
              },
              {
                'name': '16_45',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 6,
                'optionIndex': 1
              },
              {
                'name': '16_50',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '17_01',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 1,
                'optionIndex': 1
              },
              {
                'name': '17_02',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_05',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '17_10',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '17_15',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 8,
                'optionIndex': 1
              },
              {
                'name': '17_19',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '17_23',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 1,
                'optionIndex': 1
              },
              {
                'name': '17_24',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 1
              },
              {
                'name': '17_27',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 4,
                'optionIndex': 1
              },
              {
                'name': '17_28',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 3,
                'optionIndex': 1
              },
              {
                'name': '17_33',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 8,
                'optionIndex': 1
              },
              {
                'name': '17_37',
                'value': 20,
                'dataCount': 3,
                'answersDataCount': 15,
                'optionIndex': 1
              },
              {
                'name': '17_38',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 5,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': 'Q13: ..._2',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': '16_01',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 3,
                'optionIndex': 2
              },
              {
                'name': '16_05',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 2,
                'optionIndex': 2
              },
              {
                'name': '16_09',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 3,
                'optionIndex': 2
              },
              {
                'name': '16_13',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 1,
                'optionIndex': 2
              },
              {
                'name': '16_14',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 2
              },
              {
                'name': '16_18',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '16_23',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 4,
                'optionIndex': 2
              },
              {
                'name': '16_27',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 2
              },
              {
                'name': '16_31',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 6,
                'optionIndex': 2
              },
              {
                'name': '16_36',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '16_40',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 6,
                'optionIndex': 2
              },
              {
                'name': '16_45',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 6,
                'optionIndex': 2
              },
              {
                'name': '16_50',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '17_01',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_02',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 5,
                'optionIndex': 2
              },
              {
                'name': '17_05',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '17_10',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '17_15',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 8,
                'optionIndex': 2
              },
              {
                'name': '17_19',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '17_23',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_24',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 2
              },
              {
                'name': '17_27',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 4,
                'optionIndex': 2
              },
              {
                'name': '17_28',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 3,
                'optionIndex': 2
              },
              {
                'name': '17_33',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 8,
                'optionIndex': 2
              },
              {
                'name': '17_37',
                'value': 60,
                'dataCount': 9,
                'answersDataCount': 15,
                'optionIndex': 2
              },
              {
                'name': '17_38',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 5,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': 'Q13: ..._3',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': '16_01',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 3,
                'optionIndex': 3
              },
              {
                'name': '16_05',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 2,
                'optionIndex': 3
              },
              {
                'name': '16_09',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 3,
                'optionIndex': 3
              },
              {
                'name': '16_13',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 1,
                'optionIndex': 3
              },
              {
                'name': '16_14',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 3
              },
              {
                'name': '16_18',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '16_23',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 4,
                'optionIndex': 3
              },
              {
                'name': '16_27',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 4,
                'optionIndex': 3
              },
              {
                'name': '16_31',
                'value': 16.67,
                'dataCount': 1,
                'answersDataCount': 6,
                'optionIndex': 3
              },
              {
                'name': '16_36',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '16_40',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 6,
                'optionIndex': 3
              },
              {
                'name': '16_45',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 6,
                'optionIndex': 3
              },
              {
                'name': '16_50',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '17_01',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 1,
                'optionIndex': 3
              },
              {
                'name': '17_02',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 5,
                'optionIndex': 3
              },
              {
                'name': '17_05',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '17_10',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '17_15',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 8,
                'optionIndex': 3
              },
              {
                'name': '17_19',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '17_23',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_24',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 7,
                'optionIndex': 3
              },
              {
                'name': '17_27',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 4,
                'optionIndex': 3
              },
              {
                'name': '17_28',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 3,
                'optionIndex': 3
              },
              {
                'name': '17_33',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 8,
                'optionIndex': 3
              },
              {
                'name': '17_37',
                'value': 40,
                'dataCount': 6,
                'answersDataCount': 15,
                'optionIndex': 3
              },
              {
                'name': '17_38',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 5,
                'optionIndex': 3
              }
            ]
          },
          {
            'id': 0,
            'name': 'Q13: ..._4',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': '16_01',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 3,
                'optionIndex': 4
              },
              {
                'name': '16_05',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 2,
                'optionIndex': 4
              },
              {
                'name': '16_09',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 3,
                'optionIndex': 4
              },
              {
                'name': '16_13',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_14',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 4
              },
              {
                'name': '16_18',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '16_23',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 4,
                'optionIndex': 4
              },
              {
                'name': '16_27',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 4
              },
              {
                'name': '16_31',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 6,
                'optionIndex': 4
              },
              {
                'name': '16_36',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '16_40',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 6,
                'optionIndex': 4
              },
              {
                'name': '16_45',
                'value': 83.33,
                'dataCount': 5,
                'answersDataCount': 6,
                'optionIndex': 4
              },
              {
                'name': '16_50',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '17_01',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_02',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 5,
                'optionIndex': 4
              },
              {
                'name': '17_05',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '17_10',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '17_15',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 8,
                'optionIndex': 4
              },
              {
                'name': '17_19',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '17_23',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_24',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 4
              },
              {
                'name': '17_27',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 4,
                'optionIndex': 4
              },
              {
                'name': '17_28',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 3,
                'optionIndex': 4
              },
              {
                'name': '17_33',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 8,
                'optionIndex': 4
              },
              {
                'name': '17_37',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 15,
                'optionIndex': 4
              },
              {
                'name': '17_38',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 5,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': 'Q13: ..._5',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': '16_01',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 3,
                'optionIndex': 5
              },
              {
                'name': '16_05',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 2,
                'optionIndex': 5
              },
              {
                'name': '16_09',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 3,
                'optionIndex': 5
              },
              {
                'name': '16_13',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_14',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 4,
                'optionIndex': 5
              },
              {
                'name': '16_18',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '16_23',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 4,
                'optionIndex': 5
              },
              {
                'name': '16_27',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 4,
                'optionIndex': 5
              },
              {
                'name': '16_31',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 6,
                'optionIndex': 5
              },
              {
                'name': '16_36',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '16_40',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 6,
                'optionIndex': 5
              },
              {
                'name': '16_45',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 6,
                'optionIndex': 5
              },
              {
                'name': '16_50',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '17_01',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 1,
                'optionIndex': 5
              },
              {
                'name': '17_02',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 5,
                'optionIndex': 5
              },
              {
                'name': '17_05',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '17_10',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '17_15',
                'value': 87.5,
                'dataCount': 7,
                'answersDataCount': 8,
                'optionIndex': 5
              },
              {
                'name': '17_19',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '17_23',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_24',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 7,
                'optionIndex': 5
              },
              {
                'name': '17_27',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 4,
                'optionIndex': 5
              },
              {
                'name': '17_28',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_33',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 8,
                'optionIndex': 5
              },
              {
                'name': '17_37',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 15,
                'optionIndex': 5
              },
              {
                'name': '17_38',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 5,
                'optionIndex': 5
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_01',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Q13: ..._1',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      75,
                      85.71,
                      0,
                      50,
                      50,
                      42.86,
                      50,
                      66.67,
                      57.14,
                      100,
                      0,
                      57.14,
                      57.14,
                      50,
                      57.14,
                      100,
                      42.86,
                      75,
                      66.67,
                      25,
                      20,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      3,
                      6,
                      0,
                      2,
                      3,
                      3,
                      3,
                      4,
                      4,
                      1,
                      0,
                      4,
                      4,
                      4,
                      4,
                      1,
                      3,
                      3,
                      2,
                      2,
                      3,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._2',
                    'percents': [
                      100,
                      50,
                      33.33,
                      100,
                      50,
                      57.14,
                      25,
                      50,
                      66.67,
                      85.71,
                      50,
                      66.67,
                      28.57,
                      0,
                      80,
                      57.14,
                      42.86,
                      62.5,
                      42.86,
                      0,
                      57.14,
                      25,
                      66.67,
                      50,
                      60,
                      100
                    ],
                    'amounts': [
                      3,
                      1,
                      1,
                      1,
                      2,
                      4,
                      1,
                      2,
                      4,
                      6,
                      3,
                      4,
                      2,
                      0,
                      4,
                      4,
                      3,
                      5,
                      3,
                      0,
                      4,
                      1,
                      2,
                      4,
                      9,
                      5
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._3',
                    'percents': [
                      33.33,
                      50,
                      33.33,
                      100,
                      50,
                      14.29,
                      100,
                      75,
                      16.67,
                      71.43,
                      66.67,
                      50,
                      42.86,
                      100,
                      40,
                      28.57,
                      57.14,
                      12.5,
                      42.86,
                      0,
                      85.71,
                      25,
                      66.67,
                      37.5,
                      40,
                      60
                    ],
                    'amounts': [
                      1,
                      1,
                      1,
                      1,
                      2,
                      1,
                      4,
                      3,
                      1,
                      5,
                      4,
                      3,
                      3,
                      1,
                      2,
                      2,
                      4,
                      1,
                      3,
                      0,
                      6,
                      1,
                      2,
                      3,
                      6,
                      3
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._4',
                    'percents': [
                      33.33,
                      100,
                      33.33,
                      0,
                      50,
                      57.14,
                      75,
                      50,
                      33.33,
                      71.43,
                      50,
                      83.33,
                      57.14,
                      0,
                      60,
                      57.14,
                      42.86,
                      62.5,
                      57.14,
                      0,
                      42.86,
                      75,
                      66.67,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      1,
                      2,
                      1,
                      0,
                      2,
                      4,
                      3,
                      2,
                      2,
                      5,
                      3,
                      5,
                      4,
                      0,
                      3,
                      4,
                      3,
                      5,
                      4,
                      0,
                      3,
                      3,
                      2,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._5',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      50,
                      42.86,
                      25,
                      25,
                      33.33,
                      42.86,
                      33.33,
                      66.67,
                      57.14,
                      100,
                      40,
                      28.57,
                      71.43,
                      87.5,
                      42.86,
                      0,
                      42.86,
                      100,
                      0,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      2,
                      3,
                      1,
                      1,
                      2,
                      3,
                      2,
                      4,
                      4,
                      1,
                      2,
                      2,
                      5,
                      7,
                      3,
                      0,
                      3,
                      4,
                      0,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      366.66,
                      300,
                      233.33,
                      200,
                      275,
                      257.14,
                      225,
                      250,
                      200,
                      314.29,
                      250,
                      333.34,
                      242.85,
                      300,
                      220,
                      228.56,
                      271.43,
                      275,
                      242.86,
                      100,
                      271.43,
                      300,
                      266.68,
                      162.5,
                      226.66,
                      400
                    ],
                    'amounts': [
                      3,
                      2,
                      3,
                      1,
                      4,
                      7,
                      4,
                      4,
                      6,
                      7,
                      6,
                      6,
                      7,
                      1,
                      5,
                      7,
                      7,
                      8,
                      7,
                      1,
                      7,
                      4,
                      3,
                      8,
                      15,
                      5
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [],
      'textQuestionData': []
    },
    {
      'id': 33,
      'firstQuestionName': 'Q13: ...',
      'firstQuestionType': 'multi',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 13,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 6,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 2,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 2,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 16.67,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 83.33,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_01',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 87.5,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 15,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 20,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 60,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_01',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Q13: ..._1',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      75,
                      85.71,
                      0,
                      50,
                      50,
                      42.86,
                      50,
                      66.67,
                      57.14,
                      100,
                      0,
                      57.14,
                      57.14,
                      50,
                      57.14,
                      100,
                      42.86,
                      75,
                      66.67,
                      25,
                      20,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      3,
                      6,
                      0,
                      2,
                      3,
                      3,
                      3,
                      4,
                      4,
                      1,
                      0,
                      4,
                      4,
                      4,
                      4,
                      1,
                      3,
                      3,
                      2,
                      2,
                      3,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._2',
                    'percents': [
                      100,
                      50,
                      33.33,
                      100,
                      50,
                      57.14,
                      25,
                      50,
                      66.67,
                      85.71,
                      50,
                      66.67,
                      28.57,
                      0,
                      80,
                      57.14,
                      42.86,
                      62.5,
                      42.86,
                      0,
                      57.14,
                      25,
                      66.67,
                      50,
                      60,
                      100
                    ],
                    'amounts': [
                      3,
                      1,
                      1,
                      1,
                      2,
                      4,
                      1,
                      2,
                      4,
                      6,
                      3,
                      4,
                      2,
                      0,
                      4,
                      4,
                      3,
                      5,
                      3,
                      0,
                      4,
                      1,
                      2,
                      4,
                      9,
                      5
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._3',
                    'percents': [
                      33.33,
                      50,
                      33.33,
                      100,
                      50,
                      14.29,
                      100,
                      75,
                      16.67,
                      71.43,
                      66.67,
                      50,
                      42.86,
                      100,
                      40,
                      28.57,
                      57.14,
                      12.5,
                      42.86,
                      0,
                      85.71,
                      25,
                      66.67,
                      37.5,
                      40,
                      60
                    ],
                    'amounts': [
                      1,
                      1,
                      1,
                      1,
                      2,
                      1,
                      4,
                      3,
                      1,
                      5,
                      4,
                      3,
                      3,
                      1,
                      2,
                      2,
                      4,
                      1,
                      3,
                      0,
                      6,
                      1,
                      2,
                      3,
                      6,
                      3
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._4',
                    'percents': [
                      33.33,
                      100,
                      33.33,
                      0,
                      50,
                      57.14,
                      75,
                      50,
                      33.33,
                      71.43,
                      50,
                      83.33,
                      57.14,
                      0,
                      60,
                      57.14,
                      42.86,
                      62.5,
                      57.14,
                      0,
                      42.86,
                      75,
                      66.67,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      1,
                      2,
                      1,
                      0,
                      2,
                      4,
                      3,
                      2,
                      2,
                      5,
                      3,
                      5,
                      4,
                      0,
                      3,
                      4,
                      3,
                      5,
                      4,
                      0,
                      3,
                      3,
                      2,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._5',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      50,
                      42.86,
                      25,
                      25,
                      33.33,
                      42.86,
                      33.33,
                      66.67,
                      57.14,
                      100,
                      40,
                      28.57,
                      71.43,
                      87.5,
                      42.86,
                      0,
                      42.86,
                      100,
                      0,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      2,
                      3,
                      1,
                      1,
                      2,
                      3,
                      2,
                      4,
                      4,
                      1,
                      2,
                      2,
                      5,
                      7,
                      3,
                      0,
                      3,
                      4,
                      0,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      366.66,
                      300,
                      233.33,
                      200,
                      275,
                      257.14,
                      225,
                      250,
                      200,
                      314.29,
                      250,
                      333.34,
                      242.85,
                      300,
                      220,
                      228.56,
                      271.43,
                      275,
                      242.86,
                      100,
                      271.43,
                      300,
                      266.68,
                      162.5,
                      226.66,
                      400
                    ],
                    'amounts': [
                      3,
                      2,
                      3,
                      1,
                      4,
                      7,
                      4,
                      4,
                      6,
                      7,
                      6,
                      6,
                      7,
                      1,
                      5,
                      7,
                      7,
                      8,
                      7,
                      1,
                      7,
                      4,
                      3,
                      8,
                      15,
                      5
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [],
      'textQuestionData': []
    },
    {
      'id': 34,
      'firstQuestionName': 'Q13: ...',
      'firstQuestionType': 'multi',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 13,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 7,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 3,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 2,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 16.67,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 83.33,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_01',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 87.5,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 15,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 20,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 60,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_01',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Q13: ..._1',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      75,
                      85.71,
                      0,
                      50,
                      50,
                      42.86,
                      50,
                      66.67,
                      57.14,
                      100,
                      0,
                      57.14,
                      57.14,
                      50,
                      57.14,
                      100,
                      42.86,
                      75,
                      66.67,
                      25,
                      20,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      3,
                      6,
                      0,
                      2,
                      3,
                      3,
                      3,
                      4,
                      4,
                      1,
                      0,
                      4,
                      4,
                      4,
                      4,
                      1,
                      3,
                      3,
                      2,
                      2,
                      3,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._2',
                    'percents': [
                      100,
                      50,
                      33.33,
                      100,
                      50,
                      57.14,
                      25,
                      50,
                      66.67,
                      85.71,
                      50,
                      66.67,
                      28.57,
                      0,
                      80,
                      57.14,
                      42.86,
                      62.5,
                      42.86,
                      0,
                      57.14,
                      25,
                      66.67,
                      50,
                      60,
                      100
                    ],
                    'amounts': [
                      3,
                      1,
                      1,
                      1,
                      2,
                      4,
                      1,
                      2,
                      4,
                      6,
                      3,
                      4,
                      2,
                      0,
                      4,
                      4,
                      3,
                      5,
                      3,
                      0,
                      4,
                      1,
                      2,
                      4,
                      9,
                      5
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._3',
                    'percents': [
                      33.33,
                      50,
                      33.33,
                      100,
                      50,
                      14.29,
                      100,
                      75,
                      16.67,
                      71.43,
                      66.67,
                      50,
                      42.86,
                      100,
                      40,
                      28.57,
                      57.14,
                      12.5,
                      42.86,
                      0,
                      85.71,
                      25,
                      66.67,
                      37.5,
                      40,
                      60
                    ],
                    'amounts': [
                      1,
                      1,
                      1,
                      1,
                      2,
                      1,
                      4,
                      3,
                      1,
                      5,
                      4,
                      3,
                      3,
                      1,
                      2,
                      2,
                      4,
                      1,
                      3,
                      0,
                      6,
                      1,
                      2,
                      3,
                      6,
                      3
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._4',
                    'percents': [
                      33.33,
                      100,
                      33.33,
                      0,
                      50,
                      57.14,
                      75,
                      50,
                      33.33,
                      71.43,
                      50,
                      83.33,
                      57.14,
                      0,
                      60,
                      57.14,
                      42.86,
                      62.5,
                      57.14,
                      0,
                      42.86,
                      75,
                      66.67,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      1,
                      2,
                      1,
                      0,
                      2,
                      4,
                      3,
                      2,
                      2,
                      5,
                      3,
                      5,
                      4,
                      0,
                      3,
                      4,
                      3,
                      5,
                      4,
                      0,
                      3,
                      3,
                      2,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._5',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      50,
                      42.86,
                      25,
                      25,
                      33.33,
                      42.86,
                      33.33,
                      66.67,
                      57.14,
                      100,
                      40,
                      28.57,
                      71.43,
                      87.5,
                      42.86,
                      0,
                      42.86,
                      100,
                      0,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      2,
                      3,
                      1,
                      1,
                      2,
                      3,
                      2,
                      4,
                      4,
                      1,
                      2,
                      2,
                      5,
                      7,
                      3,
                      0,
                      3,
                      4,
                      0,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      366.66,
                      300,
                      233.33,
                      200,
                      275,
                      257.14,
                      225,
                      250,
                      200,
                      314.29,
                      250,
                      333.34,
                      242.85,
                      300,
                      220,
                      228.56,
                      271.43,
                      275,
                      242.86,
                      100,
                      271.43,
                      300,
                      266.68,
                      162.5,
                      226.66,
                      400
                    ],
                    'amounts': [
                      3,
                      2,
                      3,
                      1,
                      4,
                      7,
                      4,
                      4,
                      6,
                      7,
                      6,
                      6,
                      7,
                      1,
                      5,
                      7,
                      7,
                      8,
                      7,
                      1,
                      7,
                      4,
                      3,
                      8,
                      15,
                      5
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [],
      'textQuestionData': []
    },
    {
      'id': 35,
      'firstQuestionName': 'Q13: ...',
      'firstQuestionType': 'multi',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 13,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 9,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 4,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 2,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 16.67,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 83.33,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_01',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 87.5,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 15,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 20,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 60,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_01',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Q13: ..._1',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      75,
                      85.71,
                      0,
                      50,
                      50,
                      42.86,
                      50,
                      66.67,
                      57.14,
                      100,
                      0,
                      57.14,
                      57.14,
                      50,
                      57.14,
                      100,
                      42.86,
                      75,
                      66.67,
                      25,
                      20,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      3,
                      6,
                      0,
                      2,
                      3,
                      3,
                      3,
                      4,
                      4,
                      1,
                      0,
                      4,
                      4,
                      4,
                      4,
                      1,
                      3,
                      3,
                      2,
                      2,
                      3,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._2',
                    'percents': [
                      100,
                      50,
                      33.33,
                      100,
                      50,
                      57.14,
                      25,
                      50,
                      66.67,
                      85.71,
                      50,
                      66.67,
                      28.57,
                      0,
                      80,
                      57.14,
                      42.86,
                      62.5,
                      42.86,
                      0,
                      57.14,
                      25,
                      66.67,
                      50,
                      60,
                      100
                    ],
                    'amounts': [
                      3,
                      1,
                      1,
                      1,
                      2,
                      4,
                      1,
                      2,
                      4,
                      6,
                      3,
                      4,
                      2,
                      0,
                      4,
                      4,
                      3,
                      5,
                      3,
                      0,
                      4,
                      1,
                      2,
                      4,
                      9,
                      5
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._3',
                    'percents': [
                      33.33,
                      50,
                      33.33,
                      100,
                      50,
                      14.29,
                      100,
                      75,
                      16.67,
                      71.43,
                      66.67,
                      50,
                      42.86,
                      100,
                      40,
                      28.57,
                      57.14,
                      12.5,
                      42.86,
                      0,
                      85.71,
                      25,
                      66.67,
                      37.5,
                      40,
                      60
                    ],
                    'amounts': [
                      1,
                      1,
                      1,
                      1,
                      2,
                      1,
                      4,
                      3,
                      1,
                      5,
                      4,
                      3,
                      3,
                      1,
                      2,
                      2,
                      4,
                      1,
                      3,
                      0,
                      6,
                      1,
                      2,
                      3,
                      6,
                      3
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._4',
                    'percents': [
                      33.33,
                      100,
                      33.33,
                      0,
                      50,
                      57.14,
                      75,
                      50,
                      33.33,
                      71.43,
                      50,
                      83.33,
                      57.14,
                      0,
                      60,
                      57.14,
                      42.86,
                      62.5,
                      57.14,
                      0,
                      42.86,
                      75,
                      66.67,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      1,
                      2,
                      1,
                      0,
                      2,
                      4,
                      3,
                      2,
                      2,
                      5,
                      3,
                      5,
                      4,
                      0,
                      3,
                      4,
                      3,
                      5,
                      4,
                      0,
                      3,
                      3,
                      2,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._5',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      50,
                      42.86,
                      25,
                      25,
                      33.33,
                      42.86,
                      33.33,
                      66.67,
                      57.14,
                      100,
                      40,
                      28.57,
                      71.43,
                      87.5,
                      42.86,
                      0,
                      42.86,
                      100,
                      0,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      2,
                      3,
                      1,
                      1,
                      2,
                      3,
                      2,
                      4,
                      4,
                      1,
                      2,
                      2,
                      5,
                      7,
                      3,
                      0,
                      3,
                      4,
                      0,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      366.66,
                      300,
                      233.33,
                      200,
                      275,
                      257.14,
                      225,
                      250,
                      200,
                      314.29,
                      250,
                      333.34,
                      242.85,
                      300,
                      220,
                      228.56,
                      271.43,
                      275,
                      242.86,
                      100,
                      271.43,
                      300,
                      266.68,
                      162.5,
                      226.66,
                      400
                    ],
                    'amounts': [
                      3,
                      2,
                      3,
                      1,
                      4,
                      7,
                      4,
                      4,
                      6,
                      7,
                      6,
                      6,
                      7,
                      1,
                      5,
                      7,
                      7,
                      8,
                      7,
                      1,
                      7,
                      4,
                      3,
                      8,
                      15,
                      5
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [],
      'textQuestionData': []
    },
    {
      'id': 36,
      'firstQuestionName': 'Q13: ...',
      'firstQuestionType': 'multi',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 13,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 10,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 5,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 2,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 16.67,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 6,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 83.33,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_01',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._3',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._2',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 40,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 28.57,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 62.5,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 87.5,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 1,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 7,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 57.14,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 42.86,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 4,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 3,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 66.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 8,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 25,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 15,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 20,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 60,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 40,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 5,
            'isTag': false,
            'series': [
              {
                'name': 'Q13: ..._1',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Q13: ..._2',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Q13: ..._3',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Q13: ..._4',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 4
              },
              {
                'name': 'Q13: ..._5',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 5
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_01',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Q13: ..._1',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      75,
                      85.71,
                      0,
                      50,
                      50,
                      42.86,
                      50,
                      66.67,
                      57.14,
                      100,
                      0,
                      57.14,
                      57.14,
                      50,
                      57.14,
                      100,
                      42.86,
                      75,
                      66.67,
                      25,
                      20,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      3,
                      6,
                      0,
                      2,
                      3,
                      3,
                      3,
                      4,
                      4,
                      1,
                      0,
                      4,
                      4,
                      4,
                      4,
                      1,
                      3,
                      3,
                      2,
                      2,
                      3,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._2',
                    'percents': [
                      100,
                      50,
                      33.33,
                      100,
                      50,
                      57.14,
                      25,
                      50,
                      66.67,
                      85.71,
                      50,
                      66.67,
                      28.57,
                      0,
                      80,
                      57.14,
                      42.86,
                      62.5,
                      42.86,
                      0,
                      57.14,
                      25,
                      66.67,
                      50,
                      60,
                      100
                    ],
                    'amounts': [
                      3,
                      1,
                      1,
                      1,
                      2,
                      4,
                      1,
                      2,
                      4,
                      6,
                      3,
                      4,
                      2,
                      0,
                      4,
                      4,
                      3,
                      5,
                      3,
                      0,
                      4,
                      1,
                      2,
                      4,
                      9,
                      5
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._3',
                    'percents': [
                      33.33,
                      50,
                      33.33,
                      100,
                      50,
                      14.29,
                      100,
                      75,
                      16.67,
                      71.43,
                      66.67,
                      50,
                      42.86,
                      100,
                      40,
                      28.57,
                      57.14,
                      12.5,
                      42.86,
                      0,
                      85.71,
                      25,
                      66.67,
                      37.5,
                      40,
                      60
                    ],
                    'amounts': [
                      1,
                      1,
                      1,
                      1,
                      2,
                      1,
                      4,
                      3,
                      1,
                      5,
                      4,
                      3,
                      3,
                      1,
                      2,
                      2,
                      4,
                      1,
                      3,
                      0,
                      6,
                      1,
                      2,
                      3,
                      6,
                      3
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._4',
                    'percents': [
                      33.33,
                      100,
                      33.33,
                      0,
                      50,
                      57.14,
                      75,
                      50,
                      33.33,
                      71.43,
                      50,
                      83.33,
                      57.14,
                      0,
                      60,
                      57.14,
                      42.86,
                      62.5,
                      57.14,
                      0,
                      42.86,
                      75,
                      66.67,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      1,
                      2,
                      1,
                      0,
                      2,
                      4,
                      3,
                      2,
                      2,
                      5,
                      3,
                      5,
                      4,
                      0,
                      3,
                      4,
                      3,
                      5,
                      4,
                      0,
                      3,
                      3,
                      2,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Q13: ..._5',
                    'percents': [
                      100,
                      50,
                      66.67,
                      0,
                      50,
                      42.86,
                      25,
                      25,
                      33.33,
                      42.86,
                      33.33,
                      66.67,
                      57.14,
                      100,
                      40,
                      28.57,
                      71.43,
                      87.5,
                      42.86,
                      0,
                      42.86,
                      100,
                      0,
                      25,
                      53.33,
                      80
                    ],
                    'amounts': [
                      3,
                      1,
                      2,
                      0,
                      2,
                      3,
                      1,
                      1,
                      2,
                      3,
                      2,
                      4,
                      4,
                      1,
                      2,
                      2,
                      5,
                      7,
                      3,
                      0,
                      3,
                      4,
                      0,
                      2,
                      8,
                      4
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      366.66,
                      300,
                      233.33,
                      200,
                      275,
                      257.14,
                      225,
                      250,
                      200,
                      314.29,
                      250,
                      333.34,
                      242.85,
                      300,
                      220,
                      228.56,
                      271.43,
                      275,
                      242.86,
                      100,
                      271.43,
                      300,
                      266.68,
                      162.5,
                      226.66,
                      400
                    ],
                    'amounts': [
                      3,
                      2,
                      3,
                      1,
                      4,
                      7,
                      4,
                      4,
                      6,
                      7,
                      6,
                      6,
                      7,
                      1,
                      5,
                      7,
                      7,
                      8,
                      7,
                      1,
                      7,
                      4,
                      3,
                      8,
                      15,
                      5
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [],
      'textQuestionData': []
    }
  ]
};
