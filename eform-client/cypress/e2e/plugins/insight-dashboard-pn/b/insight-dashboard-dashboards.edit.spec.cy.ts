import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import dashboardsPage from '../InsightDashboard-Dashboards.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel,
  DashboardTestItemEditModel
} from '../InsightDashboard-DashboardEdit.page';
import dashboardsViewPage from '../InsightDashboard-DashboardView.page';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 1,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 5,
    dayTo: 14
  },
  today: false
};

const testItem: DashboardTestItemEditModel = {
  firstQuestion: 'Q2',
  filterQuestion: 'Q3',
  firstQuestionForSelect: '2 - Q2',
  filterQuestionForSelect: '3 - Q3',
  filterAnswer: 'Meget glad',
  period: 'Måned',
  chartType: 'Linje',
  calculateAverage: false,
  ignoredAnswerIds: [],
  comparedItems: []
};

describe('InSight Dashboard - Dashboards - Edit', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
    dashboardEditPage.setDashboardSettings(dashboardConfig);
  });

  it('should create initial empty item', () => {
    cy.get('#dashboardUpdateSaveBtn').should('be.visible');
    dashboardEditPage.rowNum().then((itemNumsBefore) => {
      dashboardEditPage.createFirstItem();
      dashboardEditPage.rowNum().should('equal', itemNumsBefore + 1);
    });
  });

  it('should delete item', () => {
    dashboardEditPage.createFirstItem();
    dashboardEditPage.rowNum().then((itemNumsBefore) => {
      dashboardEditPage.deleteItem(itemNumsBefore);
      dashboardEditPage.rowNum().should('equal', itemNumsBefore - 1);
    });
  });

  it('should create new item', () => {
    dashboardEditPage.rowNum().then((itemNumsBefore) => {
      dashboardEditPage.createFirstItem();
      dashboardEditPage.rowNum().should('equal', itemNumsBefore + 1);
    });
    dashboardEditPage.rowNum().then((itemNumsBefore) => {
      dashboardEditPage.createItem(itemNumsBefore);
      dashboardEditPage.rowNum().should('equal', itemNumsBefore + 1);
    });
  });

  it('should copy empty item', () => {
    dashboardEditPage.createFirstItem();
    dashboardEditPage.rowNum().then((itemNumsBefore) => {
      dashboardEditPage.copyItem(itemNumsBefore);
      dashboardEditPage.rowNum().should('equal', itemNumsBefore + 1);
    });
  });

  it('should save filled item', () => {
    dashboardEditPage.createFirstItem();
    dashboardEditPage.fillItem(1, testItem);
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/update').as('updateDashboard');
    dashboardEditPage.dashboardUpdateSaveBtn().click();
    cy.wait('@updateDashboard', { timeout: 60000 });
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards').as('getDashboards');
    dashboardsViewPage.returnToDashboards().click();
    cy.wait('@getDashboards', { timeout: 60000 });
    dashboardsPage.rowNum().then((dashboardRowNum) => {
      dashboardsPage.editDashboard(dashboardRowNum);
      dashboardEditPage.rowNum().should('equal', 1);
      dashboardEditPage.dashboardUpdateSaveCancelBtn().click();
    });
  });

  afterEach(() => {
    insightDashboardPage.goToDashboards();
    dashboardsPage.clearTable();
  });
});
