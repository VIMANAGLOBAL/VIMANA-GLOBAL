import {Request, Route} from "../../types";
import {HttpMethod} from "../../constants/HttpMethod";
import {Logger, LoggerUtil as LU} from "../../util/LoggerUtil";
import {Handler, Response} from "express";
import {OnfidoUtil} from "../../util/OnfidoUtil";
import {OnfidoWebhook} from "../../types/clientRequestType";
import {ClientRequestConverter} from "../../converter/ClientRequestConverter";
import {OnfidoController} from "../../controllers/OnfidoController";

const logger: Logger = LU.getLogger(__filename);

export function initOnfidoPublicRoutes(): Route[] {
    const webhook: Handler = async (req: Request, res: Response): Promise<void> => {
        console.info(LU.getStartMessage(req.id, "webhook", {body: req.body}));

        setTimeout(async () => {
            const body: OnfidoWebhook = ClientRequestConverter.convertOnfidoWebhook(req.id, req.body);
            await OnfidoController.webhook(req.id, body);
            console.info(LU.getFinishMessage(req.id, "webhook"));
            res.end();
        }, 5000);
    };

    const registerWebhook: Handler = async (req: Request, res: Response) => {
        logger.info(LU.getStartMessage(req.id, "registerWebhook"));

        await OnfidoUtil.registerWebhook(req.id);

        res.json({
            success: true,
        });

        logger.info(LU.getFinishMessage(req.id, "registerWebhook"));
    };

    return [
        {
            method: HttpMethod.GET,
            path: "/api/onfido/register-webhook",
            middleware: [],
            handler: registerWebhook,
        },
        {
            method: HttpMethod.POST,
            path: "/api/onfido/webhook",
            middleware: [],
            handler: webhook,
        }
    ];
}
