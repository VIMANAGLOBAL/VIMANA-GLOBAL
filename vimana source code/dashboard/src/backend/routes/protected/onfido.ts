import {Response, Handler} from "express";

import {Request, Route} from "../../types";
import {ErrorCode} from "../../constants/ErrorCode";
import {HttpMethod} from "../../constants/HttpMethod";
import {Logger, LoggerUtil} from "../../util/LoggerUtil";
import {ClientRequestConverter} from "../../converter/ClientRequestConverter";
import {VerifyOnfido} from "../../types/clientRequestType";
import {OnfidoController} from "../../controllers/OnfidoController";
import {User} from "../../models";

export function initOnfidoRoutes(): Route[] {
    const logger: Logger = LoggerUtil.getLogger(__filename);

    /**
     * @api {post} /api/onfido/verify send request to onfido service to verify user
     * @apiName onfido verify
     * @apiVersion 0.0.1
     * @apiGroup onfido
     *
     * @apiParam {String} firstName user first name
     * @apiParam {String} lastName user last name
     * @apiParam {String} country user country
     * @apiParam {String} identificationType identification type
     * @apiParam {String} files user document
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of:
     * `FIRST_NAME_NOT_VALID`, `LAST_NAME_NOT_VALID`, `COUNTRY_NOT_VALID`, `IDENTIFICATION_TYPE_NOT_VALID`
     */
    const verify: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "verify", {body: req.body}));

            const onfido: VerifyOnfido = ClientRequestConverter.convertVerifyOnfido(req.id, req.body, req.files);
            await OnfidoController.verify(req.id, req.user as User, onfido);

            logger.info(LoggerUtil.getFinishMessage(req.id, "verify"));

            res.json({
                success: true,
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [
                    ErrorCode.FIRST_NAME_NOT_VALID,
                    ErrorCode.LAST_NAME_NOT_VALID,
                    ErrorCode.COUNTRY_NOT_VALID,
                    ErrorCode.IDENTIFICATION_TYPE_NOT_VALID],
                LoggerUtil.getFailMessage(req.id, "verify", "", {err}));

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
            path: "/api/onfido/verify",
            middleware: [],
            handler: verify,
        },
    ];
}
