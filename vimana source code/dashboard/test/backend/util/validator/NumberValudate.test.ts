import {NumberValidate} from "../../../../src/backend/util/validator/NumberValidate";

describe("NumberValidate", (): void => {
    const validate: NumberValidate = new NumberValidate();

    describe("validate", (): void => {
        it("should check type", (): void => {
            const value: number = 123;
            const stringValue: string = "";
            const objectValue: object = {};
            const boolValue: boolean = false;

            expect(validate.isValid(value, {}, false)).toBeTruthy();
            expect(validate.isValid(stringValue, {}, false)).toBeFalsy();
            expect(validate.isValid(objectValue, {}, false)).toBeFalsy();
            expect(validate.isValid(boolValue, {}, false)).toBeFalsy();
        });

        it("should check min value", (): void => {
            const value: number = 0;

            expect(validate.isValid(value, {min: 1}, false)).toBeFalsy();
            expect(validate.isValid(value, {min: -1}, false)).toBeTruthy();
        });

        it("should check max value", (): void => {
            const value: number = 1;

            expect(validate.isValid(value, {max: 0}, false)).toBeFalsy();
            expect(validate.isValid(value, {max: 2}, false)).toBeTruthy();
        });

        it("should check integer value", (): void => {
            const falseValue: number = 1.123;
            const trueValue: number = 1;

            expect(validate.isValid(falseValue, {isInteger: true}, false)).toBeFalsy();
            expect(validate.isValid(trueValue, {isInteger: true}, false)).toBeTruthy();
        });

        it("should invert result, if `invert` option was passed", (): void => {
            const stringValue: string = "1";
            const floatValue: number = 1.23;
            const value: number = 1;

            expect(validate.isValid(stringValue, {}, true)).toBeTruthy();
            expect(validate.isValid(floatValue, {isInteger: true}, true)).toBeTruthy();
            expect(validate.isValid(value, {min: 2}, true)).toBeTruthy();
            expect(validate.isValid(value, {max: 0}, true)).toBeTruthy();
            expect(validate.isValid(floatValue, {min: 2}, true)).toBeTruthy();
            expect(validate.isValid(value, {}, true)).toBeFalsy();
        });
    });
});
