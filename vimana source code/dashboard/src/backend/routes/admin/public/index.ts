import {Response, Handler} from "express";

import {Route, Request} from "../../../types";
import {adminAuthenticationAbsent} from "../../../middleware/authenticate";
import {HttpMethod} from "../../../constants/HttpMethod";
import {initAdminSigninRoutes} from "./signin";

export function initPublicAdminRoutes(): Route[] {
    const render: Handler = (req: Request, res: Response): void => {
        res.render("./index.ejs", {host: process.env.HOST, stylesheet: "adminSignin.css", script: "adminSignin.js", title: "Sign In"});
        req.release();
    };

    const redirect: Handler = (req: Request, res: Response): void => {
        res.redirect("/admin/signin");
        req.release();
    };

    const routes: Route[] = [
        {
            method: HttpMethod.GET,
            path: "/admin/signin",
            middleware: [],
            handler: render,
        },
        {
            method: HttpMethod.GET,
            path: "/admin",
            middleware: [],
            handler: redirect,
        },
        ...initAdminSigninRoutes(),
    ];

    routes.filter((route: Route) => route.path !== "/api/admin/logout").forEach((route: Route) => {
        route.middleware.unshift(adminAuthenticationAbsent);
    });

    return routes;
}

