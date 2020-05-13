import {expect} from 'chai';
import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {
  dashboardLineScoreDataJson,
  dashboardLineScoreItems
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardViewLineScore.data';

describe('InSight Dashboard - Dashboards - Line Score', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Line Score');
    dashboardEditPage.generateItems(dashboardLineScoreItems);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
  });
  it('should compare items headers', function () {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    dashboardsViewPage.compareHeaders(dashboardLineScoreDataJson);
  });
  it('should compare items average', function () {
    dashboardsViewPage.comparePercentage(dashboardLineScoreDataJson, false);
  });
  it('should compare items amounts', function () {
    dashboardsViewPage.compareAmounts(dashboardLineScoreDataJson);
  });
});
