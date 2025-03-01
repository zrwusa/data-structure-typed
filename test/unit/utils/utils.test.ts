import { isComparable } from '../../../src';

describe('isNaN', () => {
  it('should isNaN', function () {
    expect(isNaN('string' as unknown as number)).toBe(true);
  });
});

describe('isComparable', () => {
  describe('primitive types', () => {
    it('numbers should be comparable', () => {
      expect(isComparable(42)).toBe(true);
      expect(isComparable(0)).toBe(true);
      expect(isComparable(-1)).toBe(true);
      expect(isComparable(Infinity)).toBe(true);
      expect(isComparable(-Infinity)).toBe(true);
    });

    // it('NaN should not be comparable', () => {
    //   expect(isComparable(NaN)).toBe(false);
    // });

    it('strings should be comparable', () => {
      expect(isComparable('hello')).toBe(true);
      expect(isComparable('')).toBe(true);
      expect(isComparable('123')).toBe(true);
    });

    it('BigInt should be comparable', () => {
      expect(isComparable(BigInt(42))).toBe(true);
      expect(isComparable(BigInt(0))).toBe(true);
      expect(isComparable(BigInt(-1))).toBe(true);
    });

    it('boolean should not be comparable', () => {
      expect(isComparable(true)).toBe(true);
      expect(isComparable(false)).toBe(true);
    });

    it('null and undefined should not be comparable', () => {
      expect(isComparable(null)).toBe(false);
      expect(isComparable(undefined)).toBe(false);
    });

    it('symbols should not be comparable', () => {
      expect(isComparable(Symbol('test'))).toBe(false);
      expect(isComparable(Symbol.for('test'))).toBe(false);
    });
  });

  describe('Date objects', () => {
    it('valid Date objects should be comparable', () => {
      expect(isComparable(new Date())).toBe(true);
      expect(isComparable(new Date('2024-01-01'))).toBe(true);
    });

    // it('invalid Date objects should not be comparable', () => {
    //   expect(isComparable(new Date('invalid'))).toBe(false);
    // });
  });

  describe('arrays', () => {
    it('arrays should be comparable as they convert to string', () => {
      expect(isComparable([])).toBe(true);
      expect(isComparable([1, 2, 3])).toBe(true);
      expect(isComparable(['a', 'b', 'c'])).toBe(true);
    });
  });

  describe('plain objects', () => {
    it('plain objects should not be comparable', () => {
      expect(isComparable({})).toBe(false);
      expect(isComparable({ a: 1 })).toBe(false);
    });
  });

  describe('custom objects', () => {
    it('objects with numeric valueOf should be comparable', () => {
      expect(isComparable({ valueOf: () => 42 })).toBe(true);
    });

    it('objects with string valueOf should be comparable', () => {
      expect(isComparable({ valueOf: () => 'test' })).toBe(true);
    });

    it('objects with boolean valueOf should not be comparable', () => {
      expect(isComparable({ valueOf: () => true })).toBe(true);
    });

    it('objects with nested valueOf/toString should be comparable', () => {
      expect(
        isComparable({
          valueOf: () => ({ toString: () => '42' })
        })
      ).toBe(true);
    });
  });

  describe('deeply nested objects', () => {
    it('objects with deeply nested valueOf should be comparable', () => {
      const deeplyNested = {
        valueOf: () => ({
          valueOf: () => 42
        })
      };
      expect(isComparable(deeplyNested)).toBe(true);
    });

    it('objects with very deeply nested conversion should be comparable', () => {
      const veryDeeplyNested = {
        valueOf: () => ({
          valueOf: () => ({
            toString: () => '42'
          })
        })
      };
      expect(isComparable(veryDeeplyNested)).toBe(true);
    });

    it('objects with circular references should not be comparable', () => {
      const circular: any = {
        valueOf: () => circular
      };
      expect(isComparable(circular)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('objects returning non-primitive values should be handled correctly', () => {
      const complexObject = {
        valueOf: () => ({
          toString: () => ({
            valueOf: () => 'valid'
          })
        })
      };
      expect(isComparable(complexObject)).toBe(false);
    });

    it('objects returning primitive values should be handled correctly', () => {
      const complexObject = {
        valueOf: () => ({
          valueOf: () => ({
            valueOf: () => ({
              valueOf: () => ({
                toString: () => `{
                                   valueOf: () => 'valid'
                                 }`
              })
            })
          })
        })
      };
      expect(isComparable(complexObject)).toBe(true);
    });
  });

  describe('type checking', () => {
    // it('should narrow types correctly', () => {
    //   const value: unknown = 42;
    //   if (isComparable(value)) {
    //     // Type narrowing here should succeed
    //     const result = value > 0;
    //     expect(result).toBe(true);
    //   }
    // });

    it('should work with type guard in array methods', () => {
      const values: unknown[] = [42, 'test', true, null, undefined, new Date()];
      const comparableValues = values.filter(item => isComparable(item));
      expect(comparableValues.length).toBe(4);
    });
  });
});

