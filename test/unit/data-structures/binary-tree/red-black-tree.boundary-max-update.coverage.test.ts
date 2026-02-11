import { RedBlackTree } from '../../../../src';

describe('RedBlackTree boundary max update coverage', () => {
  it('mapMode: updating existing max key with defined value hits store.set branch in cMax===0 fast-path', () => {
    const t = new RedBlackTree<number, string>(); // mapMode default

    t.set(10, 'mid');
    t.set(5, 'min');
    t.set(15, 'max');

    // Update existing max key with a defined value.
    t.set(15, 'max2');

    expect(t.get(15)).toBe('max2');
    // Assert store updated (fast-path uses store.set).
    expect((t as any)._store.get(15)).toBe('max2');
  });
});
