import {HostnameValidate} from "./HostnameValidate";

export class MailValidate {
    private validator: HostnameValidate = null;
    private localPart: string = "";
    private hostname: string = "";

    constructor(hostnameValidator: HostnameValidate) {
        this.validator = hostnameValidator;
    }

    public isValid(value: any, invert: boolean): boolean {
        if (typeof value !== "string") {
            return invert;
        }

        if (!this.splitEmailParts(value)) {
            return invert;
        }

        if ((this.localPart.length > 64) || (this.hostname.length > 255)) {
            return invert;
        }

        const hostname: boolean = this.validateHostnamePart(invert);
        const local: boolean = this.validateLocalPart();

        if (local && hostname) {
            return !invert;
        }

        return invert;
    }

    private validateHostnamePart(invert: boolean): boolean {
        return this.validator.isValid(this.hostname, invert);
    }

    private validateLocalPart(): boolean {
        let result: boolean = false;

        if (/^[a-zA-Z0-9%-_!?^`}{|~#$&\"()*+/=]+(\x2e+[a-zA-Z0-9%-_!?^`}{|~#$&\"()*+/=]+)*$/.test(this.localPart)) {
            result = true;
        } else if (/^"([\x20-\x21\x23-\x5b\x5d-\x7e]|\x5c[\x20-\x7e])*"$/.test(this.localPart)) {
            result = true;
        }
        return result;
    }

    private splitEmailParts(value: string): boolean {
        if ((value.indexOf("..") !== -1) || !(/^(.+)@([^@]+)$/.test(value))) {
            return false;
        }

        this.localPart = value.match(/^(.+)@([^@]+)$/)[1];
        this.hostname = value.match(/^(.+)@([^@]+)$/)[2];

        return true;
    }
}
