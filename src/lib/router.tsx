import { DependencyContainer } from './common';
import { HashRouter as Router, Route } from 'react-router-dom';
import React, { FunctionComponent } from 'react';

export enum RouteType {
    Exact,
    NotExact,
    Length,
}

export interface RouteDesc {
    type: RouteType;
    path: string;
    component: (dependencies: DependencyContainer) => FunctionComponent<any>;
}

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
        console.log(dep);
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
