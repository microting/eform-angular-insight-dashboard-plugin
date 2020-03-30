import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';

describe('Insight Dashboard - Dashboards - Copy', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
  });
  it('should not copy dashboard', function () {
    const rowNumsBeforeDelete = dashboardsPage.rowNum;
    $('#spinner-animation').waitForDisplayed(30000, true);
    $('#createDashboardBtn').waitForDisplayed(10000);
    dashboardsPage.copyDashboard_Cancel(dashboardsPage.getDashboard(rowNumsBeforeDelete));
    expect(rowNumsBeforeDelete).equal(dashboardsPage.rowNum);
  });
  it('should copy dashboard', function () {
    $('#createDashboardBtn').waitForDisplayed(10000);
    const rowNumsBeforeCopy = dashboardsPage.rowNum;
    dashboardsPage.copyDashboard(dashboardsPage.getDashboard(rowNumsBeforeCopy));
    insightDashboardPage.goToDashboards();
    expect(rowNumsBeforeCopy).equal(dashboardsPage.rowNum - 1);
    $('#spinner-animation').waitForDisplayed(30000, true);
    loginPage.open('/');
  });
});
