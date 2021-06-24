import { AfterContentInit, Component, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/common/services';
import { TranslateService } from '@ngx-translate/core';
import { translates } from '../i18n/translates';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-insight-dashboard-pn-layout',
  template: '<router-outlet></router-outlet>',
})
export class InsightDashboardPnLayoutComponent
  implements AfterContentInit, OnInit {
  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    const lang = this.authStateService.currentUserLocale;
    const i18n = translates[lang];
    this.translateService.setTranslation(lang, i18n, true);
  }
}
