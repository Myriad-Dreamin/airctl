// react库
import React from 'react';
import { Redirect } from 'react-router-dom';
// 本地编写的公共库
import { compose } from '../lib/fp';
import { CreateRouter, RouteDesc, RouteType } from '../lib/router';
// MainLayout高阶函数组件
import { MainLayout } from '../component/layout/main-layout';
// 主页面
import { Welcome } from './welcome';
// 模拟支付（现已停用）
import { UserMockPay } from './user/page/mock-callback';
// 路由
import { OverviewRoutes } from './overview/router';
import { AirRoutes } from './air/router';
import { RoomRoutes } from './room/router';
import { UserRoutes } from './user/router';
import { AdminRoutes } from './admin/router';

// 普通app路由对象
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

// 最终路由对象
const MainRoutes: RouteDesc[] = [
    // 主页面
    {
        type: RouteType.Exact,
        path: '',
        component: Welcome,
    },
    // 模拟支付页面
    {
        type: RouteType.Exact,
        path: 'mock-pay',
        component: UserMockPay,
    },
    // app子路由
    {
        type: RouteType.NotExact,
        path: 'app',
        component: compose(MainLayout, CreateRouter('/app/', Routes, false)),
    },
];

// 根据路由信息创建Router对象
export const InternalRouter = CreateRouter('/', MainRoutes, true);
