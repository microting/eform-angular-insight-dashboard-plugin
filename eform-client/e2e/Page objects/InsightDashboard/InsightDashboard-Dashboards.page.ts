import Page from '../Page';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';
export const locationName = 'Location 1';

export class InsightDashboardDashboardsPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  public get dashboardCreateBtn() {
    return browser.element('#createDashboardBtn');
  }

  public get dashboardCreateSaveBtn() {
    return browser.element('#dashboardCreateSaveBtn');
  }

  public get dashboardCreateCancelBtn() {
    return browser.element('#dashboardCreateSaveCancelBtn');
  }

  public get dashboardName() {
    return browser.element('#dashboardNameCreate');
  }

  public get dashboardNameInput() {
    return browser.element('#dashboardNameCreate > input');
  }

  public get dashboardEditSaveBtn() {
    return browser.element('#dashboardEditSaveBtn');
  }

  public get dashboardEditCancelBtn() {
    return browser.element('#dashboardEditSaveCancelBtn');
  }

  public get dashboardDeleteSaveBtn() {
    return browser.element('#dashboardDeleteSaveBtn');
  }

  public get dashboardDeleteCancelBtn() {
    return browser.element('#dashboardDeleteCancelBtn');
  }

  public get dashboardCopySaveBtn() {
    return browser.element('#dashboardCopySaveBtn');
  }

  public get dashboardCopySaveCancelBtn() {
    return browser.element('#dashboardCopySaveCancelBtn');
  }

  createDashboard() {
    this.dashboardCreateBtn.click();
    browser.pause(8000);
    this.dashboardName.click();
    browser.pause(1000);
    this.dashboardName.addValue(dashboardName);
    // Select survey
    const surveySearchField = dashboardsPage.getSurveysSearchField();
    surveySearchField.addValue(configName);
    const surveyListChoices = dashboardsPage.getSurveyListOfChoices();
    const surveyChoice = surveyListChoices[0];
    browser.pause(8000);
    surveyChoice.click();
    // Select location
    const locationSearchField = dashboardsPage.getLocationTagSearchField();
    locationSearchField.addValue(locationName);
    const locationListChoices = dashboardsPage.getLocationTagListOfChoices();
    const locationChoice = locationListChoices[0];
    browser.pause(8000);
    locationChoice.click();
    browser.pause(1000);
    this.dashboardCreateSaveBtn.click();
    browser.pause(8000);
  }

  createDashboard_Cancels() {
    this.dashboardCreateBtn.click();
    browser.pause(8000);
    this.dashboardCreateCancelBtn.click();
    browser.pause(8000);
  }

  deleteDashboard(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardDeleteBtn.click();
    browser.pause(1000);
    this.dashboardDeleteSaveBtn.click();
    browser.pause(8000);
  }

  deleteDashboard_Cancels(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardDeleteBtn.click();
    browser.pause(8000);
    this.dashboardDeleteCancelBtn.click();
    browser.pause(8000);
  }

  copyDashboard(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardCopyBtn.click();
    browser.pause(5000);
    this.dashboardCopySaveBtn.click();
    browser.pause(15000);
  }

  copyDashboard_Cancel(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardCopyBtn.click();
    browser.pause(5000);
    this.dashboardCopySaveCancelBtn.click();
    browser.pause(15000);
  }

  public getSurveysSearchField() {
    return browser.element('#selectSurveyCreate .ng-input > input');
  }

  public getSurveyListOfChoices() {
    return browser.$$('#selectSurveyCreate .ng-option');
  }

  public getLocationTagSearchField() {
    return browser.element('#selectLocationTag .ng-input > input');
  }

  public getLocationTagListOfChoices() {
    return browser.$$('#selectLocationTag .ng-option');
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
