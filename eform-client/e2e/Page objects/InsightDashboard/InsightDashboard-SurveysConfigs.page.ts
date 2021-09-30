import Page from '../Page';

export const configName = 'Test-Set';

export class InsightDashboardSurveysConfigsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
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

  private async surveyConfigLocationEditCheckbox(num: number) {
    const ele =  await $(`#checkboxEdit${num}`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 30000});
    return ele;
  }

  private async surveyConfigLocationCreateCheckbox(num: number) {
    const ele = await $(`#checkboxCreate${num}`);
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

  public async installationDeleteCancelBtn() {
    const ele = await $('#surveyConfigDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  async createSurveyConfig(configName: string) {
    await (await this.surveyConfigCreateBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    const searchField = await surveyConfigsPage.getSurveysSearchField();
    searchField.addValue(configName);
    const listChoices = await surveyConfigsPage.getSurveyListOfChoices();
    const choice = listChoices[0];
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await choice.click();
    await browser.pause(1000);
    await (await this.surveyConfigCreateSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async createSurveyConfig_Cancels() {
    await (await this.surveyConfigCreateBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.surveyConfigCreateCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async updateSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    await rowObject.editSurveyConfigBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.surveyConfigLocationEditCheckbox(1)).click();
    await (await this.surveyConfigLocationEditCheckbox(2)).click();
    await browser.pause(1000);
    await (await this.surveyConfigEditSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async updateSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    await rowObject.editSurveyConfigBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.surveyConfigEditCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }


  async deleteSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    await rowObject.surveyConfigDeleteBtn.click();
    await browser.pause(1000);
    await (await this.surveyConfigDeleteSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async deleteSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    await rowObject.surveyConfigDeleteBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.surveyConfigDeleteCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  activateSurveyConfig() {
    // const installation = installationPage.getFirstRowObject();
    // installation.retractBtn.click();
    // browser.pause(5000);
    // this.installationRetractSaveBtn.click();
    // browser.pause(15000);
  }

  activateSurveyConfig__Cancels() {
    // const installation = installationPage.getFirstRowObject();
    // installation.retractBtn.click();
    // browser.pause(5000);
    // this.installationRetractSaveBtn.click();
    // browser.pause(15000);
  }

  public async getSurveysSearchField() {
    const ele = await $('#selectSurveyCreate .ng-input > input');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getSurveyListOfChoices() {
    const ele = await $$('#selectSurveyCreate .ng-option');
    await ele[0].waitForDisplayed({timeout: 30000});
    await ele[0].waitForClickable({timeout: 30000});
    return ele;
  }

  async getFirstRowObject(): Promise<SurveysConfigPageRowObject> {
    await browser.pause(500);
    const obj = new SurveysConfigPageRowObject();
    return await obj.getRow(1);
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
  constructor() {}

  public id;
  public surveyName;
  public locations;
  public editSurveyConfigBtn;
  public surveyConfigDeleteBtn;
  public surveyConfigActivateBtn;
  async getRow(rowNum: number): Promise<SurveysConfigPageRowObject> {
    if ((await $$('#surveyConfigId'))[rowNum - 1]) {
      this.id = (await $$('#surveyConfigId'))[rowNum - 1];
      try {
        this.surveyName = (await $$('#surveyConfigName'))[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.locations = (await $$('#surveyConfigLocation > p'))[rowNum - 1];
      } catch (e) {
      }
      // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.editSurveyConfigBtn = (await $$('#editSurveyConfigBtn'))[rowNum - 1];
      this.surveyConfigDeleteBtn = (await $$('#surveyConfigDeleteBtn'))[rowNum - 1];
      this.surveyConfigActivateBtn = (await $$('#surveyConfigActivateBtn'))[rowNum - 1];
    }
    return this;
  }
}
