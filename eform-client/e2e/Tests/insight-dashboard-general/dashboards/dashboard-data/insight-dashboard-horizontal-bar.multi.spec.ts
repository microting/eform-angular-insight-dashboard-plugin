import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {DashboardTestConfigEditModel} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {
  dashboardHorizontalBarDataJson,
  dashboardHorizontalBarItems
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardHorizontalBar.data';

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
  today: true
};

describe('InSight Dashboard - Dashboards - Horizontal Bar', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Horizontal Bar');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardHorizontalBarItems);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
  });
  it('should compare items headers', async () => {
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await dashboardsViewPage.compareHeaders(dashboardHorizontalBarDataJson);
  });
  it('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardHorizontalBarDataJson);
  });
  it('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardHorizontalBarDataJson);
  });
  after(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
  });
});
