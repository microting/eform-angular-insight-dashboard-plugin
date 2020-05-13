import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardEditPage from '../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import dashboardsViewPage from '../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';

const item = {
  firstQuestion: 'Q2',
  filterQuestion: 'Q3',
  filterAnswer: 'Meget glad',
  period: 'Måned',
  chartType: 'Linje',
  calculateAverage: false,
  ignoredAnswerIds: []
};

describe('InSight Dashboard - Dashboards - View', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
  });
  it('should observe filled item', function () {
    const itemNumsBeforeCreateItem = dashboardEditPage.rowNum;
    dashboardEditPage.createFirstItem();
    dashboardEditPage.fillItem(itemNumsBeforeCreateItem + 1, item);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
    dashboardsViewPage.compareItem(dashboardsViewPage.rowNum);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  });
});
