#!/bin/bash
perl -pi -e '$_.="  },\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="      .then(m => m.InsightDashboardPnModule)\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="    loadChildren: () => import('\''./modules/insight-dashboard-pn/insight-dashboard-pn.module'\'')\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="    path: '\''insight-dashboard-pn'\'',\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  {\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
