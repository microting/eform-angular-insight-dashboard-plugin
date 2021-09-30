import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import answersPage from '../../../Page objects/InsightDashboard/InsightDashboard-Answers.page';

const microtingUId = 1413005;
describe('InSight Dashboard - Answers - Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToAnswers();
  });
  it('should be delete answer', async () => {
    await (await answersPage.searchMicrotingUIdInput()).setValue(microtingUId);
    await (await answersPage.searchMicrotingUIdBtn()).click();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    await (await answersPage.deleteByMicrotingUIdBtn()).click();
    const saveDeleteBtn = await $('#saveDeleteBtn');
    await saveDeleteBtn.waitForDisplayed({timeout: 20000});
    await saveDeleteBtn.waitForClickable({ timeout: 20000});
    await saveDeleteBtn.click();
    await spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    await (await answersPage.searchMicrotingUIdInput()).setValue(microtingUId);
    await (await answersPage.searchMicrotingUIdBtn()).click();
    await spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    expect(await answersPage.rowNum()).eq(0);
  });
});
