import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {translates} from '../i18n/translates';
import {Subscription} from 'rxjs';
import {selectCurrentUserLocale} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-insight-dashboard-pn-layout',
  template: '<router-outlet></router-outlet>',
})
export class InsightDashboardPnLayoutComponent implements AfterContentInit, OnInit, OnDestroy {
  private selectCurrentUserLocale$ = this.store.select(selectCurrentUserLocale);
  currentUserLocaleAsyncSub$: Subscription;

  constructor(
    private store: Store,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.currentUserLocaleAsyncSub$ = this.selectCurrentUserLocale$.subscribe((locale) => {
      const i18n = translates[locale];
      this.translateService.setTranslation(locale, i18n, true);
    });
  }

  ngOnDestroy(): void {
    this.currentUserLocaleAsyncSub$.unsubscribe();
  }
}
