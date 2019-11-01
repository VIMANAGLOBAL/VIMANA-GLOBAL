import {AdminSignin, FetchContent, History, Login, NewUser, SaveSettings} from "../../../src/backend/types/clientRequestType";
import {ClientRequestConverter} from "../../../src/backend/converter/ClientRequestConverter";
import {ErrorCode} from "../../../src/backend/constants/ErrorCode";

describe("ClientRequestConverter", (): void => {
    const reqId: string = "test request id";

    describe("convertLogin", (): void => {
        it("should convert request body for login", (): void => {
            const email: string = "test@mail.com";
            const password: string = "12345678";
            const token: string = "123456";
            const body: any = {
                email,
                password,
                token,
            };
            const result: Login = ClientRequestConverter.convertLogin(reqId, body);

            expect(result).toBeDefined();
            expect(result.email).toEqual(email);
            expect(result.password).toEqual(password);
            expect(result.token).toEqual(token);
        });

        it("should throw EMAIL_NOT_VALID if email not valid", (): void => {
            const email: any = 123;
            const password: string = "12345678";
            const token: string = "123456";
            const body: any = {
                email,
                password,
                token,
            };

            function badFunction(): Login {
                return ClientRequestConverter.convertLogin(reqId, body);
            }

            expect(badFunction).toThrowError(ErrorCode.EMAIL_NOT_VALID);
        });

        it("should throw PASSWORD_NOT_VALID if password not valid", (): void => {
            const email: string = "somemail@mail.ru";
            const password: any = 1234;
            const token: string = "123456";
            const body: any = {
                email,
                password,
                token,
            };

            function badFunction(): Login {
                return ClientRequestConverter.convertLogin(reqId, body);
            }

            expect(badFunction).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
        });

        it("should throw WRONG_TOKEN if token not valid", (): void => {
            const email: string = "somemail@mail.ru";
            const password: string = "12345678";
            const token: any = [5, 2, 5, 1];
            const body: any = {
                email,
                password,
                token,
            };

            function badFunction(): Login {
                return ClientRequestConverter.convertLogin(reqId, body);
            }

            expect(badFunction).toThrowError(ErrorCode.WRONG_TOKEN);
        });
    });

    describe("convertAdminSignin", (): void => {
        it("should convert request body for admin login", (): void => {
            const username: string = "username";
            const password: string = "12345678";
            const body: any = {
                username,
                password,
            };
            const result: AdminSignin = ClientRequestConverter.convertAdminSignin(reqId, body);

            expect(result).toBeDefined();
            expect(result.username).toEqual(username);
            expect(result.password).toEqual(password);
        });

        it("should throw USERNAME_NOT_VALID if username not valid", (): void => {
            const username: any = 12345678;
            const password: string = "12345678";
            const body: any = {
                username,
                password,
            };

            function badFunction(): AdminSignin {
                return ClientRequestConverter.convertAdminSignin(reqId, body);
            }

            expect(badFunction).toThrowError(ErrorCode.USERNAME_NOT_VALID);
        });

        it("should throw PASSWORD_NOT_VALID if password not valid", (): void => {
            const username: string = "12345678";
            const password: any = 12345678;
            const body: any = {
                username,
                password,
            };

            function badFunction(): AdminSignin {
                return ClientRequestConverter.convertAdminSignin(reqId, body);
            }

            expect(badFunction).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
        });
    });

    describe("convertTransactionHistory", (): void => {
        it("should convert request body for transaction history", (): void => {
            const count: number = 10;
            const page: number = 5;
            const body: any = {
                count,
            };
            const params: any = {
                page,
            };

            const result: History = ClientRequestConverter.convertTransactionHistory(reqId, body, params);

            expect(result).toBeDefined();
            expect(result.count).toEqual(count);
            expect(result.page).toEqual(page);
        });

        it("should throw COUNT_NOT_VALID if count not valid", (): void => {
            const littleCount: number = 0;
            const bigCount: number = 150;
            const floatCount: number = 1.23;
            const stringCount: any = "000";
            const page: number = 5;
            const params: any = {
                page,
            };

            function badFunctionWithFloatValue(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, {count: floatCount}, params);
            }
            function badFunctionWithMaxValue(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, {count: bigCount}, params);
            }
            function badFunctionWithMinValue(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, {count: littleCount}, params);
            }
            function badFunctionWithType(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, {count: stringCount}, params);
            }

            expect(badFunctionWithFloatValue).toThrowError(ErrorCode.COUNT_NOT_VALID);
            expect(badFunctionWithMaxValue).toThrowError(ErrorCode.COUNT_NOT_VALID);
            expect(badFunctionWithMinValue).toThrowError(ErrorCode.COUNT_NOT_VALID);
            expect(badFunctionWithType).toThrowError(ErrorCode.COUNT_NOT_VALID);
        });

        it("should throw PAGE_NOT_VALID if page not valid", (): void => {
            const count: number = 3;
            const body: any = {
                count,
            };

            const littlePage: number = 0;
            const bigPage: number = 10000001;
            const floatPage: number = 1.23;
            const stringPage: any = "a";

            function badFunctionWithMaxValue(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, body, {page: bigPage});
            }
            function badFunctionWithMinValue(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, body, {page: littlePage});
            }
            function badFunctionWithType(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, body, {page: stringPage});
            }
            function badFunctionWithFloatValue(): History {
                return ClientRequestConverter.convertTransactionHistory(reqId, body, {page: floatPage});
            }

            expect(badFunctionWithFloatValue).toThrowError(ErrorCode.PAGE_NOT_VALID);
            expect(badFunctionWithMaxValue).toThrowError(ErrorCode.PAGE_NOT_VALID);
            expect(badFunctionWithMinValue).toThrowError(ErrorCode.PAGE_NOT_VALID);
            expect(badFunctionWithType).toThrowError(ErrorCode.PAGE_NOT_VALID);
        });
    });

    describe("convertEmail", (): void => {
        it("should convert request body for email operations", (): void => {
            const email: string = "email@mail.ru";
            const body: any = { email };

            const result: string = ClientRequestConverter.convertEmail(reqId, body);

            expect(result).toBeDefined();
            expect(typeof result).toEqual("string");
        });

        it("should throw EMAIL_NOT_VALID if count not valid", (): void => {
            const email: string = "12345";
            const body: any = { email };

            function badFunctionWithFloatValue(): string {
                return ClientRequestConverter.convertEmail(reqId, body);
            }

            expect(badFunctionWithFloatValue).toThrowError(ErrorCode.EMAIL_NOT_VALID);
        });
    });

    describe("convertVerificationCode", (): void => {
        it("should convert request query for account verification", (): void => {
            const code: string = "123456789123456789123456789123456789";
            const query: any = { code };

            const result: string = ClientRequestConverter.convertVerificationCode(reqId, query);

            expect(result).toBeDefined();
            expect(typeof result).toEqual("string");
        });

        it("should throw VERIFICATION_CODE_NOT_VALID if code not valid", (): void => {
            const longCode: string = "1234567891234567891234567891234567890";
            const shortCode: string = "1";

            function badFunctionWithLongValue(): string {
                return ClientRequestConverter.convertVerificationCode(reqId, { code: longCode });
            }
            function badFunctionWithShortValue(): string {
                return ClientRequestConverter.convertVerificationCode(reqId, { code: shortCode });
            }

            expect(badFunctionWithLongValue).toThrowError(ErrorCode.VERIFICATION_CODE_NOT_VALID);
            expect(badFunctionWithShortValue).toThrowError(ErrorCode.VERIFICATION_CODE_NOT_VALID);
        });
    });

    describe("convertSaveSettings", (): void => {
        it("should convert request body for settings saving", (): void => {
            const enable2fa: string = "true";
            const token: string = "123456";
            const currentPass: string = "12345678";
            const newPass: string = "123456780";
            const confirm: string = "123456780";
            const body: any = {
                currentPass,
                newPass,
                confirm,
                enable2fa,
                token,
            };

            const result: SaveSettings = ClientRequestConverter.convertSaveSettings(reqId, body);

            expect(result).toBeDefined();
            expect(result.newPass.currentPass).toEqual(currentPass);
            expect(result.newPass.newPass).toEqual(newPass);
            expect(result.newPass.confirm).toEqual(confirm);
            expect(result.authenticate2fa.token).toEqual(token);
            expect(result.authenticate2fa.enable2fa).toBeTruthy();
        });

        it("should convert request body for settings saving without password blocks", (): void => {
            const enable2fa: string = "true";
            const token: string = "123456";
            const body: any = {
                enable2fa,
                token,
            };

            const result: SaveSettings = ClientRequestConverter.convertSaveSettings(reqId, body);

            expect(result).toBeDefined();
            expect(body.token).toEqual(token);
            expect(body.enable2fa).toBeTruthy();
        });

        it("should convert request body for settings saving without 2fa block", (): void => {
            const currentPass: string = "12345678";
            const newPass: string = "123456780";
            const confirm: string = "123456780";
            const body: any = {
                currentPass,
                newPass,
                confirm,
            };

            const result: SaveSettings = ClientRequestConverter.convertSaveSettings(reqId, body);

            expect(result).toBeDefined();
            expect(body.currentPass).toEqual(currentPass);
            expect(body.newPass).toEqual(newPass);
            expect(body.confirm).toEqual(confirm);
        });

        it("should throw PASSWORD_NOT_VALID if current password not valid", (): void => {
            const shortCurrentPass: string = "123";
            let longCurrentPass: string = "1";
            for (let i: number = 0; i < 1000000; i++) {
                longCurrentPass += "1";
            }
            const trimmedPass: string = "       ";
            const newPass: string = "123456780";
            const confirm: string = "123456780";
            const body: any = {
                newPass,
                confirm,
            };

            function badFunctionWithShortValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, currentPass: shortCurrentPass});
            }
            function badFunctionWithLongValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, currentPass: longCurrentPass});
            }
            function badFunctionWithTrimmedValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, currentPass: trimmedPass});
            }

            expect(badFunctionWithShortValue).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
            expect(badFunctionWithLongValue).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
            expect(badFunctionWithTrimmedValue).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
        });

        it("should throw NEW_PASSWORD_NOT_VALID if current password not valid", (): void => {
            const shortNewPass: string = "123";
            let longNewPass: string = "1";
            for (let i: number = 0; i < 1000000; i++) {
                longNewPass += "1";
            }
            const trimmedNewPass: string = "       ";
            const currentPass: string = "123456780";
            const confirm: string = "123456780";
            const body: any = {
                currentPass,
                confirm,
            };

            function badFunctionWithShortValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, newPass: shortNewPass});
            }
            function badFunctionWithLongValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, newPass: longNewPass});
            }
            function badFunctionWithTrimmedValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, newPass: trimmedNewPass});
            }

            expect(badFunctionWithShortValue).toThrowError(ErrorCode.NEW_PASSWORD_NOT_VALID);
            expect(badFunctionWithLongValue).toThrowError(ErrorCode.NEW_PASSWORD_NOT_VALID);
            expect(badFunctionWithTrimmedValue).toThrowError(ErrorCode.NEW_PASSWORD_NOT_VALID);
        });

        it("should throw CONFIRM_NOT_VALID if current password not valid", (): void => {
            const shortConfirm: string = "123";
            let longConfirm: string = "1";
            for (let i: number = 0; i < 1000000; i++) {
                longConfirm += "1";
            }
            const trimmedConfirm: string = "       ";
            const currentPass: string = "123456780";
            const newPass: string = "123456780";
            const body: any = {
                currentPass,
                newPass,
            };

            function badFunctionWithShortValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, confirm: shortConfirm});
            }
            function badFunctionWithLongValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, confirm: longConfirm});
            }
            function badFunctionWithTrimmedValue(): SaveSettings {
                return ClientRequestConverter.convertSaveSettings(reqId, {...body, confirm: trimmedConfirm});
            }

            expect(badFunctionWithShortValue).toThrowError(ErrorCode.CONFIRM_NOT_VALID);
            expect(badFunctionWithLongValue).toThrowError(ErrorCode.CONFIRM_NOT_VALID);
            expect(badFunctionWithTrimmedValue).toThrowError(ErrorCode.CONFIRM_NOT_VALID);
        });
    });

    describe("convertFetchContent", (): void => {
        it("should convert request body for fetching log content", (): void => {
            const current: string = "current.file.log";
            const part: number = 123;
            const filter: object = {};
            const body: any = {
                current,
                part,
                filter,
            };

            const result: FetchContent = ClientRequestConverter.convertFetchContent(body);

            expect(result).toBeDefined();
            expect(result.current).toEqual(current);
            expect(result.part).toEqual(part);
            expect(result.filter).toEqual(filter);
        });
    });

    describe("convertNewUser", (): void => {
        it("should convert request body for new user creation", (): void => {
            const firstName: string = "michael";
            const lastName: string = "test";
            const email: string = "somemail@mail.com";
            const password: string = "12345678";
            const confirm: string = "12345678";
            const country: string = "ukraine";
            const address: string = "some address";
            const city: string = "some city";
            const state: string = "some state";
            const zipCode: string = "zip code";
            const phone: string = "+380661234567";
            const description: string = "INDIVIDUAL";

            const body: any = {
                firstName,
                lastName,
                email,
                password,
                confirm,
                country,
                address,
                city,
                state,
                zipCode,
                phone,
                description
            };

            const result: NewUser = ClientRequestConverter.convertNewUser(reqId, body);

            expect(result).toBeDefined();
            expect(typeof result).toEqual("object");
            expect(result.firstName).toEqual(firstName);
            expect(result.lastName).toEqual(lastName);
            expect(result.email).toEqual(email);
            expect(result.password).toEqual(password);
            expect(result.confirm).toEqual(confirm);
            expect(result.country).toEqual(country);
            expect(result.address).toEqual(address);
            expect(result.city).toEqual(city);
            expect(result.state).toEqual(state);
            expect(result.zipCode).toEqual(zipCode);
            expect(result.phone).toEqual(phone);
            expect(result.description).toEqual(description);
        });

        it("should throw EMAIL_NOT_VALID if email not valid", (): void => {
            const firstName: string = "michael";
            const lastName: string = "test";
            const email: string = "12345678";
            const password: string = "12345678";
            const confirm: string = "12345678";
            const country: string = "ukraine";
            const address: string = "some address";
            const city: string = "some city";
            const state: string = "some state";
            const zipCode: string = "zip code";
            const phone: string = "+380661234567";
            const description: string = "INDIVIDUAL";

            const body: any = {
                firstName,
                lastName,
                email,
                password,
                confirm,
                country,
                address,
                city,
                state,
                zipCode,
                phone,
                description
            };

            function badFunction(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, body);
            }

            expect(badFunction).toThrowError(ErrorCode.EMAIL_NOT_VALID);
        });

        it("should throw PASSWORD_NOT_VALID if current password not valid", (): void => {
            const shortPass: string = "123";
            let longPass: string = "1";
            for (let i: number = 0; i < 1000000; i++) {
                longPass += "1";
            }
            const trimmedPass: string = "       ";

            const firstName: string = "michael";
            const lastName: string = "test";
            const email: string = "somemail@mail.ru";
            const confirm: string = "12345678";
            const country: string = "ukraine";
            const address: string = "some address";
            const city: string = "some city";
            const state: string = "some state";
            const zipCode: string = "zip code";
            const phone: string = "+380661234567";
            const description: string = "INDIVIDUAL";

            const body: any = {
                firstName,
                lastName,
                email,
                confirm,
                country,
                address,
                city,
                state,
                zipCode,
                phone,
                description
            };

            function badFunctionWithShortValue(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, {...body, password: shortPass});
            }
            function badFunctionWithLongValue(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, {...body, password: longPass});
            }
            function badFunctionWithTrimmedValue(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, {...body, password: trimmedPass});
            }

            expect(badFunctionWithShortValue).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
            expect(badFunctionWithLongValue).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
            expect(badFunctionWithTrimmedValue).toThrowError(ErrorCode.PASSWORD_NOT_VALID);
        });

        it("should throw CONFIRM_NOT_VALID if confirm not valid", (): void => {
            const shortPass: string = "123";
            let longPass: string = "1";
            for (let i: number = 0; i < 1000000; i++) {
                longPass += "1";
            }
            const trimmedPass: string = "       ";

            const firstName: string = "michael";
            const lastName: string = "test";
            const email: string = "somemail@mail.ru";
            const password: string = "12345678";
            const country: string = "ukraine";
            const address: string = "some address";
            const city: string = "some city";
            const state: string = "some state";
            const zipCode: string = "zip code";
            const phone: string = "+380661234567";
            const description: string = "INDIVIDUAL";

            const body: any = {
                firstName,
                lastName,
                email,
                password,
                country,
                address,
                city,
                state,
                zipCode,
                phone,
                description
            };

            function badFunctionWithShortValue(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, {...body, confirm: shortPass});
            }
            function badFunctionWithLongValue(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, {...body, confirm: longPass});
            }
            function badFunctionWithTrimmedValue(): NewUser {
                return ClientRequestConverter.convertNewUser(reqId, {...body, confirm: trimmedPass});
            }

            expect(badFunctionWithShortValue).toThrowError(ErrorCode.CONFIRM_NOT_VALID);
            expect(badFunctionWithLongValue).toThrowError(ErrorCode.CONFIRM_NOT_VALID);
            expect(badFunctionWithTrimmedValue).toThrowError(ErrorCode.CONFIRM_NOT_VALID);
        });
    });
});
