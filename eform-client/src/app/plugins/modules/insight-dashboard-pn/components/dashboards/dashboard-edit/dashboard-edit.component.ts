import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss']
})
export class DashboardEditComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor() { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

}
