import {Handler, Response} from "express";

import {Request, Route} from "../../types";
import {initSettingsRoutes} from "./settings";
import {initDashboardRoutes} from "./dashboard";
import {initOnfidoRoutes} from "./onfido";
import {requireTokenPresent} from "../../middleware/authenticate";
import {HttpMethod} from "../../constants/HttpMethod";

export function initProtectedRoutes(): Route[] {
    const render: Handler = (req: Request, res: Response): void => {
        res.render("./index.ejs",
            {host: process.env.HOST, stylesheet: "dashboard.css", script: "dashboard.js", title: "Vimana Dashboard"});
        req.release();
    };

    const renderTerms: Handler = (req: Request, res: Response): void => {
        res.redirect("/dashboard");
        // res.render("./index.ejs",
        //     {host: process.env.HOST, stylesheet: "terms.css", script: "terms.js", title: "Terms & Conditions"});
        req.release();
    };

    const routes: Route[] = [
        {
            method: "get",
            path: "/dashboard*",
            middleware: [],
            handler: render,
        },
        {
            method: HttpMethod.GET,
            path: "/terms-conditions",
            middleware: [],
            handler: renderTerms
        },
        ...initSettingsRoutes(),
        ...initDashboardRoutes(),
        ...initOnfidoRoutes()
    ];

    routes.forEach((route: Route): void => {
        route.middleware.unshift(requireTokenPresent);
    });

    return routes;
}
