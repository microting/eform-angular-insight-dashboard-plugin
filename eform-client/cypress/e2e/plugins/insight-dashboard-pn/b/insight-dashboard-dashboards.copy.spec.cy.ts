import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage from '../InsightDashboard-Dashboards.page';

describe('InSight Dashboard - Dashboards - Copy', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
  });

  it('should not copy dashboard', () => {
    dashboardsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createDashboardBtn').should('be.visible');
      dashboardsPage.copyDashboard_Cancel(rowNumsBefore);
      dashboardsPage.rowNum().should('equal', rowNumsBefore);
    });
  });

  it('should copy dashboard', () => {
    dashboardsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createDashboardBtn').should('be.visible');
      dashboardsPage.copyDashboard(rowNumsBefore);
      insightDashboardPage.goToDashboards();
      dashboardsPage.rowNum().should('equal', rowNumsBefore + 1);
    });
  });

  after(() => {
    dashboardsPage.clearTable();
  });
});
