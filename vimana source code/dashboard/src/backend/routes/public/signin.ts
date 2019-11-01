import * as passport from "passport";

import {Response, Handler} from "express";
import {IVerifyOptions} from "passport-local";

import {Request, Route} from "../../types";
import {SigninController} from "../../controllers/SigninController";
import {HttpMethod} from "../../constants/HttpMethod";
import {ErrorCode} from "../../constants/ErrorCode";
import {ClientRequestConverter} from "../../converter/ClientRequestConverter";
import {User} from "../../models";
import {Logger, LoggerUtil as LU} from "../../util/LoggerUtil";
import {Login} from "../../types/clientRequestType";

export function initSigninRoutes(): Route[] {
    const controller: SigninController = new SigninController();
    const logger: Logger = LU.getLogger(__filename);

    /**
     * @api {post} /api/signin/login login
     * @apiName log in
     * @apiVersion 0.0.1
     * @apiGroup signin
     *
     * @apiParam {String} email email address
     * @apiParam {String} password password
     * @apiParam {String} token code from Google Authenticator (not required)
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`, `WRONG_EMAIL_OR_PASS`,
     * `REQUIRED_2FA`
     */
    const login: Handler = (req: Request, res: Response): void => {
        logger.info(LU.getStartMessage(req.id, "login", {body: req.body}));

        const loginBody: Login = ClientRequestConverter.convertLogin(req.id, req.body);
        if (typeof loginBody.token !== "undefined") {
            passport.authenticate("2fa", (err: any, user: User, payload: IVerifyOptions) => {
                if (err) {
                    LU.error(logger, err, [ErrorCode.WRONG_EMAIL_OR_PASS], LU.getFailMessage(req.id, "login2fa", "", {err}));

                    res.json({
                        success: false,
                        errorCode: err.message || ErrorCode.INTERNAL_ERROR,
                    });
                    req.release();
                } else if (user) {
                    req.logIn(user, (e): void => {
                        if (e) {
                            LU.error(logger, e, [ErrorCode.WRONG_EMAIL_OR_PASS], LU.getFailMessage(req.id, "login2fa", "req.logIn", {err: e}));

                            res.json({
                                success: false,
                                errorCode: e.message || ErrorCode.INTERNAL_ERROR,
                            });
                        } else {
                            logger.info(LU.getFinishMessage(req.id, "login2fa"));

                            res.json({
                                success: true,
                            });
                        }
                        req.release();
                    });
                } else {
                    LU.error(logger, payload, [ErrorCode.WRONG_EMAIL_OR_PASS, ErrorCode.WRONG_TOKEN],
                        LU.getFailMessage(req.id, "login2fa", "", {err: payload}));
                    res.json({
                        success: false,
                        errorCode: payload.message,
                    });
                    req.release();
                }
            })(req, res);
        } else {
            passport.authenticate("local", (err: any, user, payload: IVerifyOptions): void => {
                if (err) {
                    LU.error(logger, err, [ErrorCode.WRONG_EMAIL_OR_PASS, ErrorCode.REQUIRED_2FA], LU.getFailMessage(req.id, "login", "", {err}));

                    res.json({
                        success: false,
                        errorCode: err.message || ErrorCode.INTERNAL_ERROR,
                    });
                    req.release();
                } else if (user) {
                    req.logIn(user, (e: any): void => {
                        if (e) {
                            LU.error(logger, e, [ErrorCode.WRONG_EMAIL_OR_PASS, ErrorCode.REQUIRED_2FA],
                                LU.getFailMessage(req.id, "login", "req.logIn", {err: e}));

                            res.json({
                                success: false,
                                errorCode: e.message || ErrorCode.INTERNAL_ERROR,
                            });
                        } else {
                            logger.info(LU.getFinishMessage(req.id, "login"));

                            res.json({
                                success: true,
                            });
                        }
                        req.release();
                    });
                } else {
                    LU.error(logger, payload, [ErrorCode.WRONG_EMAIL_OR_PASS, ErrorCode.REQUIRED_2FA], LU.getFailMessage(req.id, "login", "",
                            {err: payload}));

                    res.json({
                        success: false,
                        errorCode: payload.message,
                    });
                    req.release();
                }
            })(req, res);
        }
    };

    /**
     * @api {post} /api/signin/recover recover password
     * @apiName recover
     * @apiVersion 0.0.1
     * @apiGroup signin
     *
     * @apiParam {String} email user's email to recover
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`, `NOT_FOUND`, `TOO_EARLY`
     */
    const recover: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LU.getStartMessage(req.id, "recover", {body: req.body}));

            const email: string = ClientRequestConverter.convertEmail(req.id, req.body);
            await controller.recover(req.id, email);

            logger.info(LU.getFinishMessage(req.id, "recover"));

            res.json({
                success: true,
            });
        } catch (err) {
            LU.error(logger, err, [ErrorCode.NOT_FOUND, ErrorCode.TOO_EARLY, ErrorCode.EMAIL_NOT_VALID],
                LU.getFailMessage(req.id, "recover", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {get} /api/signin/logout logout
     * @apiName logout
     * @apiVersion 0.0.1
     * @apiGroup signin
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const logout: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LU.getStartMessage(req.id, "logout"));

            req.logout();
            req.session.destroy(() => {});

            logger.info(LU.getFinishMessage(req.id, "logout"));

            res.json({
                success: true,
            });
        } catch (err) {
            LU.error(logger, err, [], LU.getFailMessage(req.id, "logout", "", {err}));

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
            path: "/api/signin/login",
            middleware: [],
            handler: login,
        },
        {
            method: HttpMethod.POST,
            path: "/api/signin/recover",
            middleware: [],
            handler: recover,
        },
        {
            method: HttpMethod.GET,
            path: "/api/signin/logout",
            middleware: [],
            handler: logout,
        }
    ];
}
