/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { LengthPipe } from '@Fiat/infrastructure/pipes/length.pipe';

describe('LengthPipe', () => {
    let pipe: LengthPipe;

    beforeEach(() => {
        pipe = new LengthPipe();
    });

    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });

    describe('valid currency codes', () => {
        it('should accept valid 3-letter uppercase codes', () => {
            const validCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

            validCodes.forEach((code) => {
                expect(() => pipe.transform(code)).not.toThrow();
                expect(pipe.transform(code)).toBe(code);
            });
        });

        it('should accept valid 3-letter lowercase codes', () => {
            const validCodes = ['usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'chf'];

            validCodes.forEach((code) => {
                expect(() => pipe.transform(code)).not.toThrow();
                expect(pipe.transform(code)).toBe(code);
            });
        });

        it('should accept mixed case 3-letter codes', () => {
            const mixedCases = ['Usd', 'eUr', 'GbP', 'jPy', 'CaD', 'AuD', 'cHf'];

            mixedCases.forEach((code) => {
                expect(() => pipe.transform(code)).not.toThrow();
                expect(pipe.transform(code)).toBe(code);
            });
        });

        it('should accept codes with special characters', () => {
            const specialCodes = ['EU@', 'US#', 'GB$', 'JP%', 'CA^', 'AU&', 'CH*'];

            specialCodes.forEach((code) => {
                expect(() => pipe.transform(code)).not.toThrow();
                expect(pipe.transform(code)).toBe(code);
            });
        });

        it('should accept codes with underscores and hyphens', () => {
            const specialCodes = ['EU_', 'US-', 'G_B', 'J-P', 'C_D', 'A-U'];

            specialCodes.forEach((code) => {
                expect(() => pipe.transform(code)).not.toThrow();
                expect(pipe.transform(code)).toBe(code);
            });
        });

        it('should return the exact same string for valid inputs', () => {
            expect(pipe.transform('USD')).toBe('USD');
            expect(pipe.transform('eur')).toBe('eur');
            expect(pipe.transform('GbP')).toBe('GbP');
            expect(pipe.transform('jp@')).toBe('jp@');
        });
    });

    describe('invalid currency codes with numbers', () => {
        it('should reject codes containing single digits', () => {
            const codesWithNumbers = ['US1', 'E2R', '3BP', 'JP4', 'CA5', 'AU6'];

            codesWithNumbers.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);

                try {
                    pipe.transform(code);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('currency code cannot contain a number');
                }
            });
        });

        it('should reject codes with multiple digits', () => {
            const codesWithMultipleNumbers = ['123', '12D', 'U23', '1BC'];

            codesWithMultipleNumbers.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);

                try {
                    pipe.transform(code);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('currency code cannot contain a number');
                }
            });
        });

        it('should reject codes with numbers at different positions', () => {
            const positions = [
                { code: '1BC', position: 'start' },
                { code: 'A2C', position: 'middle' },
                { code: 'AB3', position: 'end' },
            ];

            positions.forEach(({ code }) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);

                try {
                    pipe.transform(code);
                } catch (error) {
                    expect(error.message).toBe('currency code cannot contain a number');
                }
            });
        });

        it('should reject codes with zero', () => {
            const codesWithZero = ['0BC', 'A0C', 'AB0', '000'];

            codesWithZero.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);
            });
        });
    });

    describe('invalid currency codes with wrong length', () => {
        it('should reject empty string', () => {
            expect(() => pipe.transform('')).toThrow(BadRequestException);

            try {
                pipe.transform('');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('wrong currency code');
            }
        });

        it('should reject single character codes', () => {
            const singleChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

            singleChars.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);

                try {
                    pipe.transform(code);
                } catch (error) {
                    expect(error.message).toBe('wrong currency code');
                }
            });
        });

        it('should reject two character codes', () => {
            const twoChars = ['US', 'EU', 'GB', 'JP', 'CA', 'AU', 'CH'];

            twoChars.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);

                try {
                    pipe.transform(code);
                } catch (error) {
                    expect(error.message).toBe('wrong currency code');
                }
            });
        });

        it('should reject four character codes', () => {
            const fourChars = ['USDA', 'EURO', 'GBPA', 'JPYA', 'CADA', 'AUDA'];

            fourChars.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);

                try {
                    pipe.transform(code);
                } catch (error) {
                    expect(error.message).toBe('wrong currency code');
                }
            });
        });

        it('should reject very long codes', () => {
            const longCodes = [
                'USDA',
                'DOLLAR',
                'AMERICAN_DOLLAR',
                'VERY_LONG_CURRENCY_CODE',
            ];

            longCodes.forEach((code) => {
                expect(() => pipe.transform(code)).toThrow(BadRequestException);
            });
        });
    });

    describe('edge cases', () => {

        it('should handle special Unicode characters', () => {
            expect(() => pipe.transform('€$£')).not.toThrow();
            expect(() => pipe.transform('¥¢₹')).not.toThrow();
            expect(pipe.transform('€$£')).toBe('€$£');
        });

        it('should handle null and undefined inputs gracefully', () => {
            expect(() => pipe.transform(null as any)).toThrow();
            expect(() => pipe.transform(undefined as any)).toThrow();
        });

        it('should handle non-string inputs', () => {
            expect(() => pipe.transform(123 as any)).toThrow();
            expect(() => pipe.transform({} as any)).toThrow();
            expect(() => pipe.transform([] as any)).toThrow();
        });
    });

    describe('validation priority', () => {
        it('should check for numbers before length', () => {
            // Code with number and wrong length should throw number error first
            expect(() => pipe.transform('1')).toThrow(BadRequestException);

            try {
                pipe.transform('1');
            } catch (error) {
                expect(error.message).toBe('currency code cannot contain a number');
            }
        });

        it('should check for numbers in codes longer than 3 characters', () => {
            expect(() => pipe.transform('USD1')).toThrow(BadRequestException);

            try {
                pipe.transform('USD1');
            } catch (error) {
                expect(error.message).toBe('currency code cannot contain a number');
            }
        });

        it('should check length only when no numbers are present', () => {
            expect(() => pipe.transform('USDA')).toThrow(BadRequestException);

            try {
                pipe.transform('USDA');
            } catch (error) {
                expect(error.message).toBe('wrong currency code');
            }
        });
    });

    describe('PipeTransform interface', () => {
        it('should implement PipeTransform interface', () => {
            expect(pipe.transform).toBeDefined();
            expect(typeof pipe.transform).toBe('function');
        });

        it('should have correct transform method signature', () => {
            const result = pipe.transform('USD');
            expect(typeof result).toBe('string');
            expect(result).toBe('USD');
        });
    });

    describe('performance', () => {
        it('should handle multiple validations efficiently', () => {
            const codes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
            const start = performance.now();

            for (let i = 0; i < 1000; i++) {
                codes.forEach((code) => pipe.transform(code));
            }

            const end = performance.now();
            const duration = end - start;

            // Should complete 5000 validations in reasonable time (< 100ms)
            expect(duration).toBeLessThan(100);
        });

        it('should handle error cases efficiently', () => {
            const invalidCodes = ['US1', 'USDA', '1BC', 'AB'];
            let errorCount = 0;

            const start = performance.now();

            for (let i = 0; i < 1000; i++) {
                invalidCodes.forEach((code) => {
                    try {
                        pipe.transform(code);
                    } catch {
                        errorCount++;
                    }
                });
            }

            const end = performance.now();
            const duration = end - start;

            expect(errorCount).toBe(4000); // 4 invalid codes × 1000 iterations
            expect(duration).toBeLessThan(100);
        });
    });

    describe('common currency codes', () => {
        it('should accept all major world currencies', () => {
            const majorCurrencies = [
                'USD', // US Dollar
                'EUR', // Euro
                'JPY', // Japanese Yen
                'GBP', // British Pound
                'CNY', // Chinese Yuan
                'AUD', // Australian Dollar
                'CAD', // Canadian Dollar
                'CHF', // Swiss Franc
                'HKD', // Hong Kong Dollar
                'SGD', // Singapore Dollar
                'INR', // Indian Rupee
                'KRW', // South Korean Won
                'BRL', // Brazilian Real
                'MXN', // Mexican Peso
                'RUB', // Russian Ruble
            ];

            majorCurrencies.forEach((currency) => {
                expect(() => pipe.transform(currency)).not.toThrow();
                expect(pipe.transform(currency)).toBe(currency);
            });
        });

        it('should accept Latin American currencies', () => {
            const latinAmericanCurrencies = [
                'ARS', // Argentine Peso
                'VES', // Venezuelan Bolívar
                'COP', // Colombian Peso
                'CLP', // Chilean Peso
                'PEN', // Peruvian Sol
                'UYU', // Uruguayan Peso
                'BOB', // Bolivian Boliviano
                'PYG', // Paraguayan Guaraní
            ];

            latinAmericanCurrencies.forEach((currency) => {
                expect(() => pipe.transform(currency)).not.toThrow();
                expect(pipe.transform(currency)).toBe(currency);
            });
        });
    });
});
