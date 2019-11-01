import {Response, Handler} from "express";

import {Route, Request} from "../../types";
import {initSignupRoutes} from "./signup";
import {initSigninRoutes} from "./signin";
import {requireTokenAbsent} from "../../middleware/authenticate";
import {HttpMethod} from "../../constants/HttpMethod";
import {ClientRequestConverter} from "../../converter/ClientRequestConverter";
import {MailService} from "../../util/MailService";
import {ServiceLocator} from "../../util/ServiceLocator";
import {Logger, LoggerUtil} from "../../util/LoggerUtil";
import {initOnfidoPublicRoutes} from "./onfido";

export function initPublicRoutes(): Route[] {
    const logger: Logger = LoggerUtil.getLogger(__filename);

    const render: Handler = (req: Request, res: Response): void => {
        res.render("./index.ejs",
            {host: process.env.HOST, stylesheet: "signin.css", script: "signin.js", title: "Sign In"});
        req.release();
    };

    const renderEmail: Handler = async (req: Request, res: Response): Promise<any> => {
        try {
            const mailService: MailService = ServiceLocator.getInstance().getMailService();
            const data: any = ClientRequestConverter.convertShowEmail(req.id, req.query);
            const html: string = await mailService.getEmailHTML(req.id, data.type, data);
            res.send(html);
        } catch (err) {
            LoggerUtil.error(logger, err, [],
                LoggerUtil.getFailMessage(req.id, "renderEmail", "Incorrect query params", {err}));
            res.json({
                success: false
            });
        } finally {
            req.release();
        }
    };

    const renderSignup: Handler = (req: Request, res: Response): void => {
        if (req.query && req.query.code) {
            const code: string = ClientRequestConverter.convertRegisterCode(req.id, req.query);
            res.cookie("code", code);
            res.redirect(`/register`);
        } else {
            res.render("./index.ejs",
                {host: process.env.HOST, stylesheet: "signin.css", script: "signin.js", title: "Sign In"});
        }
        req.release();
    };

    const routes: Route[] = [
        {
            method: HttpMethod.GET,
            path: "/",
            middleware: [],
            handler: render,
        },
        {
            method: "get",
            path: "/login",
            middleware: [],
            handler: render,
        },
        {
            method: "get",
            path: "/success*",
            middleware: [],
            handler: render,
        },
        {
          method: "get",
          path: "/failed*",
          middleware: [],
          handler: render,
        },
        {
            method: "get",
            path: "/register",
            middleware: [],
            handler: renderSignup,
        },
        {
            method: "get",
            path: "/cookie-policy",
            middleware: [],
            handler: render,
        },
        {
            method: "get",
            path: "/privacy-policy",
            middleware: [],
            handler: render,
        },
        {
            method: "get",
            path: "/show-email",
            middleware: [],
            handler: renderEmail,
        },
        ...initSignupRoutes(),
        ...initSigninRoutes(),
        ...initOnfidoPublicRoutes(),
    ];

    routes.filter((route: Route) => route.path !== "/api/signin/logout").forEach((route: Route): void => {
        route.middleware.unshift(requireTokenAbsent);
    });

    return routes;
}
