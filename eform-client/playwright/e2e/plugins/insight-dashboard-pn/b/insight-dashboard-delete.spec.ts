import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';

test.describe('InSight Dashboard - Dashboards - Delete', () => {
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
    await dashboardsPage.createDashboard();
    await insightDashboardPage.goToDashboards();
  });

  test.afterAll(async () => {
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('should not delete dashboard', async () => {
    const rowNumsBeforeDelete = await dashboardsPage.rowNum();
    await page.locator('#createDashboardBtn').waitFor({ state: 'visible', timeout: 10000 });
    await dashboardsPage.deleteDashboard_Cancels(rowNumsBeforeDelete);
    expect(rowNumsBeforeDelete).toBe(await dashboardsPage.rowNum());
  });

  test('should delete dashboard', async () => {
    await page.locator('#createDashboardBtn').waitFor({ state: 'visible', timeout: 10000 });
    const rowNumsBeforeDelete = await dashboardsPage.rowNum();
    await dashboardsPage.deleteDashboard(rowNumsBeforeDelete);
    await insightDashboardPage.goToDashboards();
    expect(rowNumsBeforeDelete).toBe(await dashboardsPage.rowNum() + 1);
  });
});
