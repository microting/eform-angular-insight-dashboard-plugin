import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage, {
  dashboardName,
} from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';

describe('Insight Dashboard - Dashboards - Add', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
  });
  it('should create dashboard', function () {
    $('#createDashboardBtn').waitForDisplayed(10000);
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
    const dashboardCountAfterCreate = dashboardsPage.rowNum;
    const dashboard = dashboardsPage.getDashboard(dashboardCountAfterCreate);
    expect(dashboard.dashboardName).equal(dashboardName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    loginPage.open('/');
  });
  it('should not create dashboard', function () {
    const rowNumsBeforeCreate = dashboardsPage.rowNum;
    $('#spinner-animation').waitForDisplayed(90000, true);
    $('#createDashboardBtn').waitForDisplayed(10000);
    dashboardsPage.createDashboard_Cancels();
    expect(rowNumsBeforeCreate).equal(dashboardsPage.rowNum);
  });
});
