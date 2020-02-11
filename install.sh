#!/bin/bash

if [ ! -d "/var/www/microting/eform-angular-insight-dashboard-plugin" ]; then
  cd /var/www/microting
  su ubuntu -c \
  "git clone https://github.com/microting/eform-angular-insight-dashboard-plugin.git -b stable"
fi

cd /var/www/microting/eform-angular-insight-dashboard-plugin
su ubuntu -c \
"dotnet restore eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn.sln"

echo "################## START GITVERSION ##################"
export GITVERSION=`git describe --abbrev=0 --tags | cut -d "v" -f 2`
echo $GITVERSION
echo "################## END GITVERSION ##################"
su ubuntu -c \
"dotnet publish eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn.sln -o out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release"

if [ -d "/var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn" ]; then
	su ubuntu -c \
	"rm -fR /var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn"
fi

su ubuntu -c \
"cp -av /var/www/microting/eform-angular-insight-dashboard-plugin/eform-client/src/app/plugins/modules/insight-dashboard-pn /var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/insight-dashboard-pn"
su ubuntu -c \
"mkdir -p /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/"

if [ -d "/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/InsightDashboard" ]; then
	su ubuntu -c \
	"rm -fR /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/InsightDashboard"
fi

su ubuntu -c \
"cp -av /var/www/microting/eform-angular-insight-dashboard-plugin/eFormAPI/Plugins/InsightDashboard.Pn/InsightDashboard.Pn/out /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/InsightDashboard"


echo "Recompile angular"
cd /var/www/microting/eform-angular-frontend/eform-client
su ubuntu -c \
"/var/www/microting/eform-angular-insight-dashboard-plugin/testinginstallpn.sh"
su ubuntu -c \
"GENERATE_SOURCEMAP=false npm run build"
echo "Recompiling angular done"


