import { AVLTreeCounter } from '../../../../src';

describe('AVLTreeCounter remaining reachable branch coverage (batch 3)', () => {
  it('perfectlyBalance returns false for empty tree (n===0 branch)', () => {
    const t = new AVLTreeCounter<number, number>();
    expect(t.perfectlyBalance()).toBe(false);
  });

  it('clone covers non-mapMode branch (bfs sets values)', () => {
    const t = new AVLTreeCounter<number, string>([], { isMapMode: false });
    t.set(1, 'a', 3);

    const c = t.clone();
    expect(c.get(1)).toBe('a');
    expect((c as any).getNode(1).count).toBe(3);
  });

  it('_createLike hits default iter=[] parameter', () => {
    const t = new AVLTreeCounter<number, number>();
    const like = (t as any)._createLike();
    expect(like).toBeInstanceOf(AVLTreeCounter);
    expect(like.size).toBe(0);
  });

  it('_keyValueNodeOrEntryToNodeAndValue entry with undefined key returns [undefined, undefined]', () => {
    const t = new AVLTreeCounter<number, number>();
    const out = (t as any)._keyValueNodeOrEntryToNodeAndValue([undefined, 123]);
    expect(out).toEqual([undefined, undefined]);
  });

  it('_swapProperties covers mapMode branches where value assignments are skipped', () => {
    const t = new AVLTreeCounter<number, string>([], { isMapMode: true });

    const n1 = t.createNode(1, 's', 1) as any;
    const n2 = t.createNode(2, 'd', 2) as any;

    // Ensure values are present so we can assert they were NOT reassigned.
    n1.value = 's';
    n2.value = 'd';
    n1.height = 10;
    n2.height = 20;

    const swapped = (t as any)._swapProperties(n1, n2);
    expect(swapped).toBe(n2);

    // keys/counts/heights swap...
    expect(n2.key).toBe(1);
    expect(n2.count).toBe(1);
    expect(n2.height).toBe(10);

    expect(n1.key).toBe(2);
    expect(n1.count).toBe(2);
    expect(n1.height).toBe(20);

    // ...but values should be untouched in map mode.
    expect(n1.value).toBe('s');
    expect(n2.value).toBe('d');
  });

  it('_swapProperties covers non-mapMode branches where value assignments occur', () => {
    const t = new AVLTreeCounter<number, string>([], { isMapMode: false });

    const n1 = t.createNode(1, 's', 1) as any;
    const n2 = t.createNode(2, 'd', 2) as any;
    n1.height = 10;
    n2.height = 20;

    const swapped = (t as any)._swapProperties(n1, n2);
    expect(swapped).toBe(n2);

    expect(n2.key).toBe(1);
    expect(n2.value).toBe('s');
    expect(n2.count).toBe(1);

    expect(n1.key).toBe(2);
    expect(n1.value).toBe('d');
    expect(n1.count).toBe(2);
  });
});
