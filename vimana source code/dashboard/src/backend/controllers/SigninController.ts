import {EntityManager, getConnection, getRepository, Repository} from "typeorm";

import {AdminUser} from "../types";
import {MailService} from "../util/MailService";
import {HashingUtil} from "../util/HashingUtil";
import {Admin, ResendMap, User} from "../models";
import {ErrorCode} from "../constants/ErrorCode";
import {RandomString} from "../util/RandomString";
import {LetterType} from "../constants/LetterType";
import {ServiceLocator} from "../util/ServiceLocator";
import {RecoverLetterData} from "../types/letterDataType";
import {ExpirationDate} from "../constants/ExpirationDate";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {LetterDataConverter} from "../converter/LetterDataConverter";

const logger: Logger = LU.getLogger(__filename);

export class SigninController {
    public static async adminSignin(reqId: string, username: string, password: string): Promise<AdminUser> {
        logger.info(LU.getStartMessage(reqId, "adminSignin", {username, password}));

        const adminRepo: Repository<Admin> = getRepository(Admin);
        const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();

        const saltedUsername: string = hashingUtil.saltAdminUsername(reqId, username);
        const saltedPassword: string = hashingUtil.saltAdminPassword(reqId, password);

        const admins: Admin[] = await adminRepo.find(
            {where: {username: saltedUsername, password: saltedPassword, verified: true}});
        logger.info(LU.getMessage(reqId, "adminSignin", "fetched admins", {admins}));

        if (admins && admins.length === 1) {
            const res: AdminUser = {
                id: admins[0].id,
                username,
            };
            logger.info(LU.getFinishMessage(reqId, "adminSignin", {res}));

            return res;
        }

        logger.warn(LU.getFailMessage(reqId, "adminSignin", "wrong username or pass", {username, password}));
        throw new Error(ErrorCode.WRONG_EMAIL_OR_PASS);
    }

    public async recover(reqId: string, email: string): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "recover", {email}));

        const userRepo: Repository<User> = getRepository(User);
        const resendMapRepo: Repository<ResendMap> = getRepository(ResendMap);

        const users: User[] = await userRepo.find({where: {email, verified: true}});
        logger.info(LU.getMessage(reqId, "recover", "fetched users", {users}));

        if (!users || users.length === 0) {
            logger.warn(LU.getFailMessage(reqId, "recover", "user not found"));
            throw new Error(ErrorCode.NOT_FOUND);
        }

        const user: User = users[0];
        if (!user.verified) {
            logger.warn(LU.getFailMessage(reqId, "recover", "user not verified", {user}));
            throw new Error(ErrorCode.NOT_FOUND);
        }

        const maps: ResendMap[] = await resendMapRepo.find({where: {email, target: LetterType.RECOVER}});
        logger.info(LU.getMessage(reqId, "recover", "maps fetched", {maps}));

        if (maps && maps.length > 0) {
            const map: ResendMap = maps[0];
            map.sentTimestamp.setTime(map.sentTimestamp.getTime() + ExpirationDate.LETTER_RESEND);

            // if (map.sentTimestamp > new Date()) {
            //     logger.warn(LU.getFailMessage(reqId, "recover", "too early", {sent: map.sentTimestamp, current: new Date()}));
            //     throw new Error(ErrorCode.TOO_EARLY);
            // }

            return await this._recoverWithMap(reqId, user, map);
        } else {
            return await this._recover(reqId, user);
        }
    }

    private async _recover(reqId: string, user: User): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_recover", {user}));

        const map: ResendMap = new ResendMap({email: user.email, target: LetterType.RECOVER, sentTimestamp: new Date()});

        return this._recoverWithMap(reqId, user, map);
    }

    private async _recoverWithMap(reqId: string, user: User, map: ResendMap): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_recoverWithMap", {user, map}));

        await getConnection().transaction(async (manager: EntityManager) => {
            const userRepo: Repository<User> = manager.getRepository(User);
            const resendMapRepo: Repository<ResendMap> = manager.getRepository(ResendMap);

            const randomString: RandomString = ServiceLocator.getInstance().getRandomStringUtil();
            const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
            const mailService: MailService = ServiceLocator.getInstance().getMailService();

            const password: string = randomString.getRandomString(false, 10);

            user.password = hashingUtil.saltPassword(reqId, password);
            await userRepo.save(user);

            logger.info(LU.getMessage(reqId, "_recoverWithMap", "changed user password", {user}));

            map.sentTimestamp = new Date();
            await resendMapRepo.save(map);

            logger.info(LU.getMessage(reqId, "_recoverWithMap", "changed sentTimestamp", {map}));

            const data: RecoverLetterData = LetterDataConverter.convertRecoverLetterData(reqId, password);
            await mailService.sendEmail(reqId, user.email, LetterType.RECOVER, data);
            logger.info(LU.getFinishMessage(reqId, "_recoverWithMap"));
        });
    }
}
