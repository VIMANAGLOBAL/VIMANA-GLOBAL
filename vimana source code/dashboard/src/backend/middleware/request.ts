import * as express from "express";

import {Request} from "../types";
import {ServiceLocator} from "../util/ServiceLocator";
import {RandomString} from "../util/RandomString";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";

const logger: Logger = LU.getLogger(__filename);
const randomStringUtil: RandomString = ServiceLocator.getInstance().getRandomStringUtil();

export const requestMiddleware: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id: string = randomStringUtil.getRandomString();
    const request: Request = req as Request;

    request.id = id;
    request.release = () => {
        randomStringUtil.release(id);
        logger.info(LU.getMessage(id, "requestMiddleware", "released"));
    };

    logger.info(LU.getMessage(id, "requestMiddleware", "applied"));

    next();
};
