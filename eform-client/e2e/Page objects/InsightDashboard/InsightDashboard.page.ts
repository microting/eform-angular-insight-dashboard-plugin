import Page from '../Page';

export class InsightDashboardPage extends Page {
  constructor() {
    super();
  }
  public async InsightDashboardDropDown() {
    const ele = await $(`#insight-dashboard-pn`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public async InsightDashboardDropDownClick() {
    await (await this.InsightDashboardDropDown()).click();
  }
  public async SurveysConfigsBtn() {
    const insightDashboardPnSurveysConfigs = await $('#insight-dashboard-pn-surveys-configs');
    await insightDashboardPnSurveysConfigs.waitForDisplayed({timeout: 30000});
    await insightDashboardPnSurveysConfigs.waitForClickable({timeout: 20000});
    return insightDashboardPnSurveysConfigs;
  }
  public async DashboardsBtn() {
    const insightDashboardPnDashboardsBtn = await $('#insight-dashboard-pn-dashboards');
    // await insightDashboardPnDashboardsBtn.waitForDisplayed({timeout: 30000});
    // await insightDashboardPnDashboardsBtn.waitForClickable({timeout: 20000});
    return insightDashboardPnDashboardsBtn;
  }
  public async AnswersBtn() {
    const answersBtn = await $('#insight-dashboard-pn-answers');
    await answersBtn.waitForDisplayed({timeout: 30000});
    await answersBtn.waitForClickable({timeout: 20000});
    return answersBtn;
  }
  async goToSurveysConfigs() {
    await this.InsightDashboardDropDownClick();
    await (await this.SurveysConfigsBtn()).click();
  }
  async goToDashboards(dropdownIsOpened = false) {
    // if dropdown is not opened
    if(!dropdownIsOpened) {
      await this.InsightDashboardDropDownClick();
      await (await this.DashboardsBtn()).waitForClickable();
    }
    await (await this.DashboardsBtn()).click();
    await browser.pause(2000);
    await (await $('#createDashboardBtn')).waitForClickable({timeout: 90000});
  }
  async goToAnswers() {
    await this.InsightDashboardDropDownClick();
    await (await this.AnswersBtn()).click();
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
