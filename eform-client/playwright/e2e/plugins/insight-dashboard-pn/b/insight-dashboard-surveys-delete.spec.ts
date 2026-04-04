import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardSurveysConfigsPage, configName } from '../InsightDashboard-SurveysConfigs.page';

test.describe('InSight Dashboard - Survey Config - Delete', () => {
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

  test('Should not delete survey config', async () => {
    const rowNumsBeforeDelete = await surveyConfigsPage.rowNum();
    await page.locator('#createSurveyConfigBtn').waitFor({ state: 'visible', timeout: 10000 });
    await surveyConfigsPage.deleteSurveyConfig_Cancels(rowNumsBeforeDelete);
    expect(rowNumsBeforeDelete).toBe(await surveyConfigsPage.rowNum());
  });

  test('Should delete survey config', async () => {
    const rowNumsBeforeDelete = await surveyConfigsPage.rowNum();
    await page.locator('#createSurveyConfigBtn').waitFor({ state: 'visible', timeout: 10000 });
    await surveyConfigsPage.deleteSurveyConfig(rowNumsBeforeDelete);
    const rowsAfterDelete = await surveyConfigsPage.rowNum();
    expect(rowsAfterDelete).toBe(rowNumsBeforeDelete - 1);
  });
});
