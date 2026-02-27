export const configName = 'Test-Set';

export function selectValueInNgSelector(selector: string, value: string, selectorInModal = false) {
  cy.get(selector).should('be.visible');
  cy.get(selector).find('input').should('be.visible').clear().type(value);
  cy.wait(500);
  let valueForClick;
  if (selectorInModal) {
    valueForClick = cy.get('.ng-option').contains(value);
  } else {
    valueForClick = cy.get(selector).find('.ng-option').contains(value);
  }
  valueForClick.first().scrollIntoView().should('be.visible').click();
  cy.wait(500);
}

export function selectValueInNgSelectorWithSeparateValueAndSearchValue(
  selector: string,
  value: string,
  searchValue: string
) {
  if (!searchValue) {
    return;
  }
  cy.get(selector).should('be.visible');
  cy.get(selector).find('input').should('be.visible').clear().type(searchValue);
  cy.wait(500);
  cy.get(selector).find('.ng-option').contains(value).first().scrollIntoView().should('be.visible').click();
  cy.wait(500);
}

export function selectDateRangeOnDatePicker(
  yearFrom: number, monthFrom: number, dayFrom: number,
  yearTo: number, monthTo: number, dayTo: number
) {
  selectDateOnDatePicker(yearFrom, monthFrom, dayFrom);
  selectDateOnDatePicker(yearTo, monthTo, dayTo);
}

export function selectDateOnDatePicker(year: number, month: number, day: number) {
  cy.wait(500);
  cy.get('.mat-focus-indicator.mat-calendar-period-button.mat-button.mat-button-base').click();
  cy.wait(500);
  cy.get(`tbody div.mat-calendar-body-cell-content.mat-focus-indicator:eq(${year - 2016})`).click();
  cy.wait(500);
  cy.get(`div.mat-calendar-body-cell-content.mat-focus-indicator:eq(${month - 1})`).click();
  cy.wait(500);
  cy.get(`div.mat-calendar-body-cell-content.mat-focus-indicator:not(.owl-dt-calendar-cell-out):eq(${day - 1})`).click();
  cy.wait(500);
}

class InsightDashboardSurveysConfigsPage {

  rowNum(): Cypress.Chainable<number> {
    return cy.get('.mat-mdc-row').its('length');
  }

  surveyConfigCreateBtn() {
    return cy.get('#createSurveyConfigBtn').should('be.visible');
  }

  surveyConfigCreateSaveBtn() {
    return cy.get('#surveyConfigCreateSaveBtn').should('be.visible');
  }

  surveyConfigCreateCancelBtn() {
    return cy.get('#surveyConfigCreateSaveCancelBtn').should('be.visible');
  }

  surveyConfigEditSaveBtn() {
    return cy.get('#surveyConfigEditSaveBtn').should('be.visible');
  }

  surveyConfigEditCancelBtn() {
    return cy.get('#surveyConfigEditSaveCancelBtn').should('be.visible');
  }

  surveyConfigLocationCheckbox(num: number) {
    return cy.get(`#checkbox${num} label`).should('be.visible');
  }

  surveyConfigDeleteSaveBtn() {
    return cy.get('#surveyConfigDeleteSaveBtn').should('be.visible');
  }

  surveyConfigDeleteCancelBtn() {
    return cy.get('#surveyConfigDeleteCancelBtn').should('be.visible');
  }

  createSurveyConfig(name: string) {
    this.surveyConfigCreateBtn().click();
    cy.get('#selectSurveyCreate .ng-input > input').should('be.visible').type(name);
    cy.get('ng-dropdown-panel .ng-option').first().should('be.visible').click();
    cy.intercept('POST', '**/api/insight-dashboard-pn/survey-configs/create').as('createSurveyConfig');
    this.surveyConfigCreateSaveBtn().click();
    cy.wait('@createSurveyConfig', { timeout: 60000 });
  }

  createSurveyConfig_Cancels() {
    this.surveyConfigCreateBtn().click();
    this.surveyConfigCreateCancelBtn().click();
  }

  updateSurveyConfig(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.get(`#editSurveyConfigBtn-${idx}`).should('be.visible').click();
    this.surveyConfigLocationCheckbox(1).click();
    this.surveyConfigLocationCheckbox(2).click();
    cy.intercept('POST', '**/api/insight-dashboard-pn/survey-configs/update').as('updateSurveyConfig');
    this.surveyConfigEditSaveBtn().click();
    cy.wait('@updateSurveyConfig', { timeout: 60000 });
  }

  updateSurveyConfig_Cancels(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.get(`#editSurveyConfigBtn-${idx}`).should('be.visible').click();
    this.surveyConfigEditCancelBtn().click();
  }

  deleteSurveyConfig(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.get(`#surveyConfigDeleteBtn-${idx}`).should('be.visible').click();
    cy.intercept('POST', '**/api/insight-dashboard-pn/survey-configs/delete').as('deleteSurveyConfig');
    this.surveyConfigDeleteSaveBtn().click();
    cy.wait('@deleteSurveyConfig', { timeout: 60000 });
  }

  deleteSurveyConfig_Cancels(rowNum: number) {
    const idx = rowNum - 1;
    cy.get('#actionMenu').eq(idx).click();
    cy.get(`#surveyConfigDeleteBtn-${idx}`).should('be.visible').click();
    this.surveyConfigDeleteCancelBtn().click();
  }

  getRowSurveyName(rowNum: number): Cypress.Chainable<string> {
    const idx = rowNum - 1;
    return cy.get('.mat-mdc-row').eq(idx).find('.mat-column-surveyName span').invoke('text');
  }
}

const surveyConfigsPage = new InsightDashboardSurveysConfigsPage();
export default surveyConfigsPage;
