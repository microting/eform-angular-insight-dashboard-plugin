import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
  DashboardTestItemEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';

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
  today: false,
};

const item: DashboardTestItemEditModel = {
  firstQuestion: 'Q2',
  filterQuestion: 'Q3',
  firstQuestionForSelect: '2 - Q2',
  filterQuestionForSelect: '3 - Q3',
  filterAnswer: 'Meget glad',
  period: 'Måned',
  chartType: 'Linje',
  calculateAverage: false,
  ignoredAnswerIds: [],
  comparedItems: [],
};

test.describe('InSight Dashboard - Dashboards - View', () => {
  let page: any;
  let loginPage: LoginPage;
  let insightDashboardPage: InsightDashboardPage;
  let dashboardsPage: InsightDashboardDashboardsPage;
  let dashboardEditPage: InsightDashboardDashboardEditPage;
  let dashboardsViewPage: InsightDashboardDashboardViewPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    dashboardsPage = new InsightDashboardDashboardsPage(page);
    dashboardEditPage = new InsightDashboardDashboardEditPage(page);
    dashboardsViewPage = new InsightDashboardDashboardViewPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Test View');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('should observe filled item', async () => {
    await dashboardEditPage.generateItems([item]);
    await page.waitForTimeout(1000);
    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await page.waitForTimeout(5000);
    await page.locator('#firstQuestion1').waitFor({ state: 'visible', timeout: 30000 });
    await dashboardsViewPage.returnToDashboards;
    await dashboardsViewPage.compareItem(1, item, dashboardConfig);
  });
});
