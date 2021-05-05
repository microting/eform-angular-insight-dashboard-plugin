import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel,
} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import sitesPage from '../../../../Page objects/Sites.page';
import {
  dashboardTotalNDataJson,
  dashboardTotalNItems,
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardTotalN.data';
import myEformsPage from '../../../../Page objects/MyEforms.page';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
  dateFrom: '2016/01/01',
  dateTo: '2020/05/14',
  today: true,
};

describe('InSight Dashboard - Dashboards - Total N', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();

    // Create and assign total tag
    myEformsPage.Navbar.goToSites();
    const site = sitesPage.getFirstRowObject();
    if (!site.tags || !site.tags.includes(dashboardConfig.locationTagName)) {
      sitesPage.createTag([dashboardConfig.locationTagName]);
      for (let i = 1; i < 5; i++) {
        sitesPage.getSite(i).edit({ tags: [dashboardConfig.locationTagName] });
      }
    }

    // Create dashboard with items
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Total N');
    dashboardEditPage.setDashboardSettings(dashboardConfig);
    dashboardEditPage.generateItems(dashboardTotalNItems);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
  });
  it('should compare items headers', function () {
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
    dashboardsViewPage.compareHeaders(dashboardTotalNDataJson);
  });
  it('should compare items percentage', function () {
    dashboardsViewPage.comparePercentage(dashboardTotalNDataJson);
  });
  it('should compare items amounts', function () {
    dashboardsViewPage.compareAmounts(dashboardTotalNDataJson);
  });
});
