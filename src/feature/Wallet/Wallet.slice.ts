import { createSlice, PayloadAction, createSelector, createAction } from 'redux-starter-kit';

import { IWallet } from '.';
import { IRootState } from '../../store';

type IExchangeWidgetState = {
    activeWalletID?: number;
    activeWalletRates?: Record<string, number>;
    walletIDs: number[];
    walletList: Record<string, IWallet>;
};

export type ICommitTransactionPayload = {
    fromWalletID: number;
    toWalletID: number;
    fromAmount?: number;
    toAmount?: number;
}

const initialState: IExchangeWidgetState = {
    activeWalletID: undefined,
    activeWalletRates: undefined,
    walletIDs: [],
    walletList: {},
};

const slice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWallets(state, action: PayloadAction<IWallet[]>) {
            action.payload.forEach(wallet => (state.walletList[wallet.id] = wallet));
            state.walletIDs = Object.values(state.walletList).map(wallet => wallet.id);
        },
        setActiveWallet(state, action: PayloadAction<IWallet>) {
            state.activeWalletID = action.payload.id;
            state.activeWalletRates = undefined;
        },
        setActiveRates(state, action: PayloadAction<IExchangeWidgetState['activeWalletRates']>) {
            state.activeWalletRates = action.payload;
        }
    },
});

export const { setWallets, setActiveWallet, setActiveRates } = slice.actions;
export const commitTransaction = createAction<ICommitTransactionPayload>('wallet/commitTransaction');

export default slice.reducer;

export const selectActiveWallet = createSelector(
    (state: IRootState) => state.wallet.activeWalletID,
    (state: IRootState) => state.wallet.walletList,
    (activeWalletID, wallets) => (activeWalletID !== undefined ? wallets[activeWalletID] : undefined),
);

export const selectAllWallets = createSelector(
    (state: IRootState) => state.wallet.walletIDs,
    (state: IRootState) => state.wallet.walletList,
    (walletIDs, walletList) => walletIDs.map(id => walletList[id]),
);
