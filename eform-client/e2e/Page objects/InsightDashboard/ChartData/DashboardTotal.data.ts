import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardTotalItems: DashboardTestItemEditModel[] = [
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
  },
  {
    firstQuestion: 'Q1',
    firstQuestionForSelect: '1 - Q1',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Vandret Søjlediagram',
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
    chartType: 'Lodret Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  }
];

export const dashboardTotalDataJson = {
  'id': 16,
  'dashboardName': 'Total',
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
      'id': 37,
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
            'value': 105,
            'dataCount': 105,
            'answersDataCount': 0,
            'optionIndex': 1
          },
          {
            'name': 'Nej',
            'value': 33,
            'dataCount': 33,
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
                      76.09
                    ],
                    'amounts': [
                      105
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      23.91
                    ],
                    'amounts': [
                      33
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100
                    ],
                    'amounts': [
                      138
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
      'id': 38,
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
            'value': 105,
            'dataCount': 105,
            'answersDataCount': 0,
            'optionIndex': 1
          },
          {
            'name': 'Nej',
            'value': 33,
            'dataCount': 33,
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
                      76.09
                    ],
                    'amounts': [
                      105
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      23.91
                    ],
                    'amounts': [
                      33
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100
                    ],
                    'amounts': [
                      138
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
      'id': 39,
      'firstQuestionName': 'Q1',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 6,
      'chartType': 5,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 3,
      'chartData': {
        'single': [
          {
            'name': 'Ja',
            'value': 76.09,
            'dataCount': 105,
            'answersDataCount': 0,
            'optionIndex': 1
          },
          {
            'name': 'Nej',
            'value': 23.91,
            'dataCount': 33,
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
                      76.09
                    ],
                    'amounts': [
                      105
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      23.91
                    ],
                    'amounts': [
                      33
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100
                    ],
                    'amounts': [
                      138
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
      'id': 40,
      'firstQuestionName': 'Q1',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 6,
      'chartType': 8,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 4,
      'chartData': {
        'single': [
          {
            'name': 'Ja',
            'value': 76.09,
            'dataCount': 105,
            'answersDataCount': 0,
            'optionIndex': 1
          },
          {
            'name': 'Nej',
            'value': 23.91,
            'dataCount': 33,
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
                      76.09
                    ],
                    'amounts': [
                      105
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      23.91
                    ],
                    'amounts': [
                      33
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100
                    ],
                    'amounts': [
                      138
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
