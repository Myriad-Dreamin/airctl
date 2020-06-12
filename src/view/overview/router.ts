import { RouteDesc, RouteType } from '../../lib/router';
import { OverviewForm } from './form/form';
import { OverviewList } from './list/list';
import { Dashboard } from './dashboard/dashboard';

function rel(r: string): string {
    return 'overview/' + r;
}

export const OverviewRoutes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: rel('dashboard'),
        component: Dashboard,
    },
    {
        type: RouteType.Exact,
        path: rel('form'),
        component: () => OverviewForm,
    },
    {
        type: RouteType.Exact,
        path: rel('list'),
        component: () => OverviewList,
    },
];
