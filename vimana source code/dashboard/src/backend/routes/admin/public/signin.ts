import {Handler, Response} from "express";

import {Request, Route} from "../../../types";
import {HttpMethod} from "../../../constants/HttpMethod";
import {ErrorCode} from "../../../constants/ErrorCode";
import {Logger, LoggerUtil} from "../../../util/LoggerUtil";
import {adminAuthenticationPresent} from "../../../middleware/authenticate";
import {SigninController} from "../../../controllers/SigninController";
import {AdminSignin} from "../../../types/clientRequestType";
import {ClientRequestConverter} from "../../../converter/ClientRequestConverter";

export function initAdminSigninRoutes(): Route[] {
    const adminLogin: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            const adminSignin: AdminSignin = ClientRequestConverter.convertAdminSignin(req.id, req.body);
            req.session.admin = await SigninController.adminSignin(req.id, adminSignin.username, adminSignin.password);

            res.json({
                success: true,
            });
        } catch (err) {
            res.json({
                success: false,
                errorCode: err.message,
            });
        } finally {
            req.release();
        }
    };

    const adminLogout: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            req.session.admin = undefined;
            req.session.destroy(() => {});

            res.json({
                success: true,
            });
        } catch (err) {
            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    return [
        {
            method: HttpMethod.POST,
            path: "/api/admin/login",
            middleware: [],
            handler: adminLogin,
        },

        {
            method: HttpMethod.GET,
            path: "/api/admin/logout",
            middleware: [adminAuthenticationPresent],
            handler: adminLogout,
        }
    ];
}