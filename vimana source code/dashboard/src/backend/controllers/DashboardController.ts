import {getRepository, Repository} from "typeorm";

import {Kyc, User, Verification} from "../models";
import {Investment, Rates, Transaction, TransactionHistory, UserInfo, UserInfoKyc} from "../types/serverResponseType";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {UserInvestment} from "../types/clientRequestType";
import {InvestmentLetterData} from "../types/letterDataType";
import {LetterDataConverter} from "../converter/LetterDataConverter";
import {MailService} from "../util/MailService";
import {ServiceLocator} from "../util/ServiceLocator";
import {LetterType} from "../constants/LetterType";
import {OnfidoUtil} from "../util/OnfidoUtil";
import {OnfidoCheck} from "../types";
import {OnfidoCheckStatus} from "../constants/OnfidoCheckStatus";
import {OnfidoCheckResult} from "../constants/OnfidoCheckResult";

const logger: Logger = LU.getLogger(__filename);

export class DashboardController {
    public static async userInfo(reqId: string, user: User): Promise<UserInfo> {
        logger.info(LU.getStartMessage(reqId, "userInfo", { user }));

        const userInfo: UserInfo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,

            email: user.email,
            vip: user.vipUser,
            country: user.country,
            enabled2fa: user.enabled2fa,

            kyc: await DashboardController.getKyc(reqId, user),

            address: user.address || undefined,
            city: user.city || undefined,
            state: user.state || undefined,
            zipCode: user.zipCode || undefined,
            phone: user.phone || undefined,
            description: user.description || [],
        };

        logger.info(LU.getFinishMessage(reqId, "userInfo", {userInfo}));

