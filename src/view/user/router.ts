import { RouteDesc, RouteType } from '../../lib/router';
import { UserRegisterForm } from './form/register';
import { UserList } from './list/list';
import { UserProfile } from './profile/profile';
import { UserPrivilegeForm } from './profile/privilege';
import { UserPay } from './page/pay';

function rel(r: string): string {
    return 'user/' + r;
}

export const UserRoutes: RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: rel('form/register'),
        component: UserRegisterForm,
    },
    {
        type: RouteType.Exact,
        path: rel('list'),
        component: UserList,
    },
    {
        type: RouteType.Exact,
        path: rel('profile'),
        component: UserProfile,
    },
    {
        type: RouteType.Exact,
        path: rel('pay'),
        component: UserPay,
    },
    {
        type: RouteType.Exact,
        path: rel('profile/:id/privilege'),
        component: () => UserPrivilegeForm,
    },
];
