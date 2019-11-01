import {MailValidate} from "./MailValidate";
import {HostnameValidate} from "./HostnameValidate";
import {PhoneValidate} from "./PhoneValidate";
import {StringValidate, StringValidateOptions} from "./StringValidate";
import {InArrayValidate} from "./InArrayValidate";
import {ArrayInArrayValidate} from "./ArrayInArrayValidate";
import {NumberValidate, NumberValidateOptions} from "./NumberValidate";

export class Validator {
    private readonly mailValidator: MailValidate;
    private readonly hostnameValidator: HostnameValidate;
    private readonly phoneValidator: PhoneValidate;
    private readonly stringValidator: StringValidate;
    private readonly inArrayValidator: InArrayValidate;
    private readonly arrayInArrayValidator: ArrayInArrayValidate;
    private readonly numberValidator: NumberValidate;

    constructor() {
        this.hostnameValidator = new HostnameValidate();
        this.mailValidator = new MailValidate(this.hostnameValidator);
        this.phoneValidator = new PhoneValidate();
        this.stringValidator = new StringValidate();
        this.inArrayValidator = new InArrayValidate();
        this.arrayInArrayValidator = new ArrayInArrayValidate();
        this.numberValidator = new NumberValidate();
    }

    public validateMail(value: any, invert: boolean = false): boolean {
        return this.mailValidator.isValid(value, invert);
    }

    public validateHostname(value: any, invert: boolean = false): boolean {
        return this.hostnameValidator.isValid(value, invert);
    }

    public validatePhone(value: any, invert: boolean = false): boolean {
        return this.phoneValidator.isValid(value, invert);
    }

    public validateString(value: any, options: StringValidateOptions = {}, invert: boolean = false): boolean {
        return this.stringValidator.isValid(value, options, invert);
    }

    public validateInArray(value: any, values: string[], invert: boolean = false): boolean {
        return this.inArrayValidator.isValid(value, values, invert);
    }

    public validateArrayInArray(src: any, values: string[], invert: boolean = false): boolean {
        return this.arrayInArrayValidator.isValid(src, values, invert);
    }

    public validateNumber(value: any, options: NumberValidateOptions = {}, invert: boolean = false): boolean {
        return this.numberValidator.isValid(value, options, invert);
    }
}
