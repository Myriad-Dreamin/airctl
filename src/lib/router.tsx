import { DependencyContainer } from './common';
import { HashRouter as Router, Route } from 'react-router-dom';
import React, { FunctionComponent } from 'react';

// 将RouteDesc类型的路由描述转化为React Router（将过程式Router转化为声明式Router）

export enum RouteType {
    // 精准匹配
    Exact,
    // 模糊匹配
    NotExact,
    Length,
}

export interface RouteDesc {
    // 匹配类型
    type: RouteType;
    // 路由路径
    path: string;
    // 路由目标组件
    component: (dependencies: DependencyContainer) => FunctionComponent<any>;
}

// 检查路由数据是否正确
export function checkRoutes(routes: RouteDesc[]) {
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

// 创建React路由虚拟Dom
export function CreateRouter(rel: string, routes: RouteDesc[], isRoot: boolean) {
    checkRoutes(routes);

    return (dep: DependencyContainer) => {
        const computed = routes.map((desc) => {
            switch (desc.type) {
                case RouteType.Exact:
                case RouteType.NotExact:
                    const x = Object.assign(desc);
                    x.path = rel + desc.path;
                    x.component = desc.component(dep);
                    return x;
            }
            return desc;
        });
        const Internal = () => (
            <div>
                {computed.map((desc) => {
                    switch (desc.type) {
                        case RouteType.Exact:
                            return <Route exact path={desc.path} component={desc.component} key={desc.path} />;
                        case RouteType.NotExact:
                            return <Route path={desc.path} component={desc.component} key={desc.path} />;
                    }
                    return null;
                })}
            </div>
        );
        return isRoot
            ? () => (
                  <Router>
                      <Internal />
                  </Router>
              )
            : Internal;
    };
}
