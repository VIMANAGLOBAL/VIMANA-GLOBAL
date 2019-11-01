import * as qrCode from "qrcode";
import * as speakeasy from "speakeasy";

import {EntityManager, getConnection, Repository} from "typeorm";

import {ErrorCode} from "../constants/ErrorCode";
import {User, Verification} from "../models";
import {ServiceLocator} from "../util/ServiceLocator";
import {HashingUtil} from "../util/HashingUtil";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {SettingsQR} from "../types/serverResponseType";
import {Key} from "speakeasy";
import {Authenticate2fa, NewPassword, UserSettings} from "../types/clientRequestType";

const logger: Logger = LU.getLogger(__filename);

export class SettingsController {
    public static async saveSettings(reqId: string,
                                     newPass: NewPassword,
                                     authenticate2fa: Authenticate2fa,
                                     userSettings: UserSettings,
                                     user: User): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "saveSettings", {newPass, authenticate2fa, userSettings, user }));

        await getConnection().transaction(async (manager: EntityManager): Promise<void> => {
            if (newPass.newPass && newPass.currentPass && newPass.confirm) {
                await SettingsController.changePassword(reqId, newPass, user, manager);
            }

            if (typeof authenticate2fa.enable2fa !== "undefined" && authenticate2fa.enable2fa !== user.enabled2fa) {
                if (authenticate2fa.enable2fa) {
                    await SettingsController.enable2fa(reqId, authenticate2fa, user, manager);
                } else {
                    await SettingsController.disable2fa(reqId, user, manager);
                }
            }

            await SettingsController.saveUser(reqId, userSettings, user, manager);
        });
    }

    public static async deleteAccount(reqId: string,
                                      user: User): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "deleteAccount", { user }));

        await getConnection().transaction(async (manager: EntityManager): Promise<void> => {
            const verificationRepo: Repository<Verification> = manager.getRepository(Verification);
            const userRepo: Repository<User> = manager.getRepository(User);

            await verificationRepo.delete({user});
            await userRepo.delete({id: user.id});
        });
    }

    public static async generateQr(reqId: string, user: User): Promise<SettingsQR> {
        logger.info(LU.getStartMessage(reqId, "generateQr", {user}));

        const secretKey: Key = speakeasy.generateSecret({length: 20});
        const secret: string = secretKey.base32;

        const base64 = await qrCode.toDataURL(`otpauth://totp/SecretKey?secret=${secret}`);
        const matches = base64.match(/^data:image\/png;base64,(.+)$/);

        logger.info(LU.getFinishMessage(reqId, "generateQr"));

        return {
            buffer: new Buffer(matches[1], "base64"),
            secret,
        };
    }

    private static async saveUser(reqId: string, userSettings: UserSettings, user: User, manager: EntityManager): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "saveUser", {userSettings, user }));

        const userRepo: Repository<User> = manager.getRepository(User);

        user.firstName = userSettings.firstName || "";
        user.lastName = userSettings.lastName || "";
        user.address = userSettings.address || "";
        user.city = userSettings.city || "";
        user.description = userSettings.description;
        user.state = userSettings.state || "";
        user.zipCode = userSettings.zipCode || "";
        user.phone = userSettings.phone || "";
        user.country = userSettings.country || "";

        await userRepo.save(user);
    }

    private static async changePassword(reqId: string,
                                        passwordSettings: NewPassword,
                                        user: User,
                                        manager: EntityManager): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "changePassword", {passwordSettings, user}));

        const {
            currentPass,
            newPass,
            confirm,
        } = passwordSettings;

        if (newPass !== confirm) {
            logger.warn(LU.getFailMessage(reqId, "changePassword", "passwords mismatch", {newPass, confirm }));
            throw new Error(ErrorCode.PASSWORD_MISMATCH);
        }

        const userRepo: Repository<User> = manager.getRepository(User);
        const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
        const password: string = hashingUtil.saltPassword(reqId, currentPass);

        const users: User[] = await userRepo.find({where: {id: user.id, password}});
        logger.info(LU.getMessage(reqId, "changePassword", "fetched users", {users}));

        if (!users || users.length === 0) {
            logger.warn(LU.getMessage(reqId, "changePassword", "user not found", {users}));
            throw new Error(ErrorCode.WRONG_PASSWORD);
        }

        user.password = hashingUtil.saltPassword(reqId, newPass);
        await userRepo.save(user);
        logger.info(LU.getFinishMessage(reqId, "changePassword"));
    }

    private static async enable2fa(reqId: string, authenticate2fa: Authenticate2fa, user: User, manager: EntityManager): Promise<User> {
        logger.info(LU.getStartMessage(reqId, "enable2fa", {authenticate2fa, user}));

        const {
            token,
            secret,
        } = authenticate2fa;

        if (!user) {
            logger.warn(LU.getFailMessage(reqId, "enable2fa", "user is null", {user}));
            return user;
        }

        const userRepo: Repository<User> = manager.getRepository(User);
        const verified: boolean = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
        });

        if (!token || !verified) {
            logger.warn(LU.getFailMessage(reqId, "enable2fa", "can't verify user's token", {verified}));
            throw new Error(ErrorCode.WRONG_TOKEN);
        }

        user.enabled2fa = true;
        user.secret2fa = secret;
        await userRepo.save(user);

        logger.info(LU.getFinishMessage(reqId, "enable2fa", {user}));

        return user;
    }

    private static async disable2fa(reqId: string, user: User, manager: EntityManager): Promise<User> {
        logger.info(LU.getStartMessage(reqId, "disable2fa", {user}));

        if (!user || !user.enabled2fa) {
            logger.warn(LU.getFailMessage(reqId, "disable2fa", "2fa disabled or user is null", {user}));
            return user;
        }

        const userRepo: Repository<User> = manager.getRepository(User);
        user.enabled2fa = false;
        await userRepo.save(user);

        logger.info(LU.getFinishMessage(reqId, "disable2fa", {user}));

        return user;
    }
}
