import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage from '../InsightDashboard-Dashboards.page';

describe('InSight Dashboard - Dashboards - Delete', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
  });

  it('should not delete dashboard', () => {
    dashboardsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createDashboardBtn').should('be.visible');
      dashboardsPage.deleteDashboard_Cancels(rowNumsBefore);
      dashboardsPage.rowNum().should('equal', rowNumsBefore);
    });
  });

  it('should delete dashboard', () => {
    dashboardsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createDashboardBtn').should('be.visible');
      dashboardsPage.deleteDashboard(rowNumsBefore);
      insightDashboardPage.goToDashboards();
      dashboardsPage.rowNum().should('equal', rowNumsBefore - 1);
    });
  });

  afterEach(() => {
    insightDashboardPage.goToDashboards();
    dashboardsPage.clearTable();
  });
});
