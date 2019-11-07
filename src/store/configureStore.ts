import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { IRootState, rootSaga } from '.';

export default function configureAppStore(preloadedState?: IRootState) {
    const saga = createSagaMiddleware();
    const store = configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware({ thunk: false }), saga],
        preloadedState,
    });
    saga.run(rootSaga);

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('.', () => {
            const newRootReducer = require('.').default;
            store.replaceReducer(newRootReducer);
        });
    }

    return store;
}
