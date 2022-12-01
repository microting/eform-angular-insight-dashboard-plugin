import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import answersPage from '../../../Page objects/InsightDashboard/InsightDashboard-Answers.page';

const microtingUId = 1413005;
describe('InSight Dashboard - Answers - View', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToAnswers();
  });
  it('should be displayed 18 answers values', async () => {
    await (await answersPage.searchMicrotingUIdInput()).setValue(microtingUId);
    await (await answersPage.searchMicrotingUIdBtn()).click();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    expect(await answersPage.rowNum()).eq(19);
  });
});
