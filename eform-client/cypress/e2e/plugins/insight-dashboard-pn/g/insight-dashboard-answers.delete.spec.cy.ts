import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import answersPage from '../InsightDashboard-Answers.page';

const microtingUId = 1413005;

describe('InSight Dashboard - Answers - Delete', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToAnswers();
  });

  it('should be delete answer', () => {
    answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    answersPage.deleteAnswer();
    answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    answersPage.rowNum().should('eq', 19);
  });
});
