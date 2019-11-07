import { combineReducers } from 'redux-starter-kit';

import walletReducer from '../feature/Wallet/Wallet.slice';
import { walletSaga } from '../feature/Wallet/Wallet.saga';
import { fork } from '@redux-saga/core/effects';

export const rootReducer = combineReducers({
    wallet: walletReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
    yield fork(walletSaga);
}

export default rootReducer;
