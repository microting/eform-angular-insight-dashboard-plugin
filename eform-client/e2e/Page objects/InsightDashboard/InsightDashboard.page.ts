import Page from '../Page';

export class InsightDashboardPage extends Page {
  constructor() {
    super();
  }
  public InsightDashboardDropDown() {
    $(`#insight-dashboard-pn`).click();
  }
  public get SurveysConfigsBtn() {
    const insightDashboardPnSurveysConfigs = $('#insight-dashboard-pn-surveys-configs');
    insightDashboardPnSurveysConfigs.waitForDisplayed({timeout: 30000});
    insightDashboardPnSurveysConfigs.waitForClickable({timeout: 20000});
    return insightDashboardPnSurveysConfigs;
  }
  public get DashboardsBtn() {
    const insightDashboardPnDashboards = $('#insight-dashboard-pn-dashboards');
    insightDashboardPnDashboards.waitForDisplayed({timeout: 30000});
    insightDashboardPnDashboards.waitForClickable({timeout: 20000});
    return insightDashboardPnDashboards;
  }
  public get AnswersBtn() {
    const answersBtn = $('#insight-dashboard-pn-answers');
    answersBtn.waitForDisplayed({timeout: 30000});
    answersBtn.waitForClickable({timeout: 20000});
    return answersBtn;
  }
  goToSurveysConfigs() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.SurveysConfigsBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  goToDashboards() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.DashboardsBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  goToAnswers() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.AnswersBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
