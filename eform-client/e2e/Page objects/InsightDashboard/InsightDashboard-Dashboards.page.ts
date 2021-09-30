import Page from '../Page';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';

export class InsightDashboardDashboardsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
  }

  public async dashboardCreateBtn() {
    const ele = await $('#createDashboardBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCreateSaveBtn() {
    const ele = await $('#dashboardCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCreateCancelBtn() {
    const ele = await $('#dashboardCreateSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardName() {
    const ele = await $('#dashboardNameCreate');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardNameInput() {
    const ele = await $('#dashboardNameCreate > input');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardEditSaveBtn() {
    const ele = await $('#dashboardEditSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardEditCancelBtn() {
    const ele = await $('#dashboardEditSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardDeleteSaveBtn() {
    const ele = await $('#dashboardDeleteSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardDeleteCancelBtn() {
    const ele = await $('#dashboardDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCopySaveBtn() {
    const ele = await $('#dashboardCopySaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCopySaveCancelBtn() {
    const ele = $('#dashboardCopySaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  async createDashboard(name: string = 'NewDashboard') {
    await (await this.dashboardCreateBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardName()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardName()).addValue(name);
    // Select survey
    const surveySearchField = await dashboardsPage.getSurveysSearchField();
    await surveySearchField.addValue(configName);
    const surveyListChoices = await dashboardsPage.getSurveyListOfChoices();
    const surveyChoice = surveyListChoices[0];
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await surveyChoice.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardCreateSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async createDashboard_Cancels() {
    await (await this.dashboardCreateBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardCreateCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async deleteDashboard(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardDeleteBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardDeleteSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async deleteDashboard_Cancels(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardDeleteBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardDeleteCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async copyDashboard(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardCopyBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardCopySaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async copyDashboard_Cancel(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardCopyBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
    await (await this.dashboardCopySaveCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  public async getSurveysSearchField() {
    const ele = await $('#selectSurveyCreate .ng-input > input');
    await ele .waitForDisplayed({timeout: 30000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getSurveyListOfChoices() {
    return $$('#selectSurveyCreate .ng-option');
  }

  async getFirstRowObject(): Promise<DashboardsPageRowObject> {
    const ele = new DashboardsPageRowObject();
    return await ele.getRow(1);
  }

  async getDashboard(num): Promise<DashboardsPageRowObject> {
    await browser.pause(500);
    const ele = new DashboardsPageRowObject();
    return await ele.getRow(num);
  }
}

const dashboardsPage = new InsightDashboardDashboardsPage();
export default dashboardsPage;

export class DashboardsPageRowObject {
  constructor() {}

  public id;
  public dashboardName;
  public locations;
  public dashboardViewBtn;
  public dashboardEditBtn;
  public dashboardDeleteBtn;
  public dashboardCopyBtn;

  async getRow(rowNum: number): Promise<DashboardsPageRowObject> {
    if ((await $$('#dashboardId'))[rowNum - 1]) {
      this.id = (await $$('#dashboardId'))[rowNum - 1];
      try {
        this.dashboardName = (await $$('#dashboardName'))[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.locations = (await $$('#dashboardLocation > p'))[rowNum - 1];
      } catch (e) {
      }
      // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.dashboardEditBtn = (await $$('#dashboardEditBtn'))[rowNum - 1];
      this.dashboardViewBtn = (await $$('#dashboardViewBtn'))[rowNum - 1];
      this.dashboardDeleteBtn = (await $$('#dashboardDeleteBtn'))[rowNum - 1];
      this.dashboardCopyBtn = (await $$('#dashboardCopyBtn'))[rowNum - 1];
    }
    return this;
  }
}
