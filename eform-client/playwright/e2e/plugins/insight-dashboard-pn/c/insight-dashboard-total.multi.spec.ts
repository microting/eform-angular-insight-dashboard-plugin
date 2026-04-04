import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import { dashboardTotalDataJson, dashboardTotalItems } from '../ChartData/DashboardTotal.data';

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

test.describe('InSight Dashboard - Dashboards - Total', () => {
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
    await dashboardsPage.createDashboard('Total');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardTotalItems);
    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('should compare items headers', async () => {
    await dashboardsViewPage.compareHeaders(dashboardTotalDataJson);
  });

  test('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardTotalDataJson);
  });

  test('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardTotalDataJson);
  });
});
