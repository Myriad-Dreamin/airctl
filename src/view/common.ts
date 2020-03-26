import {FunctionComponent} from "react";

export enum RouteType {
    Exact,
    Length,
}

export interface Dependencies {

}

export interface RouteDesc {
    type: RouteType;
    path: string;
    component: (dependencies: Dependencies) => FunctionComponent<any>;
}

