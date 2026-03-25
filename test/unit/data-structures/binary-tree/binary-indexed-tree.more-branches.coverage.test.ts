import { BinaryIndexedTree } from '../../../../src';

describe('BinaryIndexedTree remaining branch coverage', () => {
  it('constructor sets negativeCount=max when frequency < 0 (ternary true arm)', () => {
    const bit = new BinaryIndexedTree({ max: 10, frequency: -1 });
    expect(bit.negativeCount).toBe(10);
  });

  it('read() throws when count is not an integer', () => {
    const bit = new BinaryIndexedTree({ max: 10 });
    expect(() => bit.read(1.5)).toThrow('Invalid count');
  });

  it('index validation throws when index is not an integer', () => {
    const bit = new BinaryIndexedTree({ max: 10 });
    expect(() => bit.readSingle(1.2 as any)).toThrow('Invalid index');
  });
});
