import { Page } from '@playwright/test';
import {
  selectValueInNgSelector,
  selectValueInNgSelectorWithSeparateValueAndSearchValue,
  selectDateRangeOnNewDatePicker,
} from '../../helper-functions';

export class InsightDashboardDashboardEditPage {
  constructor(private page: Page) {}

  async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('#dashboardItem').count();
  }

  public get initialItemCreateBtn() {
    return this.page.locator('#initialItemCreateBtn');
  }

  public get dashboardUpdateSaveBtn() {
    return this.page.locator('#dashboardUpdateSaveBtn');
  }

  public get dashboardUpdateSaveCancelBtn() {
    return this.page.locator('#dashboardUpdateSaveCancelBtn');
  }

  public get dashboardNameInput() {
    return this.page.locator('#dashboardNameCreate');
  }

  public get dashboardRangeToTodayCheckbox() {
    return this.page.locator('#rangeToTodayCheckbox label');
  }

  public get dateRange() {
    return this.page.locator('mat-date-range-input');
  }

  public calculateAverageCheckbox(rowNum: number) {
    return this.page.locator(`#calcAverageCheckbox${rowNum} label`);
  }

  public enableCompareCheckbox(rowNum: number) {
    return this.page.locator(`#enableCompare${rowNum} label`);
  }

  public enableIgnoreCheckbox(rowNum: number) {
    return this.page.locator(`#enableIgnoreCheckbox${rowNum}`);
  }

  public answerIgnoreCheckbox(rowNum: number, ignoredAnswerId: number) {
    return this.page.locator(`#ignoreCheckbox${ignoredAnswerId}_${rowNum} label`);
  }

  public compareItemInput(rowNum: number, compareItemIndex: number) {
    return this.page.locator(`#locationTag${rowNum}_${compareItemIndex}`);
  }

  async setDashboardSettings(model: DashboardTestConfigEditModel) {
    await this.dateRange.click();
    if (model.dateRange) {
      await selectDateRangeOnNewDatePicker(
        this.page,
        model.dateRange.yearFrom,
        model.dateRange.monthFrom,
        model.dateRange.dayFrom,
        model.dateRange.yearTo,
        model.dateRange.monthTo,
        model.dateRange.dayTo,
      );
    }
    if (model.today) {
      await this.dashboardRangeToTodayCheckbox.click();
    }
    await selectValueInNgSelector(this.page, '#selectLocationTag', model.locationTagName);
  }

  async createFirstItem() {
    await this.initialItemCreateBtn.click();
  }

  async createItem(rowObject: InsightDashboardEditRowObject) {
    await rowObject.itemCreateBtn.click();
  }

  async deleteItem(rowObject: InsightDashboardEditRowObject) {
    await rowObject.itemDeleteBtn.click();
  }

  async copyItem(rowObject: InsightDashboardEditRowObject) {
    await rowObject.itemCopyBtn.click();
  }

  async fillItem(rowNum: number, itemObject: DashboardTestItemEditModel) {
    await selectValueInNgSelectorWithSeparateValueAndSearchValue(
      this.page, `#editFirstQuestion${rowNum}`, itemObject.firstQuestion, itemObject.firstQuestionForSelect);

    if (itemObject.filterQuestion) {
      await selectValueInNgSelectorWithSeparateValueAndSearchValue(
        this.page, `#editFilterQuestion${rowNum}`, itemObject.filterQuestion, itemObject.filterQuestionForSelect);
    }

    if (itemObject.filterAnswer) {
      await selectValueInNgSelector(this.page, `#editFilterAnswer${rowNum}`, itemObject.filterAnswer);
    }

    await selectValueInNgSelector(this.page, `#editPeriod${rowNum}`, itemObject.period);

    if (itemObject.calculateAverage) {
      const ele = this.calculateAverageCheckbox(rowNum);
      await ele.waitFor({ state: 'visible', timeout: 20000 });
      await ele.click();
    }

    for (const ignoredAnswerId of itemObject.ignoredAnswerIds) {
      const ele = this.answerIgnoreCheckbox(rowNum, ignoredAnswerId);
      await ele.waitFor({ state: 'visible', timeout: 20000 });
      await ele.click();
    }

    if (itemObject.comparedItems.length) {
      await this.enableCompareCheckbox(rowNum).click();
      for (const compareItem of itemObject.comparedItems) {
        await this.compareItemInput(rowNum, compareItem.itemIndex).pressSequentially(String(compareItem.value));
      }
    }

    await selectValueInNgSelector(this.page, `#editChartType${rowNum}`, itemObject.chartType);
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
    await this.page.waitForTimeout(500);
    return new InsightDashboardEditRowObject(this.page).getRow(1);
  }

  async getDashboardItem(num: number): Promise<InsightDashboardEditRowObject> {
    await this.page.waitForTimeout(500);
    return new InsightDashboardEditRowObject(this.page).getRow(num);
  }
}

export class InsightDashboardEditRowObject {
  constructor(private page: Page) {}

  public firstQuestion: ReturnType<Page['locator']>;
  public filterQuestion: ReturnType<Page['locator']>;
  public filterAnswer: ReturnType<Page['locator']>;
  public period: ReturnType<Page['locator']>;
  public calcAverageCheckbox: ReturnType<Page['locator']>;
  public chartType: ReturnType<Page['locator']>;
  public itemCreateBtn: ReturnType<Page['locator']>;
  public itemDeleteBtn: ReturnType<Page['locator']>;
  public itemCopyBtn: ReturnType<Page['locator']>;

  getRow(rowNum: number): InsightDashboardEditRowObject {
    const index = rowNum - 1;
    this.firstQuestion = this.page.locator('#editFirstQuestion').nth(index);
    this.filterQuestion = this.page.locator('#editFilterQuestion').nth(index);
    this.filterAnswer = this.page.locator('#editFilterAnswer').nth(index);
    this.period = this.page.locator('#editPeriod').nth(index);
    this.calcAverageCheckbox = this.page.locator('#calcAverageCheckbox').nth(index);
    this.chartType = this.page.locator('#editChartType').nth(index);
    this.itemCreateBtn = this.page.locator('#createItemBtn').nth(index);
    this.itemDeleteBtn = this.page.locator('#deleteItemBtn').nth(index);
    this.itemCopyBtn = this.page.locator('#copyItemBtn').nth(index);
    return this;
  }
}

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
  comparedItems: { itemIndex: number; value: number }[];
}

export interface DashboardTestConfigEditModel {
  locationTagName: string;
  dateRange?: {
    yearFrom: number;
    monthFrom: number;
    dayFrom: number;
    yearTo: number;
    monthTo: number;
    dayTo: number;
  };
  today: boolean;
}
