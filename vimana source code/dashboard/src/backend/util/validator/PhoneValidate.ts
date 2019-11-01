import * as libphonenumber from "libphonenumber-js";

export class PhoneValidate {
    public isValid(value: any, invert: boolean): boolean {
        if (typeof value !== "string") {
            return invert;
        }

        const result: boolean = libphonenumber.isValidNumber(value);

        return invert ? !result : result;
    }
}