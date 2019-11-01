import {Handler, Response} from "express";

import {Request, Route} from "../../../types";
import {adminAuthenticationPresent} from "../../../middleware/authenticate";
import {initAdminPanelRoutes} from "./panel";

export function initAdminProtectedRoutes(): Route[] {
    const render: Handler = (req: Request, res: Response): void => {
        res.render("./index.ejs", {host: process.env.HOST, stylesheet: "adminPanel.css", script: "adminPanel.js", title: "Vimana Admin Panel"});
        req.release();
    };

    const routes: Route[] = [
        {
            method: "get",
            path: "/admin/panel*",
            middleware: [],
            handler: render,
        },
        ...initAdminPanelRoutes(),
    ];

    routes.forEach((route: Route) => {
        route.middleware.unshift(adminAuthenticationPresent);
    });

    return routes;
}
