import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import { generateDeviceId, generateUUID } from "./utils/StringUtils";

type BalanceData = {
    accountNumber: string;
    accountDescription: string;
    ownerName: string;
    currency: string;
    balance: string;
    totalBalance: string;
    status: number;
}

type BalanceList = {
    balances: BalanceData[]
};

type TransactionInfo = {
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
    }) {
        this.username = data.username;
        this.password = data.password;
        this.deviceId = generateDeviceId();
        this.clientId = "iuSuHYVufIUuNIREV0FB9EoLn9kHsDbm";

        const HeaderInterceptor = (config: InternalAxiosRequestConfig) => {
              config.headers['x-request-id'] = generateUUID();
              return config;
        };
        this.client = axios.create({
            baseURL: "https://apiapp.acb.com.vn",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'apikey': 'CQk6S5usauGmMgMYLGqCuDtgtqIM8FI1',
                'User-Agent': 'ACB-MBA/8 CFNetwork/1335.0.3 Darwin/21.6.0',
                'x-app-version': '3.26.0',
                'x-conversation-id': 'f43472f1-6d88-4228-91b9-4618a079342a'
            }
        })
        this.client.interceptors.request.use(HeaderInterceptor)
    }

    private async login(): Promise<any> {
        try {
            const loginRequest = await this.client.request({
                url: "/mb/v2/auth/tokens",
                method: "POST",
                data: JSON.stringify({
                    "username": this.username,
                    "password": this.password,
                    "deviceId": this.deviceId,
                    "clientId": this.clientId
                }),
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })
            const loginResponse = loginRequest.data

            this.accessToken = loginResponse.accessToken
            this.refreshToken = loginResponse.refreshToken
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    private async refreshAccount(): Promise<any> {
        try {
            const refreshRequest = await this.client.request({
                method: "POST",
                url: "/mb/v2/auth/refresh",
                headers: {
                    'Authorization': `Bearer ${this.refreshToken}`
                }
            })
            const refreshResponse = refreshRequest.data
            this.accessToken = refreshResponse.accessToken
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    private async authAccount(): Promise<any> {
        if (this.refreshToken) {
            return await this.refreshAccount()
        } else {
            return await this.login()
        }
    }

    public async getBalance(): Promise<BalanceList | undefined> {
        await this.authAccount()

        try {
            const balanceRequest = await this.client.request({
                url: "/mb/legacy/ss/cs/bankservice/transfers/list/account-payment",
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })
            const status = balanceRequest.status
            const balanceResponse = balanceRequest.data

            if (status != 200) {
                return undefined
            }

            const balance: BalanceList = {
                balances: [],
            };

            for (const account of balanceResponse.data) {
                const balanceData: BalanceData = {
                    accountNumber: account.accountNumber,
                    accountDescription: account.accountDescription,
                    ownerName: account.owner,
                    currency: account.currency,
                    balance: account.balance,
                    totalBalance: account.totalBalance,
                    status: account.status
                };
                balance.balances.push(balanceData)
            }

            return balance
        } catch (e: any) {
            console.log(e.message)
        }
    }

    public async getTransactionsHistory(data: {
        rows: number,
        accountNumber: string
    }): Promise<TransactionInfo[] | undefined> {
        await this.authAccount()

        try {
            const historiesRequest = await this.client.request({
                url: `/mb/legacy/ss/cs/bankservice/saving/tx-history?maxRows=${data.rows}&account=${data.accountNumber}`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })
            const status = historiesRequest.status
            const historiesResponse = historiesRequest.data

            if (status != 200) {
                return undefined
            }

            const transactionHistories: TransactionInfo[] = []

            for (const transaction of historiesResponse.data) {
                const transactionInfo: TransactionInfo = {
                    "amount": transaction.amount,
                    "accountName": transaction.accountName,
                    "receiverName": transaction.receiverName,
                    "transactionNumber": transaction.transactionNumber,
                    "description": transaction.description,
                    "bankName": transaction.bankName,
                    "isOnline": transaction.isOnline,
                    "postingDate": transaction.postingDate,
                    "accountOwner": transaction.accountOwner,
                    "type": transaction.type,
                    "receiverAccountNumber": transaction.receiverAccountNumber,
                    "currency": transaction.currency,
                    "account": transaction.account,
                    "activeDatetime": transaction.activeDatetime,
                    "effectiveDate": transaction.effectiveDate
                };
                transactionHistories.push(transactionInfo)
            }

            return transactionHistories
        } catch (e: any) {
            console.log(e.message)
        }
    }
}