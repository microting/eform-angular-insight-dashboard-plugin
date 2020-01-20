import {Component, Input} from '@angular/core';
import {DashboardChartTypes} from '../../../../const/enums';
import html2canvas from 'html2canvas';
import {convertInlineStyleSVG} from '../../../../helpers/chart-svg.helper';

@Component({
  selector: 'app-dashboard-chart-edit',
  templateUrl: './dashboard-chart-edit.component.html',
  styleUrls: ['./dashboard-chart-edit.component.scss']
})
export class DashboardChartEditComponent {
  @Input() chartType: DashboardChartTypes;

  get chartTypes() {
    return DashboardChartTypes;
  }

  single: any[];
  multi: any[];
  view: any[] = [700, 400];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    Object.assign(this, {single});
    Object.assign(this, {multi});
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}


const single = [
  {
    name: 'Germany',
    value: 8940000
  },
  {
    name: 'USA',
    value: 5000000
  },
  {
    name: 'France',
    value: 7200000
  }
];

const multi = [
  {
    'name': 'Germany',
    'series': [
      {
        'name': '2010',
        'value': 7300000
      },
      {
        'name': '2011',
        'value': 8940000
      }
    ]
  },

  {
    'name': 'USA',
    'series': [
      {
        'name': '2010',
        'value': 7870000
      },
      {
        'name': '2011',
        'value': 8270000
      }
    ]
  },

  {
    'name': 'France',
    'series': [
      {
        'name': '2010',
        'value': 5000002
      },
      {
        'name': '2011',
        'value': 5800000
      }
    ]
  }
];
