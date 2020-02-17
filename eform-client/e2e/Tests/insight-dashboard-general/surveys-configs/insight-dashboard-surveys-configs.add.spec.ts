import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage, {configName} from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';


describe('Insight Dashboard - Survey Config - Add', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
  });
  it('Should create survey config', function () {
    browser.waitForVisible('#createSurveyConfigBtn', 10000);
    surveyConfigsPage.createSurveyConfig(configName);
    const surveyConfig = surveyConfigsPage.getFirstRowObject();
    expect(surveyConfig.surveyName).equal(configName);
    browser.pause(8000);
    browser.refresh();
  });
  it('Should not create survey config', function () {
    const rowNumsBeforeCreate = surveyConfigsPage.rowNum;
    browser.pause(8000);
    browser.waitForVisible('#createSurveyConfigBtn', 10000);
    surveyConfigsPage.createSurveyConfig_Cancels();
    expect(rowNumsBeforeCreate).equal(surveyConfigsPage.rowNum);
  });
});
