import Page from '../Page';

export class InsightDashboardPage extends Page {
  constructor() {
    super();
  }
  public InsightDashboardDropDown() {
    $(`#insight-dashboard-pn`).click();
  }
  public async SurveysConfigsBtn() {
    const insightDashboardPnSurveysConfigs = await $('#insight-dashboard-pn-surveys-configs');
    await insightDashboardPnSurveysConfigs.waitForDisplayed({timeout: 30000});
    await insightDashboardPnSurveysConfigs.waitForClickable({timeout: 20000});
    return insightDashboardPnSurveysConfigs;
  }
  public async DashboardsBtn() {
    const insightDashboardPnDashboards = await $('#insight-dashboard-pn-dashboards');
    await insightDashboardPnDashboards.waitForDisplayed({timeout: 30000});
    await insightDashboardPnDashboards.waitForClickable({timeout: 20000});
    return insightDashboardPnDashboards;
  }
  public async AnswersBtn() {
    const answersBtn = await $('#insight-dashboard-pn-answers');
    await answersBtn.waitForDisplayed({timeout: 30000});
    await answersBtn.waitForClickable({timeout: 20000});
    return answersBtn;
  }
  async goToSurveysConfigs() {
    await this.InsightDashboardDropDown();
    await browser.pause(1000);
    await (await this.SurveysConfigsBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }
  async goToDashboards() {
    await this.InsightDashboardDropDown();
    await browser.pause(1000);
    await (await this.DashboardsBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }
  async goToAnswers() {
    await this.InsightDashboardDropDown();
    await browser.pause(1000);
    await (await this.AnswersBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({timeout: 30000, reverse: true});
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
