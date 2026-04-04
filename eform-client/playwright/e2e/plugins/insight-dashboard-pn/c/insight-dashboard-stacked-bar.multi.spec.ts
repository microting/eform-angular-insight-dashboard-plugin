import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { MyEformsPage } from '../../../../Page objects/MyEforms.page';
import { SitesPage } from '../../../../Page objects/Sites.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardDashboardsPage } from '../InsightDashboard-Dashboards.page';
import { InsightDashboardDashboardViewPage } from '../InsightDashboard-DashboardView.page';
import {
  InsightDashboardDashboardEditPage,
  DashboardTestConfigEditModel,
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardStackedBarDataJson,
  dashboardStackedBarItems,
} from '../ChartData/DashboardStackedBar.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
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

test.describe('InSight Dashboard - Dashboards - Stacked Bar', () => {
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

    // Create and assign total tag
    await myEformsPage.Navbar.goToSites();
    const site = await sitesPage.getFirstRowObject();
    if (!site.tags || !site.tags.includes(dashboardConfig.locationTagName)) {
      await sitesPage.createTag([dashboardConfig.locationTagName]);
      for (let i = 1; i < 5; i++) {
        const s = await sitesPage.getSite(i);
        await s.edit({ tags: [dashboardConfig.locationTagName] });
      }
    }

    // Create dashboard with items
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Stacked Bar');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardStackedBarItems);
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
    await dashboardsViewPage.compareHeaders(dashboardStackedBarDataJson);
  });

  test('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardStackedBarDataJson);
  });

  test('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardStackedBarDataJson);
  });
});
