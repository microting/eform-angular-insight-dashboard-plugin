import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DashboardChartTypesEnum} from '../../../../const/enums';
import {DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from '../../../../../../../common/models/common';

@Component({
  selector: 'app-dashboard-chart-edit',
  templateUrl: './dashboard-chart-edit.component.html',
  styleUrls: ['./dashboard-chart-edit.component.scss']
})
export class DashboardChartEditComponent implements OnChanges {
  @Input() chartPosition: number;
  @Input() isFirstQuestionSmiley: boolean;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() answers: CommonDictionaryModel[] = [];

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  line: any[];
  multi: any[];
  multiStacked: any[];
  pie: any[];
  view: any[] = [800, 400];

  colorScheme = {
    domain: ['#9c27b0', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#9e9e9e']
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  legendAdvanced = false;
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges = true;
  animations = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = false;
  noBarWhenZero = true;
  barWidth = 7;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;

  customColors = [
    {
      name: 'Meget glad',
      value: '#007E33'
    },
    {
      name: 'Glad',
      value: '#00C851'
    },
    {
      name: 'Neutral',
      value: '#ffbb33'
    },
    {
      name: 'Sur',
      value: '#ff4444'
    },
    {
      name: 'Meget sur',
      value: '#CC0000'
    },
    {
      name: 'Ved ikke',
      value: '#0099CC'
    }
  ];

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.isFirstQuestionSmiley) {
      const currentValue = changes.isFirstQuestionSmiley.currentValue as boolean;
        if (currentValue) {
          Object.assign(this, {line: lineSmiley});
          Object.assign(this, {multi: multiSmiley});
          Object.assign(this, {pie: singleSmiley});
          Object.assign(this, {multiStacked});
        } else {
          Object.assign(this, {line: line});
          Object.assign(this, {multi});
          Object.assign(this, {pie: single});
          Object.assign(this, {multiStacked});
        }
    }
  }
}


const singleSmiley = [
  {
    name: 'Meget glad',
    value: 65.63
  },
  {
    name: 'Glad',
    value: 1.67
  },
  {
    name: 'Neutral',
    value: 3.34
  },
  {
    name: 'Sur',
    value: 26.73
  },
  {
    name: 'Meget sur',
    value: 1.19
  },
  {
    name: 'Ved ikke',
    value: 1.43
  },
];
const single = [
  {
    name: 'Ja',
    value: 70
  },
  {
    name: 'Nej',
    value: 30
  }
];

const line = [
  {
    'name': 'Ja',
    'series': [
      {
        'value': 20,
        'name': '16-apr'
      },
      {
        'value': 80,
        'name': '16-aug'
      },
      {
        'value': 50,
        'name': '16-sep'
      },
      {
        'value': 30,
        'name': '16-oct'
      },
      {
        'value': 10,
        'name': '16-nov'
      },
      {
        'value': 67,
        'name': '16-dec'
      },
      {
        'value': 79,
        'name': '17-jan'
      }
    ]
  },
  {
    'name': 'Nej',
    'series': [
      {
        'value': 80,
        'name': '16-apr'
      },
      {
        'value': 20,
        'name': '16-aug'
      },
      {
        'value': 25,
        'name': '16-sep'
      },
      {
        'value': 70,
        'name': '16-oct'
      },
      {
        'value': 90,
        'name': '16-nov'
      },
      {
        'value': 33,
        'name': '16-dec'
      },
      {
        'value': 21,
        'name': '17-jan'
      }
    ]
  },
];
const lineSmiley = [
  {
    'name': 'Meget glad',
    'series': [
      {
        'name': '16-1H',
        'value': 0
      },
      {
        'name': '16-2H',
        'value': 2
      },
      {
        'name': '17-1H',
        'value': 10
      },
      {
        'name': '17-2H',
        'value': 6
      }
    ]
  },
  {
    'name': 'Glad',
    'series': [
      {
        'name': '16-1H',
        'value': 35.0
      },
      {
        'name': '16-2H',
        'value': 65.0
      },
      {
        'name': '17-1H',
        'value': 66.0
      },
      {
        'name': '17-2H',
        'value': 68.0
      }
    ]
  },
  {
    'name': 'Neutral',
    'series': [
      {
        'name': '16-1H',
        'value': 7.0
      },
      {
        'name': '16-2H',
        'value': 3.0
      },
      {
        'name': '17-1H',
        'value': 10
      },
      {
        'name': '17-2H',
        'value': 3.0
      }
    ]
  },
  {
    'name': 'Sur',
    'series': [
      {
        'name': '16-1H',
        'value': 14.0
      },
      {
        'name': '16-2H',
        'value': 3.0
      },
      {
        'name': '17-1H',
        'value': 4
      },
      {
        'name': '17-2H',
        'value': 6.0
      }
    ]
  },
  {
    'name': 'Meget sur',
    'series': [
      {
        'name': '16-1H',
        'value': 42.0
      },
      {
        'name': '16-2H',
        'value': 26.0
      },
      {
        'name': '17-1H',
        'value': 27.0
      },
      {
        'name': '17-2H',
        'value': 24.0
      }
    ]
  },
  {
    'name': 'Ved ikke',
    'series': [
      {
        'name': '16-1H',
        'value': 30
      },
      {
        'name': '16-2H',
        'value': 22
      },
      {
        'name': '17-1H',
        'value': 16
      },
      {
        'name': '17-2H',
        'value': 12
      }
    ]
  }
];

const multi = [
  {
    'name': '16-apr',
    'series': [
      {
        'name': 'Ja',
        'value': 70
      },
      {
        'name': 'Nej',
        'value': 30
      }
    ]
  },
  {
    'name': '16-aug',
    'series': [
      {
        'name': 'Ja',
        'value': 75
      },
      {
        'name': 'Nej',
        'value': 25
      }
    ]
  },
  {
    'name': '16-dec',
    'series': [
      {
        'name': 'Ja',
        'value': 70
      },
      {
        'name': 'Nej',
        'value': 30
      }
    ]
  },
  {
    'name': '16-feb',
    'series': [
      {
        'name': 'Ja',
        'value': 30
      },
      {
        'name': 'Nej',
        'value': 70
      }
    ]
  },
  {
    'name': '17-jan',
    'series': [
      {
        'name': 'Ja',
        'value': 60
      },
      {
        'name': 'Nej',
        'value': 40
      }
    ]
  },
  {
    'name': '17-feb',
    'series': [
      {
        'name': 'Ja',
        'value': 10
      },
      {
        'name': 'Nej',
        'value': 90
      }
    ]
  },
  {
    'name': '17-mar',
    'series': [
      {
        'name': 'Ja',
        'value': 60
      },
      {
        'name': 'Nej',
        'value': 40
      }
    ]
  },
  {
    'name': '17-apr',
    'series': [
      {
        'name': 'Ja',
        'value': 5
      },
      {
        'name': 'Nej',
        'value': 95
      }
    ]
  },
  {
    'name': '17-aug',
    'series': [
      {
        'name': 'Ja',
        'value': 17
      },
      {
        'name': 'Nej',
        'value': 83
      }
    ]
  },
  {
    'name': '17-sep',
    'series': [
      {
        'name': 'Ja',
        'value': 33
      },
      {
        'name': 'Nej',
        'value': 67
      }
    ]
  },
  {
    'name': '17-oct',
    'series': [
      {
        'name': 'Ja',
        'value': 0
      },
      {
        'name': 'Nej',
        'value': 100
      }
    ]
  },
  {
    'name': '17-nov',
    'series': [
      {
        'name': 'Ja',
        'value': 15
      },
      {
        'name': 'Nej',
        'value': 85
      }
    ]
  },
  {
    'name': '17-dec',
    'series': [
      {
        'name': 'Ja',
        'value': 5
      },
      {
        'name': 'Nej',
        'value': 95
      }
    ]
  },
];
const multiSmiley = [
  {
    'name': '16-1H',
    'series': [
      {
        'name': 'Meget glad',
        'value': 35.0
      },
      {
        'name': 'Glad',
        'value': 42.0
      },
      {
        'name': 'Neutral',
        'value': 14.0
      },
      {
        'name': 'Sur',
        'value': 7.0
      }
    ]
  },
  {
    'name': '16-2H',
    'series': [
      {
        'name': 'Meget glad',
        'value': 65.0
      },
      {
        'name': 'Glad',
        'value': 26.0
      },
      {
        'name': 'Neutral',
        'value': 3.0
      },
      {
        'name': 'Sur',
        'value': 3.0
      }
    ]
  },
  {
    'name': '17-1H',
    'series': [
      {
        'name': 'Meget glad',
        'value': 66.0
      },
      {
        'name': 'Glad',
        'value': 27.0
      },
      {
        'name': 'Neutral',
        'value': 2.0
      },
      {
        'name': 'Meget sur',
        'value': 2.0
      }
    ]
  },
  {
    'name': '17-2H',
    'series': [
      {
        'name': 'Meget glad',
        'value': 68.0
      },
      {
        'name': 'Glad',
        'value': 24.0
      },
      {
        'name': 'Neutral',
        'value': 6.0
      }
    ]
  }
];

const multiStacked = [
  {
    'id': 1,
    'name': 'Location 1',
    'series': [
      {
        'name': '16-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 35.0
          },
          {
            'name': 'Glad',
            'value': 42.0
          },
          {
            'name': 'Neutral',
            'value': 14.0
          },
          {
            'name': 'Sur',
            'value': 7.0
          }
        ]
      },
      {
        'name': '16-2H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 65.0
          },
          {
            'name': 'Glad',
            'value': 26.0
          },
          {
            'name': 'Neutral',
            'value': 3.0
          },
          {
            'name': 'Sur',
            'value': 3.0
          }
        ]
      },
      {
        'name': '17-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 2.0
          },
          {
            'name': 'Glad',
            'value': 66.0
          },
          {
            'name': 'Neutral',
            'value': 27.0
          },
          {
            'name': 'Sur',
            'value': 2.0
          }
        ]
      },
      {
        'name': '17-2H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 68.0
          },
          {
            'name': 'Glad',
            'value': 24.0
          },
          {
            'name': 'Neutral',
            'value': 6.0
          }
        ]
      }
    ]
  },
  {
    'id': 2,
    'name': 'Location 2',
    'series': [
      {
        'name': '16-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 44.0
          },
          {
            'name': 'Glad',
            'value': 51
          },
          {
            'name': '0',
            'value': 5.0
          }
        ]
      },
      {
        'name': '16-2H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 52.0
          },
          {
            'name': 'Glad',
            'value': 44.0
          },
          {
            'name': 'Neutral',
            'value': 4.0
          }
        ]
      },
      {
        'name': '17-1H',
        'series': [
          {
            'name': 'Meget sur',
            'value': 5.0
          },
          {
            'name': 'Meget glad',
            'value': 70.0
          },
          {
            'name': 'Glad',
            'value': 18.0
          },
          {
            'name': 'Neutral',
            'value': 2.0
          },
          {
            'name': 'Neutral',
            'value': 2.0
          }
        ]
      },
      {
        'name': '17-2H',
        'series': [
          {
            'name': 'Meget sur',
            'value': 3.0
          },
          {
            'name': 'Meget glad',
            'value': 72.0
          },
          {
            'name': 'Glad',
            'value': 20.0
          },
          {
            'name': 'Neutral',
            'value': 3.0
          }
        ]
      }
    ]
  },
  {
    'id': 3,
    'name': 'Location 3',
    'series': [
      {
        'name': '16-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 76.0
          },
          {
            'name': 'Glad',
            'value': 11.0
          },
          {
            'name': 'Neutral',
            'value': 5.0
          },
          {
            'name': '0',
            'value': 5.0
          }
        ]
      },
      {
        'name': '16-2H',
        'series': [
          {
            'name': '999',
            'value': 20
          },
          {
            'name': 'Meget glad',
            'value': 66.0
          },
          {
            'name': 'Glad',
            'value': 4
          },
          {
            'name': 'Neutral',
            'value': 10
          }
        ]
      },
      {
        'name': '17-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 80.0
          },
          {
            'name': 'Glad',
            'value': 16.0
          },
          {
            'name': 'Neutral',
            'value': 3.0
          }
        ]
      },
      {
        'name': '17-2H',
        'series': [
          {
            'name': 'Meget sur',
            'value': 3.0
          },
          {
            'name': 'Meget glad',
            'value': 62.0
          },
          {
            'name': 'Glad',
            'value': 31.0
          },
          {
            'name': 'Neutral',
            'value': 3.0
          }
        ]
      }
    ]
  },
  {
    'id': 4,
    'name': 'Location 4',
    'series': [
      {
        'name': '16-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 60.0
          },
          {
            'name': 'Glad',
            'value': 26.0
          },
          {
            'name': 'Neutral',
            'value': 6.0
          },
          {
            'name': 'Sur',
            'value': 6.0
          }
        ]
      },
      {
        'name': '16-2H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 68.0
          },
          {
            'name': 'Glad',
            'value': 28.0
          },
          {
            'name': 'Neutral',
            'value': 4.0
          }
        ]
      },
      {
        'name': '17-1H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 65.0
          },
          {
            'name': 'Glad',
            'value': 24.0
          },
          {
            'name': 'Neutral',
            'value': 6.0
          },
          {
            'name': 'Sur',
            'value': 3.0
          }
        ]
      },
      {
        'name': '17-2H',
        'series': [
          {
            'name': 'Meget glad',
            'value': 70.0
          },
          {
            'name': 'Glad',
            'value': 23.0
          },
          {
            'name': 'Neutral',
            'value': 6.0
          }
        ]
      }
    ]
  }
];
