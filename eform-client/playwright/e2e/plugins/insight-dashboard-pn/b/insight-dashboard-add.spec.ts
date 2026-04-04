import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage, dashboardName } from '../InsightDashboard-Dashboards.page';

test.describe('InSight Dashboard - Dashboards - Add', () => {
  let page: any;
  let loginPage: LoginPage;
  let insightDashboardPage: InsightDashboardPage;
  let dashboardsPage: InsightDashboardDashboardsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    dashboardsPage = new InsightDashboardDashboardsPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
  });

  test.afterAll(async () => {
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('should create dashboard', async () => {
    await page.locator('#createDashboardBtn').waitFor({ state: 'visible', timeout: 10000 });
    await dashboardsPage.createDashboard();
    await insightDashboardPage.goToDashboards();
    const dashboard = await dashboardsPage.getLastRowObject();
    expect(dashboard.dashboardName).toBe(dashboardName);
  });

  test('should not create dashboard', async () => {
    const rowNumsBeforeCreate = await dashboardsPage.rowNum();
    await page.locator('#createDashboardBtn').waitFor({ state: 'visible', timeout: 10000 });
    await dashboardsPage.createDashboard_Cancels();
    expect(rowNumsBeforeCreate).toBe(await dashboardsPage.rowNum());
  });
});
