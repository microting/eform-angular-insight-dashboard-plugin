import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage from '../InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardHorizontalBarDataJson,
  dashboardHorizontalBarItems
} from '../ChartData/DashboardHorizontalBar.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 0,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 5,
    dayTo: 14
  },
  today: true
};

describe('InSight Dashboard - Dashboards - Horizontal Bar', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Horizontal Bar');
    dashboardEditPage.setDashboardSettings(dashboardConfig);
    dashboardEditPage.generateItems(dashboardHorizontalBarItems);
    dashboardEditPage.dashboardUpdateSaveBtn().click();
    cy.get('#spinner-animation').should('not.exist', {timeout: 40000});
    cy.wait(1000);
  });

  it('should compare items headers', () => {
    dashboardsViewPage.compareHeaders(dashboardHorizontalBarDataJson);
  });

  it('should compare items percentage', () => {
    dashboardsViewPage.comparePercentage(dashboardHorizontalBarDataJson);
  });

  it('should compare items amounts', () => {
    dashboardsViewPage.compareAmounts(dashboardHorizontalBarDataJson);
  });

  after(() => {
    insightDashboardPage.goToDashboards();
    cy.get('#spinner-animation').should('not.exist', {timeout: 40000});
    dashboardsPage.clearTable();
  });
});
