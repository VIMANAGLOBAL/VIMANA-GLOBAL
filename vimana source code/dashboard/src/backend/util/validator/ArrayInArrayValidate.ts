export class ArrayInArrayValidate {
    public isValid(src: any, values: string[], invert: boolean): boolean {
        let valid: boolean = true;

        for (const value of src) {
            if (typeof value !== "string") {
                valid = false;
                return valid;
            }
            const exist = values.includes(value);
            if (!exist) {
                valid = false;
                return valid;
            }
        }

        return valid;
    }
}
