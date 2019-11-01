import {InArrayValidate} from "../../../../src/backend/util/validator/InArrayValidate";

describe("InArrayValidate", (): void => {
    const validate: InArrayValidate = new InArrayValidate();

    describe("validate", (): void => {
        it("it should return false, if passed value isn't string", (): void => {
            const numberValue: number = 0;
            const objectValue: object = {};
            const boolValue: boolean = false;

            expect(validate.isValid(numberValue, [], false)).toBeFalsy();
            expect(validate.isValid(objectValue, [], false)).toBeFalsy();
            expect(validate.isValid(boolValue, [], false)).toBeFalsy();
        });

        it("should return false, if passed value isn't in passed array", (): void => {
            const value: string = "1";
            const otherValue: string = "3";
            const valuesArray: string[] = ["0", "2"];

            expect(validate.isValid(value, valuesArray, false)).toBeFalsy();
            expect(validate.isValid(otherValue, valuesArray, false)).toBeFalsy();
        });

        it("should return true, if passed value is in passed array", (): void => {
            const value: string = "1";
            const otherValue: string = "3";
            const valuesArray: string[] = ["1", "3", "5"];

            expect(validate.isValid(value, valuesArray, false)).toBeTruthy();
            expect(validate.isValid(otherValue, valuesArray, false)).toBeTruthy();
        });

        it("should invert result, if `invert` option was passed", (): void => {
            const value: string = "1";
            const otherValue: string = "2";
            const valuesArray: string[] = ["1", "3", "5"];

            expect(validate.isValid(value, valuesArray, true)).toBeFalsy();
            expect(validate.isValid(otherValue, valuesArray, true)).toBeTruthy();
        });
    });
});
