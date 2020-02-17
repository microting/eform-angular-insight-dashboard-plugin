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
    browser.waitForVisible('#createDashboardBtn', 10000);
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
    const dashboardCountAfterCreate = dashboardsPage.rowNum;
    const dashboard = dashboardsPage.getDashboard(dashboardCountAfterCreate);
    expect(dashboard.dashboardName).equal(dashboardName);
    browser.pause(8000);
    browser.refresh();
  });
  it('should not create dashboard', function () {
    const rowNumsBeforeCreate = dashboardsPage.rowNum;
    browser.pause(8000);
    browser.waitForVisible('#createDashboardBtn', 10000);
    dashboardsPage.createDashboard_Cancels();
    expect(rowNumsBeforeCreate).equal(dashboardsPage.rowNum);
  });
});
