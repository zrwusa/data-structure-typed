import { BST } from '../../../../src';

describe('BST remaining reachable branch coverage (batch 4)', () => {
  it('search(): entry with defined key sets targetKey (covers entry[0] non-nullish branch)', () => {
    const t = new BST<number, number>();
    t.setMany([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);

    const res = (t as any).search([2, undefined], (n: any) => n.key);
    expect(res).toEqual([2]);
  });

  it('setMany(): recursive balanced build hits isRaw(key) branch', () => {
    type Raw = { k: number; v: number };
    const t = new BST<number, number, Raw>([], {
      toEntryFn: (r: Raw) => [r.k, r.v]
    });

    const inserted = t.setMany(
      [
        { k: 2, v: 20 },
        { k: 1, v: 10 },
        { k: 3, v: 30 }
      ],
      undefined,
      true,
      'RECURSIVE'
    );

    expect(inserted).toHaveLength(3);
    expect(t.get(2)).toBe(20);
  });
});
