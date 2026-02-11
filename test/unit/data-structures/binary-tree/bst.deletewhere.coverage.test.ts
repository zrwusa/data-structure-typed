import { BST, Range } from '../../../../src';

describe('BST deleteWhere coverage', () => {
  it('deleteWhere(predicate) uses default args (onlyOne/startNode/iterationType)', () => {
    const bst = new BST<number, number>();
    for (const k of [4, 2, 6, 1, 3, 5, 7]) bst.set(k, k);

    // delete evens (should remove 2,4,6)
    const res = bst.deleteWhere(node => node.key % 2 === 0);
    expect(res.length).toBe(3);
    expect(bst.has(2)).toBe(false);
    expect(bst.has(4)).toBe(false);
    expect(bst.has(6)).toBe(false);

    // odd keys remain
    expect([...bst].map(([k]) => k).sort((a, b) => a - b)).toEqual([1, 3, 5, 7]);
  });

  it('deleteWhere(range, onlyOne=true) deletes a single match', () => {
    const bst = new BST<number, number>();
    for (const k of [10, 5, 15, 3, 7, 12, 18]) bst.set(k, k);

    const r = new Range<number>(7, 15, true, true);
    const before = bst.size;

    const res = bst.deleteWhere(r, true);
    expect(res.length).toBe(1);
    expect(bst.size).toBe(before - 1);
  });

  it('protected _createLike default iterable branch', () => {
    const bst = new BST<number, number>([2, 1, 3]);
    const like = (bst as any)._createLike();
    expect(like).toBeInstanceOf(BST);
    expect(like.size).toBe(0);
  });
});
