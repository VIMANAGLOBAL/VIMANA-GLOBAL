import * as log4js from "log4js";
import {Configuration} from "log4js";
import {ErrorCode} from "../constants/ErrorCode";

export interface Logger extends log4js.Logger {
}

const conf: Configuration = {
    appenders: {
        console: {
            type: "console",
            layout: {
                type: "pattern",
                pattern: "%r | %p %c: %m%n",
            },
        },
        fileErr: {
            type: "file",
            filename: "logs/error.log",
            layout: {
                type: "pattern",
                pattern: "{\"level\":\"%p\",\"time\":\"%d\",\"path\":\"%c\",\"message\":%m}",
            },
        },
        consoleErr: {
            type: "logLevelFilter",
            appender: "console",
            level: "error",
        },
        info: {
            type: "dateFile",
            filename: "logs/info.log",
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: false,
            maxLogSize: 10485760,
            numBackups: 10,
            layout: {
                type: "pattern",
                pattern: "{\"level\":\"%p\",\"time\":\"%d\",\"path\":\"%c\",\"message\":%m}",
            },
        },
        errorFilter: {
            type: "logLevelFilter",
            level: "ERROR",
            appender: "fileErr",
        },
    },
    categories: {
        default: {
            appenders: [
                "info",
                "errorFilter",
                "consoleErr",
            ],
            level: "info",
        },
    },
};

export class LoggerUtil {
    public static configure(root: string, config: Configuration = conf): void {
        log4js.configure(config);

        LoggerUtil.rootLength = root.length;
    }

    public static getLogger(filepath: string, removeRootPath: boolean = true): Logger {
        const index: number = filepath.lastIndexOf(".");

        if (index > -1) {
            filepath = filepath.substr(0, index);
        }
        if (removeRootPath && LoggerUtil.rootLength) {
            filepath = filepath.substr(LoggerUtil.rootLength);
        }
        if (filepath.length > 32) {
            filepath = filepath.substr(-32);
        }

        return log4js.getLogger(filepath);
    }

    public static getFailMessage(reqId: string, method: string, message: string, objects: any = {}): string {
        message = "failed: " + message;
        if (typeof objects.err !== "undefined") {
            const err: any = objects.err;
            objects.err = err && err.message ? err.message : err;
        }
        return LoggerUtil.getMessage(reqId, method, message, objects);
    }

    public static getStartMessage(reqId: string, method: string, objects: any = {}): string {
        return LoggerUtil.getMessage(reqId, method, "started", objects);
    }

    public static getFinishMessage(reqId: string, method, objects: any = {}): string {
        return LoggerUtil.getMessage(reqId, method, "finished", objects);
    }

    public static getMessage(reqId: string, method: string, message: string, objects: any = {}): string {
        const res: any = {
            reqId,
            method,
            message,
        };

        for (const key in objects) {
            res[key] = JSON.stringify(objects[key]);
        }

        return JSON.stringify(res);
    }

    public static error(logger: Logger, err: any, valid: ErrorCode[], message: string): void {
        if (err && err.message && valid.includes(err.message)) {
            logger.warn(`${message}`);
        } else {
            logger.error(message);
        }
    }

    public static stringify(obj: object): any {
        obj = LoggerUtil.normalizeJSON(obj);

        return obj;
    }

    private static rootLength: number;

    private static normalizeJSON(object: any): object {
        let i: number;
        let k: string;
        let ret: object | any[];

        if (!(object instanceof Object)) {
            ret = object;
        } else if (object.toJSON) {
            ret = object.toJSON();
        } else if (object instanceof Array || object.toArray) {
            if (object.toArray) {
                object = object.toArray();
            }
            ret = [];
            for (i = 0; i < (object as any[]).length; i++) {
                (ret as any[]).push(LoggerUtil.normalizeJSON((object as any[])[i]));
            }
        } else {
            ret = {};
            for (k in object) {
                if (object[k] === object) {
                    ret[k] = "[[recursive object]]";
                } else {
                    ret[k] = LoggerUtil.normalizeJSON(object[k]);
                }
            }
        }

        return ret;
    }
}
