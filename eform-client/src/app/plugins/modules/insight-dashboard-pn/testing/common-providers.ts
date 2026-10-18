import {EnvironmentProviders, Provider} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideTranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {provideNativeDateAdapter} from '@angular/material/core';
import {AppMenuStateService, AuthStateService} from 'src/app/common/store';
import {SitesService, TitleService} from 'src/app/common/services';
import {ToastrService} from 'ngx-toastr';
import {of} from 'rxjs';
import {vi} from 'vitest';

/**
 * Providers shared by the insight dashboard component specs.
 * Services that hit the backend are supplied per spec as mocks.
 */
export function commonProviders(extra: Provider[] = []): Array<Provider | EnvironmentProviders> {
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideNoopAnimations(),
    provideRouter([]),
    provideTranslateService(),
    provideNativeDateAdapter(),
    // the page subheader (eform-new-subheader) injects these
    {provide: AppMenuStateService, useValue: {}},
    {provide: TitleService, useValue: {setTitle: vi.fn()}},
    {provide: AuthStateService, useValue: {}},
    {provide: SitesService, useValue: {}},
    {provide: Store, useValue: {select: vi.fn(() => of(null)), dispatch: vi.fn()}},
    {provide: ToastrService, useValue: {success: vi.fn(), error: vi.fn(), warning: vi.fn()}},
    {provide: MatDialogRef, useValue: {close: vi.fn()}},
    {provide: MAT_DIALOG_DATA, useValue: {}},
    ...extra,
  ];
}
