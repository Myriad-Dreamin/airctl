import { RouteDesc, RouteType } from '../../lib/router';
import { Form } from './form/form';
import { List } from './list/list';
import { RoomInspect } from './page/inspect';

function rel(r: string): string {
    return 'room/' + r;
}

export const RoomRoutes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: rel('form'),
        component: () => Form,
    },
    {
        type: RouteType.Exact,
        path: rel('list'),
        component: () => List,
    },
    {
        type: RouteType.Exact,
        path: rel('inspect'),
        component: RoomInspect,
    },
];
