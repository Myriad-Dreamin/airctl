import React from 'react';
import { Redirect } from 'react-router-dom';
import { OverviewRoutes } from './overview/router';
import { AirRoutes } from './air/router';
import { UserRoutes } from './user/router';
import { Welcome } from './welcome';
// import {RoomRoutes} from "./room/router";
import { AdminRoutes } from './admin/router';
import { MainLayout } from '../component/layout/main-layout';
import { compose } from '../lib/fp';
import { CreateRouter, RouteDesc, RouteType } from '../lib/router';
import { UserMockPay } from './user/page/mock-callback';
import { RoomRoutes } from './room/router';

const Routes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: '',
        component: () => () => <Redirect to="/app/overview/dashboard" />,
    },
    ...OverviewRoutes,

    ...AirRoutes,
    ...RoomRoutes,

    ...UserRoutes,
    ...AdminRoutes,
];

const MainRoutes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: '',
        component: Welcome,
    },
    {
        type: RouteType.Exact,
        path: 'mock-pay',
        component: UserMockPay,
    },
    {
        type: RouteType.NotExact,
        path: 'app',
        component: compose(MainLayout, CreateRouter('/app/', Routes, false)),
    },
];

export const InternalRouter = CreateRouter('/', MainRoutes, true);
