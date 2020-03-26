import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { OverviewRoutes } from './overview/router';
import { AirRoutes } from './air/router';
import { UserRoutes } from './user/router';
import { DC, RouteDesc, RouteType } from './common';
import { Welcome } from './welcome';
// import {RoomRoutes} from "./room/router";
import { AdminRoutes } from './admin/router';

function checkRoutes(routes: RouteDesc[]) {
    const checkPathConflict: Set<string> = new Set<string>();
    for (const route of routes) {
        if (route.type >= RouteType.Length || route.type < 0) {
            console.error(`route type error on ${route.path}, should not be ${route.type}`);
        }
        if (checkPathConflict.has(route.path)) {
            console.error(`path conflict on ${route.path}`);
        }
        checkPathConflict.add(route.path);
    }
}

const Routes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: '/',
        component: () => Welcome,
    },
    ...OverviewRoutes,

    ...AirRoutes,
    // 将来版本中会发布
    // ...RoomRoutes,

    ...UserRoutes,
    ...AdminRoutes,
];

checkRoutes(Routes);

export const InternalRouter = (props: DC) => (
    <HashRouter>
        <Switch>
            {Routes.map((desc) => {
                if (desc.type === RouteType.Exact) {
                    return <Route exact path={desc.path} component={desc.component(props)} key={desc.path} />;
                }
                return null;
            })}
        </Switch>
    </HashRouter>
);
