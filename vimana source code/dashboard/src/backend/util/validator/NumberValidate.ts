export interface NumberValidateOptions {
    min?: number;
    max?: number;
    isInteger?: boolean;
}

export class NumberValidate {
    public isValid(value: any, options: NumberValidateOptions, invert: boolean): boolean {
        if (typeof value !== "number") {
            return invert;
        }

        if (typeof options.isInteger === "boolean") {
            if (options.isInteger && ((value ^ 0) !== value)) {
                return invert;
            } else if (!options.isInteger && ((value ^ 0) === value)) {
                return invert;
            }
        }

        if (typeof options.min === "number") {
            if (value < options.min) {
                return invert;
            }
        }

        if (typeof options.max === "number") {
            if (value > options.max) {
                return invert;
            }
        }

        return !invert;
    }
}
