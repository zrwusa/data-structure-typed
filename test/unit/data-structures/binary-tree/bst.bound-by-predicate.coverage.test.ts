import { BST } from '../../../../src';

describe('BST _boundByPredicate coverage', () => {
  it('recursive traversal: returns first in-order match and short-circuits once found', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

    const pred = (node: any) => node.key >= 7;
    const out = (t as any)._boundByPredicate(pred, 'RECURSIVE');
    expect(out?.key).toBe(7);
  });

  it('recursive traversal: returns undefined when no match', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    const out = (t as any)._boundByPredicate((node: any) => node.key === 999, 'RECURSIVE');
    expect(out).toBeUndefined();
  });

  it('iterative traversal: returns first match and breaks when stack pop is not real', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    const out = (t as any)._boundByPredicate((node: any) => node.key === 10, 'ITERATIVE');
    expect(out?.key).toBe(10);

    // Force the internal stack-pop guard branch by clearing the tree and calling again.
    t.clear();
    const out2 = (t as any)._boundByPredicate((node: any) => node.key === 1, 'ITERATIVE');
    expect(out2).toBeUndefined();
  });
});
