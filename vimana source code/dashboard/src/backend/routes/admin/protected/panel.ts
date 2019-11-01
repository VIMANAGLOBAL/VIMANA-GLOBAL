import {Handler, Response} from "express";

import {Request, Route} from "../../../types";
import {ErrorCode} from "../../../constants/ErrorCode";
import {HttpMethod} from "../../../constants/HttpMethod";
import {FetchContent, LinkCreation, VipLetter} from "../../../types/clientRequestType";
import {PanelController} from "../../../controllers/PanelController";
import {ClientRequestConverter} from "../../../converter/ClientRequestConverter";
import {Logger, LoggerUtil as LU} from "../../../util/LoggerUtil";

const logger: Logger = LU.getLogger(__filename);

export function initAdminPanelRoutes(): Route[] {
    const generateLink: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LU.getStartMessage(req.id, "generateLink", {body: req.body}));

            const linkCreation: LinkCreation = ClientRequestConverter.convertLinkCreation(req.id, req.body);
            const link: string = await PanelController.generateLink(req.id, linkCreation);

            logger.info(LU.getFinishMessage(req.id, "generateLink", {link}));

            res.json({
                success: true,
                payload: link,
            });
        } catch (err) {
            LU.error(logger, err, [ErrorCode.EMAIL_NOT_UNIQUE, ErrorCode.EMAIL_NOT_VALID],
                LU.getFailMessage(req.id, "generateLink", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    const sendWelcomeLetter: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LU.getStartMessage(req.id, "sendWelcomeLetter", {body: req.body}));

            const letter: VipLetter = ClientRequestConverter.convertVipWelcomeLetter(req.id, req.body);
            await PanelController.sendVipLetter(req.id, letter);

            logger.info(LU.getFinishMessage(req.id, "sendWelcomeLetter"));

            res.json({
                success: true,
            });
        } catch (err) {
            LU.error(logger, err, [ErrorCode.EMAIL_NOT_UNIQUE, ErrorCode.EMAIL_NOT_VALID],
                LU.getFailMessage(req.id, "sendWelcomeLetter", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR,
            });
        } finally {
            req.release();
        }
    };

    const fetchFiles: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            const files: string[] = await PanelController.fetchFiles();

            res.json({
                success: true,
                payload: files,
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

    const fetchContent: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            const fetchContentBody: FetchContent = ClientRequestConverter.convertFetchContent(req.body);
            const content: string[] = await PanelController.fetchContent(fetchContentBody.current, fetchContentBody.part, fetchContentBody.filter);

            res.json({
                success: true,
                payload: content,
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
            method: HttpMethod.GET,
            path: "/api/admin/fetch-files",
            middleware: [],
            handler: fetchFiles,
        },
        {
            method: HttpMethod.POST,
            path: "/api/admin/fetch-content",
            middleware: [],
            handler: fetchContent,
        },
        {
            method: HttpMethod.POST,
            path: "/api/admin/create-link",
            middleware: [],
            handler: generateLink,
        },
        {
            method: HttpMethod.POST,
            path: "/api/admin/send-welcome-letter",
            middleware: [],
            handler: sendWelcomeLetter,
        }
    ];
}
