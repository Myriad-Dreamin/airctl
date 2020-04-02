import { RouteDesc, RouteType } from '../../lib/router';
import { Report } from './form/report';
import { AirList } from './list/list';
import { AirInspect } from './page/inspect';

function rel(r: string): string {
    return 'air/' + r;
}

export const AirRoutes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: rel('report-repair'),
        component: () => Report,
    },
    {
        type: RouteType.Exact,
        path: rel('list'),
        component: AirList,
    },
    {
        type: RouteType.Exact,
        path: rel('inspect'),
        component: AirInspect,
    },
];
