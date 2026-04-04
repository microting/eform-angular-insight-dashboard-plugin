import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardSurveysConfigsPage, configName } from '../InsightDashboard-SurveysConfigs.page';

test.describe('InSight Dashboard - Survey Configs - Edit', () => {
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
    await surveyConfigsPage.createSurveyConfig(configName);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Should not update survey config', async () => {
    const surveyConfig = await surveyConfigsPage.rowNum();
    await page.locator('#createSurveyConfigBtn').waitFor({ state: 'visible', timeout: 30000 });
    await surveyConfigsPage.updateSurveyConfig_Cancels(surveyConfig);
  });

  test('Should update survey config', async () => {
    const surveyConfig = await surveyConfigsPage.rowNum();
    await page.locator('#createSurveyConfigBtn').waitFor({ state: 'visible', timeout: 30000 });
    await surveyConfigsPage.updateSurveyConfig(surveyConfig);
  });
});
