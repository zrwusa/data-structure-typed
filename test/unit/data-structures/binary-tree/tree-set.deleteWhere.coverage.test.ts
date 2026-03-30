import { TreeSet } from '../../../../src';

describe('TreeSet.deleteWhere coverage', () => {
  it('should delete keys matching predicate', () => {
    const set = new TreeSet<number>([1, 2, 3, 4, 5]);
    const result = set.deleteWhere((key) => key > 3);
    expect(result).toBe(true);
    expect(set.has(4)).toBe(false);
    expect(set.has(5)).toBe(false);
    expect(set.has(3)).toBe(true);
    expect(set.size).toBe(3);
  });

  it('should return false when no keys match', () => {
    const set = new TreeSet<number>([1, 2, 3]);
    expect(set.deleteWhere(() => false)).toBe(false);
    expect(set.size).toBe(3);
  });

  it('should handle empty set', () => {
    const set = new TreeSet<number>();
    expect(set.deleteWhere(() => true)).toBe(false);
  });

  it('should pass correct arguments to predicate', () => {
    const set = new TreeSet<number>([10, 20]);
    const calls: [number, number][] = [];
    set.deleteWhere((key, index) => {
      calls.push([key, index]);
      return false;
    });
    expect(calls).toEqual([
      [10, 0],
      [20, 1]
    ]);
  });
});
