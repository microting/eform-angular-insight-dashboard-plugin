import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage from '../InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardLineDataJson,
  dashboardLineDataItems
} from '../ChartData/DashboardLine.data';

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

describe('InSight Dashboard - Dashboards - Line', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Line');
    dashboardEditPage.setDashboardSettings(dashboardConfig);
    dashboardEditPage.generateItems(dashboardLineDataItems);
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/update').as('updateDashboard');
    dashboardEditPage.dashboardUpdateSaveBtn().click();
    cy.wait('@updateDashboard', { timeout: 60000 });
  });

  it('should compare items headers', () => {
    dashboardsViewPage.compareHeaders(dashboardLineDataJson);
  });

  it('should compare items percentage', () => {
    dashboardsViewPage.comparePercentage(dashboardLineDataJson);
  });

  it('should compare items amounts', () => {
    dashboardsViewPage.compareAmounts(dashboardLineDataJson);
  });

  afterEach(() => {
    insightDashboardPage.goToDashboards();
    dashboardsPage.clearTable();
  });
});
