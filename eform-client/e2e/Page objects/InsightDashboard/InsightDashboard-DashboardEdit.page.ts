import Page from '../Page';
import dashboardsPage, {configName} from './InsightDashboard-Dashboards.page';

export const firstQuestion = 'Q2';
export const filterQuestion = 'Q3';
export const filterAnswer = 'smiley1';
export const period = 'Måned';
export const chartType = 'Linje';
export const locationName = 'Location 1';

export class InsightDashboardDashboardEditPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#dashboardItem').length;
  }

  public get initialItemCreateBtn() {
    $('#initialItemCreateBtn').waitForDisplayed(20000);
    $('#initialItemCreateBtn').waitForClickable({timeout: 20000});
    return $('#initialItemCreateBtn');
  }

  public get dashboardUpdateSaveBtn() {
    $('#dashboardUpdateSaveBtn').waitForDisplayed(20000);
    $('#dashboardUpdateSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardUpdateSaveBtn');
  }

  public get dashboardUpdateSaveCancelBtn() {
    $('#dashboardUpdateSaveCancelBtn').waitForDisplayed(20000);
    $('#dashboardUpdateSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardUpdateSaveCancelBtn');
  }

  public get dashboardName() {
    $('#dashboardNameCreate').waitForDisplayed(20000);
    $('#dashboardNameCreate').waitForClickable({timeout: 20000});
    return $('#dashboardNameCreate');
  }

  public firstQuestionSearchField(rowNum: number) {
    return $(`#editFirstQuestion${rowNum} .ng-input > input`);
  }

  public firstQuestionListOfOptions(rowNum: number) {
    return $$(`#editFirstQuestion${rowNum} .ng-option`);
  }

  public filterQuestion(rowNum: number) {
    return $(`#editFilterQuestion${rowNum}`);
  }

  public filterQuestionSearchField(rowNum: number) {
    return $(`#editFilterQuestion${rowNum} .ng-input > input`);
  }

  public filterQuestionListOfOptions(rowNum: number) {
    return $$(`#editFilterQuestion${rowNum} .ng-option`);
  }

  public filterAnswer(rowNum: number) {
    return $(`#editFilterAnswer${rowNum}`);
  }

  public filterAnswerSearchField(rowNum: number) {
    return $(`#editFilterAnswer${rowNum} .ng-input > input`);
  }

  public filterAnswerListOfOptions(rowNum: number) {
    return $$(`#editFilterAnswer${rowNum} .ng-option`);
  }

  public period(rowNum: number) {
    return $(`#editPeriod${rowNum}`);
  }

  public periodSearchField(rowNum: number) {
    return $(`#editPeriod${rowNum} .ng-input > input`);
  }

  public periodListOfOptions(rowNum: number) {
    return $$(`#editPeriod${rowNum} .ng-option`);
  }

  public chartType(rowNum: number) {
    return $(`#editChartType${rowNum}`);
  }

  public chartTypeSearchField(rowNum: number) {
    return $(`#editChartType${rowNum} .ng-input > input`);
  }

  public chartTypeListOfOptions(rowNum: number) {
    return $$(`#editChartType${rowNum} .ng-option`);
  }


  public getLocationTagSearchField() {
    $('#selectLocationTag .ng-input > input').waitForDisplayed(20000);
    $('#selectLocationTag .ng-input > input').waitForClickable({timeout: 20000});
    return $('#selectLocationTag .ng-input > input');
  }

  public getLocationTagListOfChoices() {
    return $$('#selectLocationTag .ng-option');
  }

  selectFirstLocation() {
    pause(3000);
    const locationSearchField = this.getLocationTagSearchField();
    locationSearchField.addValue(locationName);
    const locationListChoices = this.getLocationTagListOfChoices();
    const locationChoice = locationListChoices[0];
    $('#spinner-animation').waitForDisplayed(90000, true);
    locationChoice.click();
    pause(3000);
  }

  createFirstItem() {
    this.selectFirstLocation();
    this.initialItemCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  createItem(rowObject: DashboardsEditItemObject) {
    rowObject.itemCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  deleteItem(rowObject: DashboardsEditItemObject) {
    rowObject.itemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  copyItem(rowObject: DashboardsEditItemObject) {
    rowObject.itemCopyBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  fillItem(rowNum: number) {
    // Select first question
    this.firstQuestionSearchField(rowNum).addValue(firstQuestion);
    const firstQuestionChoice = this.firstQuestionListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed(20000, true);
    firstQuestionChoice.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // Select filter question
    this.filterQuestionSearchField(rowNum).addValue(filterQuestion);
    const filterQuestionChoice = this.filterQuestionListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed(20000, true);
    filterQuestionChoice.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // Select filter answer
    this.filterAnswerSearchField(rowNum).addValue(filterAnswer);
    const filterAnswerChoice = this.filterAnswerListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed(20000, true);
    filterAnswerChoice.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // Select period
    this.periodSearchField(rowNum).addValue(period);
    const periodChoice = this.periodListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed(20000, true);
    periodChoice.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // Select chart type
    this.chartTypeSearchField(rowNum).addValue(chartType);
    const chartTypeChoice = this.chartTypeListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed(20000, true);
    chartTypeChoice.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  getFirstItemObject(): DashboardsEditItemObject {
    return new DashboardsEditItemObject(1);
  }

  getDashboardItem(num): DashboardsEditItemObject {
    return new DashboardsEditItemObject(num);
  }
}

const dashboardsEditPage = new InsightDashboardDashboardEditPage();
export default dashboardsEditPage;

export class DashboardsEditItemObject {
  constructor(rowNum) {
    this.firstQuestion = $$('#editFirstQuestion')[rowNum - 1];
    this.firstQuestionSearchField = $$('#editFirstQuestion .ng-input > input')[rowNum - 1];
    this.firstQuestionListOfOptions = $$('#editFirstQuestion .ng-option')[rowNum - 1];

    this.filterQuestion = $$('#editFilterQuestion')[rowNum - 1];
    this.filterQuestionSearchField = $$('#editFilterQuestion .ng-input > input')[rowNum - 1];
    this.filterQuestionListOfOptions = $$('#editFilterQuestion .ng-option')[rowNum - 1];

    this.filterAnswer = $$('#editFilterAnswer')[rowNum - 1];
    this.filterAnswerSearchField = $$('#editFilterAnswer .ng-input > input')[rowNum - 1];
    this.filterAnswerListOfOptions = $$('#editFilterAnswer .ng-option')[rowNum - 1];

    this.period = $$('#editPeriod')[rowNum - 1];
    this.periodSearchField = $$('#editPeriod .ng-input > input')[rowNum - 1];
    this.periodListOfOptions = $$('#editPeriod .ng-option')[rowNum - 1];

    this.chartType = $$('#editChartType')[rowNum - 1];
    this.chartTypeSearchField = $$('#editChartType .ng-input > input')[rowNum - 1];
    this.chartTypeListOfOptions = $$('#editChartType .ng-option')[rowNum - 1];
    // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
    this.itemCreateBtn = $$('#createItemBtn')[rowNum - 1];
    this.itemDeleteBtn = $$('#deleteItemBtn')[rowNum - 1];
    this.itemCopyBtn = $$('#copyItemBtn')[rowNum - 1];
  }

  public firstQuestion;
  public firstQuestionSearchField;
  public firstQuestionListOfOptions;
  public filterQuestion;
  public filterQuestionSearchField;
  public filterQuestionListOfOptions;
  public filterAnswer;
  public filterAnswerSearchField;
  public filterAnswerListOfOptions;
  public period;
  public periodSearchField;
  public periodListOfOptions;
  public chartType;
  public chartTypeSearchField;
  public chartTypeListOfOptions;
  public itemCreateBtn;
  public itemDeleteBtn;
  public itemCopyBtn;
}
