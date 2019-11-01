import {Response, Handler} from "express";

import {User} from "../../models";
import {Request, Route} from "../../types";
import {ErrorCode} from "../../constants/ErrorCode";
import {HttpMethod} from "../../constants/HttpMethod";
import {Logger, LoggerUtil} from "../../util/LoggerUtil";
import {SettingsQR} from "../../types/serverResponseType";
import {SaveSettings} from "../../types/clientRequestType";
import {SettingsController} from "../../controllers/SettingsController";
import {ClientRequestConverter} from "../../converter/ClientRequestConverter";

export function initSettingsRoutes(): Route[] {
    const logger: Logger = LoggerUtil.getLogger(__filename);

    /**
     * @api {get} /api/settings/qr generate qr-code
     * @apiName qr
     * @apiVersion 0.0.1
     * @apiGroup settings
     *
     * @apiSuccess {String} src source of qr-code in .png image
     * @apiError {String} src blank string
     */
    const qr: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            const settingsQr: SettingsQR = await SettingsController.generateQr(req.id, req.user as User);
            req.session.secret2fa = settingsQr.secret;
            res.send(settingsQr.buffer);
        } catch (err) {
            res.send("");
        } finally {
            req.release();
        }
    };

    /**
     * @api {post} /api/settings/save save settings
     * @apiName save settings
     * @apiVersion 0.0.1
     * @apiGroup settings
     *
     * @apiParam {String} currentPass current user password (required only for password changing)
     * @apiParam {String} newPass new user password (required only for password changing)
     * @apiParam {String} confirm new user password confirmation (required only for password changing)
     * @apiParam {boolean} enable2fa flag that shows is 2fa enabled or not (required only for 2fa enabling/disabling)
     * @apiParam {String} token password from Google Authenticator app (required only for 2fa enabling/disabling)
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`, `PASSWORD_NOT_VALID`,
     * `NEW_PASSWORD_NOT_VALID`, `CONFIRM_NOT_VALID`, `WRONG_TOKEN`, `PASSWORD_MISMATCH`, `WRONG_PASSWORD`
     */
    const save: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "save", {body: req.body}));

            const settings: SaveSettings = ClientRequestConverter.convertSaveSettings(req.id, req.body, req.session.secret2fa);
            await SettingsController.saveSettings(req.id, settings.newPass, settings.authenticate2fa, settings.user, req.user as User);

            logger.info(LoggerUtil.getFinishMessage(req.id, "save"));

            res.json({
                success: true,
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [
                    ErrorCode.PASSWORD_NOT_VALID,
                    ErrorCode.NEW_PASSWORD_NOT_VALID,
                    ErrorCode.CONFIRM_NOT_VALID,
                    ErrorCode.WRONG_TOKEN,
                    ErrorCode.PASSWORD_MISMATCH,
                    ErrorCode.WRONG_PASSWORD],
                LoggerUtil.getFailMessage(req.id, "save", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {delete} /api/settings/delete-account delete user account
     * @apiName delete user account
     * @apiVersion 0.0.1
     * @apiGroup settings
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const deleteAccount: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "deleteAccount", {body: req.body}));

            await SettingsController.deleteAccount(req.id, req.user as User);
            req.logout();
            req.session.destroy(() => {});

            logger.info(LoggerUtil.getFinishMessage(req.id, "deleteAccount"));

            res.json({
                success: true,
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [
                    ErrorCode.PASSWORD_NOT_VALID,
                    ErrorCode.NEW_PASSWORD_NOT_VALID,
                    ErrorCode.CONFIRM_NOT_VALID,
                    ErrorCode.WRONG_TOKEN,
                    ErrorCode.PASSWORD_MISMATCH,
                    ErrorCode.WRONG_PASSWORD],
                LoggerUtil.getFailMessage(req.id, "deleteAccount", "", {err}));

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
            method: HttpMethod.GET,
            path: "/api/settings/qr",
            middleware: [],
            handler: qr,
        },
        {
            method: HttpMethod.POST,
            path: "/api/settings/save",
            middleware: [],
            handler: save,
        },
        {
            method: HttpMethod.DELETE,
            path: "/api/settings/delete-account",
            middleware: [],
            handler: deleteAccount,
        },
    ];
}
