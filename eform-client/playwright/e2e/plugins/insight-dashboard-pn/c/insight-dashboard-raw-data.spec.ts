import { expect, test } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import { dashboardMultiChartItems } from '../ChartData/DashboardMultiChart.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
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

// All tests here share one page created in beforeAll, so the disclosure keeps
// whatever state the previous test left it in. Every test therefore goes through
// ensureExpanded() instead of clicking blindly, which would toggle it shut again.
test.describe('InSight Dashboard - Raw data table', () => {
  let page: any;
  let insightDashboardPage: InsightDashboardPage;
  let dashboardsPage: InsightDashboardDashboardsPage;
  let dashboardEditPage: InsightDashboardDashboardEditPage;
  let dashboardsViewPage: InsightDashboardDashboardViewPage;

  const ensureExpanded = async (item: number) => {
    if ((await dashboardsViewPage.rawDataGrid(item).count()) === 0) {
      await dashboardsViewPage.rawDataToggle(item).click();
    }
    await expect(dashboardsViewPage.rawDataGrid(item)).toBeVisible();
    // Rows arrive with the response, not with the grid, so wait for them.
    await expect(dashboardsViewPage.rawDataRows(item).first()).toBeVisible({ timeout: 30000 });
  };

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    dashboardsPage = new InsightDashboardDashboardsPage(page);
    dashboardEditPage = new InsightDashboardDashboardEditPage(page);
    dashboardsViewPage = new InsightDashboardDashboardViewPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Raw data');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardMultiChartItems);
    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 40000 });
    await page.waitForTimeout(1000);
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('does not render the grid until the toggle is clicked', async () => {
    // Lazy loading is the point of the disclosure: the dashboard view response
    // must not carry raw data for every chart on the page.
    await expect(dashboardsViewPage.rawDataGrid(0)).toHaveCount(0);

    await dashboardsViewPage.rawDataToggle(0).click();

    await expect(dashboardsViewPage.rawDataGrid(0)).toBeVisible();
    await expect(dashboardsViewPage.rawDataRows(0).first()).toBeVisible({ timeout: 30000 });
  });

  test('reports an answer count matching the rows it renders', async () => {
    await ensureExpanded(0);

    const answerCount = await dashboardsViewPage.rawDataAnswerCount(0);
    expect(answerCount).not.toBeNull();
    expect(answerCount as number).toBeGreaterThan(0);

    // Exact reconciliation against the chart is asserted in
    // InsightDashboard.Pn.Test/RawDataUTests.cs, which compares answer sets
    // against the database rather than scraping the rendered table. Here we only
    // check the UI is self-consistent: one page of rows, never more than the
    // page size, and never more than the reported total.
    const rowCount = await dashboardsViewPage.rawDataRows(0).count();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(25);
    expect(rowCount).toBeLessThanOrEqual(answerCount as number);
  });

  test('gives every multi-select option its own question-prefixed column', async () => {
    await ensureExpanded(0);

    const headers = await dashboardsViewPage.rawDataHeaders(0).allTextContents();
    const optionHeaders = headers.filter((header) => header.includes('›'));

    // Whether this survey contains a multi question is a property of the seed
    // data, not of the feature. That multi questions expand to one column per
    // option is asserted against the database in RawDataUTests.cs; here we only
    // validate the rendered label format when such columns are present.
    test.skip(optionHeaders.length === 0, 'Seed survey has no multi-select question.');

    for (const header of optionHeaders) {
      const [questionPart, optionPart] = header.split('›');
      expect(questionPart.trim().length).toBeGreaterThan(0);
      expect(optionPart.trim().length).toBeGreaterThan(0);
      // Question columns are labelled "N - question text".
      expect(questionPart.trim()).toMatch(/^\d+\s/);
    }
  });

  test('keeps audit columns out of the default view', async () => {
    await ensureExpanded(0);

    const headers = await dashboardsViewPage.rawDataHeaders(0).allTextContents();
    const trimmed = headers.map((header) => header.trim());

    // Time zone ships hidden by default; the visible header row must not carry it.
    expect(trimmed).not.toContain('Tidszone');
    expect(trimmed.some((header) => header.length > 0)).toBe(true);
  });
});
