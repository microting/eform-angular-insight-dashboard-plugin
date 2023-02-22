import Page from '../Page';

export class InsightDashboardDashboardEditPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#dashboardItem')).length;
  }

  public async initialItemCreateBtn() {
    const ele = await $('#initialItemCreateBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardUpdateSaveBtn() {
    const ele = await $('#dashboardUpdateSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardUpdateSaveCancelBtn() {
    const ele = await $('#dashboardUpdateSaveCancelBtn');
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

  public async dashboardRangeToTodayCheckbox() {
    const ele = await $('#rangeToTodayCheckbox label');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dateRange() {
    const ele = await $('#dateRange');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async firstQuestionSearchField(rowNum: number) {
    const ele = await $(`#editFirstQuestion${rowNum} .ng-input > input`);
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async firstQuestionListOfOptions(rowNum: number) {
    return $$(`#editFirstQuestion${rowNum} .ng-option`);
  }

  public async filterQuestion(rowNum: number) {
    return $(`#editFilterQuestion${rowNum}`);
  }

  public async filterQuestionSearchField(rowNum: number) {
    return $(`#editFilterQuestion${rowNum} .ng-input > input`);
  }

  public async filterQuestionListOfOptions(rowNum: number) {
    return $$(`#editFilterQuestion${rowNum} .ng-option`);
  }

  public async filterAnswer(rowNum: number) {
    return $(`#editFilterAnswer${rowNum}`);
  }

  public async filterAnswerSearchField(rowNum: number) {
    return $(`#editFilterAnswer${rowNum} .ng-input > input`);
  }

  public async filterAnswerListOfOptions(rowNum: number) {
    return $$(`#editFilterAnswer${rowNum} .ng-option`);
  }

  public async period(rowNum: number) {
    return $(`#editPeriod${rowNum}`);
  }

  public async calculateAverageCheckbox(rowNum: number) {
    const ele = await $(`#calcAverageCheckbox${rowNum} label`);
    await ele.waitForDisplayed({timeout: 30000});
    return ele;
  }

  public async enableCompareCheckbox(rowNum: number) {
    const ele = await $(`#enableCompare${rowNum} label`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async enableIgnoreCheckbox(rowNum: number) {
    return $(`#enableIgnoreCheckbox${rowNum}`);
  }

  public async answerIgnoreCheckbox(rowNum: number, ignoredAnswerId: number) {
    return $(`#ignoreCheckbox${ignoredAnswerId}_${rowNum} label`);
  }

  public async compareItemInput(rowNum: number, compareItemIndex: number) {
    return $(`#locationTag${rowNum}_${compareItemIndex}`);
  }

  public async periodSearchField(rowNum: number) {
    return $(`#editPeriod${rowNum} .ng-input > input`);
  }

  public async periodListOfOptions(rowNum: number) {
    return $$(`#editPeriod${rowNum} .ng-option`);
  }

  public async chartType(rowNum: number) {
    return $(`#editChartType${rowNum}`);
  }

  public async chartTypeSearchField(rowNum: number) {
    return $(`#editChartType${rowNum} .ng-input > input`);
  }

  public async chartTypeListOfOptions(rowNum: number) {
    return $$(`#editChartType${rowNum} .ng-option`);
  }


  public async getLocationTagSearchField() {
    const ele = await $('#selectLocationTag .ng-input > input');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getLocationTagListOfChoices() {
    const ele = await $$('#selectLocationTag .ng-option');
    await ele[0].waitForDisplayed({timeout: 30000});
    await ele[0].waitForClickable({timeout: 30000});
    return ele;
  }

  async setDashboardSettings(model: DashboardTestConfigEditModel) {
    await this.waitForSpinnerHide();

    // Set date from and date to
    if (model.dateRange) {
      await (await this.dateRange()).addValue(model.dateRange);
    }

    // Set today
    if (model.today) {
      await (await this.dashboardRangeToTodayCheckbox()).click();
    }

    const locationSearchField = await this.getLocationTagSearchField();
    await locationSearchField.addValue(model.locationTagName);
    const locationListChoices = await this.getLocationTagListOfChoices();
    const locationChoice = locationListChoices[0];
    await this.waitForSpinnerHide();
    await locationChoice.click();

    await this.waitForSpinnerHide();
  }

  async createFirstItem() {
    await (await this.initialItemCreateBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async createItem(rowObject: InsightDashboardEditRowObject) {
    await (await rowObject.itemCreateBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async deleteItem(rowObject: InsightDashboardEditRowObject) {
    await (await rowObject.itemDeleteBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async copyItem(rowObject: InsightDashboardEditRowObject) {
    await (await rowObject.itemCopyBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }

  async fillItem(rowNum: number, itemObject: DashboardTestItemEditModel) {
    // Select first question
    await (await this.firstQuestionSearchField(rowNum)).addValue(itemObject.firstQuestion);
    const firstQuestionChoice = (await this.firstQuestionListOfOptions(rowNum))[0];
    await this.waitForSpinnerHide();
    await firstQuestionChoice.click();
    await this.waitForSpinnerHide();
    // Select filter question
    if (itemObject.filterQuestion) {
      await (await (this.filterQuestionSearchField(rowNum))).addValue(itemObject.filterQuestion);
      const filterQuestionChoice = (await this.filterQuestionListOfOptions(rowNum))[0];
      await this.waitForSpinnerHide();
      await filterQuestionChoice.click();
      await this.waitForSpinnerHide();
    }

    // Select filter answer
    if (itemObject.filterAnswer) {
      await (await this.filterAnswerSearchField(rowNum)).addValue(itemObject.filterAnswer);
      const filterAnswerChoice = (await this.filterAnswerListOfOptions(rowNum))[0];
      await this.waitForSpinnerHide();
      await filterAnswerChoice.click();
      await this.waitForSpinnerHide();
    }

    // Select period
    await (await this.periodSearchField(rowNum)).addValue(itemObject.period);
    // tslint:disable-next-line:max-line-length
    const periodChoice = itemObject.period === 'År' ? (await this.periodListOfOptions(rowNum))[2] : (await this.periodListOfOptions(rowNum))[0];
    await this.waitForSpinnerHide();
    await periodChoice.click();
    await this.waitForSpinnerHide();

    // Select calculate average
    if (itemObject.calculateAverage) {
      await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
      const ele = await this.calculateAverageCheckbox(rowNum);
      await ele.waitForDisplayed({timeout: 20000});
      await ele.waitForClickable({timeout: 20000});
      await ele.click();
    }

    // Ignored answers
    for (const ignoredAnswerId of itemObject.ignoredAnswerIds) {
      const ele = await this.answerIgnoreCheckbox(rowNum, ignoredAnswerId);
      await ele.waitForDisplayed({timeout: 20000});
      await ele.waitForClickable({timeout: 20000});
      await ele.click();
    }

    // Compared items
    if (itemObject.comparedItems.length) {
      await (await this.enableCompareCheckbox(rowNum)).click();
      for (const compareItem of itemObject.comparedItems) {
        await (await this.compareItemInput(rowNum, compareItem.itemIndex)).addValue(compareItem.value);
      }
    }

    // Select chart type
    await (await this.chartTypeSearchField(rowNum)).addValue(itemObject.chartType);
    const chartTypeChoice = (await this.chartTypeListOfOptions(rowNum))[0];
    await chartTypeChoice.waitForDisplayed({timeout: 30000});
    await chartTypeChoice.waitForClickable({timeout: 30000});
    await chartTypeChoice.click();
  }

  async generateItems(itemsArray: DashboardTestItemEditModel[]) {
    await this.createFirstItem();
    for (let i = 0; i < itemsArray.length; i++) {
      await this.fillItem(i + 1, itemsArray[i]);
      if (i < itemsArray.length - 1) {
        await this.createItem(await this.getDashboardItem(i + 1));
      }
    }
  }

  async getFirstItemObject(): Promise<InsightDashboardEditRowObject> {
    await browser.pause(500);
    const obj = new InsightDashboardEditRowObject();
    return await obj.getRow(1);
  }

  async getDashboardItem(num): Promise<InsightDashboardEditRowObject> {
    await browser.pause(500);
    const obj = new InsightDashboardEditRowObject();
    return obj.getRow(num);
  }
}

const dashboardsEditPage = new InsightDashboardDashboardEditPage();
export default dashboardsEditPage;

export class InsightDashboardEditRowObject {
  constructor() {}

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

  async getRow(rowNum: number): Promise<InsightDashboardEditRowObject> {
    this.firstQuestion = (await $$('#editFirstQuestion'))[rowNum - 1];
    this.firstQuestionSearchField = (await $$('#editFirstQuestion .ng-input > input'))[rowNum - 1];
    this.firstQuestionListOfOptions = (await $$('#editFirstQuestion .ng-option'))[rowNum - 1];

    this.filterQuestion = (await $$('#editFilterQuestion'))[rowNum - 1];
    this.filterQuestionSearchField = (await $$('#editFilterQuestion .ng-input > input'))[rowNum - 1];
    this.filterQuestionListOfOptions = (await $$('#editFilterQuestion .ng-option'))[rowNum - 1];

    this.filterAnswer = (await $$('#editFilterAnswer'))[rowNum - 1];
    this.filterAnswerSearchField = (await $$('#editFilterAnswer .ng-input > input'))[rowNum - 1];
    this.filterAnswerListOfOptions = (await $$('#editFilterAnswer .ng-option'))[rowNum - 1];

    this.period = (await $$('#editPeriod'))[rowNum - 1];
    this.periodSearchField = (await $$('#editPeriod .ng-input > input'))[rowNum - 1];
    this.periodListOfOptions = (await $$('#editPeriod .ng-option'))[rowNum - 1];

    this.calcAverageCheckbox = (await $$('#calcAverageCheckbox'))[rowNum - 1];

    this.chartType = (await $$('#editChartType'))[rowNum - 1];
    this.chartTypeSearchField = (await $$('#editChartType .ng-input > input'))[rowNum - 1];
    this.chartTypeListOfOptions = (await $$('#editChartType .ng-option'))[rowNum - 1];
    // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`))[rowNum - 1];
    this.itemCreateBtn = (await $$('#createItemBtn'))[rowNum - 1];
    this.itemDeleteBtn = (await $$('#deleteItemBtn'))[rowNum - 1];
    this.itemCopyBtn = (await $$('#copyItemBtn'))[rowNum - 1];
    return this;
  }
}

export interface DashboardTestItemEditModel {
  firstQuestion: string;
  filterQuestion: string;
  filterAnswer: string;
  period: string;
  chartType: string;
  calculateAverage: boolean;
  ignoredAnswerIds: number[];
  comparedItems: { itemIndex: number, value: number }[];
}

export interface DashboardTestConfigEditModel {
  locationTagName: string;
  dateRange: string;
  today: boolean;
}

