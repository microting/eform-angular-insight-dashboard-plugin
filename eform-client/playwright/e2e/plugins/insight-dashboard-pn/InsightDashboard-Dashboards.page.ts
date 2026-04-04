import { Page } from '@playwright/test';
import { selectValueInNgSelector } from '../../helper-functions';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';

export class InsightDashboardDashboardsPage {
  constructor(private page: Page) {}

  async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('tbody > tr').count();
  }

  public get dashboardCreateBtn() {
    return this.page.locator('#createDashboardBtn');
  }

  public get dashboardCreateSaveBtn() {
    return this.page.locator('#dashboardCreateSaveBtn');
  }

  public get dashboardCreateCancelBtn() {
    return this.page.locator('#dashboardCreateSaveCancelBtn');
  }

  public get dashboardNameInput() {
    return this.page.locator('#dashboardNameCreate');
  }

  public get dashboardEditSaveBtn() {
    return this.page.locator('#dashboardEditSaveBtn');
  }

  public get dashboardEditCancelBtn() {
    return this.page.locator('#dashboardEditSaveCancelBtn');
  }

  public get dashboardDeleteSaveBtn() {
    return this.page.locator('#dashboardDeleteSaveBtn');
  }

  public get dashboardDeleteCancelBtn() {
    return this.page.locator('#dashboardDeleteCancelBtn');
  }

  public get dashboardCopySaveBtn() {
    return this.page.locator('#dashboardCopySaveBtn');
  }

  public get dashboardCopySaveCancelBtn() {
    return this.page.locator('#dashboardCopySaveCancelBtn');
  }

  async createDashboard(name: string = 'NewDashboard') {
    await this.dashboardCreateBtn.click();
    await this.dashboardNameInput.click();
    await this.dashboardNameInput.pressSequentially(name);
    await selectValueInNgSelector(this.page, '#selectSurveyCreate', configName, false, true);
    await this.dashboardCreateSaveBtn.click();
  }

  async createDashboard_Cancels() {
    await this.dashboardCreateBtn.click();
    await this.dashboardCreateCancelBtn.click();
  }

  async deleteDashboard(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.dashboardDeleteBtn.click();
    await this.dashboardDeleteSaveBtn.click();
  }

  async deleteDashboard_Cancels(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.dashboardDeleteBtn.click();
    await this.dashboardDeleteCancelBtn.click();
  }

  async copyDashboard(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardCopyBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.dashboardCopyBtn.click();
    await this.dashboardCopySaveBtn.click();
  }

  async copyDashboard_Cancel(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardCopyBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.dashboardCopyBtn.click();
    await this.dashboardCopySaveCancelBtn.click();
  }

  async getLastRowObject(): Promise<DashboardsPageRowObject> {
    return await new DashboardsPageRowObject(this.page).getRow(await this.rowNum());
  }

  async getFirstRowObject(): Promise<DashboardsPageRowObject> {
    return await new DashboardsPageRowObject(this.page).getRow(1);
  }

  async clearTable() {
    await this.page.waitForTimeout(1000);
    const rowCount = await this.rowNum();
    for (let i = 0; i < rowCount; i++) {
      await (await this.getFirstRowObject()).delete();
      await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 40000 });
    }
  }

  async getDashboard(num: number): Promise<DashboardsPageRowObject> {
    await this.page.waitForTimeout(1000);
    return await new DashboardsPageRowObject(this.page).getRow(num);
  }
}

export class DashboardsPageRowObject {
  constructor(private page: Page) {}

  public rowNum: number;
  public id: number;
  public dashboardName: string;
  public dashboardViewBtn: ReturnType<Page['locator']>;
  public dashboardEditBtn: ReturnType<Page['locator']>;
  public dashboardCopyBtn: ReturnType<Page['locator']>;
  public dashboardDeleteBtn: ReturnType<Page['locator']>;

  async getRow(rowNum: number): Promise<DashboardsPageRowObject> {
    const index = rowNum - 1;
    this.rowNum = index;
    const row = this.page.locator('tbody > tr').nth(index);
    if ((await row.count()) > 0) {
      try {
        this.id = +(await row.locator('.mat-column-id span').textContent() ?? '0');
        this.dashboardName = (await row.locator('.mat-column-dashboardName span').textContent() ?? '').trim();
        this.dashboardViewBtn = this.page.locator(`#dashboardViewBtn-${index}`);
        this.dashboardEditBtn = this.page.locator(`#dashboardEditBtn-${index}`);
        this.dashboardCopyBtn = this.page.locator(`#dashboardCopyBtn-${index}`);
        this.dashboardDeleteBtn = this.page.locator(`#dashboardDeleteBtn-${index}`);
      } catch (e) {
      }
    }
    return this;
  }

  async clickActionsMenu(rowNum: number) {
    await this.page.waitForTimeout(1000);
    await this.page.locator('#actionMenu').nth(rowNum).click();
    await this.page.waitForTimeout(1000);
  }

  async edit() {
    await this.clickActionsMenu(this.rowNum);
    await this.dashboardEditBtn.waitFor({ state: 'visible', timeout: 40000 });
    await this.dashboardEditBtn.click();
    await this.page.waitForTimeout(500);
  }

  async delete() {
    await this.clickActionsMenu(this.rowNum);
    await this.dashboardDeleteBtn.click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#dashboardDeleteSaveBtn').click();
    await this.page.waitForTimeout(500);
  }
}
