import { client } from '.';

export type ISymbols = Record<string, string>;


export const getSymbols = () => {
    return client
        .get<ISymbols>('http://data.fixer.io/api/symbols')
};
export const getFXRateForPair = (base: string, ...symbols: string[]) => {
    return client.get('http://data.fixer.io/api/latest', { base, symbols: symbols.join(',') });
};
