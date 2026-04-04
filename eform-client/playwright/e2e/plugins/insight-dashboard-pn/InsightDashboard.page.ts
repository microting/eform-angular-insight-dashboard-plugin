import { Page } from '@playwright/test';

export class InsightDashboardPage {
  constructor(private page: Page) {}

  public get insightDashboardDropDown() {
    return this.page.locator('#insight-dashboard-pn');
  }

  public get surveysConfigsBtn() {
    return this.page.locator('#insight-dashboard-pn-surveys-configs');
  }

  public get dashboardsBtn() {
    return this.page.locator('#insight-dashboard-pn-dashboards');
  }

  public get answersBtn() {
    return this.page.locator('#insight-dashboard-pn-answers');
  }

  async goToSurveysConfigs() {
    if (!await this.surveysConfigsBtn.isVisible()) {
      await this.insightDashboardDropDown.waitFor({ state: 'visible', timeout: 30000 });
      await this.insightDashboardDropDown.click();
    }
    await this.surveysConfigsBtn.waitFor({ state: 'visible', timeout: 20000 });
    await this.surveysConfigsBtn.click();
  }

  async goToDashboards() {
    await this.page.goto('/plugins/insight-dashboard-pn/dashboards');
    await this.page.locator('#createDashboardBtn').waitFor({ state: 'visible', timeout: 30000 });
  }

  async goToAnswers() {
    if (!await this.answersBtn.isVisible()) {
      await this.insightDashboardDropDown.waitFor({ state: 'visible', timeout: 30000 });
      await this.insightDashboardDropDown.click();
    }
    await this.answersBtn.waitFor({ state: 'visible', timeout: 20000 });
    await this.answersBtn.click();
  }
}
