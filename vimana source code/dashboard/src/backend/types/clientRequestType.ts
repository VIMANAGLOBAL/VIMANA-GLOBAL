export interface Login {
    email: string;
    password: string;
    token?: string;
}

export interface LinkCreation {
    email: string;
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
}

export interface VipLetter extends LinkCreation {
    prefix: string | null;
    link: string;
}

export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm: string;
    country: string;

    code?: string;
}

export interface AdminSignin {
    username: string;
    password: string;
}

export interface Authenticate2fa {
    enable2fa: boolean;
    token: string;
    secret: string;
}

export interface NewPassword {
    currentPass: string;
    newPass: string;
    confirm: string;
}

export interface SaveSettings {
    authenticate2fa: Authenticate2fa;
    newPass: NewPassword;
    user: UserSettings;
}

export interface UserSettings {
    firstName: string;
    lastName: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    description?: string[];
}

export interface History {
    count: number;
    page: number;
}

export interface FetchContent {
    current: string;
    part: number;
    filter: ContentFilter;
}

export interface ContentFilter {
    level?: string;
    reqId?: string;
    text?: string;
}

export interface UserInvestment {
    amount: string;
    currency: string;
}

export interface VerifyOnfido {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    country: string;
    identificationType: string;
    birthday: string;
    files: object[];
}

export interface OnfidoWebhook {
    id: string;
}
