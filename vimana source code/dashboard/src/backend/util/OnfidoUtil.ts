import { ErrorCode } from "../constants/ErrorCode";
import * as request from "request-promise";
import {Logger, LoggerUtil as LU, LoggerUtil} from "./LoggerUtil";
import {OnfidoCheck} from "../types";

const logger: Logger = LoggerUtil.getLogger(__filename);

export class OnfidoUtil {
    public static async registerWebhook(reqId: string): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "registerWebhook"));

        const getOptions = {
            method: "GET",
            uri: "https://api.onfido.com/v2/webhooks/",
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
        };

        const getResponse = await request(getOptions);
        const jsonResponse = JSON.parse(getResponse);

        if (jsonResponse.webhooks && jsonResponse.webhooks.length >= 2) {
            console.info(LU.getMessage(reqId, "registerWebhook", "webhooks already have been registered", {wh: jsonResponse.webhooks}));
            return;
        }

        const url = `${process.env.SERVER_URL}/api/onfido/webhook`;
        const options = {
            method: "POST",
            uri: `https://api.onfido.com/v2/webhooks?url=${url}` +
                `&events[]=check.completed`,
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
        };

        const response = await request(options);
        console.info(LU.getFinishMessage(reqId, "registerWebhook", {response}));
    }

    public static async createApplicant(reqId: string,
                                        firstName: string,
                                        lastName: string,
                                        country: string,
                                        birthday: string,
                                        email: string,
                                        phone: string): Promise<string> {
        logger.info(LU.getStartMessage(reqId, "createApplicant", {firstName, lastName, country}));

        const options = {
            method: "POST",
            uri: `https://api.onfido.com/v2/applicants?first_name=${firstName}&last_name=${lastName}` +
                `&country=${country}&dob=${birthday}&email=${email}&mobile=${phone}`,
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
        };

        let response;

        try {
            response = await request(options);
        } catch (err) {
            if (err && err.message && err.message.indexOf("422") === 0) {
                throw new Error(ErrorCode.UNSUPPORTED_COUNTRY);
            }
            throw err;
        }

        if (!response) {
            logger.error(LU.getMessage(reqId, "createApplicant", "Response is null!"));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }
        const jsonResponse = JSON.parse(response);
        if (!jsonResponse || !jsonResponse.id) {
            logger.error(LU.getMessage(reqId, "createApplicant", "No json response", {jsonResponse}));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        logger.info(LU.getFinishMessage(reqId, "createApplicant", {id: jsonResponse.id}));

        return jsonResponse.id;
    }

    public static async uploadDocument(reqId: string, applicantId: string, type: string, file: any): Promise<string> {
        logger.info(LU.getStartMessage(reqId, "uploadDocument", {applicantId, type}));

        const options = {
            method: "POST",
            uri: `https://api.onfido.com/v2/applicants/${applicantId}/documents`,
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
            formData: {
                type: type.toLowerCase(),
                file: {
                    value: file.data,
                    options: {
                        filename: file.name,
                        contentType: file.mimetype
                    }
                }
            }
        };

        const response = await request(options);
        if (!response) {
            logger.error(LU.getMessage(reqId, "uploadDocument", "Response is null!"));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        const jsonResponse = JSON.parse(response);
        if (!jsonResponse || !jsonResponse.id) {
            logger.error(LU.getMessage(reqId, "uploadDocument", "No json response", {jsonResponse}));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        logger.info(LU.getFinishMessage(reqId, "uploadDocument", {id: jsonResponse.id}));

        return jsonResponse.id;
    }

    public static async createCheck(reqId: string, applicantId: string): Promise<string> {
        logger.info(LU.getStartMessage(reqId, "createCheck", {applicantId}));

        const options = {
            method: "POST",
            uri: `https://api.onfido.com/v2/applicants/${applicantId}/checks?type=express&reports[][name]=document`,
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
        };

        const response = await request(options);
        if (!response) {
            logger.error(LU.getMessage(reqId, "createCheck", "Response is null!"));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        const jsonResponse = JSON.parse(response);
        if (!jsonResponse || !jsonResponse.id) {
            logger.error(LU.getMessage(reqId, "createCheck", "No json response", {jsonResponse}));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        logger.info(LU.getFinishMessage(reqId, "createCheck", {id: jsonResponse.id}));

        return jsonResponse.id;
    }

    public static async retrieveCheck(reqId: string, applicantId: string, checkId: string): Promise<OnfidoCheck> {
        logger.info(LU.getStartMessage(reqId, "retrieveCheck", {applicantId, checkId}));

        const options = {
            method: "GET",
            uri: `https://api.onfido.com/v2/applicants/${applicantId}/checks/${checkId}`,
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
        };

        const response = await request(options);
        if (!response) {
            logger.error(LU.getMessage(reqId, "retrieveCheck", "Response is null"));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        const jsonResponse = JSON.parse(response);
        if (!jsonResponse) {
            logger.error(LU.getMessage(reqId, "retrieveCheck", "No json response", {jsonResponse}));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        const res: OnfidoCheck = {
            status: jsonResponse.status,
            result: jsonResponse.result,
        };

        logger.info(LU.getFinishMessage(reqId, "retrieveCheck", {res}));

        return res;
    }

    public static async checkReport(reqId: string, checkId: string): Promise<string> {
        logger.info(LU.getStartMessage(reqId, "checkReport", {checkId}));

        const options = {
            method: "GET",
            uri: `https://api.onfido.com/v2/checks/${checkId}/reports`,
            headers: {
                "Authorization": `Token token=${process.env.ONFIDO_TOKEN}`,
            },
        };

        const response = await request(options);
        if (!response) {
            logger.error(LU.getMessage(reqId, "checkReport", "Response is null"));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        const jsonResponse = JSON.parse(response);
        if (!jsonResponse) {
            logger.error(LU.getMessage(reqId, "checkReport", "No json response", {jsonResponse}));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        const reports = jsonResponse.reports;
        if (!reports || !reports.length) {
            logger.error(LU.getMessage(reqId, "checkReport", "No reports in check", {checkId}));
            throw new Error(ErrorCode.INTERNAL_ERROR);
        }

        return reports[0].result;
    }
}
