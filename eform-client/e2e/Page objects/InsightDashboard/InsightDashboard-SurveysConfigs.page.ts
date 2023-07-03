import Page from '../Page';

export const configName = 'Test-Set';

export class InsightDashboardSurveysConfigsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
  }

  public async surveyConfigCreateBtn() {
    const ele = await $('#createSurveyConfigBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigCreateSaveBtn() {
    const ele = await $('#surveyConfigCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigCreateCancelBtn() {
    const ele = await $('#surveyConfigCreateSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigEditSaveBtn() {
    const ele = await $('#surveyConfigEditSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigEditCancelBtn() {
    const ele = await $('#surveyConfigEditSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigLocationCheckbox(num: number) {
    const ele = await $(`#checkbox${num} label`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 30000});
    return ele;
  }

  public async surveyConfigDeleteSaveBtn() {
    const ele = await $('#surveyConfigDeleteSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigDeleteCancelBtn() {
    const ele = await $('#surveyConfigDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

/*  public async installationDeleteCancelBtn() {
    const ele = await $('#surveyConfigDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }*/

  async createSurveyConfig(configName: string) {
    await (await this.surveyConfigCreateBtn()).click();
    const searchField = await surveyConfigsPage.getSurveysSearchField();
    await searchField.addValue(configName);
    const listChoices = await surveyConfigsPage.getSurveyListOfChoices();
    const choice = listChoices[0];
    await choice.click();
    await browser.pause(1000);
    await (await this.surveyConfigCreateSaveBtn()).click();
  }

  async createSurveyConfig_Cancels() {
    await (await this.surveyConfigCreateBtn()).click();
    await (await this.surveyConfigCreateCancelBtn()).click();
  }

  async updateSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    await rowObject.editSurveyConfigBtn.click();
    await (await this.surveyConfigLocationCheckbox(1)).click();
    await (await this.surveyConfigLocationCheckbox(2)).click();
    await browser.pause(1000);
    await (await this.surveyConfigEditSaveBtn()).click();
  }

  async updateSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    await rowObject.editSurveyConfigBtn.click();
    await (await this.surveyConfigEditCancelBtn()).click();
  }


  async deleteSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    await rowObject.surveyConfigDeleteBtn.click();
    await browser.pause(1000);
    await (await this.surveyConfigDeleteSaveBtn()).click();
  }

  async deleteSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    await rowObject.surveyConfigDeleteBtn.click();
    await (await this.surveyConfigDeleteCancelBtn()).click();
  }

  public async getSurveysSearchField() {
    const ele = await $('#selectSurveyCreate .ng-input > input');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getSurveyListOfChoices() {
    const ele = await $$('ng-dropdown-panel .ng-option');
    await ele[0].waitForDisplayed({timeout: 30000});
    await ele[0].waitForClickable({timeout: 30000});
    return ele;
  }

  async getFirstRowObject(): Promise<SurveysConfigPageRowObject> {
    await browser.pause(500);
    const obj = new SurveysConfigPageRowObject();
    return await obj.getRow(1);
  }

  async getLastRowObject(): Promise<SurveysConfigPageRowObject> {
    return await new SurveysConfigPageRowObject().getRow(await this.rowNum());
  }

  async getSurveyConfig(num): Promise<SurveysConfigPageRowObject> {
    await browser.pause(500);
    const obj = new SurveysConfigPageRowObject();
    return await obj.getRow(num);
  }
}

const surveyConfigsPage = new InsightDashboardSurveysConfigsPage();
export default surveyConfigsPage;

export class SurveysConfigPageRowObject {
  constructor() {
  }

  public row: WebdriverIO.Element;
  public id: number;
  public surveyName: string;
  public locations: string[];
  public editSurveyConfigBtn;
  public surveyConfigDeleteBtn;
  public surveyConfigActivateBtn;

  async getRow(rowNum: number): Promise<SurveysConfigPageRowObject> {
    this.row = (await $$('tbody > tr'))[rowNum - 1];
    if (this.row) {
      try {
        this.id = +await (await this.row.$('.mat-column-id span')).getText();
        this.surveyName = await (await this.row.$('.mat-column-surveyName span')).getText();
        this.locations = (await (await this.row.$('.mat-column-locations')).getText()).split('\n\n');
        this.editSurveyConfigBtn = await this.row.$$('.mat-column-actions button')[0];
        this.surveyConfigActivateBtn = await this.row.$$('.mat-column-actions button')[1];
        this.surveyConfigDeleteBtn = await this.row.$$('.mat-column-actions button')[2];
      } catch (e) {
      }
    }
    return this;
  }
}
