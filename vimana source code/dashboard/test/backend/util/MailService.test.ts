import {mailcatcherConfig, MailService} from "../../../src/backend/util/MailService";
import * as nodemailerMock from "nodemailer-mock";
import * as path from "path";
import {LetterData, RecoverLetterData} from "../../../src/backend/types/letterDataType";

class MockedMailService extends MailService {
    public async _renderHtml(reqId: string, templatePath: string, templateData: LetterData): Promise<string> {
        return super._renderHtml(reqId, templatePath, templateData);
    }

    public async _send(reqId: string, receiver: string, subject: string, html: string): Promise<void> {
        return super._send(reqId, receiver, subject, html);
    }
}

describe("MailService", (): void => {
    const reqId: string = "test req id";

    let transport: any;
    let mailService: MockedMailService;

    beforeAll((): void => {
        transport = nodemailerMock.createTransport(mailcatcherConfig);
        transport.close = () => ({});
        mailService = new MockedMailService(transport);
    });

    describe("renderHtml", (): void => {
       it("should return rendered html data in string", async (): Promise<void> => {
            const data: RecoverLetterData = { password: "123" };
            const templatePath: string = path.resolve(__dirname, "../../../src/backend/templates/Recover.ejs");
            const renderedHtml: string = await mailService._renderHtml(reqId, templatePath, data);

            expect(renderedHtml).toBeDefined();
            expect(typeof renderedHtml).toEqual("string");
            expect(renderedHtml.includes("123")).toBeTruthy();
       });
    });

    describe("send", (): void => {
        it("should send letters", async (): Promise<void> => {
            const receiver: string = "receiver@receive.com";
            const subject: string = "subject";
            const html: string = "<body>123</body>";

            await mailService._send(reqId, receiver, subject, html);

            const sentMails: any[] = nodemailerMock.mock.sentMail();

            expect(sentMails).toBeDefined();
            expect(sentMails.length).toEqual(1);

            const mail: any = sentMails[0];

            expect(mail.to).toEqual(receiver);
            expect(mail.from).toEqual("admin@vimana.global");
            expect(mail.subject).toEqual(subject);
            expect(mail.html).toEqual(html);
        });
    });
});
