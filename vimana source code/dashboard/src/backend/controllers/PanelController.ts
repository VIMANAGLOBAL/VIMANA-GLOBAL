import * as uuid from "uuid";
import * as path from "path";
import * as es from "event-stream";
import {MapStream} from "event-stream";
import * as fs from "fs-extra-promise";
import {getRepository, Repository} from "typeorm";

import {Code, User} from "../models";
import {ErrorCode} from "../constants/ErrorCode";
import {ContentFilter, LinkCreation, VipLetter} from "../types/clientRequestType";
import {ExpirationDate} from "../constants/ExpirationDate";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {ServerResponseConverter} from "../converter/ServerResponseConverter";
import {MailService} from "../util/MailService";
import {ServiceLocator} from "../util/ServiceLocator";
import {VipWelcomeLetterData} from "../types/letterDataType";
import {LetterDataConverter} from "../converter/LetterDataConverter";
import {LetterType} from "../constants/LetterType";

const logger: Logger = LU.getLogger(__filename);

export class PanelController {
    public static async generateLink(reqId: string, creation: LinkCreation): Promise<string> {
        logger.info(LU.getStartMessage(reqId, "generateLink", {creation}));

        const userRepo: Repository<User> = getRepository(User);
        const codeRepo: Repository<Code> = getRepository(Code);

        const users: User[] = await userRepo.find({where: {email: creation.email}});
        logger.info(LU.getMessage(reqId, "generateLink", "fetched users", {users}));

        if (users && users.length) {
            throw new Error(ErrorCode.EMAIL_NOT_UNIQUE);
        }
        if (!creation.email) {
            throw new Error(ErrorCode.EMAIL_NOT_VALID);
        }

        const codes: Code[] = await codeRepo.find({where: {email: creation.email}});
        logger.info(LU.getMessage(reqId, "generateLink", "fetched codes", {codes}));

        let codeHash: string;

        if (codes && codes.length) {
            const code = codes[0];
            if (code.expirationTimestamp < new Date()) {
                await codeRepo.delete(code);
            } else {
                codeHash = code.code;
            }
        } else {
            const expirationTimestamp: Date = new Date();
            expirationTimestamp.setTime(expirationTimestamp.getTime() + ExpirationDate.VIP_CODE);
            codeHash = uuid.v4();
            await codeRepo.save(new Code({...creation, code: codeHash, expirationTimestamp}));
        }

        const link: string = ServerResponseConverter.convertVipCode(reqId, codeHash);
        logger.info(LU.getFinishMessage(reqId, "generateLink", {link}));

        return link;
    }

    public static async sendVipLetter(reqId: string, letter: VipLetter): Promise<void> {
        logger.info(LU.getStartMessage(reqId, "sendVipLetter", {letter}));

        const mailUtil: MailService = ServiceLocator.getInstance().getMailService();
        const letterData: VipWelcomeLetterData = LetterDataConverter.convertVipWelcomeLetterData(reqId,
            letter.prefix,
            letter.link,
            letter.name,
            letter.contactName,
            letter.contactPhone,
            letter.contactMail);

        await mailUtil.sendEmail(reqId, letter.email, LetterType.VIP_WELCOME, letterData);

        logger.info(LU.getFinishMessage(reqId, "generateLink"));
    }

    public static async fetchFiles(): Promise<string[]> {
        let files: string[] = await fs.readdirAsync(path.resolve(__dirname, "../../../logs"));
        files = files.filter((i: string): boolean => /\.log$/.test(i));

        return files;
    }

    public static async fetchContent(current: string, part: number, filter: ContentFilter): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let lineNumber: number = 0;
            const count: number = (part + 1) * 1000;

            const res: string[] = [];
            const s: MapStream = fs.createReadStream(path.resolve(__dirname, "../../../logs", current))
                .pipe(es.split())
                .pipe(es.mapSync((line: string) => {
                        s.pause();
                        lineNumber += 1;

                        if (lineNumber + 1000 >= count) {
                            if (this.checkFilter(line, filter)) {
                                res.push(line);
                            }
                        }

                        if (res.length < count) {
                            s.resume();
                        } else {
                            resolve(res);
                        }
                    })
                        .on("error", (err: any): void => {
                            reject(err);
                        })
                        .on("end", (): void => {
                            resolve(res);
                        }),
                );
        });
    }

    private static checkFilter(line: string, filter: ContentFilter): boolean {
        if (filter === null || filter === undefined) {
            return true;
        }

        if (filter.level && filter.level !== "ALL") {
            if (!line.includes(`level\":\"${filter.level}`)) {
                return false;
            }
        }

        if (filter.reqId && filter.reqId !== "") {
            if (!line.includes(`reqId\":\"${filter.reqId}`)) {
                return false;
            }
        }

        if (filter.text && filter.text !== "") {
            if (!line.includes(filter.text)) {
                return false;
            }
        }

        return true;
    }
}
