import {expect} from 'chai';
import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {DashboardTestConfigEditModel} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {
  dashboardStackedBarDataJson,
  dashboardStackedBarItems
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardStackedBar.data';
import sitesPage from '../../../../Page objects/Sites.page';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
  dateFrom: '2016/01/01',
  dateTo: '2020/05/14',
  today: true
};

describe('InSight Dashboard - Dashboards - Stacked Bar', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();

    // Create and assign total tag TODO: FIX
    // loginPage.open('/advanced/sites');
    // sitesPage.createAndAssignTag(dashboardConfig.locationTagName, [1, 2, 3, 4]);

    // Create dashboard with items
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Stacked Bar');
    dashboardEditPage.setDashboardSettings(dashboardConfig);
    dashboardEditPage.generateItems(dashboardStackedBarItems);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
  });
  it('should compare items headers', function () {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    dashboardsViewPage.compareHeaders(dashboardStackedBarDataJson);
  });
  it('should compare items percentage', function () {
    dashboardsViewPage.comparePercentage(dashboardStackedBarDataJson);
  });
  it('should compare items amounts', function () {
    dashboardsViewPage.compareAmounts(dashboardStackedBarDataJson);
  });
});
