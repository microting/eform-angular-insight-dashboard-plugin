import { Page } from '@playwright/test';

// The insight-dashboard modals use Material <mtx-select> (which wraps ng-select)
// inside a <mat-form-field>. While no value is selected, the field's floating
// <mat-label> sits over the centre of the control and intercepts pointer events
// there, so clicking the host centre to open the dropdown never lands — the
// beforeAll hooks then time out. Open via the ng-select arrow instead: it sits
// on the right, clear of the label, and reliably toggles the dropdown.
async function openMtxSelect(page: Page, selector: string) {
  const host = page.locator(selector);
  await host.waitFor({ state: 'visible', timeout: 40000 });
  await host.locator('.ng-arrow-wrapper').click();
  await page.locator('ng-dropdown-panel').waitFor({ state: 'visible', timeout: 40000 });
  return host;
}

async function pickOption(page: Page, matcher: string | RegExp) {
  const option = page
    .locator('ng-dropdown-panel .ng-option')
    .filter({ hasText: matcher })
    .first();
  await option.waitFor({ state: 'visible', timeout: 40000 });
  await option.scrollIntoViewIfNeeded();
  await option.click();
  await page.waitForTimeout(500);
}

/** Drop-in for selectValueInNgSelector against an mtx-select. */
export async function selectValueInMtxSelect(page: Page, selector: string, value: string) {
  const host = await openMtxSelect(page, selector);
  await host.locator('input').fill(value);
  await page.waitForTimeout(500);
  await pickOption(page, value);
}

/** Drop-in for an exact (whole-cell) match against an mtx-select. */
export async function selectExactValueInMtxSelect(page: Page, selector: string, value: string) {
  const host = await openMtxSelect(page, selector);
  await host.locator('input').fill(value);
  await page.waitForTimeout(500);
  await pickOption(page, new RegExp(`^\\s*${value}\\s*$`));
}
