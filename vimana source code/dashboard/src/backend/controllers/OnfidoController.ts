import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {OnfidoWebhook, VerifyOnfido} from "../types/clientRequestType";
import {OnfidoUtil} from "../util/OnfidoUtil";
import {getRepository, Repository} from "typeorm";
import {Kyc, User} from "../models";
import {ErrorCode} from "../constants/ErrorCode";
import {OnfidoCheck} from "../types";
import {OnfidoCheckResult} from "../constants/OnfidoCheckResult";
import {WsUtil} from "../util/WsUtil";
import {ServiceLocator} from "../util/ServiceLocator";
import {WsAction} from "../constants/WsAction";

const logger: Logger = LU.getLogger(__filename);

export class OnfidoController {
    public static async webhook(reqId: string, body: OnfidoWebhook): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "webhook", {body}));

        const kycRepo: Repository<Kyc> = getRepository(Kyc);
        const kyc: Kyc = await kycRepo.findOne({checkId: body.id}, {relations: ["user"]});

        const check: OnfidoCheck = await OnfidoUtil.retrieveCheck(reqId, kyc.applicantId, kyc.checkId);

        if (kyc.inProgress) {
            kyc.inProgress = false;
            kyc.passed = check.result === OnfidoCheckResult.CLEAR;

            await kycRepo.save(kyc);

            const wsUtil: WsUtil = ServiceLocator.getInstance().getWsUtil();
            wsUtil.send(reqId, kyc.user.id, kyc.passed ? WsAction.KYC_PASSED : WsAction.KYC_FAILED);
        }
    }

    public static async verify(reqId: string, user: User, userInfo: VerifyOnfido): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "verify", { user }));

        const kycRepo: Repository<Kyc> = getRepository(Kyc);
        let kyc: Kyc = await kycRepo.findOne({user});

        if (kyc === undefined) {
            kyc = new Kyc({user, documentIds: []});
        } else if (kyc.inProgress) {
            logger.warn(LU.getMessage(reqId, "verify", "kyc is already in progress", {kyc}));
            throw new Error(ErrorCode.KYC_IN_PROGRESS);
        } else if (kyc.passed) {
            logger.warn(LU.getMessage(reqId, "verify", "kyc is already done", {kyc}));
            throw new Error(ErrorCode.KYC_ALREADY_DONE);
        }

        kyc.applicantId = kyc.applicantId ? kyc.applicantId :
            await OnfidoUtil.createApplicant(reqId,
                userInfo.firstName,
                userInfo.lastName,
                userInfo.country,
                userInfo.birthday,
                userInfo.email,
                userInfo.phone);

        for (const fileName in userInfo.files) {
            const file = userInfo.files[fileName];
            const documentId: string = await OnfidoUtil.uploadDocument(reqId, kyc.applicantId, userInfo.identificationType, file);
            kyc.documentIds.push(documentId);
        }
        kyc.checkId = await OnfidoUtil.createCheck(reqId, kyc.applicantId);
        kyc.inProgress = true;

        if (kyc.id) {
            await kycRepo.save(kyc);
        } else {
            await kycRepo.insert(kyc);
        }

        logger.info(LU.getFinishMessage(reqId, "verify", {kyc}));
    }
}
