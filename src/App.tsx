import React from 'react';
import { Provider } from 'react-redux';

import ExchangeWidget from './feature/Wallet';
import configureAppStore from './store/configureStore';
import { Layout } from './components/Layout.style';

const store = configureAppStore();

const App: React.FC = () => {
    return (
        <Layout>
            <Provider store={store}>
                <ExchangeWidget />
            </Provider>
        </Layout>
    );
};

export default App;
