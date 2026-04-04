import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardAnswersPage } from '../InsightDashboard-Answers.page';

const microtingUId = 1413005;

test.describe('InSight Dashboard - Answers - View', () => {
  let page: any;
  let insightDashboardPage: InsightDashboardPage;
  let answersPage: InsightDashboardAnswersPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    insightDashboardPage = new InsightDashboardPage(page);
    answersPage = new InsightDashboardAnswersPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToAnswers();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should be displayed 18 answers values', async () => {
    await answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    expect(await answersPage.rowNum()).toBe(19);
  });
});
