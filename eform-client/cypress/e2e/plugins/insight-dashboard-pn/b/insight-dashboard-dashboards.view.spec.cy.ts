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

const item: DashboardTestItemEditModel = {
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

describe('InSight Dashboard - Dashboards - View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard('Test View');
    dashboardEditPage.setDashboardSettings(dashboardConfig);
  });

  it('should observe filled item', () => {
    dashboardEditPage.generateItems([item]);
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/update').as('updateDashboard');
    dashboardEditPage.dashboardUpdateSaveBtn().click();
    cy.wait('@updateDashboard', { timeout: 60000 });
    cy.get('#firstQuestion1').should('be.visible');
    dashboardsViewPage.returnToDashboards();
    dashboardsViewPage.compareItem(1, item, dashboardConfig);
  });

  afterEach(() => {
    insightDashboardPage.goToDashboards();
    dashboardsPage.clearTable();
  });
});
