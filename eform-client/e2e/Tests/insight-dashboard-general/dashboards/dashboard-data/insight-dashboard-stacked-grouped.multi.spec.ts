import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel,
} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import sitesPage from '../../../../Page objects/Sites.page';
import {
  dashboardStackedGroupedDataJson,
  dashboardStackedGroupedItems,
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardStackedGrouped.data';
import myEformsPage from '../../../../Page objects/MyEforms.page';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 1,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 5,
    dayTo: 14
  },
  today: true,
};

describe('InSight Dashboard - Dashboards - Stacked Grouped', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();

    // Create and assign total tag
    await myEformsPage.Navbar.goToSites();
    const site = await sitesPage.getFirstRowObject();
    if (!site.tags || !site.tags.includes(dashboardConfig.locationTagName)) {
      await sitesPage.createTag([dashboardConfig.locationTagName]);
      for (let i = 1; i < 5; i++) {
        await (await sitesPage.getSite(i)).edit({tags: [dashboardConfig.locationTagName]});
      }
    }

    // Create dashboard with items
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Stacked Grouped');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardStackedGroupedItems);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
  });
  it('should compare items headers', async () => {
    await dashboardsViewPage.compareHeaders(dashboardStackedGroupedDataJson);
  });
  it('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardStackedGroupedDataJson);
  });
  it('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardStackedGroupedDataJson);
  });
  after(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
  });
});
