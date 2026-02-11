import { BST } from '../../../../src';

describe('BST search() fast-path coverage', () => {
  it('search(node) uses node.key extraction branch and returns callback result', () => {
    const t = new BST<number, string>([], { isMapMode: false });
    t.set(10, 'a');
    t.set(5, 'b');
    t.set(15, 'c');

    const n5 = t.getNode(5)!;
    const out = t.search(n5, false, (n: any) => n.value);
    expect(out).toEqual(['b']);
  });

  it('search(entry) with null key returns [] (covers entry null-key guard in fast path)', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    const out = t.search([null as any, 1] as any);
    expect(out).toEqual([]);
  });

  it('search by key returns [] when startNode ensureNode fails', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    const out = t.search(10 as any, false, (n: any) => n.key, null as any);
    expect(out).toEqual([]);
  });
});
