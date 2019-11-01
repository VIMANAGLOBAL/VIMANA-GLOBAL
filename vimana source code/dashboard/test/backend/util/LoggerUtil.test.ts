import {Logger, LoggerUtil} from "../../../src/backend/util/LoggerUtil";
import {Configuration} from "log4js";
import Mock = jest.Mock;
import {ErrorCode} from "../../../src/backend/constants/ErrorCode";

describe("LoggerUtil", (): void => {
    beforeAll((): void => {
        const config: Configuration = {
            appenders: {
                console: {
                    type: "console",
                    layout: {
                        type: "pattern",
                        pattern: "%r | %p %c: %m%n",
                    },
                },
            },
            categories: {
                default: {
                    appenders: [
                        "console",
                    ],
                    level: "info",
                },
            },
        };
        LoggerUtil.configure(__dirname, config);
    });

    describe("getLogger", (): void => {
        it("should return logger objects", (): void => {
            const logger: Logger = LoggerUtil.getLogger(__filename);

            expect(logger).toBeDefined();
        });
    });

    describe("stringify", (): void => {
        it("should return normalized json", (): void => {
            const value: object = {
                field: 1,
                otherField: 2,
                arrayField: [1, 2, 3],
            };
            const json: string = LoggerUtil.stringify(value);

            expect(json).toBeDefined();
            expect(typeof json).toEqual("object");
            expect(json).toEqual({"arrayField": [1, 2, 3], "field": 1, "otherField": 2});
        });

        it("should return normalized json when recursive object was passed", (): void => {
            const value: {field: object} = {
                field: {},
            };
            value.field = value;

            const json: string = LoggerUtil.stringify(value);

            expect(json).toBeDefined();
            expect(typeof json).toEqual("object");
            expect(json).toEqual({"field": "[[recursive object]]"});
        });
    });

    describe("error", (): void => {
        const mockLogger: Logger = LoggerUtil.getLogger(__filename);

        beforeEach((): void => {
            mockLogger.error = jest.fn<void>();
            mockLogger.warn = jest.fn<void>();
        });

        it("should call `error` method, if err object has unknown type", (): void => {
            LoggerUtil.error(mockLogger, {field: "Big Scary Error"}, [], "Big Scary Message");

            expect((mockLogger.error as Mock<void>).mock.calls.length).toStrictEqual(1);
            expect((mockLogger.warn as Mock<void>).mock.calls.length).toStrictEqual(0);
        });

        it("should call `warn` method, if err object has expected type", (): void => {
            LoggerUtil.error(mockLogger, {message: ErrorCode.NOT_FOUND}, [ErrorCode.NOT_FOUND], "Some message here");

            expect((mockLogger.error as Mock<void>).mock.calls.length).toStrictEqual(0);
            expect((mockLogger.warn as Mock<void>).mock.calls.length).toStrictEqual(1);
        });
    });

    describe("get messages", (): void => {
        const reqId: string = "testReqId";

        it("should return normalized json string", (): void => {
            const method: string = "testMethod";
            const message: string = "testMessage";
            const objects: object = {
                one: 1,
                other: "other",
                isTrue: true,
                array: [1, 2, 3, "4"],
            };
            const value: string = LoggerUtil.getMessage(reqId, method, message, objects);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":\"testMessage\",\"one\":\"1\",\"other\":" +
                "\"\\\"other\\\"\",\"isTrue\":\"true\",\"array\":\"[1,2,3,\\\"4\\\"]\"}");
        });

        it("should return normalized json string without objects", (): void => {
            const method: string = "testMethod";
            const message: string = "testMessage";
            const value: string = LoggerUtil.getMessage(reqId, method, message);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":\"testMessage\"}");
        });

        it("should return normalized json string with `started` message", (): void => {
            const method: string = "testMethod";
            const objects: object = {
                one: 1,
                other: "other",
                isTrue: true,
                array: [1, 2, 3, "4"],
            };
            const value: string = LoggerUtil.getStartMessage(reqId, method, objects);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":\"started\",\"one\":\"1\",\"other\":" +
                "\"\\\"other\\\"\",\"isTrue\":\"true\",\"array\":\"[1,2,3,\\\"4\\\"]\"}");
        });

        it("should return normalized json string with `finished` message", (): void => {
            const method: string = "testMethod";
            const objects: object = {
                one: 1,
                other: "other",
                isTrue: true,
                array: [1, 2, 3, "4"],
            };
            const value: string = LoggerUtil.getFinishMessage(reqId, method, objects);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":\"finished\",\"one\":\"1\",\"other\":" +
                "\"\\\"other\\\"\",\"isTrue\":\"true\",\"array\":\"[1,2,3,\\\"4\\\"]\"}");
        });

        it("should return normalized json string with `failed` message", (): void => {
            const method: string = "testMethod";
            const message: string = "we all die";
            const objects: object = {
                one: 1,
                other: "other",
                isTrue: true,
                array: [1, 2, 3, "4"],
            };
            const value: string = LoggerUtil.getFailMessage(reqId, method, message, objects);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":\"failed: we all die\",\"one\":\"1\",\"other\":" +
                "\"\\\"other\\\"\",\"isTrue\":\"true\",\"array\":\"[1,2,3,\\\"4\\\"]\"}");
        });

        it("should return normalized json string with `failed` message and `message` field of error object", (): void => {
            const method: string = "testMethod";
            const message: string = "we all die";
            const objects: object = {
                err: {
                    message: "D:",
                },
            };
            const value: string = LoggerUtil.getFailMessage(reqId, method, message, objects);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":\"failed: we all die\",\"err\":\"\\\"D:\\\"\"}");
        });

        it("should return normalized json string with `failed` message without `message` field of error object", (): void => {
            const method: string = "testMethod";
            const message: string = "we all die";
            const objects: object = {
                err: {
                    field: "D:",
                },
            };
            const value: string = LoggerUtil.getFailMessage(reqId, method, message, objects);

            expect(value).toBeDefined();
            expect(typeof value).toEqual("string");
            expect(value).toEqual("{\"reqId\":\"testReqId\",\"method\":\"testMethod\",\"message\":" +
                "\"failed: we all die\",\"err\":\"{\\\"field\\\":\\\"D:\\\"}\"}");
        });
    });
});
