import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage from '../InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel
} from '../InsightDashboard-DashboardEdit.page';
import {
  dashboardStackedGroupedDataJson,
  dashboardStackedGroupedItems
} from '../ChartData/DashboardStackedGrouped.data';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Total',
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

describe('InSight Dashboard - Dashboards - Stacked Grouped', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Stacked Grouped');
    dashboardEditPage.setDashboardSettings(dashboardConfig);
    dashboardEditPage.generateItems(dashboardStackedGroupedItems);
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/update').as('updateDashboard');
    dashboardEditPage.dashboardUpdateSaveBtn().click();
    cy.wait('@updateDashboard', { timeout: 60000 });
  });

  it('should compare items headers', () => {
    dashboardsViewPage.compareHeaders(dashboardStackedGroupedDataJson);
  });

  it('should compare items percentage', () => {
    dashboardsViewPage.comparePercentage(dashboardStackedGroupedDataJson);
  });

  it('should compare items amounts', () => {
    dashboardsViewPage.compareAmounts(dashboardStackedGroupedDataJson);
  });

  after(() => {
    insightDashboardPage.goToDashboards();
    dashboardsPage.clearTable();
  });
});
