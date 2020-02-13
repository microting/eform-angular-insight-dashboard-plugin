import Page from '../Page';

export class InsightDashboardPage extends Page {
  constructor() {
    super();
  }
  public InsightDashboardDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Insight Instrumentbræt')]`).click();
  }
  public get SurveysConfigsBtn() {
    return browser.element('#insight-dashboard-pn-surveys-configs');
  }
  public get DashboardsBtn() {
    return browser.element('#insight-dashboard-pn-dashboards');
  }
  goToSurveysConfigs() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.SurveysConfigsBtn.click();
    browser.pause(8000);
  }
  goToDashboards() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.DashboardsBtn.click();
    browser.pause(8000);
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
