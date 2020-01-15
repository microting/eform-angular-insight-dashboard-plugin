import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-block',
  templateUrl: './dashboard-block.component.html',
  styleUrls: ['./dashboard-block.component.scss']
})
export class DashboardBlockComponent implements OnInit {
  isCollapsed = true;

  constructor() { }

  ngOnInit() {
  }

}
