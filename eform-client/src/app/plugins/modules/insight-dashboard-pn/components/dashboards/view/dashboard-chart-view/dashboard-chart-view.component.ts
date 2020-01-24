import {Component, Input, OnInit} from '@angular/core';
import {DashboardChartTypesEnum} from '../../../../const/enums';
import html2canvas from 'html2canvas';
import {convertInlineStyleSVG} from '../../../../helpers/chart-svg.helper';

@Component({
  selector: 'app-dashboard-chart-view',
  templateUrl: './dashboard-chart-view.component.html',
  styleUrls: ['./dashboard-chart-view.component.scss']
})
export class DashboardChartViewComponent {
  @Input() chartType: DashboardChartTypesEnum;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  single: any[];
  multi: any[];
  view: any[] = [1000, 500];

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

  printDiv() {
    html2canvas(document.getElementById('copyableChart'), {
      logging: false,
      scale: 3,
      onclone: clonedDoc => {
        convertInlineStyleSVG(clonedDoc, 0, this.chartType);
      }
    }).then(canvas => {
      const myImage = canvas.toDataURL('image/png', 1.0);
      this.downloadURI(myImage, 'MaSimulation.png');
    });
  }

  downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    // after creating link you should delete dynamic link
    // clearDynamicLink(link);
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
