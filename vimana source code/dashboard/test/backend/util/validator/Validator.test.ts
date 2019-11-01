import {Validator} from "../../../../src/backend/util/validator/Validator";

describe("Validator", (): void => {
    const validator: Validator = new Validator();

    describe("validate phones", (): void => {
        it("should check type (pass only strings)", (): void => {
            const value: number = 123;
            const objectValue: object = {};
            const boolValue: boolean = false;
            const stringValue: string = "+380661234567";

            expect(validator.validatePhone(value, false)).toBeFalsy();
            expect(validator.validatePhone(objectValue, false)).toBeFalsy();
            expect(validator.validatePhone(boolValue, false)).toBeFalsy();
            expect(validator.validatePhone(stringValue, false)).toBeTruthy();
        });

        it("should validate phone in format +[country code][number]", (): void => {
            const goodOne: string = "+380664309367";
            const thisIsOkToo: string = "+38(066)430-93-67";
            const andThis: string = "+3/8/0/6/6/4/3/0/9/3/6/7";
            const badOne: string = "+0664309367";

            expect(validator.validatePhone(goodOne, false)).toBeTruthy();
            expect(validator.validatePhone(thisIsOkToo, false)).toBeTruthy();
            expect(validator.validatePhone(andThis, false)).toBeTruthy();
            expect(validator.validatePhone(badOne, false)).toBeFalsy();
        });

        it("should invert result, if `invert` option was passed", (): void => {
            const goodOne: string = "+380664309367";
            const thisIsOkToo: string = "+38(066)430-93-67";
            const andThis: string = "+3/8/0/6/6/4/3/0/9/3/6/7";
            const badOne: string = "+0664309367";

            expect(validator.validatePhone(goodOne, true)).toBeFalsy();
            expect(validator.validatePhone(thisIsOkToo, true)).toBeFalsy();
            expect(validator.validatePhone(andThis, true)).toBeFalsy();
            expect(validator.validatePhone(badOne, true)).toBeTruthy();
        });
    });

    describe("validate strings", (): void => {
        it("should check type", () => {
            const numberValue: number = 0;
            const objectValue: object = {};
            const boolValue: boolean = false;
            const stringValue: string = "some string";

            expect(validator.validateString(numberValue, {}, false)).toBeFalsy();
            expect(validator.validateString(objectValue, {}, false)).toBeFalsy();
            expect(validator.validateString(boolValue, {}, false)).toBeFalsy();
            expect(validator.validateString(stringValue, {}, false)).toBeTruthy();
        });

        it("should validate min length", () => {
            const value: string = "123";

            expect(validator.validateString(value, {min: 4}, false)).toBeFalsy();
            expect(validator.validateString(value, {min: 1}, false)).toBeTruthy();
        });

        it("should validate max length", () => {
            const value: string = "123";

            expect(validator.validateString(value, {max: 4}, false)).toBeTruthy();
            expect(validator.validateString(value, {max: 1}, false)).toBeFalsy();
        });

        it("should trim value before validating", () => {
            const value: string = "   123   ";

            expect(validator.validateString(value, {min: 5}, false)).toBeTruthy();
            expect(validator.validateString(value, {min: 5, trim: true}, false)).toBeFalsy();
            expect(validator.validateString(value, {max: 5}, false)).toBeFalsy();
            expect(validator.validateString(value, {max: 5, trim: true}, false)).toBeTruthy();
        });

        it("should use regular expressions", () => {
            const value: string = "some value";

            expect(validator.validateString(value, {regexp: /^\d+$/}, false)).toBeFalsy();
            expect(validator.validateString(value, {regexp: /^[\w\s]+$/}, false)).toBeTruthy();
        });

        it("it should invert result, if `invert` option was passed", () => {
            const numValue: number = 1;
            const strValue: string = "1";

            expect(validator.validateString(strValue, {regexp: /^[a-z]+$/}, true)).toBeTruthy();
            expect(validator.validateString(numValue, {}, true)).toBeTruthy();
            expect(validator.validateString(strValue, {regexp: /^\d+$/}, true)).toBeFalsy();
        });
    });

    describe("validate numbers", (): void => {
        it("should check type", (): void => {
            const value: number = 123;
            const stringValue: string = "";
            const objectValue: object = {};
            const boolValue: boolean = false;

            expect(validator.validateNumber(value, {}, false)).toBeTruthy();
            expect(validator.validateNumber(stringValue, {}, false)).toBeFalsy();
            expect(validator.validateNumber(objectValue, {}, false)).toBeFalsy();
            expect(validator.validateNumber(boolValue, {}, false)).toBeFalsy();
        });

        it("should check min value", (): void => {
            const value: number = 0;

            expect(validator.validateNumber(value, {min: 1}, false)).toBeFalsy();
            expect(validator.validateNumber(value, {min: -1}, false)).toBeTruthy();
        });

        it("should check max value", (): void => {
            const value: number = 1;

            expect(validator.validateNumber(value, {max: 0}, false)).toBeFalsy();
            expect(validator.validateNumber(value, {max: 2}, false)).toBeTruthy();
        });

        it("should check integer value", (): void => {
            const falseValue: number = 1.123;
            const trueValue: number = 1;

            expect(validator.validateNumber(falseValue, {isInteger: true}, false)).toBeFalsy();
            expect(validator.validateNumber(trueValue, {isInteger: true}, false)).toBeTruthy();
        });

        it("should invert result, if `invert` option was passed", (): void => {
            const stringValue: string = "1";
            const floatValue: number = 1.23;
            const value: number = 1;

            expect(validator.validateNumber(stringValue, {}, true)).toBeTruthy();
            expect(validator.validateNumber(floatValue, {isInteger: true}, true)).toBeTruthy();
            expect(validator.validateNumber(value, {min: 2}, true)).toBeTruthy();
            expect(validator.validateNumber(value, {max: 0}, true)).toBeTruthy();
            expect(validator.validateNumber(floatValue, {min: 2}, true)).toBeTruthy();
            expect(validator.validateNumber(value, {}, true)).toBeFalsy();
        });
    });

    describe("validate in array strings", (): void => {
        it("it should return false, if passed value isn't string", (): void => {
            const numberValue: number = 0;
            const objectValue: object = {};
            const boolValue: boolean = false;

            expect(validator.validateInArray(numberValue, [], false)).toBeFalsy();
            expect(validator.validateInArray(objectValue, [], false)).toBeFalsy();
            expect(validator.validateInArray(boolValue, [], false)).toBeFalsy();
        });

        it("should return false, if passed value isn't in passed array", (): void => {
            const value: string = "1";
            const otherValue: string = "3";
            const valuesArray: string[] = ["0", "2"];

            expect(validator.validateInArray(value, valuesArray, false)).toBeFalsy();
            expect(validator.validateInArray(otherValue, valuesArray, false)).toBeFalsy();
        });

        it("should return true, if passed value is in passed array", (): void => {
            const value: string = "1";
            const otherValue: string = "3";
            const valuesArray: string[] = ["1", "3", "5"];

            expect(validator.validateInArray(value, valuesArray, false)).toBeTruthy();
            expect(validator.validateInArray(otherValue, valuesArray, false)).toBeTruthy();
        });

        it("should invert result, if `invert` option was passed", (): void => {
            const value: string = "1";
            const otherValue: string = "2";
            const valuesArray: string[] = ["1", "3", "5"];

            expect(validator.validateInArray(value, valuesArray, true)).toBeFalsy();
            expect(validator.validateInArray(otherValue, valuesArray, true)).toBeTruthy();
        });
    });
});
