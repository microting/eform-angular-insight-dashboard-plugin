import {
  selectValueInNgSelector,
  selectValueInNgSelectorWithSeparateValueAndSearchValue,
  selectDateRangeOnDatePicker
} from './InsightDashboard-SurveysConfigs.page';

export interface DashboardTestItemEditModel {
  firstQuestion: string;
  firstQuestionForSelect: string;
  filterQuestion: string;
  filterQuestionForSelect: string;
  filterAnswer: string;
  period: string;
  chartType: string;
  calculateAverage: boolean;
  ignoredAnswerIds: number[];
  comparedItems: { itemIndex: number, value: number }[];
}

export interface DashboardTestConfigEditModel {
  locationTagName: string;
  dateRange?: {
    yearFrom: number,
    monthFrom: number,
    dayFrom: number,
    yearTo: number,
    monthTo: number,
    dayTo: number,
  };
  today: boolean;
}

class InsightDashboardDashboardEditPage {

  rowNum(): Cypress.Chainable<number> {
    cy.wait(500);
    return cy.get('#dashboardItem').its('length');
  }

  initialItemCreateBtn() {
    return cy.get('#initialItemCreateBtn').should('be.visible');
  }

  dashboardUpdateSaveBtn() {
    return cy.get('#dashboardUpdateSaveBtn').should('be.visible');
  }

  dashboardUpdateSaveCancelBtn() {
    return cy.get('#dashboardUpdateSaveCancelBtn').should('be.visible');
  }

  dashboardName() {
    return cy.get('#dashboardNameCreate').should('be.visible');
  }

  dashboardRangeToTodayCheckbox() {
    return cy.get('#rangeToTodayCheckbox label').should('be.visible');
  }

  dateRange() {
    return cy.get('mat-date-range-input').should('be.visible');
  }

  calculateAverageCheckbox(rowNum: number) {
    return cy.get(`#calcAverageCheckbox${rowNum} label`).should('be.visible');
  }

  enableCompareCheckbox(rowNum: number) {
    return cy.get(`#enableCompare${rowNum} label`).should('be.visible');
  }

  answerIgnoreCheckbox(rowNum: number, ignoredAnswerId: number) {
    return cy.get(`#ignoreCheckbox${ignoredAnswerId}_${rowNum} label`).should('be.visible');
  }

  compareItemInput(rowNum: number, compareItemIndex: number) {
    return cy.get(`#locationTag${rowNum}_${compareItemIndex}`);
  }

  setDashboardSettings(model: DashboardTestConfigEditModel) {
    this.dateRange().click();
    if (model.dateRange) {
      selectDateRangeOnDatePicker(
        model.dateRange.yearFrom,
        model.dateRange.monthFrom,
        model.dateRange.dayFrom,
        model.dateRange.yearTo,
        model.dateRange.monthTo,
        model.dateRange.dayTo,
      );
    }
    if (model.today) {
      this.dashboardRangeToTodayCheckbox().click();
    }
    selectValueInNgSelector('#selectLocationTag', model.locationTagName);
  }

  createFirstItem() {
    this.initialItemCreateBtn().click();
  }

  createItem(rowNum: number) {
    cy.get('#createItemBtn').eq(rowNum - 1).click();
  }

  deleteItem(rowNum: number) {
    cy.get('#deleteItemBtn').eq(rowNum - 1).click();
  }

  copyItem(rowNum: number) {
    cy.get('#copyItemBtn').eq(rowNum - 1).click();
  }

  fillItem(rowNum: number, itemObject: DashboardTestItemEditModel) {
    selectValueInNgSelectorWithSeparateValueAndSearchValue(
      `#editFirstQuestion${rowNum}`,
      itemObject.firstQuestion,
      itemObject.firstQuestionForSelect
    );

    if (itemObject.filterQuestion) {
      selectValueInNgSelectorWithSeparateValueAndSearchValue(
        `#editFilterQuestion${rowNum}`,
        itemObject.filterQuestion,
        itemObject.filterQuestionForSelect
      );
    }

    if (itemObject.filterAnswer) {
      selectValueInNgSelector(`#editFilterAnswer${rowNum}`, itemObject.filterAnswer);
    }

    selectValueInNgSelector(`#editPeriod${rowNum}`, itemObject.period);

    if (itemObject.calculateAverage) {
      this.calculateAverageCheckbox(rowNum).click();
    }

    for (const ignoredAnswerId of itemObject.ignoredAnswerIds) {
      this.answerIgnoreCheckbox(rowNum, ignoredAnswerId).click();
    }

    if (itemObject.comparedItems.length) {
      this.enableCompareCheckbox(rowNum).click();
      for (const compareItem of itemObject.comparedItems) {
        this.compareItemInput(rowNum, compareItem.itemIndex).type(String(compareItem.value));
      }
    }

    selectValueInNgSelector(`#editChartType${rowNum}`, itemObject.chartType);
  }

  generateItems(itemsArray: DashboardTestItemEditModel[]) {
    this.createFirstItem();
    for (let i = 0; i < itemsArray.length; i++) {
      this.fillItem(i + 1, itemsArray[i]);
      if (i < itemsArray.length - 1) {
        this.createItem(i + 1);
      }
    }
  }
}

const dashboardEditPage = new InsightDashboardDashboardEditPage();
export default dashboardEditPage;
