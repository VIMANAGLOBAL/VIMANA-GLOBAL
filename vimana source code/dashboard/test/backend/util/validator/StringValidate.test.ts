import {StringValidate} from "../../../../src/backend/util/validator/StringValidate";

describe("NumberValidate", (): void => {
    const validate: StringValidate = new StringValidate();

    describe("validate", (): void => {
        it("should check type", () => {
            const numberValue: number = 0;
            const objectValue: object = {};
            const boolValue: boolean = false;
            const stringValue: string = "some string";

            expect(validate.isValid(numberValue, {}, false)).toBeFalsy();
            expect(validate.isValid(objectValue, {}, false)).toBeFalsy();
            expect(validate.isValid(boolValue, {}, false)).toBeFalsy();
            expect(validate.isValid(stringValue, {}, false)).toBeTruthy();
        });

        it("should validate min length", () => {
            const value: string = "123";

            expect(validate.isValid(value, {min: 4}, false)).toBeFalsy();
            expect(validate.isValid(value, {min: 1}, false)).toBeTruthy();
        });

        it("should validate max length", () => {
            const value: string = "123";

            expect(validate.isValid(value, {max: 4}, false)).toBeTruthy();
            expect(validate.isValid(value, {max: 1}, false)).toBeFalsy();
        });

        it("should trim value before validating", () => {
            const value: string = "   123   ";

            expect(validate.isValid(value, {min: 5}, false)).toBeTruthy();
            expect(validate.isValid(value, {min: 5, trim: true}, false)).toBeFalsy();
            expect(validate.isValid(value, {max: 5}, false)).toBeFalsy();
            expect(validate.isValid(value, {max: 5, trim: true}, false)).toBeTruthy();
        });

        it("should use regular expressions", () => {
            const value: string = "some value";

            expect(validate.isValid(value, {regexp: /^\d+$/}, false)).toBeFalsy();
            expect(validate.isValid(value, {regexp: /^[\w\s]+$/}, false)).toBeTruthy();
        });

        it("it should invert result, if `invert` option was passed", () => {
            const numValue: number = 1;
            const strValue: string = "1";

            expect(validate.isValid(strValue, {regexp: /^[a-z]+$/}, true)).toBeTruthy();
            expect(validate.isValid(numValue, {}, true)).toBeTruthy();
            expect(validate.isValid(strValue, {regexp: /^\d+$/}, true)).toBeFalsy();
        });
    });
});
