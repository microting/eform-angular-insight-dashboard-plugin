import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage, {
  dashboardName,
} from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';

describe('InSight Dashboard - Dashboards - Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
  });
  it('should create dashboard', async () => {
    await (await $('#createDashboardBtn')).waitForDisplayed({timeout: 10000});
    await dashboardsPage.createDashboard();
    await insightDashboardPage.goToDashboards();
    const dashboardCountAfterCreate = await dashboardsPage.rowNum();
    const dashboard = await dashboardsPage.getDashboard(dashboardCountAfterCreate);
    expect(dashboard.dashboardName).equal(dashboardName);
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  });
  it('should not create dashboard', async () => {
    const rowNumsBeforeCreate = await dashboardsPage.rowNum();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await $('#createDashboardBtn')).waitForDisplayed({timeout: 10000});
    await dashboardsPage.createDashboard_Cancels();
    expect(rowNumsBeforeCreate).equal(await dashboardsPage.rowNum());
  });
});
