import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';

const configName = 'Test-Set';

describe('Insight Dashboard - Survey Configs - Edit', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
    surveyConfigsPage.createSurveyConfig(configName);
  });
  it('Should not update survey config', function () {
    const surveyConfig = surveyConfigsPage.getSurveyConfig(surveyConfigsPage.rowNum);
    const locationsBeforeUpdate = surveyConfig.locations.length;
    browser.pause(8000);
    browser.waitForVisible('#createSurveyConfigBtn', 30000);
    surveyConfigsPage.updateSurveyConfig_Cancels(surveyConfig);
    expect(surveyConfig.locations.length).equal(locationsBeforeUpdate);
  });
  it('Should update survey config', function () {
    const surveyConfig = surveyConfigsPage.getSurveyConfig(surveyConfigsPage.rowNum);
    const locationsBeforeUpdate = surveyConfig.locations.length;
    browser.pause(8000);
    browser.waitForVisible('#createSurveyConfigBtn', 30000);
    surveyConfigsPage.updateSurveyConfig(surveyConfig);
    expect(surveyConfig.locations.length).equal(locationsBeforeUpdate);
  });
});
