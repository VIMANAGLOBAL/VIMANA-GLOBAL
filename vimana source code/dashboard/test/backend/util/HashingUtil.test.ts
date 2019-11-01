import {HashingUtil} from "../../../src/backend/util/HashingUtil";

describe("HashingUtil", (): void => {
    const hashingUtil: HashingUtil = new HashingUtil();
    const reqId: string = "request id placeholder";

    describe("salt password", (): void => {
        it("should return value different from passed", (): void => {
            const value: string = "somevalue";

            const saltedValue: string = hashingUtil.saltPassword(reqId, value);

            expect(saltedValue).toBeDefined();
            expect(typeof saltedValue).toEqual("string");
            expect(value !== saltedValue).toBeTruthy();
        });

        it("should return equal values when equal agrs were passed", (): void => {
            const oneValue: string = "somevalue";
            const otherValue: string = "somevalue";

            const oneSaltedValue: string = hashingUtil.saltPassword(reqId, oneValue);
            const otherSaltedValue: string = hashingUtil.saltPassword(reqId, otherValue);

            expect(oneSaltedValue).toBeDefined();
            expect(otherSaltedValue).toBeDefined();
            expect(typeof oneSaltedValue).toEqual("string");
            expect(typeof otherSaltedValue).toEqual("string");
            expect(oneSaltedValue).toStrictEqual(otherSaltedValue);
        });

        it("should return different values when different agrs were passed", (): void => {
            const oneValue: string = "somevalue";
            const otherValue: string = "someothervalue";

            const oneSaltedValue: string = hashingUtil.saltPassword(reqId, oneValue);
            const otherSaltedValue: string = hashingUtil.saltPassword(reqId, otherValue);

            expect(oneSaltedValue).toBeDefined();
            expect(otherSaltedValue).toBeDefined();
            expect(typeof oneSaltedValue).toEqual("string");
            expect(typeof otherSaltedValue).toEqual("string");
            expect(oneSaltedValue !== otherSaltedValue).toBeTruthy();
        });

        it("should return different values when different agrs were passed", (): void => {
            const oneValue: string = "somevalue";
            const otherValue: string = "someothervalue";

            const oneSaltedValue: string = hashingUtil.saltPassword(reqId, oneValue);
            const otherSaltedValue: string = hashingUtil.saltPassword(reqId, otherValue);

            expect(oneSaltedValue).toBeDefined();
            expect(otherSaltedValue).toBeDefined();
            expect(typeof oneSaltedValue).toEqual("string");
            expect(typeof otherSaltedValue).toEqual("string");
            expect(oneSaltedValue !== otherSaltedValue).toBeTruthy();
        });
    });

    describe("salt admin password", (): void => {
        it("should use other salt for admin password", (): void => {
            const usualPassword: string = "password";
            const adminPassword: string = "password";

            const saltedUsualPassword: string = hashingUtil.saltPassword(reqId, usualPassword);
            const saltedAdminPassword: string = hashingUtil.saltAdminPassword(reqId, adminPassword);

            expect(saltedUsualPassword).toBeDefined();
            expect(saltedAdminPassword).toBeDefined();
            expect(typeof saltedUsualPassword).toEqual("string");
            expect(typeof saltedAdminPassword).toEqual("string");
            expect(saltedUsualPassword !== saltedAdminPassword).toBeTruthy();
        });
    });

    describe("salt admin username", (): void => {
        it("should use other salt for admin username", (): void => {
            const adminUsername: string = "username";
            const otherValue: string = "username";

            const saltedUsername: string = hashingUtil.saltPassword(reqId, adminUsername);
            const saltedValue: string = hashingUtil.saltAdminPassword(reqId, otherValue);

            expect(saltedUsername).toBeDefined();
            expect(saltedValue).toBeDefined();
            expect(typeof saltedUsername).toEqual("string");
            expect(typeof saltedValue).toEqual("string");
            expect(saltedUsername !== saltedValue).toBeTruthy();
        });
    });
});
