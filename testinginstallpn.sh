#!/bin/bash
sed '/\/\/ INSERT ROUTES HERE/i {' src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i path: "insight-dashboard-pn",' src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i canActivate: [AuthGuard],' src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i loadChildren: "./modules/insight-dashboard-pn/insight-dashboard-pn.module#InsightDashboardPnModule"' src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i },' src/app/plugins/plugins.routing.ts -i
