import React from 'react';
import { ITransaction } from '../feature/Wallet';

export const TransactionList: React.FC<{ transactions: Array<{ isPositive: boolean } & ITransaction> }> = ({
    transactions,
}) => {
    return (
        <section>
            {transactions.map(({id, isPositive, fromAmount, toAmount}) => (
                <div key={id}>{isPositive ? `+ ${toAmount}` : `-${fromAmount}`}</div>
            ))}
        </section>
    );
};
