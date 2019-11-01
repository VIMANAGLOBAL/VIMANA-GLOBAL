import {Application} from "express";

import {Route} from "../types";
import {requestMiddleware} from "../middleware/request";
import {initAdminRoutes} from "./admin";
import {initPublicRoutes} from "./public";
import {initProtectedRoutes} from "./protected";
import {Logger, LoggerUtil} from "../util/LoggerUtil";

const logger: Logger = LoggerUtil.getLogger(__filename);

export function initRoutes(app: Application): void {
    const routes: Route[] = [
        ...initAdminRoutes(),
        ...initPublicRoutes(),
        ...initProtectedRoutes(),
    ];

    for (const route of routes) {
        app[route.method](route.path, [requestMiddleware, ...route.middleware], route.handler);
        logger.info(LoggerUtil.getMessage("initialize", "initRoutes", "route initialized",
            {method: route.method, path: route.path}));
    }
}
