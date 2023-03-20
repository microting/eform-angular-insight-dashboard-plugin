import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel,
} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {
  dashboardStackedBarDataJson,
  dashboardStackedBarItems,
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardStackedBar.data';
import sitesPage from '../../../../Page objects/Sites.page';
import myEformsPage from '../../../../Page objects/MyEforms.page';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
  dateRange: '1/1/2016 - 5/14/2020',
  today: true,
};

describe('InSight Dashboard - Dashboards - Stacked Bar', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();

    // Create and assign total tag
    await myEformsPage.Navbar.goToSites();
    const site = await sitesPage.getFirstRowObject();
    if (!site.tags || !site.tags.includes(dashboardConfig.locationTagName)) {
      await sitesPage.createTag([dashboardConfig.locationTagName]);
      for (let i = 1; i < 5; i++) {
        await (await sitesPage.getSite(i)).edit({ tags: [dashboardConfig.locationTagName] });
      }
    }

    // Create dashboard with items
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Stacked Bar');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardStackedBarItems);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
  });
  it('should compare items headers', async () => {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 30000, reverse: true });
    await dashboardsViewPage.compareHeaders(dashboardStackedBarDataJson);
  });
  it('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardStackedBarDataJson);
  });
  it('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardStackedBarDataJson);
  });
  after(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
  });
});
