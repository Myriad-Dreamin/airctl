import {RouteDesc, RouteType} from "../common";
import {AdminProfile} from "./profile/profile";
import {AdminResourceForm} from "./form/resource";

function rel(r: string): string {
    return "/admin/" + r
}

export const AdminRoutes : RouteDesc[] = [
    {
        type: RouteType.Exact,
        path: rel("profile/:id"),
        component: () => AdminProfile,
    },
    {
        type: RouteType.Exact,
        path: rel("resource"),
        component: () => AdminResourceForm,
    },
];