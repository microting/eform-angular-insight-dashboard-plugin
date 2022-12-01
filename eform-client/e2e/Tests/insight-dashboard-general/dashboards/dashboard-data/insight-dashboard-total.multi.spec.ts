import {expect} from 'chai';
import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {DashboardTestConfigEditModel} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {dashboardTotalDataJson, dashboardTotalItems} from '../../../../Page objects/InsightDashboard/ChartData/DashboardTotal.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateFrom: '2016/01/01',
  dateTo: '2020/05/14',
  today: true
};

describe('InSight Dashboard - Dashboards - Total', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();

    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Total');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardTotalItems);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
  });
  it('should compare items headers', async () => {
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await dashboardsViewPage.compareHeaders(dashboardTotalDataJson);
  });
  it('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardTotalDataJson);
  });
  it('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardTotalDataJson);
  });
});
