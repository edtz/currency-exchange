import { fork, put, select, call, race, delay, take, takeEvery } from '@redux-saga/core/effects';

import { setWallets, setActiveWallet, selectActiveWallet, setActiveRates, commitTransaction } from './Wallet.slice';
import { getFXRateForPair } from '../../api/FXRates';
import { sampleWallets } from './fixtures';
import { IRootState } from '../../store';
import { createTransaction } from '../../utils/transaction';

function* setInitialData() {
    yield put(setWallets(sampleWallets));
}

function* trackFXRate() {
    let isRunning = true;
    try {
        while (isRunning) {
            const activeWallet = yield select(selectActiveWallet);
            if (activeWallet) {
                const { rates } = yield call(getFXRateForPair, activeWallet.currency);
                yield put(setActiveRates(rates));
            }
            // TODO change to 10sec
            const { cancel } = yield race({ cancel: take(setActiveWallet.toString()), timeout: delay(100000000) });
            if (cancel) isRunning = false;
        }
    } catch (e) {
        console.error('Error in saga: ', e);
    }
}

function* handleTransaction(action: ReturnType<typeof commitTransaction>) {
    try {
        const { fromWalletID, toWalletID, toAmount, fromAmount } = action.payload;
        const fromWallet = yield select((state: IRootState) => state.wallet.walletList[fromWalletID]);
        const toWallet = yield select((state: IRootState) => state.wallet.walletList[toWalletID]);
        const { rates } = yield call(getFXRateForPair, fromWallet.currency, toWallet.currency);
        const { valid, transaction, fromBalance, toBalance } = createTransaction(
            fromWallet,
            toWallet,
            rates,
            fromAmount,
            toAmount,
        );

        if (!valid) throw new Error('Unsuccessful transaction');
        yield put(
            setWallets([
                {
                    ...fromWallet,
                    amount: fromBalance,
                    transactionList: [...fromWallet.transactionList, transaction],
                },
                {
                    ...toWallet,
                    amount: toBalance,
                    transactionList: [...toWallet.transactionList, transaction],
                },
            ]),
        );
    } catch (e) {
        console.error(e);
    }
}

export function* walletSaga() {
    yield takeEvery(setActiveWallet.toString(), trackFXRate);
    yield takeEvery(commitTransaction.toString(), handleTransaction);
    yield fork(setInitialData);
}
