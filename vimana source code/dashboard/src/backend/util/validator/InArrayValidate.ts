export class InArrayValidate {
    public isValid(value: any, values: string[], invert: boolean): boolean {
        if (typeof value !== "string") {
            return invert;
        }

        return invert ? !values.includes(value) : values.includes(value);
    }
}