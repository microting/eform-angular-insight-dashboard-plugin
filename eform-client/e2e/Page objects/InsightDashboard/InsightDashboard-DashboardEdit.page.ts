import Page from '../Page';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';
export const locationName = 'Location 1';

export class InsightDashboardDashboardEditPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#dashboardItem').length;
  }

  public get initialItemCreateBtn() {
    return browser.element('#initialItemCreateBtn');
  }

  public get dashboardUpdateSaveBtn() {
    return browser.element('#dashboardUpdateSaveBtn');
  }

  public get dashboardUpdateSaveCancelBtn() {
    return browser.element('#dashboardUpdateSaveCancelBtn');
  }

  public get dashboardName() {
    return browser.element('#dashboardNameCreate');
  }

  createFirstItem() {
    this.initialItemCreateBtn.click();
    browser.pause(4000);
  }

  createItem(rowObject: DashboardsEditItemObject) {
    rowObject.itemCreateBtn.click();
    browser.pause(4000);
  }

  deleteItem(rowObject: DashboardsEditItemObject) {
    rowObject.itemDeleteBtn.click();
    browser.pause(4000);
  }

  copyItem(rowObject: DashboardsEditItemObject) {
    rowObject.itemCopyBtn.click();
    browser.pause(4000);
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
    if ($$('#editFirstQuestion')[rowNum - 1]) {
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
