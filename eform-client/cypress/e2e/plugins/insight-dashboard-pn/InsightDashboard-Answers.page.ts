class InsightDashboardAnswersPage {

  searchMicrotingUIdInput() {
    return cy.get('#searchMicrotingUIdInput').should('be.visible');
  }

  searchMicrotingUIdBtn() {
    return cy.get('#searchMicrotingUIdBtn').should('be.visible');
  }

  deleteByMicrotingUIdBtn() {
    return cy.get('#deleteByMicrotingUIdBtn').should('be.visible');
  }

  saveDeleteBtn() {
    return cy.get('#saveDeleteBtn').should('be.visible');
  }

  cancelDeleteBtn() {
    return cy.get('#cancelDeleteBtn').should('be.visible');
  }

  searchAnswerByMicrotingUId(microtingUId: string) {
    this.searchMicrotingUIdInput().clear().type(microtingUId);
    this.searchMicrotingUIdBtn().click();
  }

  deleteAnswer(clickCancel = false) {
    this.deleteByMicrotingUIdBtn().click();
    if (clickCancel) {
      this.cancelDeleteBtn().click();
    } else {
      this.saveDeleteBtn().click();
    }
  }

  rowNum(): Cypress.Chainable<number> {
    return cy.get('.mat-mdc-row').its('length');
  }
}

const answersPage = new InsightDashboardAnswersPage();
export default answersPage;
