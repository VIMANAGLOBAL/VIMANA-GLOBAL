import * as nodemailer from "nodemailer";
import * as path from "path";
import * as ejs from "ejs";
import * as fs from "fs-extra-promise";
import * as Mail from "nodemailer/lib/mailer";

import {LetterType} from "../constants/LetterType";
import {LetterData} from "../types/letterDataType";
import {Logger, LoggerUtil as LU} from "./LoggerUtil";

const logger: Logger = LU.getLogger(__filename);

export const nodemailConfig: any = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "login",
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
};

export const mailcatcherConfig: any = {
    host: "mailcatcher",
    port: 1025
};

export class MailService {
    private transport: Mail;

    constructor(transport: Mail = null) {
        this.transport =
            transport === null ? nodemailer.createTransport(nodemailConfig) : transport;
    }

    public async sendEmail(
        reqId: string,
        receiver: string,
        type: LetterType,
        data: LetterData
    ): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "sendEmail", { receiver, type, data }));
        data.serverUrl = data.serverUrl || process.env.SERVER_URL;

        const {templatePath, subject} = this.checkType(type, data);
        let browserLink: string = `${data.serverUrl}/show-email?type=${type}&browserLink=/dashboard&`;

        Object.keys(data).forEach((key) => {
            browserLink += `${key}=${data[key]}&`;
        });

        const html: string = await this._renderHtml(reqId, templatePath, {...data, browserLink});

        return this._send(reqId, receiver, subject, html);
    }

    public async getEmailHTML(reqId, type, data): Promise<string> {
        const { templatePath } = this.checkType(type);

        return await this._renderHtml(reqId, templatePath, data);
    }

    protected async _send(
        reqId: string,
        receiver: string,
        subject: string,
        html: string
    ): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "_send", { receiver, subject }));

        const mailOptions: Mail.Options = {
            from: process.env.MAILER_FROM,
            to: receiver,
            subject,
            html
        };

        await this.transport
            .sendMail(mailOptions)
            .then(() => {
                logger.info(LU.getFinishMessage(reqId, "_send"));
                this.transport.close();
            })
            .catch((err) => {
                logger.error(LU.getFailMessage(reqId, "_send", "", { err }));

                this.transport.close();

                throw err;
            });
    }

    protected checkType(type: LetterType, data: any = {}) {
        let templatePath: string;
        let subject: string;

        switch (type) {
            case LetterType.VIP:
                templatePath = path.join(__dirname, `../../email/basic.html`);
                subject = "VIMANA Selected VIMANA Supporters Allocation";
                break;

            case LetterType.VIP_WELCOME:
                templatePath = path.join(__dirname, `../../email/basic.html`);
                subject = "VIMANA Selected VIMANA Supporters Allocation";
                break;

            case LetterType.VERIFICATION:
                templatePath = path.join(__dirname, `../../email/verify.html`);
                subject = "Verification email VIMANA Blockchain Airspace Network";
                break;

            case LetterType.RECOVER:
                templatePath = path.join(__dirname, `../templates/Recover.ejs`);
                subject = "Password recovering VIMANA Blockchain Airspace Network";
                break;

            case LetterType.INVESTMENT:
                templatePath = path.join(__dirname, `../templates/Investment.ejs`);
                subject = `New Vimana project investment - ${data.username} <${data.email}>`;
                break;

            default:
                console.error(`Unknown letter type: ${type}`);
                throw new Error("Unknown letter type");
        }

        return {
            templatePath,
            subject
        };
    }

    protected async _renderHtml(
        reqId: string,
        templatePath: string,
        templateData: LetterData
    ): Promise<string> {
        logger.info(LU.getStartMessage(reqId, "_renderHtml", { templatePath, templateData }));

        let data: string = await fs.readFileAsync(templatePath, "utf-8");
        data = data.replace(/%=/g, "<%=").replace(/=%/g, "%>");

        return ejs.render(data, templateData);
    }
}
