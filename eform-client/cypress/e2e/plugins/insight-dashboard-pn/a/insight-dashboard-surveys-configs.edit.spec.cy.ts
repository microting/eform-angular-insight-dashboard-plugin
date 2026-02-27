import loginPage from '../../../Login.page';
import insightDashboardPage from '../InsightDashboard.page';
import surveyConfigsPage, {configName} from '../InsightDashboard-SurveysConfigs.page';

describe('InSight Dashboard - Survey Configs - Edit', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
    surveyConfigsPage.createSurveyConfig(configName);
  });

  it('Should not update survey config', () => {
    cy.get('#createSurveyConfigBtn').should('be.visible');
    surveyConfigsPage.rowNum().then((rowCount) => {
      surveyConfigsPage.updateSurveyConfig_Cancels(rowCount);
    });
  });

  it('Should update survey config', () => {
    cy.get('#createSurveyConfigBtn').should('be.visible');
    surveyConfigsPage.rowNum().then((rowCount) => {
      surveyConfigsPage.updateSurveyConfig(rowCount);
    });
  });
});
