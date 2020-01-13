import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dashboard-copy',
  templateUrl: './dashboard-copy.component.html',
  styleUrls: ['./dashboard-copy.component.scss']
})
export class DashboardCopyComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;

  constructor() { }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

}
