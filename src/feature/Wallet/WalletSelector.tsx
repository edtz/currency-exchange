import React from 'react';
import { IWallet } from '.';
import { SelectorContainer, SelectorItem } from './Wallet.style';

export const Selector: React.FC<{ wallets: IWallet[]; activeWallet?: IWallet; handler: (wallet: IWallet) => void }> = ({
    wallets,
    activeWallet,
    handler,
}) => (
    <SelectorContainer>
        {wallets.map(wallet => (
            <SelectorItem
                active={!!activeWallet && activeWallet.id === wallet.id}
                key={wallet.id}
                onClick={() => void handler(wallet)}
            >
                <header>{wallet.currency}</header>
                <span>{wallet.amount}</span>
            </SelectorItem>
        ))}
    </SelectorContainer>
);
