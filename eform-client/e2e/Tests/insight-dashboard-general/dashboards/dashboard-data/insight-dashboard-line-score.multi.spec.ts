import {expect} from 'chai';
import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {DashboardTestConfigEditModel} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {
  dashboardLineScoreDataJson,
  dashboardLineScoreItems
} from '../../../../Page objects/InsightDashboard/ChartData/DashboardLineScore.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateFrom: '2016/01/01',
  dateTo: '2020/05/14',
  today: true
};

describe('InSight Dashboard - Dashboards - Line Score', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Line Score');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardLineScoreItems);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
  });
  it('should compare items headers', async () => {
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await dashboardsViewPage.compareHeaders(dashboardLineScoreDataJson);
  });
  it('should compare items average', async () => {
    await dashboardsViewPage.comparePercentage(dashboardLineScoreDataJson, false);
  });
  it('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardLineScoreDataJson);
  });
});
