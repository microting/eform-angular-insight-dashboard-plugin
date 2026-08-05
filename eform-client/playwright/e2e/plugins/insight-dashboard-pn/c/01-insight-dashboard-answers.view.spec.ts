import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
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

  // Numbered so this runs before the delete spec. It needs the answer to still
  // exist: the lookup now hides soft-deleted answers, so viewing one the delete
  // spec has removed would find nothing. Previously the order did not matter,
  // because a deleted answer was still returned.
  test('should display the answer values of a live answer', async () => {
    await answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    expect(await answersPage.rowNum()).toBe(19);
  });
});
