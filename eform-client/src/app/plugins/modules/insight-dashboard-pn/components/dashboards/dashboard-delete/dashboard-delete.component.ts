import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dashboard-delete',
  templateUrl: './dashboard-delete.component.html',
  styleUrls: ['./dashboard-delete.component.scss']
})
export class DashboardDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor() { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

}
