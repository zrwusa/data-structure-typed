import { BST } from '../../../../src';

describe('BST remaining reachable branch coverage (batch 3)', () => {
  it('search(): entry with nullish key does not set targetKey (covers entry[0] nullish guard)', () => {
    const t = new BST<number, number>();
    t.set(1, 1);

    // Should not throw; should return empty due to targetKey undefined.
    const res = (t as any).search([null, 1], (n: any) => n.key);
    expect(res).toEqual([]);
  });

  it('search(): forces key-pruning branches to evaluate inside shouldVisitLeft/Right by toggling _isPredicate', () => {
    const t = new BST<number, number>();
    t.setMany([
      [2, 2],
      [1, 1],
      [3, 3]
    ]);

    const pred = (node: any) => node.key === 2;

    const origIsPred = (t as any)._isPredicate;
    let calls = 0;
    (t as any)._isPredicate = (x: any) => {
      calls++;
      // search() calls _isPredicate multiple times (isPred calc + ensurePredicate + pruning closures).
      // Keep it true for the initial plumbing, then flip to false so pruning takes the key-pruning branch.
      if (calls <= 3) return true;
      return false;
    };

    try {
      const out = (t as any).search(pred, (n: any) => n.key);
      expect(out).toEqual([2]);
    } finally {
      (t as any)._isPredicate = origIsPred;
    }
  });

  it('lower(): nullish input + nullish callback hits `|| !callback` branch', () => {
    const t = new BST<number, number>();
    expect((t as any).lower(undefined, undefined)).toBeUndefined();
  });
});
