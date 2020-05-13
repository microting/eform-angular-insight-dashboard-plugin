import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardLineScoreItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q2',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8]
  },
  {
    firstQuestion: 'Q2',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Måned',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8]
  },
  {
    firstQuestion: 'Q2',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Kvarter',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8]
  },
  {
    firstQuestion: 'Q2',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Seks måned',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8]
  },
  {
    firstQuestion: 'Q2',
    filterQuestion: '',
    filterAnswer: '',
    period: 'År',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8]
  }
];

export const dashboardLineScoreDataJson = {
  'id': 42,
  'dashboardName': 'Line Score',
  'surveyName': 'Test-Set',
  'surveyId': 1,
  'locationName': 'Location 1',
  'locationId': 1,
  'tagName': null,
  'tagId': null,
  'answerDates': {
    'dateFrom': '2016-01-01T00:00:00',
    'dateTo': '2020-05-12T23:59:59',
    'today': true
  },
  'items': [
    {
      'id': 90,
      'firstQuestionName': 'Q2: Er personalet på afsnittet venligt og imødekommende?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 1,
      'compareEnabled': false,
      'calculateAverage': true,
      'position': 1,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 1,
            'name': 'Location 1',
            'answersCount': 104,
            'isTag': false,
            'series': [
              {
                'name': '16-01',
                'value': 75.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-05',
                'value': 100.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': '16-09',
                'value': 88.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-13',
                'value': 100.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': '16-14',
                'value': 50.0,
                'dataCount': 3,
                'optionIndex': 0
              },
              {
                'name': '16-18',
                'value': 75.0,
                'dataCount': 3,
                'optionIndex': 0
              },
              {
                'name': '16-23',
                'value': 88.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-27',
                'value': 100.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-31',
                'value': 100.0,
                'dataCount': 4,
                'optionIndex': 0
              },
              {
                'name': '16-36',
                'value': 86.0,
                'dataCount': 7,
                'optionIndex': 0
              },
              {
                'name': '16-40',
                'value': 80.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '16-45',
                'value': 83.0,
                'dataCount': 3,
                'optionIndex': 0
              },
              {
                'name': '16-50',
                'value': 90.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '17-02',
                'value': 70.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '17-05',
                'value': 100.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '17-10',
                'value': 88.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-15',
                'value': 100.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-19',
                'value': 88.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-23',
                'value': 75.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': '17-24',
                'value': 96.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-27',
                'value': 88.0,
                'dataCount': 4,
                'optionIndex': 0
              },
              {
                'name': '17-33',
                'value': 96.0,
                'dataCount': 7,
                'optionIndex': 0
              },
              {
                'name': '17-37',
                'value': 88.0,
                'dataCount': 13,
                'optionIndex': 0
              },
              {
                'name': '17-38',
                'value': 90.0,
                'dataCount': 5,
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
              '16-01',
              '16-05',
              '16-09',
              '16-13',
              '16-14',
              '16-18',
              '16-23',
              '16-27',
              '16-31',
              '16-36',
              '16-40',
              '16-45',
              '16-50',
              '17-02',
              '17-05',
              '17-10',
              '17-15',
              '17-19',
              '17-23',
              '17-24',
              '17-27',
              '17-33',
              '17-37',
              '17-38'
            ],
            'rawDataValues': [
              {
                'valueName': 'Location 1',
                'percents': [
                  75.0,
                  100.0,
                  88.0,
                  100.0,
                  50.0,
                  75.0,
                  88.0,
                  100.0,
                  100.0,
                  86.0,
                  80.0,
                  83.0,
                  90.0,
                  70.0,
                  100.0,
                  88.0,
                  100.0,
                  88.0,
                  75.0,
                  96.0,
                  88.0,
                  96.0,
                  88.0,
                  90.0
                ],
                'amounts': [
                  2.0,
                  1.0,
                  2.0,
                  1.0,
                  3.0,
                  3.0,
                  2.0,
                  2.0,
                  4.0,
                  7.0,
                  5.0,
                  3.0,
                  5.0,
                  5.0,
                  5.0,
                  6.0,
                  6.0,
                  6.0,
                  1.0,
                  6.0,
                  4.0,
                  7.0,
                  13.0,
                  5.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  75.0,
                  100.0,
                  88.0,
                  100.0,
                  50.0,
                  75.0,
                  88.0,
                  100.0,
                  100.0,
                  86.0,
                  80.0,
                  83.0,
                  90.0,
                  70.0,
                  100.0,
                  88.0,
                  100.0,
                  88.0,
                  75.0,
                  96.0,
                  88.0,
                  96.0,
                  88.0,
                  90.0
                ],
                'amounts': [
                  2.0,
                  1.0,
                  2.0,
                  1.0,
                  3.0,
                  3.0,
                  2.0,
                  2.0,
                  4.0,
                  7.0,
                  5.0,
                  3.0,
                  5.0,
                  5.0,
                  5.0,
                  6.0,
                  6.0,
                  6.0,
                  1.0,
                  6.0,
                  4.0,
                  7.0,
                  13.0,
                  5.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 80,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 91,
      'firstQuestionName': 'Q2: Er personalet på afsnittet venligt og imødekommende?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 2,
      'chartType': 1,
      'compareEnabled': false,
      'calculateAverage': true,
      'position': 2,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 1,
            'name': 'Location 1',
            'answersCount': 104,
            'isTag': false,
            'series': [
              {
                'name': '16-jan',
                'value': 75.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-feb',
                'value': 100.0,
                'dataCount': 1,
                'optionIndex': 0
              },
              {
                'name': '16-mar',
                'value': 88.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-apr',
                'value': 63.0,
                'dataCount': 4,
                'optionIndex': 0
              },
              {
                'name': '16-maj',
                'value': 75.0,
                'dataCount': 3,
                'optionIndex': 0
              },
              {
                'name': '16-jun',
                'value': 88.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-jul',
                'value': 100.0,
                'dataCount': 2,
                'optionIndex': 0
              },
              {
                'name': '16-aug',
                'value': 100.0,
                'dataCount': 4,
                'optionIndex': 0
              },
              {
                'name': '16-sep',
                'value': 86.0,
                'dataCount': 7,
                'optionIndex': 0
              },
              {
                'name': '16-okt',
                'value': 80.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '16-nov',
                'value': 83.0,
                'dataCount': 3,
                'optionIndex': 0
              },
              {
                'name': '16-dec',
                'value': 90.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '17-jan',
                'value': 70.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '17-feb',
                'value': 100.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '17-mar',
                'value': 88.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-apr',
                'value': 100.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-maj',
                'value': 88.0,
                'dataCount': 6,
                'optionIndex': 0
              },
              {
                'name': '17-jun',
                'value': 93.0,
                'dataCount': 7,
                'optionIndex': 0
              },
              {
                'name': '17-jul',
                'value': 88.0,
                'dataCount': 4,
                'optionIndex': 0
              },
              {
                'name': '17-aug',
                'value': 96.0,
                'dataCount': 7,
                'optionIndex': 0
              },
              {
                'name': '17-sep',
                'value': 89.0,
                'dataCount': 18,
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
              '16-jan',
              '16-feb',
              '16-mar',
              '16-apr',
              '16-maj',
              '16-jun',
              '16-jul',
              '16-aug',
              '16-sep',
              '16-okt',
              '16-nov',
              '16-dec',
              '17-jan',
              '17-feb',
              '17-mar',
              '17-apr',
              '17-maj',
              '17-jun',
              '17-jul',
              '17-aug',
              '17-sep'
            ],
            'rawDataValues': [
              {
                'valueName': 'Location 1',
                'percents': [
                  75.0,
                  100.0,
                  88.0,
                  63.0,
                  75.0,
                  88.0,
                  100.0,
                  100.0,
                  86.0,
                  80.0,
                  83.0,
                  90.0,
                  70.0,
                  100.0,
                  88.0,
                  100.0,
                  88.0,
                  93.0,
                  88.0,
                  96.0,
                  89.0
                ],
                'amounts': [
                  2.0,
                  1.0,
                  2.0,
                  4.0,
                  3.0,
                  2.0,
                  2.0,
                  4.0,
                  7.0,
                  5.0,
                  3.0,
                  5.0,
                  5.0,
                  5.0,
                  6.0,
                  6.0,
                  6.0,
                  7.0,
                  4.0,
                  7.0,
                  18.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  75.0,
                  100.0,
                  88.0,
                  63.0,
                  75.0,
                  88.0,
                  100.0,
                  100.0,
                  86.0,
                  80.0,
                  83.0,
                  90.0,
                  70.0,
                  100.0,
                  88.0,
                  100.0,
                  88.0,
                  93.0,
                  88.0,
                  96.0,
                  89.0
                ],
                'amounts': [
                  2.0,
                  1.0,
                  2.0,
                  4.0,
                  3.0,
                  2.0,
                  2.0,
                  4.0,
                  7.0,
                  5.0,
                  3.0,
                  5.0,
                  5.0,
                  5.0,
                  6.0,
                  6.0,
                  6.0,
                  7.0,
                  4.0,
                  7.0,
                  18.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 81,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 92,
      'firstQuestionName': 'Q2: Er personalet på afsnittet venligt og imødekommende?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
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
            'name': 'Location 1',
            'answersCount': 104,
            'isTag': false,
            'series': [
              {
                'name': '16-K1',
                'value': 85.0,
                'dataCount': 5,
                'optionIndex': 0
              },
              {
                'name': '16-K2',
                'value': 72.0,
                'dataCount': 9,
                'optionIndex': 0
              },
              {
                'name': '16-K3',
                'value': 92.0,
                'dataCount': 13,
                'optionIndex': 0
              },
              {
                'name': '16-K4',
                'value': 85.0,
                'dataCount': 13,
                'optionIndex': 0
              },
              {
                'name': '17-K1',
                'value': 86.0,
                'dataCount': 16,
                'optionIndex': 0
              },
              {
                'name': '17-K2',
                'value': 93.0,
                'dataCount': 19,
                'optionIndex': 0
              },
              {
                'name': '17-K3',
                'value': 91.0,
                'dataCount': 29,
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
                'valueName': 'Location 1',
                'percents': [
                  85.0,
                  72.0,
                  92.0,
                  85.0,
                  86.0,
                  93.0,
                  91.0
                ],
                'amounts': [
                  5.0,
                  9.0,
                  13.0,
                  13.0,
                  16.0,
                  19.0,
                  29.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  85.0,
                  72.0,
                  92.0,
                  85.0,
                  86.0,
                  93.0,
                  91.0
                ],
                'amounts': [
                  5.0,
                  9.0,
                  13.0,
                  13.0,
                  16.0,
                  19.0,
                  29.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 82,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 93,
      'firstQuestionName': 'Q2: Er personalet på afsnittet venligt og imødekommende?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 4,
      'chartType': 1,
      'compareEnabled': false,
      'calculateAverage': true,
      'position': 4,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 1,
            'name': 'Location 1',
            'answersCount': 104,
            'isTag': false,
            'series': [
              {
                'name': '16-1H',
                'value': 77.0,
                'dataCount': 14,
                'optionIndex': 0
              },
              {
                'name': '16-2H',
                'value': 88.0,
                'dataCount': 26,
                'optionIndex': 0
              },
              {
                'name': '17-1H',
                'value': 90.0,
                'dataCount': 35,
                'optionIndex': 0
              },
              {
                'name': '17-2H',
                'value': 91.0,
                'dataCount': 29,
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
              '16-1H',
              '16-2H',
              '17-1H',
              '17-2H'
            ],
            'rawDataValues': [
              {
                'valueName': 'Location 1',
                'percents': [
                  77.0,
                  88.0,
                  90.0,
                  91.0
                ],
                'amounts': [
                  14.0,
                  26.0,
                  35.0,
                  29.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  77.0,
                  88.0,
                  90.0,
                  91.0
                ],
                'amounts': [
                  14.0,
                  26.0,
                  35.0,
                  29.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 83,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 94,
      'firstQuestionName': 'Q2: Er personalet på afsnittet venligt og imødekommende?',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 5,
      'chartType': 1,
      'compareEnabled': false,
      'calculateAverage': true,
      'position': 5,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 1,
            'name': 'Location 1',
            'answersCount': 104,
            'isTag': false,
            'series': [
              {
                'name': '2016',
                'value': 84.0,
                'dataCount': 40,
                'optionIndex': 0
              },
              {
                'name': '2017',
                'value': 90.0,
                'dataCount': 64,
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
              '2016',
              '2017'
            ],
            'rawDataValues': [
              {
                'valueName': 'Location 1',
                'percents': [
                  84.0,
                  90.0
                ],
                'amounts': [
                  40.0,
                  64.0
                ]
              },
              {
                'valueName': 'Total',
                'percents': [
                  84.0,
                  90.0
                ],
                'amounts': [
                  40.0,
                  64.0
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 84,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    }
  ]
};
