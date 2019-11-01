import {Response, Handler} from "express";

import {ClientRequestConverter} from "../../converter/ClientRequestConverter";
import {Route, Request} from "../../types";
import {HttpMethod} from "../../constants/HttpMethod";
import {SignupController} from "../../controllers/SignupController";
import {ErrorCode} from "../../constants/ErrorCode";
import {NewUser} from "../../types/clientRequestType";
import {Logger, LoggerUtil} from "../../util/LoggerUtil";

export function initSignupRoutes(): Route[] {
    const controller: SignupController = new SignupController();
    const logger: Logger = LoggerUtil.getLogger(__filename);

    /**
     * @api {get} /api/signup/verify-email verify email
     * @apiName email verification
     * @apiVersion 0.0.1
     * @apiGroup signup
     * @apiDescription in case of successfully verification app sets cookie "verified" to "true" value
     *
     * @apiParam {String} code verification code
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`,
     * `VERIFICATION_CODE_NOT_VALID`, `NOT_FOUND`, `EXPIRED`
     */
    const verify: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "verify", {body: req.body}));

            const code: string = ClientRequestConverter.convertVerificationCode(req.id, req.query);
            await controller.verify(req.id, code);

            logger.info(LoggerUtil.getFinishMessage(req.id, "verify"));

            res.cookie("verified", "true", {maxAge: 1000});
            res.redirect("/success/verify");
        } catch (err) {
            const valid: ErrorCode[] = [
                ErrorCode.VERIFICATION_CODE_NOT_VALID,
                ErrorCode.NOT_FOUND,
                ErrorCode.EXPIRED
            ];
            LoggerUtil.error(logger, err, valid, LoggerUtil.getFailMessage(req.id, "verify", "", {err}));

            res.cookie("verified", "true");
            if (err && err.message && valid.includes(err.message)) {
                res.redirect(`/failed/${err.message.toLowerCase().replace("_", "-")}`);
            } else {
                res.redirect("/failed");
            }
        } finally {
            req.release();
        }
    };

    /**
     * @api {post} /api/signup/check-email check email
     * @apiName email checking
     * @apiVersion 0.0.1
     * @apiGroup signup
     *
     * @apiParam {String} email entered email address
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`,
     * `EMAIL_NOT_VALID`, `EMAIL_NOT_UNIQUE`
     */
    const isEmailUnique: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "isEmailUnique", {body: req.body}));

            const email: string = ClientRequestConverter.convertEmail(req.id, req.body);
            await SignupController.isEmailUnique(req.id, email);

            logger.info(LoggerUtil.getFinishMessage(req.id, "isEmailUnique"));

            res.json({
                success: true,
            });
        } catch (err) {
            LoggerUtil.error(logger, err,
                [
                    ErrorCode.EMAIL_NOT_VALID,
                    ErrorCode.EMAIL_NOT_UNIQUE,
                ],
                LoggerUtil.getFailMessage(req.id, "isEmailUnique", "", {err}));
            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {post} /api/signup/resend resend verification letter
     * @apiName verification resending
     * @apiVersion 0.0.1
     * @apiGroup signup
     *
     * @apiParam {String} email email address for verification resending
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `NOT_FOUND`, `USER_ALREADY_VERIFIED`,
     * `TOO_EARLY`, `INTERNAL_ERROR`, `EMAIL_NOT_VALID`
     */
    const resend: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "resend", {body: req.body}));

            const email: string = ClientRequestConverter.convertEmail(req.id, req.body);
            await controller.resend(req.id, email);

            logger.info(LoggerUtil.getFinishMessage(req.id, "resend"));

            res.json({
                success: true,
            });
        } catch (err) {
            LoggerUtil.error(logger, err,
                [
                    ErrorCode.EMAIL_NOT_VALID,
                    ErrorCode.NOT_FOUND,
                    ErrorCode.USER_ALREADY_VERIFIED,
                    ErrorCode.TOO_EARLY
                ],
                LoggerUtil.getFailMessage(req.id, "resend", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {post} /api/signup/register register
     * @apiName user registration
     * @apiVersion 0.0.1
     * @apiGroup signup
     *
     * @apiParam {String} firstName first name
     * @apiParam {String} lastName last name
     * @apiParam {String} email email address
     * @apiParam {String} password password
     * @apiParam {String} confirm password confirmation
     * @apiParam {String} country country
     * @apiParam {String} address address
     * @apiParam {String} city city
     * @apiParam {String} state state
     * @apiParam {String} zipCode zipCode
     * @apiParam {String} phone phone in fully format
     * @apiParam {String} description user role description. can be one of: `INDIVIDUAL`, `SYNDICATE`,
     * `CRYPTO_FUND`, `VENTURE_FUND`, `STRATEGIC`, `GOVERNMENT_ENTITY`
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`, `FIRST_NAME_NOT_VALID`,
     * `LAST_NAME_NOT_VALID`, `EMAIL_NOT_VALID`, `PASSWORD_NOT_VALID`, `CONFIRM_NOT_VALID`, `COUNTRY_NOT_VALID`,
     * `ADDRESS_NOT_VALID`, `CITY_NOT_VALID`, `STATE_NOT_VALID`, `ZIP_CODE_NOT_VALID`, `PHONE_NOT_VALID`,
     * `DESCRIPTION_NOT_VALID`, `PASSWORD_MISMATCH`, `EMAIL_NOT_UNIQUE`
     */
    const registerUser: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "resend", {body: req.body}));

            const newUser: NewUser = ClientRequestConverter.convertNewUser(req.id, req.body, req.cookies);
            await controller.register(req.id, newUser);

            res.clearCookie("code");

            logger.info(LoggerUtil.getFinishMessage(req.id, "registerUser"));

            res.json({
                vip: !!newUser.code,
                success: true
            });
        } catch (err) {
            LoggerUtil.error(logger,
                err,
                [
                    ErrorCode.FIRST_NAME_NOT_VALID,
                    ErrorCode.LAST_NAME_NOT_VALID,
                    ErrorCode.EMAIL_NOT_VALID,
                    ErrorCode.PASSWORD_NOT_VALID,
                    ErrorCode.CONFIRM_NOT_VALID,
                    ErrorCode.COUNTRY_NOT_VALID,
                    ErrorCode.ADDRESS_NOT_VALID,
                    ErrorCode.CITY_NOT_VALID,
                    ErrorCode.STATE_NOT_VALID,
                    ErrorCode.ZIP_CODE_NOT_VALID,
                    ErrorCode.PHONE_NOT_VALID,
                    ErrorCode.DESCRIPTION_NOT_VALID,
                    ErrorCode.PASSWORD_MISMATCH,
                    ErrorCode.EMAIL_NOT_UNIQUE
                ],
                LoggerUtil.getFailMessage(req.id, "registerUser", "", {err}));

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
            path: "/api/signup/check-email",
            middleware: [],
            handler: isEmailUnique,
        },
        {
            method: HttpMethod.POST,
            path: "/api/signup/register",
            middleware: [],
            handler: registerUser,
        },
        {
            method: HttpMethod.POST,
            path: "/api/signup/resend",
            middleware: [],
            handler: resend,
        },
        {
            method: HttpMethod.GET,
            path: "/api/signup/verify-email",
            middleware: [],
            handler: verify,
        }
    ];
}
