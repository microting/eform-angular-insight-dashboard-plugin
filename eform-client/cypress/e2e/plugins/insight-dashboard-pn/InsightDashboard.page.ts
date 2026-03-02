class InsightDashboardPage {

  insightDashboardDropDown() {
    return cy.get('#insight-dashboard-pn').should('be.visible');
  }

  surveysConfigsBtn() {
    return cy.get('#insight-dashboard-pn-surveys-configs');
  }

  dashboardsBtn() {
    return cy.get('#insight-dashboard-pn-dashboards');
  }

  answersBtn() {
    return cy.get('#insight-dashboard-pn-answers');
  }

  goToSurveysConfigs() {
    cy.intercept('POST', '**/api/insight-dashboard-pn/survey-configs').as('getSurveyConfigs');
    this.surveysConfigsBtn().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.insightDashboardDropDown().click();
      }
    });
    this.surveysConfigsBtn().should('be.visible').click();
    cy.wait('@getSurveyConfigs', { timeout: 60000 });
  }

  goToDashboards() {
    cy.intercept('POST', '**/api/insight-dashboard-pn/dashboards').as('getDashboards');
    this.dashboardsBtn().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.insightDashboardDropDown().click();
      }
    });
    this.dashboardsBtn().should('be.visible').click();
    cy.wait('@getDashboards', { timeout: 60000 });
    cy.get('#createDashboardBtn').should('be.visible');
  }

  goToAnswers() {
    this.answersBtn().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.insightDashboardDropDown().click();
      }
    });
    this.answersBtn().should('be.visible').click();
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
