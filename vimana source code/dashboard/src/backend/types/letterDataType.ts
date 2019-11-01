export interface LetterData {
    serverUrl?: string;
    browserLink?: string;
}

export interface VerificationLetterData extends LetterData {
    link: string;
}

export interface VipLetterData extends LetterData {
    name: string;
    serverUrl: string;
    contactPhone: string;
    contactName: string;
    contactMail: string;
}

export interface VipWelcomeLetterData extends VipLetterData {
    prefix: string;
    link: string;
}

export interface RecoverLetterData extends LetterData {
    password: string;
}

export interface InvestmentLetterData extends LetterData {
    email: string;
    phone?: string;
    username: string;
    amount: string;
    currency: string;
}
