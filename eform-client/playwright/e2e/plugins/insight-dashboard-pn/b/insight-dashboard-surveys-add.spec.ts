import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardSurveysConfigsPage, configName } from '../InsightDashboard-SurveysConfigs.page';

test.describe('InSight Dashboard - Survey Config - Add', () => {
  let page: any;
  let loginPage: LoginPage;
  let insightDashboardPage: InsightDashboardPage;
  let surveyConfigsPage: InsightDashboardSurveysConfigsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    surveyConfigsPage = new InsightDashboardSurveysConfigsPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToSurveysConfigs();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Should create survey config', async () => {
    await page.locator('#createSurveyConfigBtn').waitFor({ state: 'visible', timeout: 30000 });
    await surveyConfigsPage.createSurveyConfig(configName);
    const surveyConfig = await surveyConfigsPage.getFirstRowObject();
    expect(surveyConfig.surveyName).toBe(configName);
  });

  test('Should not create survey config', async () => {
    const rowNumsBeforeCreate = await surveyConfigsPage.rowNum();
    await page.locator('#createSurveyConfigBtn').waitFor({ state: 'visible', timeout: 10000 });
    await surveyConfigsPage.createSurveyConfig_Cancels();
    expect(rowNumsBeforeCreate).toBe(await surveyConfigsPage.rowNum());
  });
});
