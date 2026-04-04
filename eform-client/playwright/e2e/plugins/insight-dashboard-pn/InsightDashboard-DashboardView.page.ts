import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { format, parse, set } from 'date-fns';
import { DashboardTestConfigEditModel, DashboardTestItemEditModel } from './InsightDashboard-DashboardEdit.page';

export class InsightDashboardDashboardViewPage {
  constructor(private page: Page) {}

  async rowNum(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.page.locator('#dashboardViewItem').count();
  }

  public get returnToDashboards() {
    return this.page.locator('#returnToPrevious');
  }

  public firstQuestion(rowNum: number) {
    return this.page.locator(`#firstQuestion${rowNum}`);
  }

  public filterQuestion(rowNum: number) {
    return this.page.locator(`#filterQuestion${rowNum}`);
  }

  public filterAnswer(rowNum: number) {
    return this.page.locator(`#filterAnswer${rowNum}`);
  }

  public dateFrom(rowNum: number) {
    return this.page.locator('.mat-column-dateFrom span').nth(rowNum);
  }

  public dateTo(rowNum: number) {
    return this.page.locator('.mat-column-dateTo span').nth(rowNum);
  }

  public rawChartDataHeaders(rowNum: number, rawDataNum: number) {
    return this.page.locator(`#dashboardViewChartData${rowNum}_${rawDataNum}`).locator('#dataViewRawHeader');
  }

  public rawChartDataPercentValueRow(rowNum: number, rawDataNum: number, dataItemNum: number) {
    return this.page.locator(`#dashboardViewChartData${rowNum}_${rawDataNum}`).locator(`#dataViewPercent${dataItemNum}`);
  }

  public rawChartDataAmountValueRow(rowNum: number, rawDataNum: number, dataItemNum: number) {
    return this.page.locator(`#dashboardViewChartData${rowNum}_${rawDataNum}`).locator(`#dataViewAmount${dataItemNum}`);
  }

  async compareHeaders(dataJson: any) {
    const rowCount = await this.rowNum();
    for (let itemIndex = 0; itemIndex < rowCount; itemIndex++) {
      for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
        const headerLocator = this.rawChartDataHeaders(itemIndex, rawDataIndex);
        const headerCount = await headerLocator.count();
        for (let headerIndex = 0; headerIndex < headerCount; headerIndex++) {
          const text = await headerLocator.nth(headerIndex).textContent();
          expect(text?.trim(),
            `Header is incorrect on ${itemIndex} item, ${headerIndex} header`)
            .toBe(dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders[headerIndex]);
        }
      }
    }
  }

  async comparePercentage(dataJson: any, addPercentSymbol: boolean = true) {
    const rowCount = await this.rowNum();
    for (let itemIndex = 0; itemIndex < rowCount; itemIndex++) {
      for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
        for (
          let rawDataItemIndex = 0;
          rawDataItemIndex < dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems.length;
          rawDataItemIndex++
        ) {
          const percentRows = this.rawChartDataPercentValueRow(itemIndex, rawDataIndex, rawDataItemIndex);
          const percentRowCount = await percentRows.count();
          for (let row = 0; row < percentRowCount; row++) {
            const values = percentRows.nth(row).locator('#dataViewPercentValue');
            const valueCount = await values.count();
            for (let value = 0; value < valueCount; value++) {
              const text = await values.nth(value).textContent();
              expect(
                `${dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems[rawDataIndex].rawDataValues[row].percents[value]}${addPercentSymbol ? '%' : ''}`,
                `Percentage is incorrect on ${itemIndex} item, ${row} row, ${value} value`
              ).toBe(text?.trim());
            }
          }
        }
      }
    }
  }

  async compareAmounts(dataJson: any) {
    const rowCount = await this.rowNum();
    for (let itemIndex = 0; itemIndex < rowCount; itemIndex++) {
      for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
        for (
          let rawDataItemIndex = 0;
          rawDataItemIndex < dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems.length;
          rawDataItemIndex++
        ) {
          const amountRows = this.rawChartDataAmountValueRow(itemIndex, rawDataIndex, rawDataItemIndex);
          const amountRowCount = await amountRows.count();
          for (let row = 0; row < amountRowCount; row++) {
            const values = amountRows.nth(row).locator('#dataViewAmountValue');
            const valueCount = await values.count();
            for (let amount = 0; amount < valueCount; amount++) {
              const text = await values.nth(amount).textContent();
              expect(
                dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems[rawDataIndex].rawDataValues[row].amounts[amount],
                `Amount is incorrect on ${itemIndex} item, ${row} row, ${amount} value`
              ).toBe(+(text?.trim() ?? '0'));
            }
          }
        }
      }
    }
  }

  async compareItem(rowNum: number, originalItem: DashboardTestItemEditModel, config: DashboardTestConfigEditModel) {
    await this.page.waitForTimeout(1000);
    expect(await this.firstQuestion(rowNum).textContent()).toBe(originalItem.firstQuestion);
    expect(await this.filterQuestion(rowNum).textContent()).toBe(originalItem.filterQuestion);
    expect(await this.filterAnswer(rowNum).textContent()).toBe(originalItem.filterAnswer);

    const dateFrom = set(new Date(), {
      year: config.dateRange!.yearFrom,
      month: config.dateRange!.monthFrom - 1,
      date: config.dateRange!.dayFrom,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const dateTo = set(new Date(), {
      year: config.dateRange!.yearTo,
      month: config.dateRange!.monthTo - 1,
      date: config.dateRange!.dayTo,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    const dateFromText = await this.page.locator(`#dateFrom${rowNum}`).textContent();
    const dateToText = await this.page.locator(`#dateTo${rowNum}`).textContent();

    const dateFromInTableRaw = parse(dateFromText?.trim() ?? '', 'yyyy/MM/dd', new Date());
    const dateToInTableRaw = parse(dateToText?.trim() ?? '', 'yyyy/MM/dd', new Date());

    const dateFromInTable = set(dateFromInTableRaw, {
      year: dateFromInTableRaw.getFullYear(),
      month: dateFromInTableRaw.getMonth(),
      date: dateFromInTableRaw.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const dateToInTable = set(dateToInTableRaw, {
      year: dateToInTableRaw.getFullYear(),
      month: dateToInTableRaw.getMonth(),
      date: dateToInTableRaw.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    expect(format(dateFromInTable, 'dd.MM.yyyy')).toBe(format(dateFrom, 'dd.MM.yyyy'));
    expect(format(dateToInTable, 'dd.MM.yyyy')).toBe(format(dateTo, 'dd.MM.yyyy'));
  }
}
