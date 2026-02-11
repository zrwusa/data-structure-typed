import { RedBlackTree, RedBlackTreeNode } from '../../../../src';

describe('RedBlackTree remaining reachable branches (coverage)', () => {
  it('mapMode updates existing MAX key with defined value via boundary cMax===0 path (covers store.set branch)', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: true });
    t.set(1, 'a');
    t.set(2, 'b');

    // key==max => boundary cMax===0 update
    t.set(2, 'bb');
    expect(t.get(2)).toBe('bb');
  });

  it('mapMode updates existing interior key with defined value via normal search update branch', () => {
    const t = new RedBlackTree<number, string>([], { isMapMode: true });
    t.set(10, 'x');
    t.set(5, 'a');
    t.set(15, 'z');

    // Update a non-min/non-max key to avoid boundary min/max equality early returns.
    t.set(10, 'xx');
    expect(t.get(10)).toBe('xx');
  });

  it('normal-path search uses right ?? NIL fallback when a node child pointer is undefined', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });
    t.set(10, 10);
    t.set(5, 5);

    const n5 = t.getNode(5)!;

    // Corrupt: right pointer becomes undefined (instead of NIL).
    // This should exercise `current = current.right ?? NIL` fallback.
    (n5 as any).right = undefined;

    t.set(7, 7);
    expect(t.get(7)).toBe(7);
  });

  it('setWithHintNode cache maintenance evaluates compare operands when header min/max caches are real', () => {
    const t = new RedBlackTree<number, number>(); // mapMode default
    t.set(10, 10);
    t.set(20, 20);

    const hint = t.getNode(20)!;

    // Insert larger than hint with direct attach (hint.right is NIL)
    // This hits `hMin === NIL || compare < 0` with hMin!==NIL, forcing the compare operand.
    const n = t.setWithHintNode(30, 30, hint)!;
    expect(n.key).toBe(30);
    expect((t as any)._header._right.key).toBe(30);
  });

  it('_leftRotate and _rightRotate early-return when pivot or required child is missing', () => {
    const t = new RedBlackTree<number, number>([], { isMapMode: false });

    // undefined pivot
    (t as any)._leftRotate(undefined);
    (t as any)._rightRotate(undefined);

    // pivot exists but missing required child
    const x = new RedBlackTreeNode<number, number>(1);
    (x as any).right = undefined;
    const y = new RedBlackTreeNode<number, number>(2);
    (y as any).left = undefined;

    (t as any)._leftRotate(x);
    (t as any)._rightRotate(y);
  });
});
