export interface Rates {
    usd: number;
    btc: number;
    eur: number;
}

export interface SettingsQR {
    buffer: Buffer;
    secret: string;
}

export interface TransactionHistory {
    count: number;
    history: Transaction[];
}

export interface UserInfoKyc {
    inProgress: boolean;
    passed: boolean;
    failed: boolean;
}

export interface UserInfo {
    id?: number;

    firstName: string;
    lastName: string;
    email: string;
    country: string;

    vip: boolean;
    enabled2fa: boolean;

    kyc: UserInfoKyc;

    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    description?: string[];
}

export interface Transaction {
    id: string;
    agent: string;
    transType: string;
    amount: number;
    amountTokens: number;
    bonus: number;
    currencyRate: number;
    bankId: string;
    time: Date;
}

export interface Investment {
    amount: string;
    currency: string;
}
