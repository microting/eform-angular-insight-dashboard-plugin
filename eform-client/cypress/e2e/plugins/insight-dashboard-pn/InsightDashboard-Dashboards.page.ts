import {selectValueInNgSelector, configName} from './InsightDashboard-SurveysConfigs.page';
import loginPage from '../../../Login.page';

export const dashboardName = 'NewDashboard';

class InsightDashboardDashboardsPage {

  rowNum(): Cypress.Chainable<number> {
    return cy.get('.mat-mdc-row').its('length');
  }

  dashboardCreateBtn() {
    return cy.get('#createDashboardBtn').should('be.visible');
  }

  dashboardCreateSaveBtn() {
    return cy.get('#dashboardCreateSaveBtn').should('be.visible');
  }

  dashboardCreateCancelBtn() {
    return cy.get('#dashboardCreateSaveCancelBtn').should('be.visible');
  }

  dashboardNameField() {
    return cy.get('#dashboardNameCreate').should('be.visible');
  }

  dashboardDeleteSaveBtn() {
    return cy.get('#dashboardDeleteSaveBtn').should('be.visible');
  }

  dashboardDeleteCancelBtn() {
    return cy.get('#dashboardDeleteCancelBtn').should('be.visible');
  }

  dashboardCopySaveBtn() {
    return cy.get('#dashboardCopySaveBtn').should('be.visible');
  }

  dashboardCopySaveCancelBtn() {
    return cy.get('#dashboardCopySaveCancelBtn').should('be.visible');
  }

  createDashboard(name: string = 'NewDashboard') {
    this.dashboardCreateBtn().click();
    this.dashboardNameField().click();
    this.dashboardNameField().type(name);
    selectValueInNgSelector('#selectSurveyCreate', configName, true);
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/create').as('createDashboard');
    this.dashboardCreateSaveBtn().click();
    cy.wait('@createDashboard', { timeout: 60000 });
  }

  createDashboard_Cancels() {
    this.dashboardCreateBtn().click();
    this.dashboardCreateCancelBtn().click();
  }

  deleteDashboard(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.wait(500);
    cy.get(`#dashboardDeleteBtn-${idx}`).should('be.visible').click();
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/delete').as('deleteDashboard');
    this.dashboardDeleteSaveBtn().click();
    cy.wait('@deleteDashboard', { timeout: 60000 });
  }

  deleteDashboard_Cancels(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.wait(500);
    cy.get(`#dashboardDeleteBtn-${idx}`).should('be.visible').click();
    this.dashboardDeleteCancelBtn().click();
  }

  copyDashboard(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.wait(500);
    cy.get(`#dashboardCopyBtn-${idx}`).should('be.visible').click();
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/copy').as('copyDashboard');
    this.dashboardCopySaveBtn().click();
    cy.wait('@copyDashboard', { timeout: 60000 });
  }

  copyDashboard_Cancel(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.wait(500);
    cy.get(`#dashboardCopyBtn-${idx}`).should('be.visible').click();
    this.dashboardCopySaveCancelBtn().click();
  }

  editDashboard(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.wait(500);
    cy.intercept('GET', '**/api/insight-dashboard-pn/dashboards/edit/*').as('getDashboardEdit');
    cy.get(`#dashboardEditBtn-${idx}`).should('be.visible').click();
    cy.wait('@getDashboardEdit', { timeout: 60000 });
  }

  getRowDashboardName(rowNum: number): Cypress.Chainable<string> {
    const idx = rowNum - 1;
    return cy.get('.mat-mdc-row').eq(idx).find('.mat-column-dashboardName span').invoke('text');
  }

  clearTable() {
    cy.get('.mat-mdc-row').then(($rows) => {
      const rowCount = $rows.length;
      for (let i = 0; i < rowCount; i++) {
        // Always delete first row
        cy.get('#actionMenu').eq(0).click();
        cy.wait(500);
        cy.get(`#dashboardDeleteBtn-0`).should('be.visible').click();
        cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards/delete').as(`deleteDashboard${i}`);
        cy.get('#dashboardDeleteSaveBtn').should('be.visible').click();
        cy.wait(`@deleteDashboard${i}`, { timeout: 60000 });
      }
    });
  }
}

const dashboardsPage = new InsightDashboardDashboardsPage();
export default dashboardsPage;
