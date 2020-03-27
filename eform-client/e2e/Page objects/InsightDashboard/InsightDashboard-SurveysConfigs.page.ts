import Page from '../Page';
import installationPage from '../InstallationChecking/InstallationChecking-Installation.page';

export const configName = 'Test-Set';

export class InsightDashboardSurveysConfigsPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  public get surveyConfigCreateBtn() {
    return browser.element('#createSurveyConfigBtn');
  }

  public get surveyConfigCreateSaveBtn() {
    return browser.element('#surveyConfigCreateSaveBtn');
  }

  public get surveyConfigCreateCancelBtn() {
    return browser.element('#surveyConfigCreateSaveCancelBtn');
  }

  public get surveyConfigEditSaveBtn() {
    return browser.element('#surveyConfigEditSaveBtn');
  }

  public get surveyConfigEditCancelBtn() {
    return browser.element('#surveyConfigEditSaveCancelBtn');
  }

  private surveyConfigLocationEditCheckbox(num: number) {
    return browser.element(`#checkboxEdit${num}`);
  }

  private surveyConfigLocationCreateCheckbox(num: number) {
    return browser.element(`#checkboxCreate${num}`);
  }

  public get surveyConfigDeleteSaveBtn() {
    return browser.element('#surveyConfigDeleteSaveBtn');
  }

  public get surveyConfigDeleteCancelBtn() {
    return browser.element('#surveyConfigDeleteCancelBtn');
  }

  public get installationDeleteCancelBtn() {
    return browser.element('#surveyConfigDeleteCancelBtn');
  }

  createSurveyConfig(configName: string) {
    this.surveyConfigCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const searchField = surveyConfigsPage.getSurveysSearchField();
    searchField.addValue(configName);
    const listChoices = surveyConfigsPage.getSurveyListOfChoices();
    const choice = listChoices[0];
    $('#spinner-animation').waitForDisplayed(90000, true);
    choice.click();
    browser.pause(1000);
    this.surveyConfigCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  createSurveyConfig_Cancels() {
    this.surveyConfigCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.surveyConfigCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  updateSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    rowObject.editSurveyConfigBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.surveyConfigLocationEditCheckbox(1).click();
    this.surveyConfigLocationEditCheckbox(2).click();
    browser.pause(1000);
    this.surveyConfigEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  updateSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    rowObject.editSurveyConfigBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.surveyConfigEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }


  deleteSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    rowObject.surveyConfigDeleteBtn.click();
    browser.pause(1000);
    this.surveyConfigDeleteSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  deleteSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    rowObject.surveyConfigDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.surveyConfigDeleteCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
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

  public getSurveysSearchField() {
    return browser.element('#selectSurveyCreate .ng-input > input');
  }

  public getSurveyListOfChoices() {
    return browser.$$('#selectSurveyCreate .ng-option');
  }

  getFirstRowObject(): SurveysConfigPageRowObject {
    return new SurveysConfigPageRowObject(1);
  }

  getSurveyConfig(num): SurveysConfigPageRowObject {
    return new SurveysConfigPageRowObject(num);
  }
}

const surveyConfigsPage = new InsightDashboardSurveysConfigsPage();
export default surveyConfigsPage;

export class SurveysConfigPageRowObject {
  constructor(rowNum) {
    if ($$('#surveyConfigId')[rowNum - 1]) {
      this.id = $$('#surveyConfigId')[rowNum - 1];
      try {
        this.surveyName = $$('#surveyConfigName')[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.locations = $$('#surveyConfigLocation > p')[rowNum - 1];
      } catch (e) {
      }
      // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.editSurveyConfigBtn = $$('#editSurveyConfigBtn')[rowNum - 1];
      this.surveyConfigDeleteBtn = $$('#surveyConfigDeleteBtn')[rowNum - 1];
      this.surveyConfigActivateBtn = $$('#surveyConfigActivateBtn')[rowNum - 1];
    }
  }

  public id;
  public surveyName;
  public locations;
  public editSurveyConfigBtn;
  public surveyConfigDeleteBtn;
  public surveyConfigActivateBtn;
}
