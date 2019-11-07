import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { IWallet } from '.';
import { IRootState } from '../../store';
import { Header } from './Wallet.style';
import { commitTransaction, setActiveWallet, selectAllWallets, selectActiveWallet } from './Wallet.slice';
import { TransactionList } from '../../components/TransactionList';
import { Button } from '../../components/Button.style';
import { Selector } from './WalletSelector';
import { Input } from '../../components/Input.style';
import { useTransientState } from './hooks';
import { createTransaction } from '../../utils/transaction';

export interface IWalletProps {
    wallets: IWallet[];
    commitTransaction: typeof commitTransaction;
    setActiveWallet: typeof setActiveWallet;
    activeWallet?: IWallet;
    rates?: Record<string, number>;
}

/* eslint-disable jsx-a11y/accessible-emoji  */
/* eslint-disable react-hooks/exhaustive-deps  */
export const Wallets: React.FC<IWalletProps> = ({
    activeWallet,
    commitTransaction,
    setActiveWallet,
    rates,
    wallets,
}) => {
    const [isExchanging, setExchanging] = useState(false);
    const [isValid, setValid] = useState(false);
    const [toWallet, setToWallet] = useState<IWallet | undefined>(undefined);
    const [lastUsedField, setLastUsedField] = useState<'from' | 'to'>('from');

    const fromField = useTransientState('');
    const toField = useTransientState('');

    useEffect(() => {
        setToWallet(undefined);
        fromField.setTextValue('');
        toField.setTextValue('');
    }, [isExchanging]);
    useEffect(() => {
        if (!activeWallet || !toWallet || !rates) return;
        setLastUsedField(fromField.isFocused ? 'from' : 'to');
        const val = fromField.isFocused ? fromField.textValue : toField.textValue;
        const { valid, amounts } = createTransaction(
            activeWallet,
            toWallet,
            rates,
            fromField.isFocused ? val : undefined,
            toField.isFocused ? val : undefined,
        );
        setValid(valid);
        if (!amounts) return;
        if (fromField.isFocused) {
            toField.setTextValue(amounts.toAmount);
        } else {
            fromField.setTextValue(amounts.fromAmount);
        }
    }, [fromField.textValue, toField.textValue]);

    return (
        <>
            <Header isHidden={!isExchanging}>From:</Header>
            <Selector handler={setActiveWallet} wallets={wallets} activeWallet={activeWallet} />
            {activeWallet && (
                <>
                    <Button onClick={() => void setExchanging(!isExchanging)} key="exchange">
                        {isExchanging ? '⛔️ CANCEL' : '💸 EXCHANGE'}
                    </Button>
                    <Header isHidden={!isExchanging}>To:</Header>
                    {isExchanging && (
                        <Selector
                            handler={setToWallet}
                            wallets={wallets.filter(({ id }) => id !== activeWallet.id)}
                            activeWallet={toWallet}
                        />
                    )}
                    {!rates && (
                        <div>
                            Note: fixer.io doesn't support base currencies that aren't EUR, so this is not working
                        </div>
                    )}
                    {toWallet && rates && (
                        <>
                            <Header>
                                1 {activeWallet.currency} ~ {rates[toWallet.currency]} {toWallet.currency}
                            </Header>
                            <Header>{activeWallet.currency}</Header>
                            <Input {...fromField.inputProps} />
                            <Header>{toWallet.currency}</Header>
                            <Input {...toField.inputProps} />
                        </>
                    )}
                    {toWallet && isValid && (
                        <Button
                            onClick={() => {
                                commitTransaction({
                                    fromWalletID: activeWallet.id,
                                    toWalletID: toWallet.id,
                                    fromAmount: lastUsedField === 'from' ? Number(fromField.textValue) : undefined,
                                    toAmount: lastUsedField === 'to' ? Number(toField.textValue) : undefined,
                                });
                                setExchanging(false);
                            }}
                        >
                            👌 SUBMIT
                        </Button>
                    )}
                    <TransactionList
                        transactions={activeWallet.transactionList.map(transaction => ({
                            ...transaction,
                            isPositive: transaction.fromWallet !== activeWallet.id,
                        }))}
                    />
                </>
            )}
        </>
    );
};

const state2props = (state: IRootState) => ({
    activeWallet: selectActiveWallet(state),
    rates: state.wallet.activeWalletRates,
    wallets: selectAllWallets(state),
});

export default connect(
    state2props,
    { commitTransaction, setActiveWallet },
)(Wallets);
