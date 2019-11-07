import { ITransaction, IWallet } from "../feature/Wallet";

let id = 0;
export const createWallet = (currency: string, amount: string = '0.00', transactionList: ITransaction[] = []): IWallet => ({
    id: id++,
    currency,
    amount,
    transactionList,
});