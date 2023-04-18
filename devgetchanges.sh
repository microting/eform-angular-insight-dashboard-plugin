#!/bin/bash
cd ~
pwd

rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/src/app/plugins/modules/insight-dashboard-pn

cp -av Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/src/app/plugins/modules/insight-dashboard-pn

rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eFormAPI/Plugins/InsightDashboard.Pn

cp -av Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eFormAPI/Plugins/InsightDashboard.Pn

# Test files rm

rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/e2e/Tests/insight-dashboard-settings
rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/e2e/Tests/insight-dashboard-general 
rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/e2e/Page\ objects/InsightDashboard
rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/wdio-headless-plugin-step2.conf.ts
rm -fR Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/cypress/e2e/plugins/insight-dashboard-pn

# Test files cp

cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/insight-dashboard-settings Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/e2e/Tests/insight-dashboard-settings
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/insight-dashboard-general Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/e2e/Tests/insight-dashboard-general 
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Page\ objects/InsightDashboard Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/e2e/Page\ objects/InsightDashboard
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/wdio-plugin-step2.conf.ts Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/wdio-headless-plugin-step2.conf.ts
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/cypress/e2e/plugins/insight-dashboard-pn Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/cypress/e2e/plugins/insight-dashboard-pn
