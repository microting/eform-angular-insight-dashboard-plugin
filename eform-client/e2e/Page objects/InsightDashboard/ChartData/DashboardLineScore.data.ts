import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardLineScoreItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8],
    comparedItems: []
  },
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Måned',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8],
    comparedItems: []
  },
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Kvartal',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8],
    comparedItems: []
  },
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Halvår',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8],
    comparedItems: []
  },
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'År',
    chartType: 'Linje',
    calculateAverage: true,
    ignoredAnswerIds: [8],
    comparedItems: []
  }
];

export const dashboardLineScoreDataJson = {
  'id': 14,
  'dashboardName': 'Line Score',
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
      'id': 27,
      'firstQuestionName': 'Q2',
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
                'name': '16_01',
                'value': 75,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_05',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_09',
                'value': 87.5,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_13',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_14',
                'value': 50,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_18',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_23',
                'value': 87.5,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_27',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_31',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_36',
                'value': 85.71,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_40',
                'value': 80,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_45',
                'value': 83.33,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_50',
                'value': 90,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_02',
                'value': 70,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_05',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_10',
                'value': 87.5,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_15',
                'value': 100,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_19',
                'value': 87.5,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_23',
                'value': 75,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_24',
                'value': 95.83,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_27',
                'value': 87.5,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_33',
                'value': 96.43,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_37',
                'value': 88.46,
                'dataCount': 13,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_38',
                'value': 90,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
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
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      75,
                      100,
                      87.5,
                      100,
                      50,
                      75,
                      87.5,
                      100,
                      100,
                      85.71,
                      80,
                      83.33,
                      90,
                      70,
                      100,
                      87.5,
                      100,
                      87.5,
                      75,
                      95.83,
                      87.5,
                      96.43,
                      88.46,
                      90
                    ],
                    'amounts': [
                      2,
                      1,
                      2,
                      1,
                      3,
                      3,
                      2,
                      2,
                      4,
                      7,
                      5,
                      3,
                      5,
                      5,
                      5,
                      6,
                      6,
                      6,
                      1,
                      6,
                      4,
                      7,
                      13,
                      5
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      75,
                      100,
                      87.5,
                      100,
                      50,
                      75,
                      87.5,
                      100,
                      100,
                      85.71,
                      80,
                      83.33,
                      90,
                      70,
                      100,
                      87.5,
                      100,
                      87.5,
                      75,
                      95.83,
                      87.5,
                      96.43,
                      88.46,
                      90
                    ],
                    'amounts': [
                      2,
                      1,
                      2,
                      1,
                      3,
                      3,
                      2,
                      2,
                      4,
                      7,
                      5,
                      3,
                      5,
                      5,
                      5,
                      6,
                      6,
                      6,
                      1,
                      6,
                      4,
                      7,
                      13,
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
      'ignoredAnswerValues': [
        {
          'id': 1,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 28,
      'firstQuestionName': 'Q2',
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
                'name': '16_jan',
                'value': 75,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_feb',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_mar',
                'value': 87.5,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_apr',
                'value': 62.5,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_maj',
                'value': 75,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_jun',
                'value': 87.5,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_jul',
                'value': 100,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_aug',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_sep',
                'value': 85.71,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_okt',
                'value': 80,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_nov',
                'value': 83.33,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_dec',
                'value': 90,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_jan',
                'value': 70,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_feb',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_mar',
                'value': 87.5,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_apr',
                'value': 100,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_maj',
                'value': 87.5,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_jun',
                'value': 92.86,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_jul',
                'value': 87.5,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_aug',
                'value': 96.43,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_sep',
                'value': 88.89,
                'dataCount': 18,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_jan',
              '16_feb',
              '16_mar',
              '16_apr',
              '16_maj',
              '16_jun',
              '16_jul',
              '16_aug',
              '16_sep',
              '16_okt',
              '16_nov',
              '16_dec',
              '17_jan',
              '17_feb',
              '17_mar',
              '17_apr',
              '17_maj',
              '17_jun',
              '17_jul',
              '17_aug',
              '17_sep'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      75,
                      100,
                      87.5,
                      62.5,
                      75,
                      87.5,
                      100,
                      100,
                      85.71,
                      80,
                      83.33,
                      90,
                      70,
                      100,
                      87.5,
                      100,
                      87.5,
                      92.86,
                      87.5,
                      96.43,
                      88.89
                    ],
                    'amounts': [
                      2,
                      1,
                      2,
                      4,
                      3,
                      2,
                      2,
                      4,
                      7,
                      5,
                      3,
                      5,
                      5,
                      5,
                      6,
                      6,
                      6,
                      7,
                      4,
                      7,
                      18
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      75,
                      100,
                      87.5,
                      62.5,
                      75,
                      87.5,
                      100,
                      100,
                      85.71,
                      80,
                      83.33,
                      90,
                      70,
                      100,
                      87.5,
                      100,
                      87.5,
                      92.86,
                      87.5,
                      96.43,
                      88.89
                    ],
                    'amounts': [
                      2,
                      1,
                      2,
                      4,
                      3,
                      2,
                      2,
                      4,
                      7,
                      5,
                      3,
                      5,
                      5,
                      5,
                      6,
                      6,
                      6,
                      7,
                      4,
                      7,
                      18
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 2,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 29,
      'firstQuestionName': 'Q2',
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
                'name': '16_K1',
                'value': 85,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_K2',
                'value': 72.22,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_K3',
                'value': 92.31,
                'dataCount': 13,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_K4',
                'value': 84.62,
                'dataCount': 13,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_K1',
                'value': 85.94,
                'dataCount': 16,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_K2',
                'value': 93.42,
                'dataCount': 19,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_K3',
                'value': 90.52,
                'dataCount': 29,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_K1',
              '16_K2',
              '16_K3',
              '16_K4',
              '17_K1',
              '17_K2',
              '17_K3'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      85,
                      72.22,
                      92.31,
                      84.62,
                      85.94,
                      93.42,
                      90.52
                    ],
                    'amounts': [
                      5,
                      9,
                      13,
                      13,
                      16,
                      19,
                      29
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      85,
                      72.22,
                      92.31,
                      84.62,
                      85.94,
                      93.42,
                      90.52
                    ],
                    'amounts': [
                      5,
                      9,
                      13,
                      13,
                      16,
                      19,
                      29
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 3,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 30,
      'firstQuestionName': 'Q2',
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
                'name': '16_1H',
                'value': 76.79,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '16_2H',
                'value': 88.46,
                'dataCount': 26,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_1H',
                'value': 90,
                'dataCount': 35,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '17_2H',
                'value': 90.52,
                'dataCount': 29,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_1H',
              '16_2H',
              '17_1H',
              '17_2H'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      76.79,
                      88.46,
                      90,
                      90.52
                    ],
                    'amounts': [
                      14,
                      26,
                      35,
                      29
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      76.79,
                      88.46,
                      90,
                      90.52
                    ],
                    'amounts': [
                      14,
                      26,
                      35,
                      29
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 4,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 31,
      'firstQuestionName': 'Q2',
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
                'value': 84.38,
                'dataCount': 40,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': '2017',
                'value': 90.23,
                'dataCount': 64,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '2016',
              '2017'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      84.38,
                      90.23
                    ],
                    'amounts': [
                      40,
                      64
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      84.38,
                      90.23
                    ],
                    'amounts': [
                      40,
                      64
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 5,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    }
  ]
};
