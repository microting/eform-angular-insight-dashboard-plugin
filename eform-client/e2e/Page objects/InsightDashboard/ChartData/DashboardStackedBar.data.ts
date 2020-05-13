import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardStackedBarItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q1',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Kvarter',
    chartType: 'Lodret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: []
  },
  {
    firstQuestion: 'Q2',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Kvarter',
    chartType: 'Lodret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [8]
  },
  {
    firstQuestion: 'Q3',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Kvarter',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8]
  },
  {
    firstQuestion: 'Q4',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Total',
    chartType: 'Lagkagediagram',
    calculateAverage: false,
    ignoredAnswerIds: []
  }
];

export const dashboardStackedBarDataJson = {
  'id': 46,
  'dashboardName': 'Stacked bar',
  'surveyName': 'Test-Set',
  'surveyId': 1,
  'locationName': null,
  'locationId': null,
  'tagName': 'Total',
  'tagId': 1,
  'answerDates': {
    'dateFrom': '2016-01-01T00:00:00',
    'dateTo': '2020-05-12T23:59:59',
    'today': true
  },
  'items': [
    {
      'id': 101,
      'firstQuestionName': 'Q1: Vil du deltage i undersøgelsen?',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 3,
      'chartType': 9,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 1,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16-K1',
            'answersCount': 30,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 80.0,
                'dataCount': 24,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 20.0,
                'dataCount': 6,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '16-K2',
            'answersCount': 65,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 62.0,
                'dataCount': 40,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 38.0,
                'dataCount': 25,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '16-K3',
            'answersCount': 67,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 69.0,
                'dataCount': 46,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 31.0,
                'dataCount': 21,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '16-K4',
            'answersCount': 78,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 73.0,
                'dataCount': 57,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 27.0,
                'dataCount': 21,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17-K1',
            'answersCount': 78,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 77.0,
                'dataCount': 60,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 23.0,
                'dataCount': 18,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17-K2',
            'answersCount': 92,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 78.0,
                'dataCount': 72,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 22.0,
                'dataCount': 20,
                'optionIndex': 1
              }
            ]
          },
          {
            'id': 0,
            'name': '17-K3',
            'answersCount': 142,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 85.0,
                'dataCount': 120,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 15.0,
                'dataCount': 22,
                'optionIndex': 1
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawValueName': '',
            'rawHeaders': [
              '16-K1',
              '16-K2',
              '16-K3',
              '16-K4',
              '17-K1',
              '17-K2',
              '17-K3'
            ],
            'rawDataValues': [
              {
                'valueName': 'Ja',
                'percents': [
                  80.0,
                  62.0,
                  69.0,
                  73.0,
                  77.0,
                  78.0,
                  85.0
                ],
                'amounts': [
                  24.0,
                  40.0,
                  46.0,
                  57.0,
                  60.0,
                  72.0,
                  120.0
                ]
              },
              {
                'valueName': 'Nej',
                'percents': [
                  20.0,
                  38.0,
                  31.0,
                  27.0,
                  23.0,
                  22.0,
                  15.0
                ],
                'amounts': [
                  6.0,
                  25.0,
                  21.0,
                  21.0,
                  18.0,
                  20.0,
                  22.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  100.0,
                  100.0,
                  100.0,
                  100.0,
                  100.0,
                  100.0,
                  100.0
                ],
                'amounts': [
                  30.0,
                  65.0,
                  67.0,
                  78.0,
                  78.0,
                  92.0,
                  142.0
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
      'id': 100,
      'firstQuestionName': 'Q2: Er personalet på afsnittet venligt og imødekommende?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 3,
      'chartType': 9,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 2,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16-K1',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 54.0,
                'dataCount': 13,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 38.0,
                'dataCount': 9,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 0.0,
                'dataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0.0,
                'dataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 8.0,
                'dataCount': 2,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16-K2',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 55.0,
                'dataCount': 22,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 30.0,
                'dataCount': 12,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 8.0,
                'dataCount': 3,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 5.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 3.0,
                'dataCount': 1,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16-K3',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 67.0,
                'dataCount': 31,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 28.0,
                'dataCount': 13,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 2.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 2.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0.0,
                'dataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16-K4',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 61.0,
                'dataCount': 34,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 34.0,
                'dataCount': 19,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 4.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 2.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0.0,
                'dataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17-K1',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 70.0,
                'dataCount': 40,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 25.0,
                'dataCount': 14,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 2.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 2.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 2.0,
                'dataCount': 1,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17-K2',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 74.0,
                'dataCount': 53,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 21.0,
                'dataCount': 15,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 1.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 3.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 1.0,
                'dataCount': 1,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17-K3',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 69.0,
                'dataCount': 82,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 25.0,
                'dataCount': 30,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 5.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0.0,
                'dataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0.0,
                'dataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawValueName': '',
            'rawHeaders': [
              '16-K1',
              '16-K2',
              '16-K3',
              '16-K4',
              '17-K1',
              '17-K2',
              '17-K3'
            ],
            'rawDataValues': [
              {
                'valueName': 'Meget glad',
                'percents': [
                  54.0,
                  55.0,
                  67.0,
                  61.0,
                  70.0,
                  74.0,
                  69.0
                ],
                'amounts': [
                  13.0,
                  22.0,
                  31.0,
                  34.0,
                  40.0,
                  53.0,
                  82.0
                ]
              },
              {
                'valueName': 'Glad',
                'percents': [
                  38.0,
                  30.0,
                  28.0,
                  34.0,
                  25.0,
                  21.0,
                  25.0
                ],
                'amounts': [
                  9.0,
                  12.0,
                  13.0,
                  19.0,
                  14.0,
                  15.0,
                  30.0
                ]
              },
              {
                'valueName': 'Neutral',
                'percents': [
                  0.0,
                  8.0,
                  2.0,
                  4.0,
                  2.0,
                  1.0,
                  5.0
                ],
                'amounts': [
                  0.0,
                  3.0,
                  1.0,
                  2.0,
                  1.0,
                  1.0,
                  6.0
                ]
              },
              {
                'valueName': 'Sur',
                'percents': [
                  0.0,
                  5.0,
                  2.0,
                  2.0,
                  2.0,
                  3.0,
                  0.0
                ],
                'amounts': [
                  0.0,
                  2.0,
                  1.0,
                  1.0,
                  1.0,
                  2.0,
                  0.0
                ]
              },
              {
                'valueName': 'Meget sur',
                'percents': [
                  8.0,
                  3.0,
                  0.0,
                  0.0,
                  2.0,
                  1.0,
                  0.0
                ],
                'amounts': [
                  2.0,
                  1.0,
                  0.0,
                  0.0,
                  1.0,
                  1.0,
                  0.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  100.0,
                  101.0,
                  99.0,
                  101.0,
                  101.0,
                  100.0,
                  99.0
                ],
                'amounts': [
                  24.0,
                  40.0,
                  46.0,
                  56.0,
                  57.0,
                  72.0,
                  118.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 77,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 102,
      'firstQuestionName': 'Q3: Oplever du, at personalet er forberedt til samtaler med dig om din udredning/behandling?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 3,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 3,
      'chartType': 1,
      'compareEnabled': false,
      'calculateAverage': true,
      'position': 3,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 1,
            'name': 'Total',
            'answersCount': 412,
            'isTag': true,
            'series': [
              {
                'name': '16-K1',
                'value': 79.0,
                'dataCount': 24,
                'optionIndex': 0
              },
              {
                'name': '16-K2',
                'value': 71.0,
                'dataCount': 40,
                'optionIndex': 0
              },
              {
                'name': '16-K3',
                'value': 80.0,
                'dataCount': 46,
                'optionIndex': 0
              },
              {
                'name': '16-K4',
                'value': 78.0,
                'dataCount': 55,
                'optionIndex': 0
              },
              {
                'name': '17-K1',
                'value': 80.0,
                'dataCount': 58,
                'optionIndex': 0
              },
              {
                'name': '17-K2',
                'value': 88.0,
                'dataCount': 72,
                'optionIndex': 0
              },
              {
                'name': '17-K3',
                'value': 82.0,
                'dataCount': 117,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawValueName': '',
            'rawHeaders': [
              '16-K1',
              '16-K2',
              '16-K3',
              '16-K4',
              '17-K1',
              '17-K2',
              '17-K3'
            ],
            'rawDataValues': [
              {
                'valueName': 'Total',
                'percents': [
                  79.0,
                  71.0,
                  80.0,
                  78.0,
                  80.0,
                  88.0,
                  82.0
                ],
                'amounts': [
                  24.0,
                  40.0,
                  46.0,
                  55.0,
                  58.0,
                  72.0,
                  117.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  79.0,
                  71.0,
                  80.0,
                  78.0,
                  80.0,
                  88.0,
                  82.0
                ],
                'amounts': [
                  24.0,
                  40.0,
                  46.0,
                  55.0,
                  58.0,
                  72.0,
                  117.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 78,
          'answerId': 14,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 103,
      'firstQuestionName': 'Q4: Er du løbende informeret om, hvad der skal ske under din indlæggelse?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 4,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 6,
      'chartType': 2,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 4,
      'chartData': {
        'single': [
          {
            'name': 'Meget glad',
            'value': 42.0,
            'dataCount': 176,
            'optionIndex': 0
          },
          {
            'name': 'Glad',
            'value': 29.0,
            'dataCount': 123,
            'optionIndex': 0
          },
          {
            'name': 'Neutral',
            'value': 19.0,
            'dataCount': 78,
            'optionIndex': 0
          },
          {
            'name': 'Sur',
            'value': 4.0,
            'dataCount': 17,
            'optionIndex': 0
          },
          {
            'name': 'Meget sur',
            'value': 3.0,
            'dataCount': 13,
            'optionIndex': 0
          },
          {
            'name': 'Ved ikke',
            'value': 3.0,
            'dataCount': 12,
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
                'valueName': 'Meget glad',
                'percents': [
                  42.0
                ],
                'amounts': [
                  176.0
                ]
              },
              {
                'valueName': 'Glad',
                'percents': [
                  29.0
                ],
                'amounts': [
                  123.0
                ]
              },
              {
                'valueName': 'Neutral',
                'percents': [
                  19.0
                ],
                'amounts': [
                  78.0
                ]
              },
              {
                'valueName': 'Sur',
                'percents': [
                  4.0
                ],
                'amounts': [
                  17.0
                ]
              },
              {
                'valueName': 'Meget sur',
                'percents': [
                  3.0
                ],
                'amounts': [
                  13.0
                ]
              },
              {
                'valueName': 'Ved ikke',
                'percents': [
                  3.0
                ],
                'amounts': [
                  12.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  100.0
                ],
                'amounts': [
                  419.0
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
