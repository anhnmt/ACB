"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACB = void 0;
const axios_1 = __importDefault(require("axios"));
const StringUtils_1 = require("./utils/StringUtils");
class ACB {
    username;
    password;
    accessToken;
    refreshToken;
    deviceId;
    clientId;
    client;
    constructor(data) {
        this.username = data.username;
        this.password = data.password;
        this.deviceId = (0, StringUtils_1.generateDeviceId)();
        this.clientId = "iuSuHYVufIUuNIREV0FB9EoLn9kHsDbm";
        const HeaderInterceptor = (config) => {
            config.headers['x-request-id'] = (0, StringUtils_1.generateUUID)();
            return config;
        };
        this.client = axios_1.default.create({
            baseURL: "https://apiapp.acb.com.vn",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'apikey': 'CQk6S5usauGmMgMYLGqCuDtgtqIM8FI1',
                'User-Agent': 'ACB-MBA/8 CFNetwork/1335.0.3 Darwin/21.6.0',
                'x-app-version': '3.26.0',
                'x-conversation-id': 'f43472f1-6d88-4228-91b9-4618a079342a'
            }
        });
        this.client.interceptors.request.use(HeaderInterceptor);
    }
    async login() {
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
            });
            const loginResponse = loginRequest.data;
            this.accessToken = loginResponse.accessToken;
            this.refreshToken = loginResponse.refreshToken;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async refreshAccount() {
        try {
            const refreshRequest = await this.client.request({
                method: "POST",
                url: "/mb/v2/auth/refresh",
                headers: {
                    'Authorization': `Bearer ${this.refreshToken}`
                }
            });
            const refreshResponse = refreshRequest.data;
            this.accessToken = refreshResponse.accessToken;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async authAccount() {
        if (this.refreshToken) {
            return await this.refreshAccount();
        }
        else {
            return await this.login();
        }
    }
    async getBalance() {
        await this.authAccount();
        try {
            const balanceRequest = await this.client.request({
                url: "/mb/legacy/ss/cs/bankservice/transfers/list/account-payment",
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            const status = balanceRequest.status;
            const balanceResponse = balanceRequest.data;
            if (status != 200) {
                return undefined;
            }
            const balance = {
                balances: [],
            };
            for (const account of balanceResponse.data) {
                const balanceData = {
                    accountNumber: account.accountNumber,
                    accountDescription: account.accountDescription,
                    ownerName: account.owner,
                    currency: account.currency,
                    balance: account.balance,
                    totalBalance: account.totalBalance,
                    status: account.status
                };
                balance.balances.push(balanceData);
            }
            return balance;
        }
        catch (e) {
            console.log(e.message);
        }
    }
    async getTransactionsHistory(data) {
        await this.authAccount();
        try {
            const historiesRequest = await this.client.request({
                url: `/mb/legacy/ss/cs/bankservice/saving/tx-history?maxRows=${data.rows}&account=${data.accountNumber}`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            const status = historiesRequest.status;
            const historiesResponse = historiesRequest.data;
            if (status != 200) {
                return undefined;
            }
            const transactionHistories = [];
            for (const transaction of historiesResponse.data) {
                const transactionInfo = {
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
                transactionHistories.push(transactionInfo);
            }
            return transactionHistories;
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.ACB = ACB;
