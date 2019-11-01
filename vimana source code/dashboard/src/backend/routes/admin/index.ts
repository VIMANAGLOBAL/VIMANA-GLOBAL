import {Route} from "../../types";
import {initPublicAdminRoutes} from "./public";
import {initAdminProtectedRoutes} from "./protected";

export function initAdminRoutes(): Route[] {
    return [
        ...initPublicAdminRoutes(),
        ...initAdminProtectedRoutes(),
    ]
}