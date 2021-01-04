import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import answersPage from '../../../Page objects/InsightDashboard/InsightDashboard-Answers.page';

const microtingUId = 1413005;
describe('InSight Dashboard - Answers - Delete', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToAnswers();
  });
  it('should be delete answer', function () {
    answersPage.searchMicrotingUIdInput.setValue(microtingUId);
    answersPage.searchMicrotingUIdBtn.click();
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    answersPage.deleteByMicrotingUIdBtn.click();
    const saveDeleteBtn = $('#saveDeleteBtn');
    saveDeleteBtn.waitForDisplayed({timeout: 20000});
    saveDeleteBtn.waitForClickable({ timeout: 20000});
    saveDeleteBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    answersPage.searchMicrotingUIdInput.setValue(microtingUId);
    answersPage.searchMicrotingUIdBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    expect(answersPage.rowNum).eq(0);
  });
});
