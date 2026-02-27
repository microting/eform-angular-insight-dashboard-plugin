import {DashboardTestConfigEditModel, DashboardTestItemEditModel} from './InsightDashboard-DashboardEdit.page';
import {format, parse, set} from 'date-fns';

class InsightDashboardDashboardViewPage {

  rowNum(): Cypress.Chainable<number> {
    cy.wait(1000);
    return cy.get('#dashboardViewItem').its('length');
  }

  returnToDashboards() {
    return cy.get('#returnToPrevious').should('be.visible');
  }

  firstQuestion(rowNum: number) {
    return cy.get(`#firstQuestion${rowNum}`).should('be.visible');
  }

  filterQuestion(rowNum: number) {
    return cy.get(`#filterQuestion${rowNum}`);
  }

  filterAnswer(rowNum: number) {
    return cy.get(`#filterAnswer${rowNum}`);
  }

  compareHeaders(dataJson: any) {
    cy.get('#dashboardViewItem').then(($items) => {
      const rowNum = $items.length;
      for (let itemIndex = 0; itemIndex < rowNum; itemIndex++) {
        for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
          cy.get(`#dashboardViewChartData${itemIndex}_${rawDataIndex} #dataViewRawHeader`).each(($header, headerIndex) => {
            expect(
              dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders[headerIndex],
              `Header is incorrect on ${itemIndex} item, ${headerIndex} header`
            ).to.equal($header.text());
          });
        }
      }
    });
  }

  comparePercentage(dataJson: any, addPercentSymbol: boolean = true) {
    cy.get('#dashboardViewItem').then(($items) => {
      const rowNum = $items.length;
      for (let itemIndex = 0; itemIndex < rowNum; itemIndex++) {
        for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
          for (
            let rawDataItemIndex = 0;
            rawDataItemIndex < dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems.length;
            rawDataItemIndex++
          ) {
            cy.get(`#dashboardViewChartData${itemIndex}_${rawDataIndex} #dataViewPercent${rawDataItemIndex} #dataViewPercentValue`).each(($val, valueIndex) => {
              const expectedRow = Math.floor(valueIndex / dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders.length);
              const expectedCol = valueIndex % dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders.length;
              const expected = `${dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems[rawDataIndex].rawDataValues[expectedRow].percents[expectedCol]}${addPercentSymbol ? '%' : ''}`;
              expect(expected, `Percentage is incorrect on ${itemIndex} item`).to.equal($val.text());
            });
          }
        }
      }
    });
  }

  compareAmounts(dataJson: any) {
    cy.get('#dashboardViewItem').then(($items) => {
      const rowNum = $items.length;
      for (let itemIndex = 0; itemIndex < rowNum; itemIndex++) {
        for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
          for (
            let rawDataItemIndex = 0;
            rawDataItemIndex < dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems.length;
            rawDataItemIndex++
          ) {
            cy.get(`#dashboardViewChartData${itemIndex}_${rawDataIndex} #dataViewAmount${rawDataItemIndex} #dataViewAmountValue`).each(($val, valueIndex) => {
              const expectedRow = Math.floor(valueIndex / dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders.length);
              const expectedCol = valueIndex % dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders.length;
              const expected = dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems[rawDataIndex].rawDataValues[expectedRow].amounts[expectedCol];
              expect(expected, `Amount is incorrect on ${itemIndex} item`).to.equal(+$val.text());
            });
          }
        }
      }
    });
  }

  compareItem(rowNum: number, originalItem: DashboardTestItemEditModel, config: DashboardTestConfigEditModel) {
    cy.wait(1000);
    this.firstQuestion(rowNum).invoke('text').should('equal', originalItem.firstQuestion);
    this.filterQuestion(rowNum).invoke('text').should('equal', originalItem.filterQuestion);
    this.filterAnswer(rowNum).invoke('text').should('equal', originalItem.filterAnswer);

    const dateFrom = set(new Date(), {
      year: config.dateRange.yearFrom,
      month: config.dateRange.monthFrom - 1,
      date: config.dateRange.dayFrom,
      hours: 0, minutes: 0, seconds: 0, milliseconds: 0
    });
    const dateTo = set(new Date(), {
      year: config.dateRange.yearTo,
      month: config.dateRange.monthTo - 1,
      date: config.dateRange.dayTo,
      hours: 0, minutes: 0, seconds: 0, milliseconds: 0
    });

    cy.get(`#dateFrom${rowNum}`).invoke('text').then((dateFromText) => {
      const dateFromInTableRaw = parse(dateFromText, 'yyyy/MM/dd', new Date());
      const dateFromInTable = set(dateFromInTableRaw, {
        year: dateFromInTableRaw.getFullYear(),
        month: dateFromInTableRaw.getMonth(),
        date: dateFromInTableRaw.getDate(),
        hours: 0, minutes: 0, seconds: 0, milliseconds: 0
      });
      expect(format(dateFromInTable, 'P')).to.equal(format(dateFrom, 'P'));
    });

    cy.get(`#dateTo${rowNum}`).invoke('text').then((dateToText) => {
      const dateToInTableRaw = parse(dateToText, 'yyyy/MM/dd', new Date());
      const dateToInTable = set(dateToInTableRaw, {
        year: dateToInTableRaw.getFullYear(),
        month: dateToInTableRaw.getMonth(),
        date: dateToInTableRaw.getDate(),
        hours: 0, minutes: 0, seconds: 0, milliseconds: 0
      });
      expect(format(dateToInTable, 'P')).to.equal(format(dateTo, 'P'));
    });
  }
}

const dashboardsViewPage = new InsightDashboardDashboardViewPage();
export default dashboardsViewPage;
