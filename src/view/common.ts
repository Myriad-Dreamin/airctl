import { FunctionComponent } from 'react';

export enum RouteType {
    Exact,
    Length,
}

export interface DependencyContainer {}

export type DC = DependencyContainer;

export interface RouteDesc {
    type: RouteType;
    path: string;
    component: (dependencies: DependencyContainer) => FunctionComponent<any>;
}
