import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import {Guid} from 'guid-typescript';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage, {configName} from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';

describe('Installation Checking - Installation - Delete', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
    surveyConfigsPage.createSurveyConfig(configName);
  });
  it('Should not delete survey config', function () {
    const rowNumsBeforeDelete = surveyConfigsPage.rowNum;
    browser.waitForVisible('#createSurveyConfigBtn', 10000);
    surveyConfigsPage.deleteSurveyConfig_Cancels(surveyConfigsPage.getSurveyConfig(rowNumsBeforeDelete));
    expect(rowNumsBeforeDelete).equal(surveyConfigsPage.rowNum);
  });
  it('Should delete survey config', function () {
    const rowNumsBeforeDelete = surveyConfigsPage.rowNum;
    browser.waitForVisible('#createSurveyConfigBtn', 10000);
    surveyConfigsPage.deleteSurveyConfig(surveyConfigsPage.getSurveyConfig(rowNumsBeforeDelete));
    const rowsAfterDelete = surveyConfigsPage.rowNum;
    expect(rowsAfterDelete).equal(rowNumsBeforeDelete - 1);
    browser.pause(8000);
    browser.refresh();
  });
});
