import { FunctionComponent } from 'react';
import { AirService } from '../dependency/service-concept';

export enum RouteType {
    Exact,
    Length,
}

export interface DependencyContainer {
    airService: AirService;
}

export type DC = DependencyContainer;

export interface RouteDesc {
    type: RouteType;
    path: string;
    component: (dependencies: DependencyContainer) => FunctionComponent<any>;
}
