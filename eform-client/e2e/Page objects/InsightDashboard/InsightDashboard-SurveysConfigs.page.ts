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
    $('#createSurveyConfigBtn').waitForDisplayed(20000);
    $('#createSurveyConfigBtn').waitForClickable({timeout: 20000});
    return $('#createSurveyConfigBtn');
  }

  public get surveyConfigCreateSaveBtn() {
    $('#surveyConfigCreateSaveBtn').waitForDisplayed(20000);
    $('#surveyConfigCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigCreateSaveBtn');
  }

  public get surveyConfigCreateCancelBtn() {
    $('#surveyConfigCreateSaveCancelBtn').waitForDisplayed(20000);
    $('#surveyConfigCreateSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigCreateSaveCancelBtn');
  }

  public get surveyConfigEditSaveBtn() {
    $('#surveyConfigEditSaveBtn').waitForDisplayed(20000);
    $('#surveyConfigEditSaveBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigEditSaveBtn');
  }

  public get surveyConfigEditCancelBtn() {
    $('#surveyConfigEditSaveCancelBtn').waitForDisplayed(20000);
    $('#surveyConfigEditSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigEditSaveCancelBtn');
  }

  private surveyConfigLocationEditCheckbox(num: number) {
    return $(`#checkboxEdit${num}`);
  }

  private surveyConfigLocationCreateCheckbox(num: number) {
    return $(`#checkboxCreate${num}`);
  }

  public get surveyConfigDeleteSaveBtn() {
    $('#surveyConfigDeleteSaveBtn').waitForDisplayed(20000);
    $('#surveyConfigDeleteSaveBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigDeleteSaveBtn');
  }

  public get surveyConfigDeleteCancelBtn() {
    $('#surveyConfigDeleteCancelBtn').waitForDisplayed(20000);
    $('#surveyConfigDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigDeleteCancelBtn');
  }

  public get installationDeleteCancelBtn() {
    $('#surveyConfigDeleteCancelBtn').waitForDisplayed(20000);
    $('#surveyConfigDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigDeleteCancelBtn');
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
    $('#selectSurveyCreate .ng-input > input').waitForDisplayed(20000);
    $('#selectSurveyCreate .ng-input > input').waitForClickable({timeout: 20000});
    return $('#selectSurveyCreate .ng-input > input');
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
