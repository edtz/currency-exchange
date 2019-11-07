import { createTransaction } from './transaction';
import { createWallet } from './wallet';

Date.now = jest.fn(() => 1558281600000);

describe('createTransaction():', () => {
    describe('correct data', () => {
        it('should work as expected (1:1)', () => {
            const { transaction, valid } = createTransaction(
                createWallet('EUR', '100'),
                createWallet('GBP'),
                { GBP: 1 },
                10,
            );
            expect(valid).toBe(true);
            expect(transaction).toMatchSnapshot();
        });
        it('should work as expected (1:0.123)', () => {
            const { transaction, valid } = createTransaction(
                createWallet('EUR', '100'),
                createWallet('GBP'),
                { GBP: 0.123 },
                10,
            );
            expect(valid).toBe(true);
            expect(transaction).toMatchSnapshot();
        });
        it('should work as expected (1:99)', () => {
            const { transaction, valid } = createTransaction(
                createWallet('EUR', '100'),
                createWallet('GBP'),
                { GBP: 99 },
                10,
            );
            expect(valid).toBe(true);
            expect(transaction).toMatchSnapshot();
        });
        it('set amount via toAmount', () => {
            const { transaction, valid } = createTransaction(
                createWallet('EUR', '100'),
                createWallet('GBP'),
                { GBP: 1.33 },
                10,
            );
            expect(valid).toBe(true);
            expect(transaction).toMatchSnapshot();
        });
    });
    describe('incorrect data', () => {
        it('empty wallet', () => {
            const { valid } = createTransaction(createWallet('EUR', '0'), createWallet('GBP'), { GBP: 1 }, 10);
            expect(valid).toBe(false);
        });
        it('negative receiver balance', () => {
            const { valid } = createTransaction(createWallet('EUR', '1'), createWallet('GBP', '-1000'), { GBP: 1 }, 1);
            expect(valid).toBe(false);
        });
        it('no amount', () => {
            const { valid } = createTransaction(createWallet('EUR', '1'), createWallet('GBP', '1'), { GBP: 1 });
            expect(valid).toBe(false);
        });
        it('double amount', () => {
            const { valid } = createTransaction(createWallet('EUR', '1'), createWallet('GBP', '1'), { GBP: 1 }, 1, 1);
            expect(valid).toBe(false);
        });
    });
});
