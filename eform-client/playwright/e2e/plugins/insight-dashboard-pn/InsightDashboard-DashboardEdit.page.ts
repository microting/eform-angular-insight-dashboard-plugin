import { Page } from '@playwright/test';
import {
  selectValueInNgSelectorWithSeparateValueAndSearchValue,
  selectDateRangeOnNewDatePicker,
} from '../../helper-functions';
import {
  selectValueInMtxSelect,
  selectExactValueInMtxSelect,
} from './insight-mtx-select.helper';

export class InsightDashboardDashboardEditPage {
  constructor(private page: Page) {}

  async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('[id^="dashboardItem"]:not(#dashboardItems)').count();
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
    await selectValueInMtxSelect(this.page, '#selectLocationTag', model.locationTagName);
  }

  async createFirstItem() {
    await this.initialItemCreateBtn.click();
  }

  async createItem(rowObject: InsightDashboardEditRowObject) {
    await this.clickHeaderButtonAndWaitForPanel(rowObject, rowObject.itemCreateBtn);
  }

  async deleteItem(rowObject: InsightDashboardEditRowObject) {
    await rowObject.itemDeleteBtn.click();
  }

  async copyItem(rowObject: InsightDashboardEditRowObject) {
    await this.clickHeaderButtonAndWaitForPanel(rowObject, rowObject.itemCopyBtn);
  }

  /**
   * The add/copy buttons sit inside the item's expansion panel header, so the
   * click also toggles that panel. While it animates, everything below it moves
   * (by more than a screen when the item is expanded); a dropdown opened on the
   * next item meanwhile follows its select out of view and can't be clicked.
   * Wait until the panel has flipped and its height is stable for a few frames.
   */
  private async clickHeaderButtonAndWaitForPanel(
    rowObject: InsightDashboardEditRowObject,
    button: ReturnType<Page['locator']>
  ) {
    const header = this.page.locator('app-dashboard-item-edit mat-expansion-panel-header').nth(rowObject.index);
    const expandedBefore = await header.getAttribute('aria-expanded');
    await button.click();
    await this.page
      .waitForFunction(
        ({ index, expandedBefore }) => {
          const w = window as any;
          const panel = document.querySelectorAll('app-dashboard-item-edit mat-expansion-panel')[index];
          const header = panel?.querySelector('mat-expansion-panel-header');
          if (!panel || !header || header.getAttribute('aria-expanded') === expandedBefore) {
            w.__itemPanelSettle = undefined;
            return false;
          }
          const height = Math.round(panel.getBoundingClientRect().height);
          const prev = w.__itemPanelSettle;
          const stableFrames = prev && prev.panel === panel && prev.height === height ? prev.stableFrames + 1 : 0;
          w.__itemPanelSettle = { panel, height, stableFrames };
          return stableFrames >= 5;
        },
        { index: rowObject.index, expandedBefore },
        { polling: 'raf', timeout: 10000 }
      )
      // Fallback if the panel doesn't toggle: give it the animation's length.
      .catch(() => this.page.waitForTimeout(500));
  }

  async fillItem(rowNum: number, itemObject: DashboardTestItemEditModel) {
    await selectValueInNgSelectorWithSeparateValueAndSearchValue(
      this.page, `#editFirstQuestion${rowNum}`, itemObject.firstQuestion, itemObject.firstQuestionForSelect);

    if (itemObject.filterQuestion) {
      await selectValueInNgSelectorWithSeparateValueAndSearchValue(
        this.page, `#editFilterQuestion${rowNum}`, itemObject.filterQuestion, itemObject.filterQuestionForSelect);
    }

    if (itemObject.filterAnswer) {
      await selectValueInMtxSelect(this.page, `#editFilterAnswer${rowNum}`, itemObject.filterAnswer);
    }

    await selectExactValueInMtxSelect(this.page, `#editPeriod${rowNum}`, itemObject.period);

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

    await selectValueInMtxSelect(this.page, `#editChartType${rowNum}`, itemObject.chartType);
  }

  /**
   * A text first question hides the period, chart type and ignored-values
   * controls - the item renders an interviews list rather than a chart - so
   * filling one stops after the question itself.
   */
  async fillTextQuestionItem(
    rowNum: number,
    firstQuestion: string,
    firstQuestionForSelect: string
  ) {
    await selectValueInNgSelectorWithSeparateValueAndSearchValue(
      this.page,
      `#editFirstQuestion${rowNum}`,
      firstQuestion,
      firstQuestionForSelect
    );
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

  public index: number;

  getRow(rowNum: number): InsightDashboardEditRowObject {
    const index = rowNum - 1;
    this.index = index;
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
