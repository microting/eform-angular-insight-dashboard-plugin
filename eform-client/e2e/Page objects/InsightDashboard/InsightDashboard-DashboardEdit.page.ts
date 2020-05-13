import Page from '../Page';
import dashboardsPage, {configName} from './InsightDashboard-Dashboards.page';

export const locationName = 'Location 1';

export class InsightDashboardDashboardEditPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#dashboardItem').length;
  }

  public get initialItemCreateBtn() {
    $('#initialItemCreateBtn').waitForDisplayed({timeout: 30000});
    $('#initialItemCreateBtn').waitForClickable({timeout: 20000});
    return $('#initialItemCreateBtn');
  }

  public get dashboardUpdateSaveBtn() {
    $('#dashboardUpdateSaveBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardUpdateSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardUpdateSaveBtn');
  }

  public get dashboardUpdateSaveCancelBtn() {
    $('#dashboardUpdateSaveCancelBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardUpdateSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardUpdateSaveCancelBtn');
  }

  public get dashboardName() {
    $('#dashboardNameCreate').waitForDisplayed({timeout: 30000});
    $('#dashboardNameCreate').waitForClickable({timeout: 20000});
    return $('#dashboardNameCreate');
  }

  public firstQuestionSearchField(rowNum: number) {
    const ele = $(`#editFirstQuestion${rowNum} .ng-input > input`);
    ele.waitForDisplayed({timeout: 20000});
    return ele;
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

  public calculateAverageCheckbox(rowNum: number) {
    return $(`#calculateAverageCheckbox${rowNum}`);
  }

  public enableIgnoreCheckbox(rowNum: number) {
    return $(`#enableIgnoreCheckbox${rowNum}`);
  }

  public answerIgnoreCheckbox(rowNum: number, ignoredAnswerId: number) {
    return $(`#answerIgnoreCheckbox${ignoredAnswerId}_${rowNum}`);
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
    $('#selectLocationTag .ng-input > input').waitForDisplayed({timeout: 30000});
    $('#selectLocationTag .ng-input > input').waitForClickable({timeout: 20000});
    return $('#selectLocationTag .ng-input > input');
  }

  public getLocationTagListOfChoices() {
    const ele = $$('#selectLocationTag .ng-option');
    ele[0].waitForDisplayed({timeout: 30000});
    ele[0].waitForClickable({timeout: 30000});
    return ele;
  }

  selectFirstLocation() {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const locationSearchField = this.getLocationTagSearchField();
    locationSearchField.addValue(locationName);
    const locationListChoices = this.getLocationTagListOfChoices();
    const locationChoice = locationListChoices[0];
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    locationChoice.click();

    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  createFirstItem() {
    this.selectFirstLocation();
    this.initialItemCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  createItem(rowObject: InsightDashboardEditRowObject) {
    rowObject.itemCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  deleteItem(rowObject: InsightDashboardEditRowObject) {
    rowObject.itemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  copyItem(rowObject: InsightDashboardEditRowObject) {
    rowObject.itemCopyBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  fillItem(rowNum: number, itemObject: DashboardTestItemEditModel) {
    // Select first question
    this.firstQuestionSearchField(rowNum).addValue(itemObject.firstQuestion);
    const firstQuestionChoice = this.firstQuestionListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    firstQuestionChoice.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    // Select filter question
    if (itemObject.filterQuestion) {
      this.filterQuestionSearchField(rowNum).addValue(itemObject.filterQuestion);
      const filterQuestionChoice = this.filterQuestionListOfOptions(rowNum)[0];
      $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
      filterQuestionChoice.click();
      $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    }

    // Select filter answer
    if (itemObject.filterAnswer) {
      this.filterAnswerSearchField(rowNum).addValue(itemObject.filterAnswer);
      const filterAnswerChoice = this.filterAnswerListOfOptions(rowNum)[0];
      $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
      filterAnswerChoice.click();
      $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    }

    // Select period
    this.periodSearchField(rowNum).addValue(itemObject.period);
    const periodChoice = itemObject.period === 'År' ? this.periodListOfOptions(rowNum)[1] : this.periodListOfOptions(rowNum)[0];
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    periodChoice.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});

    // Select calculate average
    if (itemObject.calculateAverage) {
      $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
      this.calculateAverageCheckbox(rowNum).click();
    }

    // Ignored answers
    for (const ignoredAnswerId of itemObject.ignoredAnswerIds) {
      this.answerIgnoreCheckbox(rowNum, ignoredAnswerId).click();
    }

    // Select chart type
    this.chartTypeSearchField(rowNum).addValue(itemObject.chartType);
    browser.pause(2000);
    const chartTypeChoice = this.chartTypeListOfOptions(rowNum)[0];
    chartTypeChoice.click();
  }

  generateItems(itemsArray: DashboardTestItemEditModel[]) {
    this.createFirstItem();
    for (let i = 0; i < itemsArray.length; i++) {
      this.fillItem(i + 1, itemsArray[i]);
      if (i < itemsArray.length - 1) {
        this.createItem(this.getDashboardItem(i + 1));
      }
    }
  }

  getFirstItemObject(): InsightDashboardEditRowObject {
    return new InsightDashboardEditRowObject(1);
  }

  getDashboardItem(num): InsightDashboardEditRowObject {
    return new InsightDashboardEditRowObject(num);
  }
}

const dashboardsEditPage = new InsightDashboardDashboardEditPage();
export default dashboardsEditPage;

export class InsightDashboardEditRowObject {
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

    this.calcAverageCheckbox = $$('#calcAverageCheckbox')[rowNum - 1];

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
  public calcAverageCheckbox;
  public chartType;
  public chartTypeSearchField;
  public chartTypeListOfOptions;
  public itemCreateBtn;
  public itemDeleteBtn;
  public itemCopyBtn;
}

export interface DashboardTestItemEditModel {
  firstQuestion: string;
  filterQuestion: string;
  filterAnswer: string;
  period: string;
  chartType: string;
  calculateAverage: boolean;
  ignoredAnswerIds: number[];
}
