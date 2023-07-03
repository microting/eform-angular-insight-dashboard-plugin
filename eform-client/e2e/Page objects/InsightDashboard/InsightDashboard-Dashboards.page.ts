import Page from '../Page';
import {selectValueInNgSelector} from '../../Helpers/helper-functions';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';

export class InsightDashboardDashboardsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
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
    const ele = await (await this.dashboardName()).$('input');
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
    await (await this.dashboardName()).click();
    await (await this.dashboardName()).addValue(name);
    // Select survey
    await selectValueInNgSelector(await this.getSurveysSearchField(), configName, true);
    await (await this.dashboardCreateSaveBtn()).click();
  }

  async createDashboard_Cancels() {
    await (await this.dashboardCreateBtn()).click();
    await (await this.dashboardCreateCancelBtn()).click();
  }

  async deleteDashboard(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardDeleteBtn.click();
    await (await this.dashboardDeleteSaveBtn()).click();
  }

  async deleteDashboard_Cancels(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardDeleteBtn.click();
    await (await this.dashboardDeleteCancelBtn()).click();
  }

  async copyDashboard(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardCopyBtn.click();
    await (await this.dashboardCopySaveBtn()).click();
  }

  async copyDashboard_Cancel(rowObject: DashboardsPageRowObject) {
    await rowObject.dashboardCopyBtn.click();
    await (await this.dashboardCopySaveCancelBtn()).click();
  }

  public async getSurveysSearchField() {
    const ele = await $('#selectSurveyCreate');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getSurveyListOfChoices() {
    return $$('.ng-option');
  }

  async getLastRowObject(): Promise<DashboardsPageRowObject> {
    return await new DashboardsPageRowObject().getRow(await this.rowNum());
  }

  async getFirstRowObject(): Promise<DashboardsPageRowObject> {
    return await new DashboardsPageRowObject().getRow(1);
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      await (await this.getFirstRowObject()).delete();
    }
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

  public row: WebdriverIO.Element;
  public id: number;
  public dashboardName: string;
  public locations;
  public dashboardViewBtn: WebdriverIO.Element;
  public dashboardEditBtn: WebdriverIO.Element;
  public dashboardCopyBtn: WebdriverIO.Element;
  public dashboardDeleteBtn: WebdriverIO.Element;


  async getRow(rowNum: number): Promise<DashboardsPageRowObject> {
    this.row = (await $$('tbody > tr'))[rowNum - 1];
    if (this.row) {
      try {
        this.id = +await (await this.row.$('.mat-column-id span')).getText();
        this.dashboardName = await (await this.row.$('.mat-column-dashboardName span')).getText();
        // this.locations = (await (await this.row.$('.mat-column-locations')).getText()).split('\n\n');
        this.dashboardViewBtn = await this.row.$$('.mat-column-actions button')[0];
        this.dashboardEditBtn = await this.row.$$('.mat-column-actions button')[1];
        this.dashboardCopyBtn = await this.row.$$('.mat-column-actions button')[2];
        this.dashboardDeleteBtn = await this.row.$$('.mat-column-actions button')[3];
      } catch (e) {
      }
    }
    return this;
  }

  async delete() {
    await this.dashboardDeleteBtn.click();
    await (await dashboardsPage.dashboardDeleteSaveBtn()).waitForClickable();
    await (await dashboardsPage.dashboardDeleteSaveBtn()).click();
    await (await dashboardsPage.dashboardCreateBtn()).waitForClickable();
  }
}
