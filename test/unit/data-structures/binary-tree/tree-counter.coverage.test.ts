import { TreeCounter, TreeCounterNode } from '../../../../src';

/**
 * Coverage-focused tests for TreeCounter branches (count aggregation + delete paths).
 * Keep existing @example tests intact.
 */
describe('TreeCounter coverage', () => {
  it('TreeCounterNode.familyPosition covers ROOT/LEFT/RIGHT/ISOLATED cases', () => {
    const isolated = new TreeCounterNode<number, number>(1);
    expect(isolated.familyPosition).toBe('ISOLATED');

    const root = new TreeCounterNode<number, number>(10);
    const left = new TreeCounterNode<number, number>(5);
    root.left = left;
    expect(root.familyPosition).toBe('ROOT');
    expect(left.familyPosition).toBe('LEFT');

    left.left = new TreeCounterNode<number, number>(2);
    expect(left.familyPosition).toBe('ROOT_LEFT');

    const right = new TreeCounterNode<number, number>(15);
    root.right = right;
    expect(right.familyPosition).toBe('RIGHT');

    right.right = new TreeCounterNode<number, number>(20);
    expect(right.familyPosition).toBe('ROOT_RIGHT');
  });

  it('set increments aggregate count and createNode respects mapMode', () => {
    const tc = new TreeCounter<number, string>();
    tc.set(1, 'a', 2);
    tc.set(2, 'b', 3);

    expect(tc.count).toBe(5);
    expect(tc.getComputedCount()).toBe(5);

    // mapMode stores values on nodes in the new node-index design
    const tcMap = new TreeCounter<number, string>([], { isMapMode: true });
    tcMap.set(1, 'a', 2);
    expect(tcMap.getNode(1)?.value).toBe('a');
  });

  it('delete decrements count when node.count>1 unless ignoreCount=true', () => {
    const tc = new TreeCounter<number, number>();
    tc.set(10, 10, 3);
    expect(tc.count).toBe(3);

    // decrement path
    const r1 = tc.delete(10);
    expect(r1).toHaveLength(1);
    expect(tc.getNode(10)?.count).toBe(2);
    expect(tc.count).toBe(2);

    // ignoreCount removes node
    const r2 = tc.delete(10, true);
    expect(r2).toHaveLength(1);
    expect(tc.getNode(10)).toBeUndefined();
    expect(tc.count).toBe(0);
  });

  it('delete covers left-only/right-only and two-child paths', () => {
    const tc = new TreeCounter<number, number>();

    // right-only child case
    tc.set(10, 10, 1);
    tc.set(20, 20, 1);
    expect(tc.delete(10, true)).toHaveLength(1);
    expect(tc.getNode(10)).toBeUndefined();

    tc.clear();

    // left-only child case
    tc.set(10, 10, 1);
    tc.set(5, 5, 1);
    expect(tc.delete(10, true)).toHaveLength(1);
    expect(tc.getNode(10)).toBeUndefined();

    tc.clear();

    // two children successor path
    for (const k of [10, 5, 15, 12, 18]) tc.set(k, k, 1);
    expect(tc.delete(10, true)).toHaveLength(1);
    expect(tc.getNode(10)).toBeUndefined();
    expect(tc.count).toBe(4);
  });

  it('perfectlyBalance returns false on empty and true on non-empty (preserves count)', () => {
    const tcEmpty = new TreeCounter<number, number>();
    expect(tcEmpty.perfectlyBalance()).toBe(false);

    const tc = new TreeCounter<number, number>();
    tc.set(3, 3, 2);
    tc.set(1, 1, 1);
    tc.set(4, 4, 1);
    expect(tc.count).toBe(4);

    expect(tc.perfectlyBalance('ITERATIVE')).toBe(true);
    expect(tc.count).toBe(4);
    expect(tc.getComputedCount()).toBe(4);
  });

  it('map/clone exercise _createLike/_createInstance and preserve aggregate count', () => {
    const tc = new TreeCounter<number, number>();
    tc.set(1, 10, 2);
    tc.set(2, 20, 1);

    const mapped = tc.map((v, k) => [k + 1, (v ?? 0) + 1]);
    expect(mapped.get(2)).toBe(11);
    expect(mapped.get(3)).toBe(21);

    const cloned = tc.clone();
    expect(cloned.count).toBe(tc.count);
    expect(cloned.getComputedCount()).toBe(tc.count);
  });
});
