import {RandomString} from "./RandomString";
import {Validator} from "./validator/Validator";
import {MailService} from "./MailService";
import {HashingUtil} from "./HashingUtil";
import {WsUtil} from "./WsUtil";

export class ServiceLocator {
    public static getInstance(): ServiceLocator {
        if (ServiceLocator.instance === null) {
            ServiceLocator.instance = new ServiceLocator();
        }

        return ServiceLocator.instance;
    }

    private static instance: ServiceLocator = null;

    private hashingUtil: HashingUtil;
    private mailService: MailService;
    private randomString: RandomString;
    private validator: Validator;
    private wsUtil: WsUtil;

    constructor() {
        this.hashingUtil = null;
        this.mailService = null;
        this.randomString = null;
        this.validator = null;
        this.wsUtil = null;
    }

    public getWsUtil(wss = null): WsUtil {
        if (this.wsUtil === null) {
            this.wsUtil = new WsUtil(wss);
        }

        return this.wsUtil;
    }

    public getHashingUtil(): HashingUtil {
        if (this.hashingUtil === null) {
            this.hashingUtil = new HashingUtil();
        }

        return this.hashingUtil;
    }

    public getMailService(): MailService {
        if (this.mailService === null) {
            this.mailService = new MailService();
        }

        return this.mailService;
    }

    public getRandomStringUtil(): RandomString {
        if (this.randomString === null) {
            this.randomString = new RandomString();
        }

        return this.randomString;
    }

    public getValidator(): Validator {
        if (this.validator === null) {
            this.validator = new Validator();
        }

        return this.validator;
    }
}
