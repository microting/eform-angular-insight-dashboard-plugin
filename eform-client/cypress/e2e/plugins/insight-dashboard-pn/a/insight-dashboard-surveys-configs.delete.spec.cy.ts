import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import surveyConfigsPage, {configName} from '../InsightDashboard-SurveysConfigs.page';

describe('InSight Dashboard - Survey Config - Delete', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
    surveyConfigsPage.createSurveyConfig(configName);
  });

  it('Should not delete survey config', () => {
    surveyConfigsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createSurveyConfigBtn').should('be.visible');
      surveyConfigsPage.deleteSurveyConfig_Cancels(rowNumsBefore);
      surveyConfigsPage.rowNum().should('equal', rowNumsBefore);
    });
  });

  it('Should delete survey config', () => {
    surveyConfigsPage.rowNum().then((rowNumsBefore) => {
      cy.get('#createSurveyConfigBtn').should('be.visible');
      surveyConfigsPage.deleteSurveyConfig(rowNumsBefore);
      surveyConfigsPage.rowNum().should('equal', rowNumsBefore - 1);
    });
  });
});
