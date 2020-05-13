import Page from '../Page';
import {expect} from "chai";
import dashboardEditPage from './InsightDashboard-DashboardEdit.page';
import {dashboardLineDataJson} from './ChartData/DashboardViewLine.data';

export const firstQuestion = 'Q2';
export const filterQuestion = 'Q3';
export const filterAnswer = 'Meget glad';
export const period = 'Måned';
export const chartType = 'Linje';

export class InsightDashboardDashboardViewPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#dashboardViewItem').length;
  }

  public get returnToDashboards() {
    $('#returnToPrevious').waitForDisplayed({timeout: 30000});
    $('#returnToPrevious').waitForClickable({timeout: 20000});
    return $('#returnToPrevious');
  }

  public firstQuestion(rowNum: number) {
    return $(`#firstQuestion${rowNum}`);
  }

  public filterQuestion(rowNum: number) {
    return $(`#filterQuestion${rowNum}`);
  }

  public filterAnswer(rowNum: number) {
    return $(`#filterAnswer${rowNum}`);
  }

  public period(rowNum: number) {
    return $(`#period${rowNum}`);
  }

  public chartType(rowNum: number) {
    return $(`#chartType${rowNum}`);
  }

  public rawChartDataHeaders(rowNum: number) {
    return $(`#dashboardViewChartData${rowNum}`).$$(`#dataViewRawHeader`);
  }

  public rawChartDataPercentValueRows(rowNum: number) {
    const dataViewPercentRow = $(`#dashboardViewChartData${rowNum}`).$$(`#dataViewPercent`);
    return dataViewPercentRow.map(x => {
      return x.$$(`#dataViewPercentValue`);
    });
  }

  public rawChartDataAmountValueRows(rowNum: number) {
    const dataViewPercentRow = $(`#dashboardViewChartData${rowNum}`).$$(`#dataViewAmount`);
    return dataViewPercentRow.map(x => {
      return x.$$(`#dataViewAmountValue`);
    });
  }

  public compareHeaders(dataJson: any) {
    for (let itemIndex = 0; itemIndex < dashboardsViewPage.rowNum; itemIndex++) {
      const headerArray = dashboardsViewPage.rawChartDataHeaders(itemIndex);
      for (let headerIndex = 0; headerIndex < headerArray.length; headerIndex++) {
        expect(dataJson.items[itemIndex].chartData.rawData[0].rawHeaders[headerIndex])
          .equal(headerArray[headerIndex].getText());
      }
    }
  }

  public comparePercentage(dataJson: any, addPercentSymbol: boolean = true) {
    for (let itemIndex = 0; itemIndex < dashboardsViewPage.rowNum; itemIndex++) {
      const percentValueRows = dashboardsViewPage.rawChartDataPercentValueRows(itemIndex);
      for (let row = 0; row < percentValueRows.length; row++) {
        for (let value = 0; value < percentValueRows[row].length; value++) {
          // Requires % to compare correctly
          expect(`${dataJson.items[itemIndex].chartData.rawData[0].rawDataValues[row].percents[value]}${addPercentSymbol ? '%' : ''}`)
            .equal(percentValueRows[row][value].getText());
        }
      }
    }
  }

  public compareAmounts(dataJson: any, castValueToNumber: boolean = true) {
    for (let itemIndex = 0; itemIndex < dashboardsViewPage.rowNum; itemIndex++) {
      const amountValueRows = dashboardsViewPage.rawChartDataAmountValueRows(itemIndex);
      for (let row = 0; row < amountValueRows.length; row++) {
        for (let amount = 0; amount < amountValueRows[row].length; amount++) {
          // Requires cast to integer or to string
          expect(dataJson.items[itemIndex].chartData.rawData[0].rawDataValues[row].amounts[amount])
            .equal(+amountValueRows[row][amount].getText());
        }
      }
    }
  }

  compareItem(rowNum: number) {
    expect(this.firstQuestion(rowNum).getText()).equal(firstQuestion);
    expect(this.filterQuestion(rowNum).getText()).equal(filterQuestion);
    expect(this.filterAnswer(rowNum).getText()).equal(filterAnswer);
  }
}

const dashboardsViewPage = new InsightDashboardDashboardViewPage();
export default dashboardsViewPage;
