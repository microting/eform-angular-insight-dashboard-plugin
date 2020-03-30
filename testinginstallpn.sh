#!/bin/bash
perl -pi -e '$_.="  }\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  loadChildren: '\''./modules/insight-dashboard-pn/insight-dashboard-pn.module#InsightDashboardPnModule'\''\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  canActivate: [AuthGuard],\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  path: '\''insight-dashboard-pn'\'',\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  {\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
