import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import answersPage from '../InsightDashboard-Answers.page';

const microtingUId = 1413005;

describe('InSight Dashboard - Answers - View', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToAnswers();
  });

  it('should be displayed 18 answers values', () => {
    answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    answersPage.rowNum().should('eq', 19);
  });
});
