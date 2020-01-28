import {Component, Input} from '@angular/core';
import {DashboardChartTypesEnum} from '../../../../const/enums';

@Component({
  selector: 'app-dashboard-chart-edit',
  templateUrl: './dashboard-chart-edit.component.html',
  styleUrls: ['./dashboard-chart-edit.component.scss']
})
export class DashboardChartEditComponent {
  @Input() chartType: DashboardChartTypesEnum;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  single: any[];
  multi: any[];
  pie: any[];
  view: any[] = [700, 400];

  colorScheme = {
    domain: ['#6fabff', '#78cf72', '#e5ae24', '#AAAAAA', '#f2e02b', ]
  };

  constructor() {
    Object.assign(this, {single: line});
    Object.assign(this, {multi});
    Object.assign(this, {pie: single});
  }
}


const single = [
  {
    name: '0',
    value: 1.19
  },
  {
    name: '25',
    value: 1.67
  },
  {
    name: '50',
    value: 3.34
  },
  {
    name: '75',
    value: 26.73
  },
  {
    name: '100',
    value: 65.63
  },
  {
    name: '999',
    value: 1.43
  },
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
        'value': 50,
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
        'value': 50
      },
      {
        'name': 'Nej',
        'value': 50
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
        'value': 25
      },
      {
        'name': 'Nej',
        'value': 75
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
