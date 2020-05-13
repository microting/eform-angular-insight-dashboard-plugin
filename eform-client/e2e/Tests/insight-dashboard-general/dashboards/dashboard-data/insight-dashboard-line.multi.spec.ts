import {expect} from 'chai';
import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import {dashboardLineDataItems, dashboardLineDataJson} from '../../../../Page objects/InsightDashboard/ChartData/DashboardViewLine.data';
import dashboardEditPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';


describe('InSight Dashboard - Dashboards - Line', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Line');
    dashboardEditPage.generateItems(dashboardLineDataItems);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
  });
  it('should compare items headers', function () {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    dashboardsViewPage.compareHeaders(dashboardLineDataJson);
  });
  it('should compare items percentage', function () {
    dashboardsViewPage.comparePercentage(dashboardLineDataJson);
  });
  it('should compare items amounts', function () {
    dashboardsViewPage.compareAmounts(dashboardLineDataJson);
  });
});
