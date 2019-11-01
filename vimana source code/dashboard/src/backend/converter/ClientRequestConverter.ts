import {ServiceLocator} from "../util/ServiceLocator";
import {Validator} from "../util/validator/Validator";
import {ErrorCode} from "../constants/ErrorCode";
import {
    AdminSignin,
    Authenticate2fa,
    FetchContent,
    History, LinkCreation,
    Login,
    NewPassword,
    NewUser,
    SaveSettings,
    UserInvestment,
    UserSettings, VipLetter,
    VerifyOnfido, OnfidoWebhook
} from "../types/clientRequestType";
import {UserDescriptions} from "../constants/UserDescription";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {LetterType} from "../constants/LetterType";

const validator: Validator = ServiceLocator.getInstance().getValidator();
const logger: Logger = LU.getLogger(__filename);

export class ClientRequestConverter {
    public static convertInvestment(reqId: string, body: any): UserInvestment {
        logger.info(LU.getStartMessage(reqId, "convertInvestment", {body}));

        console.log("AMOUNT", body.amount);
        if (body.amount) {
            body.amount = body.amount.replace(",", ".");
        }

        const convertNumber: (val: number) => string = (val: number): string => {
            return val.toString().replace(/^(\d+)\.(\d+)e\+(\d+)$/,  ($0, $1, $2, $3) => {
                const before: string = $2.substr(0, +$3);
                const after: string = $2.substr(before.length);
                return $1 + before + ( after ? "." + after : new Array( +$3 - before.length + 1).join("0") );
            });
        };

        const currency: string = body.currency;
        const amount: string = convertNumber(body.amount);

        if (!validator.validateString(currency)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertInvestment", "currency not valid", {currency})
            );
            throw new Error(ErrorCode.CURRENCY_NOT_VALID);
        }

        if (!validator.validateNumber(+amount) || +amount !== +amount) {
            logger.warn(
                LU.getFailMessage(reqId, "convertInvestment", "amount not valid", {amount})
            );
            throw new Error(ErrorCode.AMOUNT_NOT_VALID);
        }

        const res: UserInvestment = {
            currency: currency.toUpperCase(),
            amount
        };

        logger.info(LU.getFinishMessage(reqId, "convertInvestment", {res}));

