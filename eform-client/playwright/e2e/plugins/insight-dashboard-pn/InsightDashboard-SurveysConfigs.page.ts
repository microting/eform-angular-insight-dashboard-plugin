import { Page } from '@playwright/test';

export const configName = 'Test-Set';

export class InsightDashboardSurveysConfigsPage {
  constructor(private page: Page) {}

  async rowNum(): Promise<number> {
    await this.page.waitForTimeout(1500);
    return await this.page.locator('tbody > tr').count();
  }

  public get surveyConfigCreateBtn() {
    return this.page.locator('#createSurveyConfigBtn');
  }

  public get surveyConfigCreateSaveBtn() {
    return this.page.locator('#surveyConfigCreateSaveBtn');
  }

  public get surveyConfigCreateCancelBtn() {
    return this.page.locator('#surveyConfigCreateSaveCancelBtn');
  }

  public get surveyConfigEditSaveBtn() {
    return this.page.locator('#surveyConfigEditSaveBtn');
  }

  public get surveyConfigEditCancelBtn() {
    return this.page.locator('#surveyConfigEditSaveCancelBtn');
  }

  public surveyConfigLocationCheckbox(num: number) {
    return this.page.locator(`#checkbox${num} label`);
  }

  public get surveyConfigDeleteSaveBtn() {
    return this.page.locator('#surveyConfigDeleteSaveBtn');
  }

  public get surveyConfigDeleteCancelBtn() {
    return this.page.locator('#surveyConfigDeleteCancelBtn');
  }

  async createSurveyConfig(configName: string) {
    await this.surveyConfigCreateBtn.click();
    const searchField = this.page.locator('#selectSurveyCreate .ng-input > input');
    await searchField.waitFor({ state: 'visible', timeout: 30000 });
    await searchField.pressSequentially(configName);
    const firstChoice = this.page.locator('ng-dropdown-panel .ng-option').first();
    await firstChoice.waitFor({ state: 'visible', timeout: 30000 });
    await firstChoice.click();
    await this.page.waitForTimeout(1000);
    await this.surveyConfigCreateSaveBtn.click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 });
  }

  async createSurveyConfig_Cancels() {
    await this.surveyConfigCreateBtn.click();
    await this.surveyConfigCreateCancelBtn.click();
  }

  async updateSurveyConfig(rowNumber: number) {
    const rowObject = await this.getSurveyConfig(rowNumber);
    await this.clickActionsMenu(rowNumber - 1);
    await rowObject.editSurveyConfigBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.editSurveyConfigBtn.click();
    await this.surveyConfigLocationCheckbox(1).click();
    await this.surveyConfigLocationCheckbox(2).click();
    await this.page.waitForTimeout(1000);
    await this.surveyConfigEditSaveBtn.click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 });
  }

  async updateSurveyConfig_Cancels(rowNumber: number) {
    const rowObject = await this.getSurveyConfig(rowNumber);
    await this.clickActionsMenu(rowNumber - 1);
    await rowObject.editSurveyConfigBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.editSurveyConfigBtn.click();
    await this.surveyConfigEditCancelBtn.click();
  }

  async deleteSurveyConfig(rowNumber: number) {
    const rowObject = await this.getSurveyConfig(rowNumber);
    await this.clickActionsMenu(rowNumber - 1);
    await rowObject.surveyConfigDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.surveyConfigDeleteBtn.click();
    await this.page.waitForTimeout(1000);
    await this.surveyConfigDeleteSaveBtn.click();
  }

  async deleteSurveyConfig_Cancels(rowNumber: number) {
    const rowObject = await this.getSurveyConfig(rowNumber);
    await this.clickActionsMenu(rowNumber - 1);
    await rowObject.surveyConfigDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await rowObject.surveyConfigDeleteBtn.click();
    await this.surveyConfigDeleteCancelBtn.click();
  }

  async getFirstRowObject(): Promise<SurveysConfigPageRowObject> {
    await this.page.waitForTimeout(500);
    return await new SurveysConfigPageRowObject(this.page).getRow(1);
  }

  async getLastRowObject(): Promise<SurveysConfigPageRowObject> {
    return await new SurveysConfigPageRowObject(this.page).getRow(await this.rowNum());
  }

  async getSurveyConfig(num: number): Promise<SurveysConfigPageRowObject> {
    await this.page.waitForTimeout(500);
    return await new SurveysConfigPageRowObject(this.page).getRow(num);
  }

  async clickActionsMenu(rowNum: number) {
    await this.page.waitForTimeout(1000);
    await this.page.locator('#actionMenu').nth(rowNum).click();
    await this.page.waitForTimeout(1000);
  }
}

export class SurveysConfigPageRowObject {
  constructor(private page: Page) {}

  public id: number;
  public surveyName: string;
  public locations: string[];
  public editSurveyConfigBtn: ReturnType<Page['locator']>;
  public surveyConfigActivateBtn: ReturnType<Page['locator']>;
  public surveyConfigDeleteBtn: ReturnType<Page['locator']>;

  async getRow(rowNum: number): Promise<SurveysConfigPageRowObject> {
    const index = rowNum - 1;
    const row = this.page.locator('tbody > tr').nth(index);
    if ((await row.count()) > 0) {
      try {
        this.id = +(await row.locator('.mat-column-id span').textContent() ?? '0');
        this.surveyName = (await row.locator('.mat-column-surveyName span').textContent() ?? '').trim();
        this.locations = ((await row.locator('.mat-column-locations').textContent()) ?? '').split('\n\n');
        this.editSurveyConfigBtn = this.page.locator(`#editSurveyConfigBtn-${index}`);
        this.surveyConfigActivateBtn = this.page.locator(`#surveyConfigStatus-${index}`);
        this.surveyConfigDeleteBtn = this.page.locator(`#surveyConfigDeleteBtn-${index}`);
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
}
