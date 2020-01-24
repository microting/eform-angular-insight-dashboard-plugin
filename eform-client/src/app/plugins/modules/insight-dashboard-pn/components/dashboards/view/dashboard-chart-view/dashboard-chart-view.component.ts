import {Component, Input} from '@angular/core';
import {DashboardChartTypesEnum} from '../../../../const/enums';
import domtoimage from 'dom-to-image';

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
    const scale = 2;
    const node = document.getElementById('copyableChart');
    setTimeout(() => domtoimage.toBlob(node, {
      height: node.offsetHeight * scale,
      width: node.offsetWidth * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: node.offsetWidth + 'px',
        height: node.offsetHeight + 'px'
      }
    })
      .then(async function (data) {
        const navi = navigator as any;
        try {
          const blob = data;
          await navi.clipboard.write([
            // @ts-ignore
            new ClipboardItem({
              [blob.type]: blob
            })
          ]);
        } catch (e) {
          console.error(e, e.message);
        }
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      }), 100);
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