        return userInfo;
    }

    public static async acceptTerms(reqId: string, user: User): Promise<User> {
        logger.info(LU.getStartMessage(reqId, "acceptTerms", { user }));

        if (!user || user.confirmed) {
            logger.warn(
                LU.getFailMessage(reqId, "acceptTerms", "user didn't confirm his email", { user })
            );
            return user;
        }

        const userRepo: Repository<User> = getRepository(User);

        user.confirmed = true;
        await userRepo.save(user);

        logger.info(LU.getFinishMessage(reqId, "acceptTerms", { user }));

        return user;
    }

    public static getBalance(reqId: string, user: User): number {
        logger.info(LU.getStartMessage(reqId, "getBalance", { user }));

        if (!user) {
            logger.warn(LU.getFailMessage(reqId, "getBalance", "user is null", { user }));
            return -1;
        }

        logger.info(LU.getFinishMessage(reqId, "getBalance"));

        return 777;
    }

    public static async getInvestment(reqId: string, user: User): Promise<Investment> {
        logger.info(LU.getStartMessage(reqId, "getInvestment", { user }));

        if (!user) {
            logger.warn(LU.getFailMessage(reqId, "getInvestment", "user is null", { user }));
            return;
        }

        const userRepo: Repository<User> = getRepository(User);
        user = await userRepo.findOne(user.id);

        return {
            amount: user.investmentAmount ? user.investmentAmount.toString() : "",
            currency: user.investmentCurrency,
        };
    }

    public static getRates(reqId: string): Rates {
        logger.info(LU.getStartMessage(reqId, "getRates"));

        logger.info(LU.getFinishMessage(reqId, "getRates"));

        return {
            usd: 1.5,
            btc: 2.3,
            eur: 4.3
        };
    }

    public static getEndTimestamp(reqId: string): Date {
        logger.info(LU.getStartMessage(reqId, "getEndTimestamp"));

        const date: Date = new Date();
        date.setFullYear(2019);
        date.setMonth(4);
        date.setDate(28);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        logger.info(LU.getFinishMessage(reqId, "getEndTimestamp", { date }));

        return date;
    }

    public static async saveInvestment(
        reqId: string,
        userInvestment: UserInvestment,
        user: User
    ): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "saveInvestment", { userInvestment, user }));

        const userRepo: Repository<User> = getRepository(User);
        user = await userRepo.findOne(user.id);

        user.investmentAmount = userInvestment.amount;
        user.investmentCurrency = userInvestment.currency;

        await userRepo.save(user);

        const letterData: InvestmentLetterData = LetterDataConverter.convertInvestmentLetterData(
            reqId,
            user.email,
            user.phone,
            user.firstName,
            user.lastName,
            userInvestment.amount,
            userInvestment.currency
        );
        const mailService: MailService = ServiceLocator.getInstance().getMailService();
        mailService.sendEmail(reqId, process.env.INVESTMENT_MAIL, LetterType.INVESTMENT, letterData);

        logger.info(LU.getFinishMessage(reqId, "saveInvestment"));
    }

    public static getHistory(
        reqId: string,
        count: number,
        page: number,
        user: User
    ): TransactionHistory {
        logger.info(LU.getStartMessage(reqId, "getHistory", { count, page, user }));

        const history: Transaction[] = [
            {
                id: "0001",
                agent: "Alfabank LTD",
                transType: "Income",
                amount: 1,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0002",
                agent: "Some bank name LTD",
                transType: "Income",
                amount: 2,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0003",
                agent: "Placeholder LTD",
                transType: "Income",
                amount: 3,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0004",
                agent: "Alfabank LTD",
                transType: "Income",
                amount: 4,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0005",
                agent: "Placeholder LTD",
                transType: "Income",
                amount: 24000,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0006",
                agent: "Alfabank LTD",
                transType: "Income",
                amount: 5,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0007",
                agent: "Some LTD",
                transType: "Income",
                amount: 6,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0008",
                agent: "Other LTD",
                transType: "Income",
                amount: 7,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0009",
                agent: "Alfabank LTD",
                transType: "Income",
                amount: 4,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0010",
                agent: "Placeholder LTD",
                transType: "Income",
                amount: 24000,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0011",
                agent: "Alfabank LTD",
                transType: "Income",
                amount: 5,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0012",
                agent: "Some LTD",
                transType: "Income",
                amount: 6,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            },
            {
                id: "0013",
                agent: "Other LTD",
                transType: "Income",
                amount: 7,
                amountTokens: 1200,
                bonus: 20,
                currencyRate: 0.000423,
                bankId: "dnk235n2boifbo133afaaf",
                time: new Date()
            }
        ];
        const c: number = history.length;
        let h: Transaction[] = [];

        if (count > 7) {
            h = history.slice();
        } else {
            h = history.splice((page - 1) * count, count);
        }

        logger.info(LU.getFinishMessage(reqId, "getHistory", { count: c, history: h }));

        return {
            count: c,
            history: h
        };
    }

    private static async getKyc(reqId: string, user: User): Promise<UserInfoKyc> {
        logger.info(LU.getStartMessage(reqId, "getKyc", {user}));

        const kycRepo: Repository<Kyc> = getRepository(Kyc);
        const kyc: Kyc = await kycRepo.findOne({user});
        logger.info(LU.getMessage(reqId, "getKyc", "kyc fetched", {kyc}));

        if (kyc && kyc.inProgress && kyc.checkId) {
            const check: OnfidoCheck = await OnfidoUtil.retrieveCheck(reqId, kyc.applicantId, kyc.checkId);
            logger.info(LU.getMessage(reqId, "getKyc", "check fetched", {check}));

            switch (check.status) {
                case OnfidoCheckStatus.COMPLETE:
                    kyc.inProgress = false;
                    kyc.passed = check.result === OnfidoCheckResult.CLEAR;
                    break;

                case OnfidoCheckStatus.IN_PROGESS:
                    kyc.inProgress = true;
                    kyc.passed = false;
                    break;

                case OnfidoCheckStatus.REOPENED:
                    kyc.inProgress = false;
                    kyc.passed = false;
                    break;

                default:
                    logger.error(LU.getFailMessage(reqId, "getKyc", "unknown check status", {status: check.status}));
            }

            await kycRepo.save(kyc);
        }

        const userInfoKyc: UserInfoKyc = {
            inProgress: kyc ? kyc.inProgress : false,
            passed: kyc ? kyc.passed : false,
            failed: kyc ? !kyc.inProgress && !kyc.passed : false,
        };

        logger.info(LU.getFinishMessage(reqId, "getKyc", {userInfoKyc}));

        return userInfoKyc;
    }
}
