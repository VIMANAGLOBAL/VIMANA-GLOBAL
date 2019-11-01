export interface StringValidateOptions {
    min?: number;
    max?: number;
    trim?: boolean;
    regexp?: RegExp;
}

export class StringValidate {
    public isValid(value: any, options: StringValidateOptions, invert: boolean): boolean {
        if (typeof value !== "string") {
            return invert;
        }

        if (typeof options.trim === "boolean" && options.trim) {
            value = value.trim();
        }

        if (typeof options.min !== "undefined") {
            if (value.length < options.min) {
                return invert;
            }
        }

        if (typeof options.max !== "undefined") {
            if (value.length > options.max) {
                return invert;
            }
        }

        if (typeof options.regexp !== "undefined") {
            if (!options.regexp.test(value)) {
                return invert;
            }
        }

        return !invert;
    }
}