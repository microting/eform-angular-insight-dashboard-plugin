import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import {Guid} from 'guid-typescript';
import customersPage from '../../../Page objects/InstallationChecking/Customers.page';
import deviceUsers from '../../../Page objects/DeviceUsers.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';

const configName = 'Test-Set';

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
  it('Should not create installation', function () {
    const rowNumsBeforeCreate = surveyConfigsPage.rowNum;
    browser.pause(8000);
    browser.waitForVisible('#createSurveyConfigBtn', 10000);
    surveyConfigsPage.createSurveyConfig_Cancels();
    expect(rowNumsBeforeCreate).equal(surveyConfigsPage.rowNum);
  });
});
