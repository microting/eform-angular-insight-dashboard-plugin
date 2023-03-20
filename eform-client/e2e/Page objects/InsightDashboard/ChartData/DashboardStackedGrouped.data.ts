import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardStackedGroupedItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'År',
    chartType: 'Vandret Bjælke Stablet Grupperet',
    calculateAverage: false,
    ignoredAnswerIds: [8],
    comparedItems: [
      {itemIndex: 0, value: 2},
      {itemIndex: 1, value: 3},
      {itemIndex: 2, value: 4},
      {itemIndex: 3, value: 5},
      {itemIndex: 4, value: 1},
    ]
  }
];

export const dashboardStackedGroupedDataJson = {
  'id': 18,
  'dashboardName': 'Stacked Grouped',
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
      'id': 44,
      'firstQuestionName': 'Q2',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 5,
      'chartType': 11,
      'compareEnabled': true,
      'calculateAverage': false,
      'position': 1,
      'chartData': {
        'single': [],
        'multi': [],
        'multiStacked': [
          {
            'id': 1,
            'name': 'Total',
            'isTag': true,
            'series': [
              {
                'id': 0,
                'name': '2016',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 60.24,
                    'dataCount': 100,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 31.93,
                    'dataCount': 53,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 3.61,
                    'dataCount': 6,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 2.41,
                    'dataCount': 4,
                    'answersDataCount': 0,
                    'optionIndex': 3
                  },
                  {
                    'name': 'Meget sur',
                    'value': 1.81,
                    'dataCount': 3,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              },
              {
                'id': 0,
                'name': '2017',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 70.85,
                    'dataCount': 175,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 23.89,
                    'dataCount': 59,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 3.24,
                    'dataCount': 8,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 1.21,
                    'dataCount': 3,
                    'answersDataCount': 0,
                    'optionIndex': 3
                  },
                  {
                    'name': 'Meget sur',
                    'value': 0.81,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              }
            ]
          },
          {
            'id': 4,
            'name': 'Location 4',
            'isTag': false,
            'series': [
              {
                'id': 0,
                'name': '2016',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 65,
                    'dataCount': 26,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 27.5,
                    'dataCount': 11,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Sur',
                    'value': 5,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 3
                  },
                  {
                    'name': 'Meget sur',
                    'value': 2.5,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              },
              {
                'id': 0,
                'name': '2017',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 67.8,
                    'dataCount': 40,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 23.73,
                    'dataCount': 14,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 3.39,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 3.39,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 3
                  },
                  {
                    'name': 'Meget sur',
                    'value': 1.69,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              }
            ]
          },
          {
            'id': 3,
            'name': 'Location 3',
            'isTag': false,
            'series': [
              {
                'id': 0,
                'name': '2016',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 72.09,
                    'dataCount': 31,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 20.93,
                    'dataCount': 9,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 4.65,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Meget sur',
                    'value': 2.33,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              },
              {
                'id': 0,
                'name': '2017',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 72.13,
                    'dataCount': 44,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 24.59,
                    'dataCount': 15,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 3.28,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Meget sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  }
                ]
              }
            ]
          },
          {
            'id': 2,
            'name': 'Location 2',
            'isTag': false,
            'series': [
              {
                'id': 0,
                'name': '2016',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 48.84,
                    'dataCount': 21,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 46.51,
                    'dataCount': 20,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 2.33,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Meget sur',
                    'value': 2.33,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              },
              {
                'id': 0,
                'name': '2017',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 74.6,
                    'dataCount': 47,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 20.63,
                    'dataCount': 13,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 3.17,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 1.59,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 3
                  },
                  {
                    'name': 'Meget sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  }
                ]
              }
            ]
          },
          {
            'id': 1,
            'name': 'Location 1',
            'isTag': false,
            'series': [
              {
                'id': 0,
                'name': '2016',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 55,
                    'dataCount': 22,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 32.5,
                    'dataCount': 13,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 7.5,
                    'dataCount': 3,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 5,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 3
                  },
                  {
                    'name': 'Meget sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  }
                ]
              },
              {
                'id': 0,
                'name': '2017',
                'answersCount': 0,
                'isTag': false,
                'series': [
                  {
                    'name': 'Meget glad',
                    'value': 68.75,
                    'dataCount': 44,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Glad',
                    'value': 26.56,
                    'dataCount': 17,
                    'answersDataCount': 0,
                    'optionIndex': 1
                  },
                  {
                    'name': 'Neutral',
                    'value': 3.13,
                    'dataCount': 2,
                    'answersDataCount': 0,
                    'optionIndex': 2
                  },
                  {
                    'name': 'Sur',
                    'value': 0,
                    'dataCount': 0,
                    'answersDataCount': 0,
                    'optionIndex': 0
                  },
                  {
                    'name': 'Meget sur',
                    'value': 1.56,
                    'dataCount': 1,
                    'answersDataCount': 0,
                    'optionIndex': 4
                  }
                ]
              }
            ]
          }
        ],
        'rawData': [
          {
            'rawHeaders': [
              'Meget glad',
              'Glad',
              'Neutral',
              'Sur',
              'Meget sur',
              '%',
              'Meget glad',
              'Glad',
              'Neutral',
              'Sur',
              'Meget sur',
              'n'
            ],
            'rawDataItems': [
              {
                'rawValueName': '2016',
                'rawDataValues': [
                  {
                    'valueName': 'Total',
                    'percents': [
                      60.24,
                      31.93,
                      3.61,
                      2.41,
                      1.81,
                      100
                    ],
                    'amounts': [
                      100,
                      53,
                      6,
                      4,
                      3,
                      166
                    ]
                  },
                  {
                    'valueName': 'Location 4',
                    'percents': [
                      65,
                      27.5,
                      0,
                      5,
                      2.5,
                      100
                    ],
                    'amounts': [
                      26,
                      11,
                      0,
                      2,
                      1,
                      40
                    ]
                  },
                  {
                    'valueName': 'Location 3',
                    'percents': [
                      72.09,
                      20.93,
                      4.65,
                      0,
                      2.33,
                      100
                    ],
                    'amounts': [
                      31,
                      9,
                      2,
                      0,
                      1,
                      43
                    ]
                  },
                  {
                    'valueName': 'Location 2',
                    'percents': [
                      48.84,
                      46.51,
                      2.33,
                      0,
                      2.33,
                      100.01
                    ],
                    'amounts': [
                      21,
                      20,
                      1,
                      0,
                      1,
                      43
                    ]
                  },
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      55,
                      32.5,
                      7.5,
                      5,
                      0,
                      100
                    ],
                    'amounts': [
                      22,
                      13,
                      3,
                      2,
                      0,
                      40
                    ]
                  }
                ]
              },
              {
                'rawValueName': '2017',
                'rawDataValues': [
                  {
                    'valueName': 'Total',
                    'percents': [
                      70.85,
                      23.89,
                      3.24,
                      1.21,
                      0.81,
                      100
                    ],
                    'amounts': [
                      175,
                      59,
                      8,
                      3,
                      2,
                      247
                    ]
                  },
                  {
                    'valueName': 'Location 4',
                    'percents': [
                      67.8,
                      23.73,
                      3.39,
                      3.39,
                      1.69,
                      100
                    ],
                    'amounts': [
                      40,
                      14,
                      2,
                      2,
                      1,
                      59
                    ]
                  },
                  {
                    'valueName': 'Location 3',
                    'percents': [
                      72.13,
                      24.59,
                      3.28,
                      0,
                      0,
                      100
                    ],
                    'amounts': [
                      44,
                      15,
                      2,
                      0,
                      0,
                      61
                    ]
                  },
                  {
                    'valueName': 'Location 2',
                    'percents': [
                      74.6,
                      20.63,
                      3.17,
                      1.59,
                      0,
                      99.99
                    ],
                    'amounts': [
                      47,
                      13,
                      2,
                      1,
                      0,
                      63
                    ]
                  },
                  {
                    'valueName': 'Location 1',
                    'percents': [
                      68.75,
                      26.56,
                      3.13,
                      0,
                      1.56,
                      100
                    ],
                    'amounts': [
                      44,
                      17,
                      2,
                      0,
                      1,
                      64
                    ]
                  }
                ]
              }
            ]
          },
          {
            'rawHeaders': [
              'Meget glad',
              'Glad',
              'Neutral',
              'Sur',
              'Meget sur',
              '%',
              'Meget glad',
              'Glad',
              'Neutral',
              'Sur',
              'Meget sur',
              'n'
            ],
            'rawDataItems': [
              {
                'rawValueName': 'Total',
                'rawDataValues': [
                  {
                    'valueName': '2016',
                    'percents': [
                      60.24,
                      31.93,
                      3.61,
                      2.41,
                      1.81,
                      100
                    ],
                    'amounts': [
                      100,
                      53,
                      6,
                      4,
                      3,
                      166
                    ]
                  },
                  {
                    'valueName': '2017',
                    'percents': [
                      70.85,
                      23.89,
                      3.24,
                      1.21,
                      0.81,
                      100
                    ],
                    'amounts': [
                      175,
                      59,
                      8,
                      3,
                      2,
                      247
                    ]
                  }
                ]
              },
              {
                'rawValueName': 'Location 4',
                'rawDataValues': [
                  {
                    'valueName': '2016',
                    'percents': [
                      65,
                      27.5,
                      0,
                      5,
                      2.5,
                      100
                    ],
                    'amounts': [
                      26,
                      11,
                      0,
                      2,
                      1,
                      40
                    ]
                  },
                  {
                    'valueName': '2017',
                    'percents': [
                      67.8,
                      23.73,
                      3.39,
                      3.39,
                      1.69,
                      100
                    ],
                    'amounts': [
                      40,
                      14,
                      2,
                      2,
                      1,
                      59
                    ]
                  }
                ]
              },
              {
                'rawValueName': 'Location 3',
                'rawDataValues': [
                  {
                    'valueName': '2016',
                    'percents': [
                      72.09,
                      20.93,
                      4.65,
                      0,
                      2.33,
                      100
                    ],
                    'amounts': [
                      31,
                      9,
                      2,
                      0,
                      1,
                      43
                    ]
                  },
                  {
                    'valueName': '2017',
                    'percents': [
                      72.13,
                      24.59,
                      3.28,
                      0,
                      0,
                      100
                    ],
                    'amounts': [
                      44,
                      15,
                      2,
                      0,
                      0,
                      61
                    ]
                  }
                ]
              },
              {
                'rawValueName': 'Location 2',
                'rawDataValues': [
                  {
                    'valueName': '2016',
                    'percents': [
                      48.84,
                      46.51,
                      2.33,
                      0,
                      2.33,
                      100.01
                    ],
                    'amounts': [
                      21,
                      20,
                      1,
                      0,
                      1,
                      43
                    ]
                  },
                  {
                    'valueName': '2017',
                    'percents': [
                      74.6,
                      20.63,
                      3.17,
                      1.59,
                      0,
                      99.99
                    ],
                    'amounts': [
                      47,
                      13,
                      2,
                      1,
                      0,
                      63
                    ]
                  }
                ]
              },
              {
                'rawValueName': 'Location 1',
                'rawDataValues': [
                  {
                    'valueName': '2016',
                    'percents': [
                      55,
                      32.5,
                      7.5,
                      5,
                      0,
                      100
                    ],
                    'amounts': [
                      22,
                      13,
                      3,
                      2,
                      0,
                      40
                    ]
                  },
                  {
                    'valueName': '2017',
                    'percents': [
                      68.75,
                      26.56,
                      3.13,
                      0,
                      1.56,
                      100
                    ],
                    'amounts': [
                      44,
                      17,
                      2,
                      0,
                      1,
                      64
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [
        {
          'id': 5,
          'locationId': null,
          'tagId': 1,
          'position': 1,
          'name': 'Total'
        },
        {
          'id': 1,
          'locationId': 4,
          'tagId': null,
          'position': 2,
          'name': 'Location 4'
        },
        {
          'id': 2,
          'locationId': 3,
          'tagId': null,
          'position': 3,
          'name': 'Location 3'
        },
        {
          'id': 3,
          'locationId': 2,
          'tagId': null,
          'position': 4,
          'name': 'Location 2'
        },
        {
          'id': 4,
          'locationId': 1,
          'tagId': null,
          'position': 5,
          'name': 'Location 1'
        }
      ],
      'ignoredAnswerValues': [
        {
          'id': 8,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    }
  ]
};
