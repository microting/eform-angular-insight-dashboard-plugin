import Page from '../Page';

export class InsightDashboardAnswersPage extends Page {
  constructor() {
    super();
  }

  public async searchMicrotingUIdInput() {
    const ele = await $('#searchMicrotingUIdInput');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public async searchMicrotingUIdBtn() {
    const ele = await $('#searchMicrotingUIdBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public async deleteByMicrotingUIdBtn() {
    const ele = await $('#deleteByMicrotingUIdBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#answerValueId')).length;
  }
}

const answersPage = new InsightDashboardAnswersPage();
export default answersPage;
