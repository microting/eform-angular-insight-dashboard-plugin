import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsightDashboardPnCollapseService {
  public collapse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  updateState(collapsed: boolean): void {
    this.collapse.next(collapsed);
  }
}
