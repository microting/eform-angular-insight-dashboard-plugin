import Page from '../Page';

export class InsightDashboardAnswersPage extends Page {
  constructor() {
    super();
  }

  public get searchMicrotingUIdInput() {
    const ele = $('#searchMicrotingUIdInput');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public get searchMicrotingUIdBtn() {
    const ele = $('#searchMicrotingUIdBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public get deleteByMicrotingUIdBtn() {
    const ele = $('#deleteByMicrotingUIdBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get rowNum(): number {
    browser.pause(500);
    return $$('#answerValueId').length;
  }
}

const answersPage = new InsightDashboardAnswersPage();
export default answersPage;
