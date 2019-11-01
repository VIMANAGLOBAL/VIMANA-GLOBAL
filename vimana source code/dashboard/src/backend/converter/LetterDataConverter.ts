import {InvestmentLetterData, RecoverLetterData, VerificationLetterData, VipLetterData, VipWelcomeLetterData} from "../types/letterDataType";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";

const logger: Logger = LU.getLogger(__filename);

export class LetterDataConverter {
    public static convertVerificationLetterData(reqId: string, code: string): VerificationLetterData {
        logger.info(LU.getStartMessage(reqId, "convertVerificationLetterData", {code}));

        const link: string = `${process.env.SERVER_URL}/api/signup/verify-email?code=${code}`;

        logger.info(LU.getFinishMessage(reqId, "convertVerificationLetterData", {link}));

        return {link};
    }

    public static convertVipLetterData(reqId: string, name: string, contactName: string, contactPhone: string, contactMail: string): VipLetterData {
        logger.info(LU.getStartMessage(reqId, "convertVipLetterData", {name, contactName, contactPhone, contactMail }));

        const res: VipLetterData = {
            serverUrl: process.env.SERVER_URL,
            name,
            contactMail,
            contactName,
            contactPhone,
        };

        logger.info(LU.getFinishMessage(reqId, "convertVipLetterData", {res}));

        return res;
    }

    public static convertVipWelcomeLetterData(reqId: string,
                                              prefix: string | null,
                                              link: string,
                                              name: string,
                                              contactName: string,
                                              contactPhone: string,
                                              contactMail: string): VipWelcomeLetterData {
        logger.info(LU.getStartMessage(reqId, "convertVipWelcomeLetterData", {prefix, name, link, contactName, contactPhone, contactMail }));

        const res: VipWelcomeLetterData = {
            serverUrl: process.env.SERVER_URL,
            prefix,
            link,
            name,
            contactMail,
            contactName,
            contactPhone,
        };

        logger.info(LU.getFinishMessage(reqId, "convertVipWelcomeLetterData", {res}));

        return res;
    }

    public static convertRecoverLetterData(reqId: string, password: string): RecoverLetterData {
        logger.info(LU.getStartMessage(reqId, "convertRecoverLetterData", {password}));

        return {password};
    }

    public static convertInvestmentLetterData(reqId: string,
                                              email: string,
                                              phone: string,
                                              firstName: string,
                                              lastName: string,
                                              amount: string,
                                              currency: string): InvestmentLetterData {
        logger.info(LU.getStartMessage(reqId, "convertInvestmentLetterData", {firstName, lastName, amount, currency}));

        const fName: string = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const lName: string = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        const username: string = fName + " " + lName;
        const res: InvestmentLetterData = {
            email,
            phone: phone ? `Phone: ${phone}` : "",
            username,
            amount,
            currency,
        };

        logger.info(LU.getFinishMessage(reqId, "convertInvestmentLetterData", {res}));

        return res;
    }
}
