import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { InsightDashboardPage } from '../InsightDashboard.page';
import { InsightDashboardAnswersPage } from '../InsightDashboard-Answers.page';

const microtingUId = 1413005;

test.describe('InSight Dashboard - Answers - Delete', () => {
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

  test('should be delete answer', async () => {
    await answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    await answersPage.deleteAnswer();
    await answersPage.searchAnswerByMicrotingUId(microtingUId.toString());

    // A deleted answer must disappear from the lookup. This asserted 0 when the
    // spec was written; it was changed to 19 three hours after the lookup's
    // workflow-state filters were commented out, which turned the regression into
    // the expected result. The filters are back, so this goes back to 0.
    // mtx-grid renders its empty state as a div outside the table, so no row
    // remains in tbody.
    expect(await answersPage.rowNum()).toBe(0);
  });
});
