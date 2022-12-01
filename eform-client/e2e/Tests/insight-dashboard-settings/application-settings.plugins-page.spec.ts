import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';

import {expect} from 'chai';
import pluginsPage from './application-settings.plugins.page';

describe('Application settings page - site header section', function () {
  before(async () => {
    await loginPage.open('/auth');
  });
  it('should go to plugin settings page', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.advancedDropdownClick();
    await myEformsPage.Navbar.clickOnSubMenuItem('Plugins');
    (await $('#plugin-name')).waitForDisplayed({timeout: 50000});

    const plugin = await pluginsPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting InSight Dashboard Plugin');
    expect(plugin.version).equal('1.0.0.0');

  });
  it('should activate the plugin', async () => {
    const plugin = await pluginsPage.getFirstPluginRowObj();
    // pluginPage.pluginSettingsBtn.click();
    await plugin.activateBtn.click();
    await (await $('#pluginOKBtn')).waitForDisplayed({timeout: 40000});
    await (await pluginPage.pluginOKBtn()).click();
    await browser.pause(50000); // We need to wait 50 seconds for the plugin to create db etc.
    await loginPage.open('/');

    await loginPage.login();
    await myEformsPage.Navbar.advancedDropdownClick();
    await myEformsPage.Navbar.clickOnSubMenuItem('Plugins');
    await (await $('#plugin-name')).waitForDisplayed({timeout: 50000});

    const pluginToFind = await pluginsPage.getFirstPluginRowObj();
    expect(pluginToFind.id).equal(1);
    expect(pluginToFind.name).equal('Microting InSight Dashboard Plugin');
    expect(pluginToFind.version).equal('1.0.0.0');
    await (await $(`//*[contains(text(), 'InSight Dashboard')]`)).waitForDisplayed({timeout: 30000});
  });
});
