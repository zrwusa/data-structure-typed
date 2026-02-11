import { RedBlackTree } from '../../../../src';

class RBTBadFixup extends RedBlackTree<number, number> {
  // Simulate an unexpected internal failure so `_setKVNode` hits the defensive `else return undefined`.
  protected override _insertFixup(_node: any): void {
    // Blow away root after "fixup".
    (this as any)._setRoot(undefined);
  }
}

describe('RedBlackTree _setKVNode uncovered-branch coverage', () => {
  it('covers normal-path current=header.parent ?? NIL when header.parent is undefined (starts at NIL)', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // Force normal path (minN becomes NIL via ??) and start walk from NIL.
    (t as any)._header._left = undefined;
    (t as any)._header.parent = undefined;

    expect(t.set(1, 1)).toBe(true);
    expect(t.getNode(1)?.key).toBe(1);
  });

  it('covers normal-path `current.left ?? NIL` / `current.right ?? NIL` in the search loop', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);

    // Skip boundary fast paths so we go through the normal search loop.
    (t as any)._header._left = undefined;

    // Force missing children so `?? NIL` branches are taken.
    const root = (t as any)._header.parent;
    root._left = undefined;
    root._right = undefined;

    expect(t.set(5, 5)).toBe(true);
    expect(t.set(15, 15)).toBe(true);

    expect(t.has(5)).toBe(true);
    expect(t.has(15)).toBe(true);
  });

  it('covers boundary max-path reading `header._right ?? NIL` when header._right is undefined (safe comparator)', () => {
    // Comparator that tolerates undefined keys from NIL.
    const comparator = (a: number, b: any) => {
      if (b === undefined || b === null) return -1; // ensures cMax < 0 so we do not attach/update under NIL
      return a - b;
    };

    const t = new RedBlackTree<number, number>([], { isMapMode: false, comparator });
    t.set(10, 10);
    t.set(5, 5); // establish min

    // Corrupt max cache only; boundary block should read `header._right ?? NIL`.
    (t as any)._header._right = undefined;

    // Key > min so we enter the max boundary block, but safe comparator prevents NIL-attach.
    expect(t.set(8, 8)).toBe(true);
    expect(t.has(8)).toBe(true);

    // Repair max cache so we don't leak corruption.
    const root = (t as any)._root;
    (t as any)._setMaxCache(t.isRealNode(root) ? t.getRightMost((n: any) => n, root) : undefined);
  });

  it('covers defensive `return undefined` after fixup when root is not real (set returns false)', () => {
    const t = new RBTBadFixup([], { isMapMode: false });

    // Force normal path (avoid boundary attach) so we reach the fixup block.
    (t as any)._header._left = undefined;

    expect(t.set(1, 1)).toBe(false);
    expect(t.size).toBe(0);
  });
});
