import { BST, Range } from '../../../../src';

/**
 * Coverage-focused tests for overload dispatch + iterationType string handling.
 *
 * IMPORTANT: Do NOT touch the existing @example tests (used for docs generation).
 */
describe('BST coverage: overloads & bound helpers', () => {
  let bst: BST<number, string>;

  beforeEach(() => {
    bst = new BST<number, string>([10, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 11, 13, 18, 25]);
  });

  it('ceiling supports iterationType passed as 2nd arg string', () => {
    expect(bst.ceiling(9, 'ITERATIVE')).toBe(10);
    expect(bst.ceiling(10, 'RECURSIVE')).toBe(10);
  });

  it('ceiling supports callback + explicit iterationType', () => {
    const got = bst.ceiling(14, node => node.key, 'ITERATIVE');
    expect(got).toBe(15);
  });

  it('higher supports iterationType passed as 2nd arg string', () => {
    expect(bst.higher(10, 'ITERATIVE')).toBe(11);
    expect(bst.higher(25, 'RECURSIVE')).toBeUndefined();
  });

  it('higher supports callback + explicit iterationType', () => {
    const got = bst.higher(14, node => node.key, 'RECURSIVE');
    expect(got).toBe(15);
  });

  it('floor supports iterationType passed as 2nd arg string', () => {
    expect(bst.floor(9, 'ITERATIVE')).toBe(8);
    expect(bst.floor(1, 'RECURSIVE')).toBe(1);
  });

  it('floor supports callback + explicit iterationType', () => {
    const got = bst.floor(14, node => node.key, 'ITERATIVE');
    expect(got).toBe(13);
  });

  it('lower supports iterationType passed as 2nd arg string', () => {
    expect(bst.lower(10, 'ITERATIVE')).toBe(8);
    expect(bst.lower(1, 'RECURSIVE')).toBeUndefined();
  });

  it('lower supports callback + explicit iterationType', () => {
    const got = bst.lower(11, node => node.key, 'RECURSIVE');
    expect(got).toBe(10);
  });

  it('bound helpers accept a NodePredicate input (smoke)', () => {
    // These overloads allow a predicate; this primarily exercises the dispatch logic.
    const pred = (node: any) => node.key === 12;
    expect(bst.ceiling(pred, node => node.key)).toBe(12);

    // Predicate overload semantics are implementation-defined; we mainly want to exercise the dispatch.
    const higher = bst.higher(pred, node => node.key);
    expect(higher).toBeDefined();
    expect(higher as number).toBeGreaterThanOrEqual(12);

    expect(bst.floor(pred, node => node.key)).toBe(12);

    const lower = bst.lower(pred, node => node.key);
    expect(lower === 11 || lower === 12).toBe(true);
  });

  it('getNode covers predicate branch + runtime Range branch + entry edge cases', () => {
    // predicate branch (delegates to getNodes)
    const pred = (node: any) => node.key === 12;
    expect(bst.getNode(pred)?.key).toBe(12);

    // runtime Range branch (Range is not in overload but allowed at runtime)
    const range = new Range(6, 12);
    const inRange = bst.getNode(range as any);
    expect(inRange?.key).toBe(6);

    // entry branch: null/undefined key should return undefined
    expect(bst.getNode([null as any, 'x'] as any)).toBeUndefined();
    expect(bst.getNode([undefined as any, 'x'] as any)).toBeUndefined();
  });

  it('search covers entry-with-null-key early return and Range search callback path', () => {
    // entry with null key => should yield [] (targetKey stays undefined)
    expect(bst.search([null as any, 'x'] as any)).toEqual([]);

    // Range search should exercise isRange predicate path + callback
    const out = bst.search(new Range(6, 12), false, node => node.key, undefined, 'ITERATIVE');
    expect(out).toEqual([6, 7, 8, 10, 11, 12]);
  });
});
