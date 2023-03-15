import Page from '../Page';

export class InsightDashboardAnswersPage extends Page {
  constructor() {
    super();
  }

  public async searchMicrotingUIdInput() {
    const ele = await $('#searchMicrotingUIdInput');
    await ele.waitForDisplayed({timeout: 40000});
    return ele;
  }

  public async searchMicrotingUIdBtn() {
    const ele = await $('#searchMicrotingUIdBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async deleteByMicrotingUIdBtn() {
    const ele = await $('#deleteByMicrotingUIdBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({ timeout: 40000});
    return ele;
  }

  public async saveDeleteBtn() {
    const ele = await $('#saveDeleteBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async cancelDeleteBtn() {
    const ele = await $('#cancelDeleteBtn');
    await ele.waitForDisplayed({timeout: 40000});
    await ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async searchAnswerByMicrotingUId(microtingUId: string) {
    await (await this.searchMicrotingUIdInput()).setValue(microtingUId);
    await (await this.searchMicrotingUIdBtn()).click();
    await this.waitForSpinnerHide();
  }

  async deleteAnswer(clickCancel = false) {
    await (await this.deleteByMicrotingUIdBtn()).click();
    if(clickCancel) {
      await (await this.cancelDeleteBtn());
    } else {
      await (await this.saveDeleteBtn());
      await this.waitForSpinnerHide();
    }
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length; // or (await $$(.mat-cell.mat-column-microtingUid)).length
  }
}

const answersPage = new InsightDashboardAnswersPage();
export default answersPage;
