import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { PluginPage } from '../../../Page objects/Plugin.page';

test.describe('Application settings page - site header section', () => {
  let page: any;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let pluginPage: PluginPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    pluginPage = new PluginPage(page);
    await loginPage.open('/auth');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should go to plugin settings page', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToPluginsPage();
    const plugin = await pluginPage.getFirstPluginRowObj();
    expect(plugin.id).toBe(1);
    expect(plugin.name.trim()).toBe('Microting InSight Dashboard Plugin');
    expect(plugin.status.trim()).toBe('toggle_off');
  });

  test('should activate the plugin', async () => {
    let plugin = await pluginPage.getFirstPluginRowObj();
    await plugin.enableOrDisablePlugin();
    plugin = await pluginPage.getFirstPluginRowObj();
    expect(plugin.id).toBe(1);
    expect(plugin.name.trim()).toBe('Microting InSight Dashboard Plugin');
    expect(plugin.status.trim()).toBe('toggle_on');
  });
});
