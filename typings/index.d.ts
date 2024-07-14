import { AxiosInstance } from "axios";

export class ACB {

    private readonly username: string;
    private readonly password: string;

    private accessToken: string | undefined;
    private refreshToken: string | undefined;
    private readonly deviceId: string;
    private readonly clientId: string;

    private client: AxiosInstance;

    constructor(data: {
        username: string,
        password: string,
    })

    private login(): Promise<any>;
    private refreshAccount(): Promise<any>;
    private authAccount(): Promise<any>;
    public getBalance(): Promise<BalanceList | undefined>;
    public getTransactionsHistory(data: {
        rows: number,
        accountNumber: string
    }): Promise<TransactionInfo[] | undefined>;
}

export type BalanceData = {
    accountNumber: string;
    accountDescription: string;
    ownerName: string;
    currency: string;
    balance: string;
    totalBalance: string;
    status: number;
}

export type BalanceList = {
    balances: BalanceData[]
};

export type TransactionInfo = {
    "amount": string;
    "accountName": string;
    "receiverName": string;
    "transactionNumber": number;
    "description": string;
    "bankName": string;
    "isOnline": boolean;
    "postingDate": number;
    "accountOwner": string | null;
    "type": "IN" | "OUT";
    "receiverAccountNumber": string;
    "currency": string;
    "account": number;
    "activeDatetime": number;
    "effectiveDate": number;
}