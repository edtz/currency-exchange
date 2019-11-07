import { IWallet, ITransaction } from '../feature/Wallet';
import Decimal from 'decimal.js';

type ICreateTransactionReturn = {
    valid: boolean;
    transaction?: ITransaction;
    toBalance?: string;
    fromBalance?: string;
    amounts?: {
        fromAmount: string;
        toAmount: string;
    };
};

let id = 0;
export const createTransaction = (
    fromWallet: IWallet,
    toWallet: IWallet,
    rates: Record<string, number>,
    fromAmount?: number | string,
    toAmount?: number | string,
): ICreateTransactionReturn => {
    const invalid = { valid: false };

    let amounts: { [key: string]: Decimal } = {};
    const fromDecimalBalance = new Decimal(fromWallet.amount);
    const toDecimalBalance = new Decimal(toWallet.amount);
    const decimalRate = new Decimal(rates[toWallet.currency] || 0);

    if ((fromAmount === undefined && toAmount === undefined) || (fromAmount !== undefined && toAmount !== undefined))
        return invalid;

    if (fromAmount === undefined) {
        amounts = {
            fromAmount: new Decimal(toAmount || 0).dividedBy(decimalRate),
            toAmount: new Decimal(toAmount || 0),
        };
    }
    if (toAmount === undefined) {
        amounts = {
            fromAmount: new Decimal(fromAmount || 0),
            toAmount: new Decimal(fromAmount || 0).times(decimalRate),
        };
    }
    if (!amounts.fromAmount.greaterThan(0) || !amounts.toAmount.greaterThan(0)) return invalid;
    const resultingBalances = {
        fromBalance: fromDecimalBalance.minus(amounts.fromAmount),
        toBalance: toDecimalBalance.plus(amounts.toAmount),
    };
    if (resultingBalances.fromBalance.greaterThan(0)) {
        return {
            valid: true,
            transaction: {
                id: id++,
                ts: Date.now(),
                fromWallet: fromWallet.id,
                toWallet: toWallet.id,
                fromAmount: amounts.fromAmount.toFixed(2),
                toAmount: amounts.toAmount.toFixed(2),
            },
            fromBalance: resultingBalances.fromBalance.toFixed(2),
            toBalance: resultingBalances.toBalance.toFixed(2),
            amounts: {
                fromAmount: amounts.fromAmount.toFixed(2),
                toAmount: amounts.toAmount.toFixed(2),
            },
        };
    }
    return invalid;
};
