import Wallet from './Wallet';

export type ITransaction = {
    toWallet?: number;
    fromWallet?: number;
    toAmount?: string;
    fromAmount?: string;
    ts: number;
    id: number;
};

export type IWallet = {
    id: number;
    currency: string;
    amount: string;
    transactionList: ITransaction[];
};

export default Wallet;
