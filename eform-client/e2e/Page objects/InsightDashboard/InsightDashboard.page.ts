import Page from '../Page';
import { $ } from '@wdio/globals';

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

  public async SurveysConfigsBtn() {
    const insightDashboardPnSurveysConfigs = await $('#insight-dashboard-pn-surveys-configs');
    // await insightDashboardPnSurveysConfigs.waitForDisplayed({timeout: 30000});
    // await insightDashboardPnSurveysConfigs.waitForClickable({timeout: 20000});
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
    // await answersBtn.waitForDisplayed({timeout: 30000});
    // await answersBtn.waitForClickable({timeout: 20000});
    return answersBtn;
  }

  async goToSurveysConfigs() {
    // if dropdown is not opened
    if (!await (await this.SurveysConfigsBtn()).isDisplayed()) {
      await (await this.InsightDashboardDropDown()).click();
    }
    await (await this.SurveysConfigsBtn()).waitForClickable({timeout: 20000});
    await (await this.SurveysConfigsBtn()).click();
  }

  async goToDashboards() {
    // if dropdown is not opened
    if (!await (await this.DashboardsBtn()).isDisplayed()) {
      await (await this.InsightDashboardDropDown()).click();
    }
    await (await this.DashboardsBtn()).waitForClickable({timeout: 20000});
    await (await this.DashboardsBtn()).click();
    await browser.pause(1500);
    await (await $('#createDashboardBtn')).waitForClickable({timeout: 20000});
  }

  async goToAnswers() {
    // if dropdown is not opened
    if (!await (await this.AnswersBtn()).isDisplayed()) {
      await (await this.InsightDashboardDropDown()).click();
    }
    await (await this.AnswersBtn()).waitForClickable({timeout: 20000});
    await (await this.AnswersBtn()).click();
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
