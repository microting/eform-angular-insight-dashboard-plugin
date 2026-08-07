import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { SitesPage } from '../../../Page objects/Sites.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardStackedGroupedNormalizedDataJson,
  dashboardStackedGroupedNormalizedItems,
} from '../ChartData/DashboardStackedGroupedNormalized.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 1,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 6,
    dayTo: 14,
  },
  today: true,
};

/**
 * The 100% stacked banded chart. It renders the same MultiStacked data the
 * grouped chart does, so the aggregated table below it must match that chart's
 * exactly - and the chart itself adds three things worth pinning: a band label
 * carrying the period range, one shared legend rather than one per band, and a
 * PNG download whose captured node includes the title.
 */
// The dashboard view binds [position]="pos + 1", so the first item's element
// ids end in 1, not 0 - verified against the rendered DOM.
test.describe('InSight Dashboard - Dashboards - Stacked Grouped Normalized', () => {
  let page: any;
  let insightDashboardPage: InsightDashboardPage;
  let dashboardsPage: InsightDashboardDashboardsPage;
  let dashboardEditPage: InsightDashboardDashboardEditPage;
  let dashboardsViewPage: InsightDashboardDashboardViewPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const sitesPage = new SitesPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    dashboardsPage = new InsightDashboardDashboardsPage(page);
    dashboardEditPage = new InsightDashboardDashboardEditPage(page);
    dashboardsViewPage = new InsightDashboardDashboardViewPage(page);
    await loginPage.open('/auth');
    await loginPage.login();

    await myEformsPage.Navbar.goToSites();
    const site = await sitesPage.getFirstRowObject();
    if (!site.tags || !site.tags.includes(dashboardConfig.locationTagName)) {
      await sitesPage.createTag([dashboardConfig.locationTagName]);
      for (let i = 1; i < 5; i++) {
        const s = await sitesPage.getSite(i);
        await s.edit({ tags: [dashboardConfig.locationTagName] });
      }
    }

    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Stacked Grouped Normalized');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardStackedGroupedNormalizedItems);
    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 40000 });
    await page.waitForTimeout(1000);
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('renders one normalized chart per band', async () => {
    // The chart type is only reachable at all if every backend gate was widened:
    // a missing switch case throws ArgumentOutOfRangeException, and a missing
    // isStackedData clause leaves MultiStacked empty and the row blank.
    const charts = page.locator(
      '#copyableChart1 ngx-charts-bar-vertical-normalized'
    );
    await expect(charts.first()).toBeVisible({ timeout: 30000 });
    expect(await charts.count()).toBeGreaterThan(1);
  });

  test('labels each band with its name and period range', async () => {
    const labels = page.locator('#copyableChart1 [id^="bandLabel1_"]');
    await expect(labels.first()).toBeVisible({ timeout: 30000 });

    for (const text of await labels.allTextContents()) {
      // "Nord (20_2H–22_2H)", or "Nord (20_2H)" for a single period.
      expect(text.trim()).toMatch(/^.+\s\([^()]+\)$/);
    }
  });

  test('shows one shared legend for the whole chart, not one per band', async () => {
    const legend = page.locator('#bandedChartLegend1');
    await expect(legend).toBeVisible({ timeout: 30000 });
    expect(await page.locator('#bandedChartLegend1').count()).toBe(1);

    // ngx-charts' own per-band legend must be off, or each band carries one.
    expect(
      await page.locator('#copyableChart1 .chart-legend').count()
    ).toBe(0);

    const entries = legend.locator('li');
    expect(await entries.count()).toBeGreaterThan(0);
  });

  test('carries the title inside the node the PNG is captured from', async () => {
    // The download renders the captured node, so a title outside it would be
    // missing from the image.
    const title = page.locator('#copyableChart1 #bandedChartTitle1');
    await expect(title).toBeVisible({ timeout: 30000 });
    expect((await title.textContent())?.trim().length).toBeGreaterThan(0);
  });

  test('downloads the chart as a PNG', async () => {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.locator('#downloadChart1').click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.png$/);
    const savedTo = await download.path();
    expect(savedTo).not.toBeNull();
  });

  test('should compare items headers', async () => {
    await dashboardsViewPage.compareHeaders(dashboardStackedGroupedNormalizedDataJson);
  });
});
