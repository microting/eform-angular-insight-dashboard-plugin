import Page from '../Page';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';

export class InsightDashboardDashboardsPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  public get dashboardCreateBtn() {
    $('#createDashboardBtn').waitForDisplayed(20000);
    $('#createDashboardBtn').waitForClickable({timeout: 20000});
    return $('#createDashboardBtn');
  }

  public get dashboardCreateSaveBtn() {
    $('#dashboardCreateSaveBtn').waitForDisplayed(20000);
    $('#dashboardCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCreateSaveBtn');
  }

  public get dashboardCreateCancelBtn() {
    $('#dashboardCreateSaveCancelBtn').waitForDisplayed(20000);
    $('#dashboardCreateSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCreateSaveCancelBtn');
  }

  public get dashboardName() {
    $('#dashboardNameCreate').waitForDisplayed(20000);
    $('#dashboardNameCreate').waitForClickable({timeout: 20000});
    return $('#dashboardNameCreate');
  }

  public get dashboardNameInput() {
    $('#dashboardNameCreate > input').waitForDisplayed(20000);
    $('#dashboardNameCreate > input').waitForClickable({timeout: 20000});
    return $('#dashboardNameCreate > input');
  }

  public get dashboardEditSaveBtn() {
    $('#dashboardEditSaveBtn').waitForDisplayed(20000);
    $('#dashboardEditSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardEditSaveBtn');
  }

  public get dashboardEditCancelBtn() {
    $('#dashboardEditSaveCancelBtn').waitForDisplayed(20000);
    $('#dashboardEditSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardEditSaveCancelBtn');
  }

  public get dashboardDeleteSaveBtn() {
    $('#dashboardDeleteSaveBtn').waitForDisplayed(20000);
    $('#dashboardDeleteSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardDeleteSaveBtn');
  }

  public get dashboardDeleteCancelBtn() {
    $('#dashboardDeleteCancelBtn').waitForDisplayed(20000);
    $('#dashboardDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardDeleteCancelBtn');
  }

  public get dashboardCopySaveBtn() {
    $('#dashboardCopySaveBtn').waitForDisplayed(20000);
    $('#dashboardCopySaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCopySaveBtn');
  }

  public get dashboardCopySaveCancelBtn() {
    $('#dashboardCopySaveCancelBtn').waitForDisplayed(20000);
    $('#dashboardCopySaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCopySaveCancelBtn');
  }

  createDashboard() {
    this.dashboardCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.dashboardName.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.dashboardName.addValue(dashboardName);
    // Select survey
    const surveySearchField = dashboardsPage.getSurveysSearchField();
    surveySearchField.addValue(configName);
    const surveyListChoices = dashboardsPage.getSurveyListOfChoices();
    const surveyChoice = surveyListChoices[0];
    $('#spinner-animation').waitForDisplayed(90000, true);
    surveyChoice.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.dashboardCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  createDashboard_Cancels() {
    this.dashboardCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.dashboardCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  deleteDashboard(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.dashboardDeleteSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  deleteDashboard_Cancels(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.dashboardDeleteCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  copyDashboard(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardCopyBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.dashboardCopySaveBtn.click();
    browser.pause(15000);
  }

  copyDashboard_Cancel(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardCopyBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.dashboardCopySaveCancelBtn.click();
    browser.pause(15000);
  }

  public getSurveysSearchField() {
    $('#selectSurveyCreate .ng-input > input').waitForDisplayed(20000);
    $('#selectSurveyCreate .ng-input > input').waitForClickable({timeout: 20000});
    return $('#selectSurveyCreate .ng-input > input');
  }

  public getSurveyListOfChoices() {
    return $$('#selectSurveyCreate .ng-option');
  }

  getFirstRowObject(): DashboardsPageRowObject {
    return new DashboardsPageRowObject(1);
  }

  getDashboard(num): DashboardsPageRowObject {
    return new DashboardsPageRowObject(num);
  }
}

const dashboardsPage = new InsightDashboardDashboardsPage();
export default dashboardsPage;

export class DashboardsPageRowObject {
  constructor(rowNum) {
    if ($$('#dashboardId')[rowNum - 1]) {
      this.id = $$('#dashboardId')[rowNum - 1];
      try {
        this.dashboardName = $$('#dashboardName')[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.locations = $$('#dashboardLocation > p')[rowNum - 1];
      } catch (e) {
      }
      // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.dashboardEditBtn = $$('#dashboardEditBtn')[rowNum - 1];
      this.dashboardViewBtn = $$('#dashboardViewBtn')[rowNum - 1];
      this.dashboardDeleteBtn = $$('#dashboardDeleteBtn')[rowNum - 1];
      this.dashboardCopyBtn = $$('#dashboardCopyBtn')[rowNum - 1];
    }
  }

  public id;
  public dashboardName;
  public locations;
  public dashboardViewBtn;
  public dashboardEditBtn;
  public dashboardDeleteBtn;
  public dashboardCopyBtn;
}
