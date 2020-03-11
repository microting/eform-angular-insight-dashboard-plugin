#!/bin/bash
cd ~
pwd

rm -fR Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn

cp -av Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/src/app/plugins/modules/insight-dashboard-pn Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn

rm -fR Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn

cp -av Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eFormAPI/Plugins/InsightDashboard.Pn Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn
