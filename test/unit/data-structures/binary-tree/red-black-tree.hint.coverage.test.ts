import { RedBlackTree } from '../../../../src';

describe('RedBlackTree hint/update coverage', () => {
  it('mapMode update fast-path keeps size and node reference stable', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: true });
    t.set(1, 'a');
    const n1 = t.getNode(1);
    expect(n1).toBeTruthy();

    t.set(1, 'b');
    const n2 = t.getNode(1);

    expect(t.size).toBe(1);
    expect(t.get(1)).toBe('b');
    expect(n2).toBe(n1);
  });

  it('setWithHintNode covers: no hint -> fallback, c0==0 update, and left/right attach branches', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    // no hint -> fallback
    const n20 = t.setWithHintNode(20, 20, undefined);
    expect(n20?.key).toBe(20);

    // c0 == 0 update
    const hint10 = t.getNode(10)!;
    const updated10 = t.setWithHintNode(10, 999, hint10);
    expect(updated10).toBe(hint10);
    expect(t.get(10)).toBe(999);

    // left attach (hint.left is empty)
    const hint5 = t.getNode(5)!;
    const n2 = t.setWithHintNode(2, 2, hint5);
    expect(n2?.parent?.key).toBe(5);
    expect(n2?.key).toBe(2);

    // predecessor-right attach (hint.left exists)
    // key=7 is <10, pred(10)=5 and pred.right is empty -> attach there.
    const n7 = t.setWithHintNode(7, 7, hint10);
    expect(n7?.key).toBe(7);
    expect(n7?.parent?.key).toBe(5);

    // successor-left attach (hint.right exists)
    // key=13 is >10, succ(10)=15 and succ.left is empty -> attach there.
    const n13 = t.setWithHintNode(13, 13, hint10);
    expect(n13?.key).toBe(13);
    expect(n13?.parent?.key).toBe(15);

    // succ.key <= key fallback branch
    const n30 = t.setWithHintNode(30, 30, hint10);
    expect(n30?.key).toBe(30);
    expect(t.getNode(30)).toBeTruthy();

    // pred.key >= key fallback branch
    const n4 = t.setWithHintNode(4, 4, hint10);
    expect(n4?.key).toBe(4);
    expect(t.getNode(4)).toBeTruthy();
  });
});
