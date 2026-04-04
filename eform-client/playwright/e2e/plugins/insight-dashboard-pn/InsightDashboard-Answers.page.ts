import { Page } from '@playwright/test';

export class InsightDashboardAnswersPage {
  constructor(private page: Page) {}

  public get searchMicrotingUIdInput() {
    return this.page.locator('#searchMicrotingUIdInput');
  }

  public get searchMicrotingUIdBtn() {
    return this.page.locator('#searchMicrotingUIdBtn');
  }

  public get deleteByMicrotingUIdBtn() {
    return this.page.locator('#deleteByMicrotingUIdBtn');
  }

  public get saveDeleteBtn() {
    return this.page.locator('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return this.page.locator('#cancelDeleteBtn');
  }

  async searchAnswerByMicrotingUId(microtingUId: string) {
    await this.searchMicrotingUIdInput.fill(microtingUId);
    await this.searchMicrotingUIdBtn.click();
  }

  async deleteAnswer(clickCancel = false) {
    await this.deleteByMicrotingUIdBtn.click();
    if (clickCancel) {
      await this.cancelDeleteBtn.waitFor({ state: 'visible' });
      await this.cancelDeleteBtn.click();
    } else {
      await this.saveDeleteBtn.waitFor({ state: 'visible' });
      await this.saveDeleteBtn.click();
    }
  }

  async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('tbody > tr').count();
  }
}
