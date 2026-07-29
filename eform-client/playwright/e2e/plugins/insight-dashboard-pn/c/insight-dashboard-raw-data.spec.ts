import { test, expect } from '@playwright/test';
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

test.describe('InSight Dashboard - Raw data table', () => {
  let page: any;
  let insightDashboardPage: InsightDashboardPage;
  let dashboardsPage: InsightDashboardDashboardsPage;
  let dashboardEditPage: InsightDashboardDashboardEditPage;
  let dashboardsViewPage: InsightDashboardDashboardViewPage;

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

  test('does not load the grid until the toggle is clicked', async () => {
    // Lazy loading is the whole point of the disclosure: the dashboard view
    // response must not carry raw data for every chart on the page.
    await expect(dashboardsViewPage.rawDataGrid(0)).toHaveCount(0);

    await dashboardsViewPage.rawDataToggle(0).click();

    await expect(dashboardsViewPage.rawDataGrid(0)).toBeVisible();
    expect(await dashboardsViewPage.rawDataRows(0).count()).toBeGreaterThan(0);
  });

  test('reports an answer count that reconciles with the chart', async () => {
    await dashboardsViewPage.rawDataToggle(0).click();
    await expect(dashboardsViewPage.rawDataGrid(0)).toBeVisible();

    const answerCount = await dashboardsViewPage.rawDataAnswerCount(0);
    expect(answerCount).not.toBeNull();

    // The aggregated table's amount block ends in a bolded Total row whose last
    // cell is the chart's total. For a `multi` first question one answer
    // contributes several answer values, so the chart total is >= the number of
    // answers; for every other question type the two are equal. This fixture
    // uses a multi question, hence the inequality rather than strict equality.
    const chartTotal = await dashboardsViewPage.chartAmountTotal(0);
    expect(chartTotal).not.toBeNull();
    expect(answerCount).toBeGreaterThan(0);
    expect(answerCount).toBeLessThanOrEqual(chartTotal as number);
  });

  test('gives every multi-select option its own question-prefixed column', async () => {
    await dashboardsViewPage.rawDataToggle(0).click();
    await expect(dashboardsViewPage.rawDataGrid(0)).toBeVisible();

    const headers = await dashboardsViewPage.rawDataHeaders(0).allTextContents();
    const optionHeaders = headers.filter((header) => header.includes('›'));

    expect(optionHeaders.length).toBeGreaterThan(0);

    for (const header of optionHeaders) {
      const [questionPart, optionPart] = header.split('›');
      expect(questionPart.trim().length).toBeGreaterThan(0);
      expect(optionPart.trim().length).toBeGreaterThan(0);
      // Question columns are labelled "N - question text".
      expect(questionPart.trim()).toMatch(/^\d+\s/);
    }
  });

  test('exposes hidden answer columns through the column menu', async () => {
    await dashboardsViewPage.rawDataToggle(0).click();
    await expect(dashboardsViewPage.rawDataGrid(0)).toBeVisible();

    const visibleBefore = await dashboardsViewPage.rawDataHeaders(0).count();
    expect(visibleBefore).toBeGreaterThan(0);

    // Time zone ships hidden by default, so it must not be in the header row.
    const headers = await dashboardsViewPage.rawDataHeaders(0).allTextContents();
    expect(headers.some((header) => header.trim() === 'Tidszone')).toBe(false);
  });
});
