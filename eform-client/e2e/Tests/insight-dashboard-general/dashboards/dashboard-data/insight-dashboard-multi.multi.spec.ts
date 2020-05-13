import {expect} from 'chai';
import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {
  dashboardMultiChartDataJson,
  dashboardMultiChartItems
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardMultiChart.data';

describe('InSight Dashboard - Dashboards - Multi chart', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Multi chart');
    dashboardEditPage.generateItems(dashboardMultiChartItems);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
  });
  it('should compare items headers', function () {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    dashboardsViewPage.compareHeaders(dashboardMultiChartDataJson);
  });
  it('should compare items percentage', function () {
    dashboardsViewPage.comparePercentage(dashboardMultiChartDataJson);
  });
  it('should compare items amounts', function () {
    dashboardsViewPage.compareAmounts(dashboardMultiChartDataJson);
  });
});