        return res;
    }

    public static convertRegisterCode(reqId: string, query: any): string {
        logger.info(LU.getStartMessage(reqId, "convertRegisterCode", {query}));

        const code: string = query.code;

        logger.info(LU.getFinishMessage(reqId, "convertRegisterCode", {code}));

        return code;
    }

    public static convertLogin(reqId: string, body: any): Login {
        logger.info(LU.getStartMessage(reqId, "convertLogin", {body}));

        const email: string = body.email;
        const password: string = body.password;
        const token: string = body.token;

        if (!validator.validateString(email)) {
            logger.warn(LU.getFailMessage(reqId, "convertLogin", "email not valid", {email}));
            throw new Error(ErrorCode.EMAIL_NOT_VALID);
        }

        if (!validator.validateString(password)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertLogin", "password not valid", {password})
            );
            throw new Error(ErrorCode.PASSWORD_NOT_VALID);
        }

        if (token && token.length && !validator.validateString(token)) {
            logger.warn(LU.getFailMessage(reqId, "convertLogin", "token not valid", {token}));
            throw new Error(ErrorCode.WRONG_TOKEN);
        }

        const res: Login = {
            email,
            password,
            token
        };

        logger.info(LU.getFinishMessage(reqId, "convertLogin", {res}));

        return res;
    }

    public static convertAdminSignin(reqId: string, body: any): AdminSignin {
        logger.info(LU.getStartMessage(reqId, "convertAdminSignin", {body}));

        const username: string = body.username;
        const password: string = body.password;

        if (!validator.validateString(username)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertAdminSignin", "username not valid", {username})
            );
            throw new Error(ErrorCode.USERNAME_NOT_VALID);
        }

        if (!validator.validateString(password)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertAdminSignin", "password not valid", {password})
            );
            throw new Error(ErrorCode.PASSWORD_NOT_VALID);
        }

        const res: AdminSignin = {
            username,
            password
        };

        logger.info(LU.getFinishMessage(reqId, "convertAdminSignin", {res}));

        return res;
    }

    public static convertTransactionHistory(reqId: string, body: any, params: any): History {
        logger.info(LU.getStartMessage(reqId, "convertTransactionHistory", {body, params}));

        const count: number = body.count;
        const page: number = +params.page;

        if (!validator.validateNumber(count, {min: 1, max: 100, isInteger: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertTransactionHistory", "count not valid", {count})
            );
            throw new Error(ErrorCode.COUNT_NOT_VALID);
        }

        if (!validator.validateNumber(page, {min: 1, max: 10000000, isInteger: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertTransactionHistory", "page not valid", {page})
            );
            throw new Error(ErrorCode.PAGE_NOT_VALID);
        }

        const res: History = {
            count,
            page
        };

        logger.info(LU.getFinishMessage(reqId, "convertTransactionHistory", {res}));

        return res;
    }

    public static convertSaveSettings(reqId: string, body: any, secret2fa: any): SaveSettings {
        logger.info(LU.getStartMessage(reqId, "convertSaveSettings", {body}));

        const res: SaveSettings = {
            authenticate2fa: ClientRequestConverter.convertAuthenticate2fa(reqId, body, secret2fa),
            newPass: ClientRequestConverter.convertNewPassword(reqId, body),
            user: ClientRequestConverter.convertUserSettings(reqId, body)
        };

        logger.info(LU.getFinishMessage(reqId, "convertSaveSettings", {res}));

        return res;
    }

    public static convertUserSettings(reqId: string, body: any): UserSettings {

        logger.info(LU.getStartMessage(reqId, "convertSaveSettings", {body}));

        const user: UserSettings = {
            firstName: body.firstName,
            lastName: body.lastName,
            country: body.country,
            address: body.address,
            city: body.city,
            state: body.state,
            zipCode: body.zipCode,
            phone: body.phone,
            description: body.description
        };

        if (!validator.validateString(user.firstName, {min: 1, max: 50, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "firstName not valid", {
                    firstName: user.firstName})
            );
            throw new Error(ErrorCode.FIRST_NAME_NOT_VALID);
        }
        if (!validator.validateString(user.lastName, {min: 1, max: 50, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "lastName not valid", {
                    lastName: user.lastName})
            );
            throw new Error(ErrorCode.LAST_NAME_NOT_VALID);
        }
        if (
            user.country &&
            typeof user.country !== "undefined" &&
            !validator.validateString(user.country, {min: 0, max: 200, trim: true})
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "address not valid", {
                    address: user.address
                })
            );
            throw new Error(ErrorCode.ADDRESS_NOT_VALID);
        }
        if (
            user.address &&
            typeof user.address !== "undefined" &&
            !validator.validateString(user.address, {min: 0, max: 200, trim: true})
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "address not valid", {
                    address: user.address
                })
            );
            throw new Error(ErrorCode.ADDRESS_NOT_VALID);
        }
        if (
            user.city &&
            typeof user.city !== "undefined" &&
            !validator.validateString(user.city, {min: 0, max: 200, trim: true})
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "city not valid", {city: user.city})
            );
            throw new Error(ErrorCode.CITY_NOT_VALID);
        }
        if (
            user.state &&
            typeof user.state !== "undefined" &&
            !validator.validateString(user.state, {min: 1, max: 200, trim: true})
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "state not valid", {state: user.state})
            );
            throw new Error(ErrorCode.STATE_NOT_VALID);
        }
        if (
            user.zipCode &&
            typeof user.zipCode !== "undefined" &&
            !validator.validateString(user.zipCode, {min: 1, max: 20, trim: true})
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "zipCode not valid", {
                    zipCode: user.zipCode
                })
            );
            throw new Error(ErrorCode.ZIP_CODE_NOT_VALID);
        }
        if (
            user.phone &&
            typeof user.phone !== "undefined" &&
            !validator.validateString(user.phone, {min: 1, max: 20, trim: true})
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "phone not valid", {phone: user.phone})
            );
            throw new Error(ErrorCode.PHONE_NOT_VALID);
        }
        if (
            user.description &&
            !validator.validateArrayInArray(user.description, UserDescriptions)
        ) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "description not valid", {
                    description: user.description
                })
            );
            throw new Error(ErrorCode.DESCRIPTION_NOT_VALID);
        }

        return user;
    }

    public static convertEmail(reqId: string, body: any): string {
        logger.info(LU.getStartMessage(reqId, "convertEmail", {body}));

        const email: string = body.email;

        if (!validator.validateMail(email)) {
            logger.warn(LU.getFailMessage(reqId, "convertEmail", "email not valid", {email}));
            throw new Error(ErrorCode.EMAIL_NOT_VALID);
        }

        logger.info(LU.getFinishMessage(reqId, "convertEmail", {email}));

        return email;
    }

    public static convertVerificationCode(reqId: string, query: any): string {
        logger.info(LU.getStartMessage(reqId, "convertVerificationCode", {query}));

        const code: string = query.code;

        if (!validator.validateString(code, {min: 36, max: 36, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertVerificationCode", "verification code not valid", {
                    code
                })
            );
            throw new Error(ErrorCode.VERIFICATION_CODE_NOT_VALID);
        }

        logger.info(LU.getFinishMessage(reqId, "convertVerificationCode", {code}));

        return code;
    }

    public static convertNewUser(reqId: string, body: any, cookies: any): NewUser {
        logger.info(LU.getStartMessage(reqId, "convertNewUser", {body, cookies}));

        const firstName: string = body.firstName;
        const lastName: string = body.lastName;
        const email: string = body.email;
        const password: string = body.password;
        const confirm: string = body.confirm;
        const country: string = body.country;

        const code: string = cookies.code;

        if (!validator.validateString(firstName, {min: 1, max: 50, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "firstName not valid", {firstName})
            );
            throw new Error(ErrorCode.FIRST_NAME_NOT_VALID);
        }
        if (!validator.validateString(lastName, {min: 1, max: 50, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "lastName not valid", {lastName})
            );
            throw new Error(ErrorCode.LAST_NAME_NOT_VALID);
        }
        if (!validator.validateMail(email)) {
            logger.warn(LU.getFailMessage(reqId, "convertNewUser", "email not valid", {email}));
            throw new Error(ErrorCode.EMAIL_NOT_VALID);
        }
        if (!validator.validateString(password, {min: 6, max: 1000, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "password not valid", {password})
            );
            throw new Error(ErrorCode.PASSWORD_NOT_VALID);
        }
        if (!validator.validateString(confirm, {min: 6, max: 1000, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "confirm not valid", {confirm})
            );
            throw new Error(ErrorCode.CONFIRM_NOT_VALID);
        }
        if (!validator.validateString(country, {min: 1, max: 200, trim: true})) {
            logger.warn(
                LU.getFailMessage(reqId, "convertNewUser", "country not valid", {country})
            );
            throw new Error(ErrorCode.COUNTRY_NOT_VALID);
        }

        const res: NewUser = {
            firstName,
            lastName,
            password,
            confirm,
            country,
            email,

            code
        };

        logger.info(LU.getFinishMessage(reqId, "convertNewUser", {res}));

        return res;
    }

    public static convertFetchContent(body: any): FetchContent {
        const current: string = body.current;
        const part: number = body.part;
        const filter: any = body.filter;

        return {
            current,
            part,
            filter
        };
    }

    public static convertLinkCreation(reqId: string, body: any): LinkCreation {
        logger.info(LU.getStartMessage(reqId, "convertLinkCreation", {body}));

        const email: string = body.email;
        const name: string = body.name;
        const contactPhone: string = body.contactPhone;
        const contactMail: string = body.contactMail;
        const contactName: string = body.contactName;

        const res: LinkCreation = {
            email,
            name,
            contactMail,
            contactName,
            contactPhone,
        };

        logger.info(LU.getFinishMessage(reqId, "convertLinkCreation", {res}));

        return res;
    }

    public static convertVipWelcomeLetter(reqId: string, body: any): VipLetter {
        logger.info(LU.getStartMessage(reqId, "convertVipWelcomeLetter", {body}));

        const prefix: string = body.prefix || "";
        const email: string = body.email;
        const link: string = body.link;
        const name: string = body.name;
        const contactPhone: string = body.contactPhone;
        const contactMail: string = body.contactMail;
        const contactName: string = body.contactName;

        const res: VipLetter = {
            prefix,
            email,
            link,
            name,
            contactMail,
            contactName,
            contactPhone,
        };

        logger.info(LU.getFinishMessage(reqId, "convertVipWelcomeLetter", {res}));

        return res;
    }

    public static convertShowEmail(reqId: string, query: any): any {
        logger.info(LU.getStartMessage(reqId, "convertShowEmail", {query}));

        const type = query.type;
        query.type = void(0);
        let res: any = query;

        if (!type || type !== LetterType.VIP_WELCOME && type !== LetterType.VERIFICATION) {
            logger.warn(LU.getFailMessage(reqId, "convertShowEmail", "type not valid", {type}));
            throw new Error(ErrorCode.TYPE_NOT_VALID);
        }
        if (type === LetterType.VIP_WELCOME) {
            res = this.convertVipWelcomeLetter(reqId, query);
        }
        if (type === LetterType.VERIFICATION) {
            const link: string = query.link;
            if (!link) {
                logger.warn(LU.getFailMessage(reqId, "convertShowEmail", "link not valid", {link}));
                throw new Error(ErrorCode.LINK_NOT_VALID);
            }
            res.link = link;
        }

        res.type = type;
        res.serverUrl = process.env.SERVER_URL;
        res.browserLink = query.browserLink || "";

        logger.info(LU.getFinishMessage(reqId, "convertShowEmail", {res}));

        return res;
    }

    public static convertOnfidoWebhook(reqId: string, body: any): OnfidoWebhook {
        logger.info(LU.getStartMessage(reqId, "convertOnfidoWebhook", {body}));

        const res: OnfidoWebhook = {
            id: body.payload.object.id,
        };

        logger.info(LU.getFinishMessage(reqId, "convertOnfidoWebhook", {res}));

        return res;
    }

    public static convertVerifyOnfido(reqId: string, body: any, files: any): VerifyOnfido {
        logger.info(LU.getStartMessage(reqId, "convertVerifyOnfido"));

        const email: string = body.email;
        const phone: string = body.phone;
        const firstName: string = body.firstName;
        const lastName: string = body.lastName;
        const country: string = body.country;
        const identificationType: string = body.identificationType;
        const birthday: string = body.birthday;

        if (!validator.validateString(firstName)) {
            logger.warn(LU.getFailMessage(reqId, "convertVerifyOnfido", "first name not valid", {firstName}));
            throw new Error(ErrorCode.FIRST_NAME_NOT_VALID);
        }

        if (!validator.validateString(lastName)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertVerifyOnfido", "last name not valid", {lastName})
            );
            throw new Error(ErrorCode.LAST_NAME_NOT_VALID);
        }

        if (!validator.validateString(country)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertVerifyOnfido", "country not valid", {lastName})
            );
            throw new Error(ErrorCode.COUNTRY_NOT_VALID);
        }

        if (!validator.validateString(identificationType)) {
            logger.warn(
                LU.getFailMessage(reqId, "convertVerifyOnfido", "identification type not valid", {lastName})
            );
            throw new Error(ErrorCode.IDENTIFICATION_TYPE_NOT_VALID);
        }

        const res: VerifyOnfido = {
            email,
            phone,
            firstName,
            lastName,
            country,
            identificationType,
            birthday,
            files
        };

        logger.info(LU.getFinishMessage(reqId, "convertVerifyOnfido"));

        return res;
    }

    private static convertNewPassword(reqId: string, body: any): NewPassword {
        logger.info(LU.getStartMessage(reqId, "convertNewPassword", {body}));

        const currentPass: string = body.currentPass;
        const newPass: string = body.newPass;
        const confirm: string = body.confirm;

        if (currentPass || newPass || confirm) {
            if (!validator.validateString(currentPass, {min: 6, max: 1000, trim: true})) {
                logger.warn(
                    LU.getFailMessage(reqId, "convertNewPassword", "currentPass not valid", {
                        currentPass
                    })
                );
                throw new Error(ErrorCode.PASSWORD_NOT_VALID);
            }
            if (!validator.validateString(newPass, {min: 6, max: 1000, trim: true})) {
                logger.warn(
                    LU.getFailMessage(reqId, "convertNewPassword", "newPass not valid", {newPass})
                );
                throw new Error(ErrorCode.NEW_PASSWORD_NOT_VALID);
            }
            if (!validator.validateString(confirm, {min: 6, max: 1000, trim: true})) {
                logger.warn(
                    LU.getFailMessage(reqId, "convertNewPassword", "confirm not valid", {confirm})
                );
                throw new Error(ErrorCode.CONFIRM_NOT_VALID);
            }
        }

        const res: NewPassword = {
            currentPass,
            newPass,
            confirm
        };

        logger.info(LU.getFinishMessage(reqId, "convertNewPassword", {res}));

        return res;
    }

    private static convertAuthenticate2fa(
        reqId: string,
        body: any,
        secret2fa: any
    ): Authenticate2fa {
        logger.info(LU.getStartMessage(reqId, "convertAuthenticate2fa", {body}));

        const enable2faString: string = body.enable2fa;
        const enable2fa: boolean =
            enable2faString === "true" ? true : enable2faString === "false" ? false : undefined;
        const token: string = body.token;

        if (typeof enable2faString === "string" && typeof enable2fa !== "undefined") {
            // @todo improve me
            // if (body.enable2fa === "true" && !validator.validateString(token, {regexp: /^\d+$/})) {
            //     logger.warn(LU.getFailMessage(reqId, "convertAuthenticate2fa", "token not valid", {token}));
            //     throw new Error(ErrorCode.WRONG_TOKEN);
            // }
        }

        const res: Authenticate2fa = {
            enable2fa,
            token,
            secret: secret2fa
        };

        logger.info(LU.getFinishMessage(reqId, "convertAuthenticate2fa", {res}));

        return res;
    }
}
