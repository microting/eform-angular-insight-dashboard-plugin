import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';

describe('Insight Dashboard - Dashboards - Delete', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
  });
  it('should not delete dashboard', function () {
    const rowNumsBeforeDelete = dashboardsPage.rowNum;
    $('#spinner-animation').waitForDisplayed(30000, true);
    $('#createDashboardBtn').waitForDisplayed(10000);
    dashboardsPage.deleteDashboard_Cancels(dashboardsPage.getDashboard(rowNumsBeforeDelete));
    expect(rowNumsBeforeDelete).equal(dashboardsPage.rowNum);
  });
  it('should delete dashboard', function () {
    $('#createDashboardBtn').waitForDisplayed(10000);
    const rowNumsBeforeDelete = dashboardsPage.rowNum;
    dashboardsPage.deleteDashboard(dashboardsPage.getDashboard(rowNumsBeforeDelete));
    insightDashboardPage.goToDashboards();
    expect(rowNumsBeforeDelete).equal(dashboardsPage.rowNum + 1);
    $('#spinner-animation').waitForDisplayed(30000, true);
    loginPage.open('/');
  });
});
