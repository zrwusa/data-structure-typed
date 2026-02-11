import { AVLTreeCounter, AVLTreeCounterNode } from '../../../../src';

describe('AVLTreeCounter additional branch coverage', () => {
  it('AVLTreeCounterNode constructor uses default count=1', () => {
    const n = new AVLTreeCounterNode(1, 'v');
    expect(n.count).toBe(1);
  });

  it('AVLTreeCounterNode familyPosition covers ISOLATED/ROOT/LEFT/ROOT_LEFT/RIGHT/ROOT_RIGHT/MAL_NODE', () => {
    const a = new AVLTreeCounterNode(1);
    expect(a.familyPosition).toBe('ISOLATED');

    // root-like: no parent, but has child
    const root = new AVLTreeCounterNode(10);
    root.left = new AVLTreeCounterNode(5);
    expect(root.familyPosition).toBe('ROOT');

    const p = new AVLTreeCounterNode(0);
    const left = new AVLTreeCounterNode(-1);
    const right = new AVLTreeCounterNode(1);
    p.left = left;
    p.right = right;

    expect(left.familyPosition).toBe('LEFT');
    expect(right.familyPosition).toBe('RIGHT');

    // root-left/right variants: node has its own child
    left.left = new AVLTreeCounterNode(-2);
    right.right = new AVLTreeCounterNode(2);
    expect(left.familyPosition).toBe('ROOT_LEFT');
    expect(right.familyPosition).toBe('ROOT_RIGHT');

    // MAL_NODE: has parent but parent does not reference it
    const mal = new AVLTreeCounterNode(99);
    mal.parent = p;
    expect(mal.familyPosition).toBe('MAL_NODE');
  });

  it('set() returns false when keyNodeOrEntry is null/undefined (covers newNode===undefined early return)', () => {
    const t = new AVLTreeCounter<number, number>([], { isMapMode: false });
    expect(t.set(undefined as any)).toBe(false);
    expect(t.set(null as any)).toBe(false);
  });

  it('set() with count=0 exercises orgNodeCount==0 branch without changing aggregate count', () => {
    const t = new AVLTreeCounter<number, number>([], { isMapMode: false });
    expect(t.count).toBe(0);

    t.set(1, 1, 0);
    expect(t.count).toBe(0);

    // normal insert should increase count
    t.set(2, 2);
    expect(t.count).toBe(1);
  });

  it('delete() returns [] when tree is empty or key missing', () => {
    const t = new AVLTreeCounter<number, number>([], { isMapMode: false });
    expect(t.delete(1)).toEqual([]);

    t.set(1, 1);
    expect(t.delete(999)).toEqual([]);
  });

  it('delete() decrements count when node.count>1 and ignoreCount=false', () => {
    const t = new AVLTreeCounter<number, number>([], { isMapMode: false });
    t.set(1, 1);
    t.set(1, 1); // duplicate increments count in _replaceNode

    const n = t.getNode(1)!;
    expect(n.count).toBe(2);
    expect(t.count).toBe(2);

    const res = t.delete(1, false);
    expect(res.length).toBe(1);
    expect(t.getNode(1)!.count).toBe(1);
    expect(t.count).toBe(1);
  });

  it('delete() removes root when it has no left child and no parent (covers parent-null root replacement)', () => {
    const t = new AVLTreeCounter<number, number>([], { isMapMode: false });
    t.set(1, 1);
    t.set(2, 2);

    // force root to have no left (common in AVL after balancing for two nodes)
    const root = t.root!;
    root.left = undefined;

    const res = t.delete(root.key, true);
    expect(res.length).toBe(1);
    expect(t.root).toBeDefined();
  });
});
