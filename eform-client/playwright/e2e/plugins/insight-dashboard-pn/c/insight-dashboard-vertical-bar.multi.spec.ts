import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardVerticalBarDataJson,
  dashboardVerticalBarItems,
} from '../ChartData/DashboardVerticalBar.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 0,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 5,
    dayTo: 14,
  },
  today: true,
};

test.describe('InSight Dashboard - Dashboards - Vertical Bar', () => {
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
    await dashboardsPage.createDashboard('Vertical Bar');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardVerticalBarItems);
    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 40000 });
    await page.waitForTimeout(1000);
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('should compare items headers', async () => {
    await dashboardsViewPage.compareHeaders(dashboardVerticalBarDataJson);
  });

  test('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardVerticalBarDataJson);
  });

  test('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardVerticalBarDataJson);
  });
});
