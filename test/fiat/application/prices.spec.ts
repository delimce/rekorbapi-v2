/* eslint-disable prettier/prettier */
import * as PricesModule from '@Fiat/application/prices';

describe('Prices Module Exports', () => {
    it('should export BcvUseCase', () => {
        expect(PricesModule.BcvUseCase).toBeDefined();
        expect(typeof PricesModule.BcvUseCase).toBe('function');
    });

    it('should export BlueUseCase', () => {
        expect(PricesModule.BlueUseCase).toBeDefined();
        expect(typeof PricesModule.BlueUseCase).toBe('function');
    });

    it('should have all expected exports', () => {
        const expectedExports = ['BcvUseCase', 'BlueUseCase'];
        const actualExports = Object.keys(PricesModule);

        expectedExports.forEach((exportName) => {
            expect(actualExports).toContain(exportName);
        });
    });

    it('should export use cases as constructible classes', () => {
        expect(() => new PricesModule.BcvUseCase(null as any)).not.toThrow();
        expect(() => new PricesModule.BlueUseCase(null as any)).not.toThrow();
    });
});
