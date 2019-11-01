import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";

const logger: Logger = LU.getLogger(__filename);

export class ServerResponseConverter {
    public static convertVipCode(reqId: string, code: string): string {
        logger.info(LU.getStartMessage(reqId, "convertVipCode", {code}));

        const res: string = `${process.env.SERVER_URL}/register?code=${code}`;

        logger.info(LU.getFinishMessage(reqId, "convertVipCode", {res}));

        return res;
    }
}
