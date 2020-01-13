import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor() { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

}
