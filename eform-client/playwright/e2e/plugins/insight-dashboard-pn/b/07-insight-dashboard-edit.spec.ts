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
    monthTo: 5,
    dayTo: 14,
  },
  today: false,
};

const testItem: DashboardTestItemEditModel = {
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

test.describe('InSight Dashboard - Dashboards - Edit', () => {
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
    await dashboardsPage.createDashboard();
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
  });

  test.afterAll(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
    await page.close();
  });

  test('should create initial empty item', async () => {
    await page.locator('#dashboardUpdateSaveBtn').waitFor({ state: 'visible', timeout: 40000 });
    const itemNumsBeforeInitialItem = await dashboardEditPage.rowNum();
    await dashboardEditPage.createFirstItem();
    expect(itemNumsBeforeInitialItem).toBe(await dashboardEditPage.rowNum() - 1);
  });

  test('should delete item', async () => {
    const itemNumsBeforeRemoveItem = await dashboardEditPage.rowNum();
    const item = await dashboardEditPage.getDashboardItem(itemNumsBeforeRemoveItem);
    await dashboardEditPage.deleteItem(item);
    expect(itemNumsBeforeRemoveItem).toBe(await dashboardEditPage.rowNum() + 1);
  });

  test('should create new item', async () => {
    const itemNumsBeforeInitialItem = await dashboardEditPage.rowNum();
    await dashboardEditPage.createFirstItem();
    expect(itemNumsBeforeInitialItem).toBe(await dashboardEditPage.rowNum() - 1);
    const itemNumsBeforeCreateItem = await dashboardEditPage.rowNum();
    const item = await dashboardEditPage.getDashboardItem(itemNumsBeforeCreateItem);
    await dashboardEditPage.createItem(item);
    expect(itemNumsBeforeCreateItem).toBe(await dashboardEditPage.rowNum() - 1);
  });

  test('should copy empty item', async () => {
    const itemNumsBeforeCopyItem = await dashboardEditPage.rowNum();
    const item = await dashboardEditPage.getDashboardItem(itemNumsBeforeCopyItem);
    await dashboardEditPage.copyItem(item);
    expect(itemNumsBeforeCopyItem).toBe(await dashboardEditPage.rowNum() - 1);
  });

  test('should save filled item', async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard();
    const itemNumsBeforeCreateItem = await dashboardEditPage.rowNum();
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.createFirstItem();
    await dashboardEditPage.fillItem(itemNumsBeforeCreateItem + 1, testItem);
    await dashboardEditPage.dashboardUpdateSaveBtn.click();
    await dashboardsViewPage.returnToDashboards.click();
    await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 40000 });
    const dashboardRowNum = await dashboardsPage.rowNum();
    const createdDashboard = await dashboardsPage.getDashboard(dashboardRowNum);
    await createdDashboard.clickActionsMenu(dashboardRowNum - 1);
    await createdDashboard.dashboardEditBtn.click();
    await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 40000 });
    expect(itemNumsBeforeCreateItem).toBe(await dashboardEditPage.rowNum() - 1);
    await dashboardEditPage.dashboardUpdateSaveCancelBtn.click();
  });
});
