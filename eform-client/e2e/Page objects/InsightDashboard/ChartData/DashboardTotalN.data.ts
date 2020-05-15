import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardTotalNItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q1',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Avanceret cirkel',
    calculateAverage: false,
    ignoredAnswerIds: []
  },
  {
    firstQuestion: 'Q1',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Cirkelnettet',
    calculateAverage: false,
    ignoredAnswerIds: []
  },
  {
    firstQuestion: 'Q1',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Lagkagediagram',
    calculateAverage: false,
    ignoredAnswerIds: []
  },
];

export const dashboardTotalNDataJson = {
  'id': 52,
  'dashboardName': 'Test Total N',
  'surveyName': 'Test-Set',
  'surveyId': 1,
  'locationName': null,
  'locationId': null,
  'tagName': 'Total',
  'tagId': 1,
  'answerDates': {
    'dateFrom': '2016-01-01T00:00:00',
    'dateTo': '2020-05-15T23:59:59',
    'today': true
  },
  'items': [
    {
      'id': 124,
      'firstQuestionName': 'Q1: Vil du deltage i undersøgelsen?',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 6,
      'chartType': 3,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 1,
      'chartData': {
        'single': [
          {
            'name': 'Ja',
            'value': 419.0,
            'dataCount': 419,
            'optionIndex': 0
          },
          {
            'name': 'Nej',
            'value': 133.0,
            'dataCount': 133,
            'optionIndex': 0
          }
        ],
        'multi': [],
        'multiStacked': [],
        'rawData': [
          {
            'rawValueName': '',
            'rawHeaders': [
              'Samlet periode'
            ],
            'rawDataValues': [
              {
                'valueName': 'Ja',
                'percents': [
                  76.0
                ],
                'amounts': [
                  419.0
                ]
              },
              {
                'valueName': 'Nej',
                'percents': [
                  24.0
                ],
                'amounts': [
                  133.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  100.0
                ],
                'amounts': [
                  552.0
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
      'id': 125,
      'firstQuestionName': 'Q1: Vil du deltage i undersøgelsen?',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 6,
      'chartType': 4,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 2,
      'chartData': {
        'single': [
          {
            'name': 'Ja',
            'value': 419.0,
            'dataCount': 419,
            'optionIndex': 0
          },
          {
            'name': 'Nej',
            'value': 133.0,
            'dataCount': 133,
            'optionIndex': 0
          }
        ],
        'multi': [],
        'multiStacked': [],
        'rawData': [
          {
            'rawValueName': '',
            'rawHeaders': [
              'Samlet periode'
            ],
            'rawDataValues': [
              {
                'valueName': 'Ja',
                'percents': [
                  76.0
                ],
                'amounts': [
                  419.0
                ]
              },
              {
                'valueName': 'Nej',
                'percents': [
                  24.0
                ],
                'amounts': [
                  133.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  100.0
                ],
                'amounts': [
                  552.0
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
      'id': 126,
      'firstQuestionName': 'Q1: Vil du deltage i undersøgelsen?',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 6,
      'chartType': 2,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 3,
      'chartData': {
        'single': [
          {
            'name': 'Ja',
            'value': 76.0,
            'dataCount': 419,
            'optionIndex': 0
          },
          {
            'name': 'Nej',
            'value': 24.0,
            'dataCount': 133,
            'optionIndex': 0
          }
        ],
        'multi': [],
        'multiStacked': [],
        'rawData': [
          {
            'rawValueName': '',
            'rawHeaders': [
              'Samlet periode'
            ],
            'rawDataValues': [
              {
                'valueName': 'Ja',
                'percents': [
                  76.0
                ],
                'amounts': [
                  419.0
                ]
              },
              {
                'valueName': 'Nej',
                'percents': [
                  24.0
                ],
                'amounts': [
                  133.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  100.0
                ],
                'amounts': [
                  552.0
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
