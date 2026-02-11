import { RedBlackTree } from '../../../../src';

describe('RedBlackTree boundary update coverage', () => {
  it('updating existing min/max via boundary cache fast paths does not change size', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: false });

    t.set(10, 'a');
    t.set(5, 'min');
    t.set(15, 'max');

    const size0 = t.size;

    // Update existing min key: should hit cMin===0 fast-path.
    expect(t.set(5, 'min2')).toBe(true);
    expect(t.size).toBe(size0);
    expect(t.getNode(5)?.value).toBe('min2');

    // Update existing max key: should hit cMax===0 fast-path.
    expect(t.set(15, 'max2')).toBe(true);
    expect(t.size).toBe(size0);
    expect(t.getNode(15)?.value).toBe('max2');
  });
});
