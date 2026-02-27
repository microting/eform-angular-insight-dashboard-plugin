import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import surveyConfigsPage, {configName} from '../InsightDashboard-SurveysConfigs.page';

describe('InSight Dashboard - Survey Config - Add', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
  });

  it('Should create survey config', () => {
    cy.get('#createSurveyConfigBtn').should('be.visible');
    surveyConfigsPage.createSurveyConfig(configName);
    surveyConfigsPage.getRowSurveyName(1).should('equal', configName);
  });

  it('Should not create survey config', () => {
    surveyConfigsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createSurveyConfigBtn').should('be.visible');
      surveyConfigsPage.createSurveyConfig_Cancels();
      surveyConfigsPage.rowNum().should('equal', rowNumsBefore);
    });
  });
});
