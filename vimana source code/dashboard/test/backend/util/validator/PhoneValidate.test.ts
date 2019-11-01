import {PhoneValidate} from "../../../../src/backend/util/validator/PhoneValidate";

describe("PhoneValidate", (): void => {
    const validate: PhoneValidate = new PhoneValidate();

    describe("validate", (): void => {
        it("should check type (pass only strings)", (): void => {
            const value: number = 123;
            const objectValue: object = {};
            const boolValue: boolean = false;
            const stringValue: string = "+380661234567";

            expect(validate.isValid(value, false)).toBeFalsy();
            expect(validate.isValid(objectValue, false)).toBeFalsy();
            expect(validate.isValid(boolValue, false)).toBeFalsy();
            expect(validate.isValid(stringValue, false)).toBeTruthy();
        });

        it("should validate phone in format +[country code][number]", (): void => {
            const goodOne: string = "+380664309367";
            const thisIsOkToo: string = "+38(066)430-93-67";
            const andThis: string = "+3/8/0/6/6/4/3/0/9/3/6/7";
            const badOne: string = "+0664309367";

            expect(validate.isValid(goodOne, false)).toBeTruthy();
            expect(validate.isValid(thisIsOkToo, false)).toBeTruthy();
            expect(validate.isValid(andThis, false)).toBeTruthy();
            expect(validate.isValid(badOne, false)).toBeFalsy();
        });

        it("should invert result, if `invert` option was passed", (): void => {
            const goodOne: string = "+380664309367";
            const thisIsOkToo: string = "+38(066)430-93-67";
            const andThis: string = "+3/8/0/6/6/4/3/0/9/3/6/7";
            const badOne: string = "+0664309367";

            expect(validate.isValid(goodOne, true)).toBeFalsy();
            expect(validate.isValid(thisIsOkToo, true)).toBeFalsy();
            expect(validate.isValid(andThis, true)).toBeFalsy();
            expect(validate.isValid(badOne, true)).toBeTruthy();
        });
    });
});
