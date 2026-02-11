import { RedBlackTree } from '../../../../src';

describe('RedBlackTree misc input coverage', () => {
  it('delete(null) returns [] and does not throw', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(1, 1);
    expect(t.delete(null as any)).toEqual([]);
    expect(t.size).toBe(1);
  });

  it('delete(undefined) returns [] and does not throw', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(1, 1);
    expect(t.delete(undefined as any)).toEqual([]);
    expect(t.size).toBe(1);
  });
});
