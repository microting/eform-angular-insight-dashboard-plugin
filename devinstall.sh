#!/bin/bash
cd ~
pwd

if [ -d "Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn" ]; then
	rm -fR Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn
fi

cp -av Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eform-client/src/app/plugins/modules/insight-dashboard-pn Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn

if [ -d "Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn" ]; then
	rm -fR Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn
fi

cp -av Documents/workspace/microting/eform-angular-insight-dashboard-plugin/eFormAPI/Plugins/InsightDashboard.Pn Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/InsightDashboard.Pn
