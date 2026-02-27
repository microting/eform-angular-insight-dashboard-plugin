import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage, {dashboardName} from '../InsightDashboard-Dashboards.page';

describe('InSight Dashboard - Dashboards - Add', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
  });

  it('should create dashboard', () => {
    cy.get('#createDashboardBtn').should('be.visible');
    dashboardsPage.createDashboard();
    insightDashboardPage.goToDashboards();
    dashboardsPage.rowNum().then((rowCount) => {
      dashboardsPage.getRowDashboardName(rowCount).should('equal', dashboardName);
    });
  });

  it('should not create dashboard', () => {
    dashboardsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createDashboardBtn').should('be.visible');
      dashboardsPage.createDashboard_Cancels();
      dashboardsPage.rowNum().should('equal', rowNumsBefore);
    });
  });

  after(() => {
    dashboardsPage.clearTable();
  });
});
