import { Component, inject, OnInit } from '@angular/core';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-interviews-edit',
  templateUrl: './dashboard-interviews-edit.component.html',
  styleUrls: ['./dashboard-interviews-edit.component.scss'],
  standalone: false,
})
export class DashboardInterviewsEditComponent implements OnInit {
  private translateService = inject(TranslateService);

  tableData = [
    {
      date: new Date(),
      locationName: 'LocationName 1',
      commentary: 'Lorem ipsum',
    },
    {
      date: new Date(),
      locationName: 'LocationName 2',
      commentary:
        'is simply dummy text of the printing and typesetting industry. ' +
        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
    },
    {
      date: new Date(),
      locationName: 'LocationName N',
      commentary:
        'It is a long established fact that a reader will be distracted by ' +
        'the readable content of a page when looking at its layout. The point of ' +
        'using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\'',
    },
  ];
  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Date'), field: 'date', type: 'date', typeParameter: {format: 'yyyy/MM/dd'}},
    {header: this.translateService.stream('Tag'), field: 'locationName'},
    {header: this.translateService.stream('Comments'), field: 'commentary'},
  ];

  ngOnInit() {
  }
}
