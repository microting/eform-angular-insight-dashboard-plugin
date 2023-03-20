import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardTotalNItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q1',
    firstQuestionForSelect: '1 - Q1',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Lagkagediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  },
  {
    firstQuestion: 'Q1',
    firstQuestionForSelect: '1 - Q1',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Cirkelnettet',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  }
];

export const dashboardTotalNDataJson = {
  'id': 19,
  'dashboardName': 'Total N',
  'surveyName': 'Test-Set',
  'surveyId': 1,
  'locationName': null,
  'locationId': null,
  'tagName': 'Total',
  'tagId': 1,
  'answerDates': {
    'dateFrom': '2016-01-01T00:00:00',
    'dateTo': '2020-12-02T23:59:59',
    'today': true
  },
  'items': [
    {
      'id': 45,
      'firstQuestionName': 'Q1',
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
            'value': 419,
            'dataCount': 419,
            'answersDataCount': 0,
            'optionIndex': 1
          },
          {
            'name': 'Nej',
            'value': 133,
            'dataCount': 133,
            'answersDataCount': 0,
            'optionIndex': 2
          }
        ],
        'multi': [],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              'Samlet periode'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Ja',
                    'percents': [
                      75.91
                    ],
                    'amounts': [
                      419
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      24.09
                    ],
                    'amounts': [
                      133
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100
                    ],
                    'amounts': [
                      552
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
      'id': 46,
      'firstQuestionName': 'Q1',
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
            'value': 419,
            'dataCount': 419,
            'answersDataCount': 0,
            'optionIndex': 1
          },
          {
            'name': 'Nej',
            'value': 133,
            'dataCount': 133,
            'answersDataCount': 0,
            'optionIndex': 2
          }
        ],
        'multi': [],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              'Samlet periode'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Ja',
                    'percents': [
                      75.91
                    ],
                    'amounts': [
                      419
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      24.09
                    ],
                    'amounts': [
                      133
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100
                    ],
                    'amounts': [
                      552
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
