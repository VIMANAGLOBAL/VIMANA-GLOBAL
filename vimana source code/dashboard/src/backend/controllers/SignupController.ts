import * as uuid from "uuid";
import * as speakeasy from "speakeasy";

import {Key} from "speakeasy";
import {getRepository, getConnection, Repository, EntityManager} from "typeorm";

import {User, Verification, ResendMap, Code} from "../models";
import {NewUser} from "../types/clientRequestType";
import {ErrorCode} from "../constants/ErrorCode";
import {ServiceLocator} from "../util/ServiceLocator";
import {HashingUtil} from "../util/HashingUtil";
import {MailService} from "../util/MailService";
import {LetterType} from "../constants/LetterType";
import {VerificationLetterData, VipLetterData} from "../types/letterDataType";
import {LetterDataConverter} from "../converter/LetterDataConverter";
import {VerificationTarget} from "../constants/VerificationTarget";
import {ExpirationDate} from "../constants/ExpirationDate";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {UserDescription} from "../constants/UserDescription";

const logger: Logger = LU.getLogger(__filename);

export class SignupController {
    public static async isEmailUnique(reqId: string, email: string): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "isEmailUnique", {email}));

        const userRepo: Repository<User> = getRepository(User);
        const count: number = await userRepo.
        createQueryBuilder("user")
            .where("LOWER(user.email) = LOWER(:email)", { email })
            .getCount();

        logger.info(LU.getMessage(reqId, "isEmailUnique", "counted", {count}));

        if (count !== 0) {
            logger.warn(LU.getFailMessage(reqId, "isEmailUnique", "email isn't unique", {count}));
            throw new Error(ErrorCode.EMAIL_NOT_UNIQUE);
        }
    }

    private static _getExpirationDate(reqId: string): Date {
        logger.info(LU.getStartMessage(reqId, "_getExpirationDate"));

        const timestamp: number = Date.now() + ExpirationDate.VERIFICATION_LETTER;
        const expirationDate: Date = new Date();
        expirationDate.setTime(timestamp);

        logger.info(LU.getFinishMessage(reqId, "_getExpirationDate", {expirationDate}));

        return expirationDate;
    }

    public async resend(reqId: string, email: string): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "resend", {email}));

        const userRepo: Repository<User> = getRepository(User);
        const resendMapRepo: Repository<ResendMap> = getRepository(ResendMap);

        const users: User[] = await userRepo.find({where: {email}, relations: ["verifications"]});
        logger.info(LU.getMessage(reqId, "resend", "fetched users", {users}));

        if (!users || users.length === 0) {
            logger.warn(LU.getFailMessage(reqId, "resend", "user not found"));
            throw new Error(ErrorCode.NOT_FOUND);
        }

        const user: User = users[0];
        if (user.verified) {
            logger.warn(LU.getFailMessage(reqId, "resend", "user not verified", {user}));
            throw new Error(ErrorCode.USER_ALREADY_VERIFIED);
        }

        const maps: ResendMap[] = await resendMapRepo.find({where: {email, target: LetterType.VERIFICATION}});
        logger.info(LU.getMessage(reqId, "resend", "maps fetched", {maps}));

        if (maps && maps.length > 0) {
            const map: ResendMap = maps[0];
            map.sentTimestamp.setTime(map.sentTimestamp.getTime() + ExpirationDate.LETTER_RESEND);

            // if (map.sentTimestamp > new Date()) {
            //     logger.warn(LU.getFailMessage(reqId, "resend", "too early", {sent: map.sentTimestamp, current: new Date()}));
            //     throw new Error(ErrorCode.TOO_EARLY);
            // }

            return await this._resendWithCodeAndMap(reqId, user.verifications[0], map);
        } else {
            return await this._resend(reqId, user);
        }
    }

    public async verify(reqId: string, code: string): Promise<boolean> {
        logger.info(LU.getStartMessage(reqId, "verify", {code}));

        await getConnection().transaction(async (manager: EntityManager) => {
            const verificationRepo: Repository<Verification> = manager.getRepository(Verification);
            const verifications: Verification[] = await verificationRepo.find({where: {code}, relations: ["user"]});

            logger.info(LU.getMessage(reqId, "verify", "fetched verifications", {verifications}));

            if (!verifications || verifications.length === 0) {
                logger.warn(LU.getFailMessage(reqId, "verify", "verifications not found"));
                throw new Error(ErrorCode.NOT_FOUND);
            }

            const verification: Verification = verifications[0];
            if (verification.expirationTimestamp < new Date()) {
                logger.warn(LU.getFailMessage(reqId, "verify", "verification expired", {
                    current: new Date(),
                    verification: verification.expirationTimestamp,
                }));
                throw new Error(ErrorCode.EXPIRED);
            }

            verification.code = "";
            await verificationRepo.save(verification);
            logger.info(LU.getMessage(reqId, "verify", "verification code cleared", {verification}));

            const userRepo: Repository<User> = manager.getRepository(User);
            const user: User = verification.user;
            user.verified = true;
            await userRepo.save(user);
            logger.info(LU.getMessage(reqId, "verify", "user verified", {user}));
        });

        logger.info(LU.getFinishMessage(reqId, "verify"));

        return true;
    }

    public async register(reqId: string, user: NewUser): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "register", {user}));

        const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
        const userRepo: Repository<User> = getRepository(User);

        const count: number = await userRepo.count({where: {email: user.email}});
        logger.info(LU.getMessage(reqId, "register", "counted users with email", {email: user.email, count}));

        if (count !== 0) {
            logger.warn(LU.getFailMessage(reqId, "register", "email isn't unique", {email: user.email}));
            throw new Error(ErrorCode.EMAIL_NOT_UNIQUE);
        }

        if (user.password !== user.confirm) {
            logger.warn(LU.getFailMessage(reqId, "register", "password mismatch", {
                password: user.password,
                confirm: user.confirm,
            }));
            throw new Error(ErrorCode.PASSWORD_MISMATCH);
        }

        const vipCode: Code = await this._checkCode(reqId, user);

        await getConnection().transaction(async (manager: EntityManager) => {
            logger.info(LU.getMessage(reqId, "register", "started transaction"));

            const transactionUserRepo: Repository<User> = manager.getRepository(User);
            const verificationRepo: Repository<Verification> = manager.getRepository(Verification);

            const password: string = hashingUtil.saltPassword(reqId, user.password);
            const secretKey: Key = speakeasy.generateSecret({length: 20});
            const secret2fa: string = secretKey.base32;
            const userModel: User = new User({
                ...user,
                password,
                secret2fa,
                vipUser: vipCode !== null,
                description: UserDescription.INDIVIDUAL
            });
            logger.info(LU.getMessage(reqId, "register", "created user", {userModel}));

            await transactionUserRepo.insert(userModel);

            const insertedUser: User = await transactionUserRepo.findOne({where: {email: user.email}});
            logger.info(LU.getMessage(reqId, "register", "inserted user", {insertedUser}));

            const code: string = uuid.v4();
            const expirationTimestamp: Date = SignupController._getExpirationDate(reqId);

            const verification: Verification = new Verification({
                code,
                target: VerificationTarget.EMAIL,
                user: insertedUser,
                expirationTimestamp,
            });
            logger.info(LU.getMessage(reqId, "register", "created verification", {verification}));

            await verificationRepo.insert(verification);
            logger.info(LU.getMessage(reqId, "register", "inserted verification"));
            await this._sendVerificationLetter(reqId, code, userModel.email);

            // if (vipCode !== null) {
            //     await this._sendVipLetter(reqId, vipCode);
            // }

            logger.info(LU.getFinishMessage(reqId, "register"));
        });
    }

    private async _checkCode(reqId: string, user: NewUser): Promise<Code> {
        logger.info(LU.getStartMessage(reqId, "_checkCode", {user}));

        const codeRepo: Repository<Code> = getRepository(Code);

        if (!user.code) {
            return null;
        }

        const codes: Code[] = await codeRepo.find({where: {code: user.code}});
        logger.info(LU.getMessage(reqId, "_checkCode", "fetched codes by code", {codes, code: user.code}));

        if (!codes || codes.length === 0) {
            return null;
        }

        const code: Code = codes[0];
        if (code.email !== user.email) {
            return null;
        }

        await codeRepo.delete(code);
        logger.info(LU.getFinishMessage(reqId, "_checkCode"));

        return code;
    }

    private async _resend(reqId: string, user: User): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_resend", {user}));

        const map: ResendMap = new ResendMap({
            email: user.email,
            target: LetterType.VERIFICATION,
            sentTimestamp: new Date(),
        });

        return this._resendWithCodeAndMap(reqId, user.verifications[0], map);
    }

    private async _resendWithCodeAndMap(reqId: string, verification: Verification, map: ResendMap): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_resendWithCodeAndMap", {verification, map}));

        await getConnection().transaction(async (manager: EntityManager) => {
            logger.info(LU.getMessage(reqId, "_resendWithCodeAndMap", "transaction started"));

            const verificationRepo: Repository<Verification> = manager.getRepository(Verification);
            const resendMapRepo: Repository<ResendMap> = manager.getRepository(ResendMap);

            verification.expirationTimestamp = SignupController._getExpirationDate(reqId);
            await verificationRepo.save(verification);
            logger.info(LU.getMessage(reqId, "_resendWithCodeAndMap", "verification updated", {verification}));

            map.sentTimestamp = new Date();
            await resendMapRepo.save(map);
            logger.info(LU.getMessage(reqId, "_resendWithCodeAndMap", "map updated", {map}));

            await this._sendVerificationLetter(reqId, verification.code, map.email);
            logger.info(LU.getFinishMessage(reqId, "_resendWithCodeAndMap"));
        });
    }

    private async _sendVerificationLetter(reqId: string, code: string, email: string): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_sendVerificationLetter", {code, email}));

        const mailService: MailService = ServiceLocator.getInstance().getMailService();
        const letterData: VerificationLetterData = LetterDataConverter.convertVerificationLetterData(reqId, code);

        await mailService.sendEmail(reqId, email, LetterType.VERIFICATION, letterData);
        logger.info(LU.getFinishMessage(reqId, "_sendVerificationLetter"));
    }

    private async _sendVipLetter(reqId: string, code: Code): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_sendVipLetter", {code}));

        const mailService: MailService = ServiceLocator.getInstance().getMailService();
        const letterData: VipLetterData = LetterDataConverter.convertVipLetterData(reqId,
            code.name,
            code.contactName,
            code.contactPhone,
            code.contactMail);

        await mailService.sendEmail(reqId, code.email, LetterType.VIP, letterData);
        logger.info(LU.getFinishMessage(reqId, "_sendVipLetter"));
    }
}
