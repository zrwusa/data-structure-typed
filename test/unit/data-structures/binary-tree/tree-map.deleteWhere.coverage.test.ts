import { TreeMap } from '../../../../src';

describe('TreeMap.deleteWhere coverage', () => {
  it('should delete entries matching predicate', () => {
    const map = new TreeMap<number, string>([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
      [4, 'd']
    ]);
    const result = map.deleteWhere(key => key % 2 === 0);
    expect(result).toBe(true);
    expect(map.has(2)).toBe(false);
    expect(map.has(4)).toBe(false);
    expect(map.has(1)).toBe(true);
    expect(map.has(3)).toBe(true);
    expect(map.size).toBe(2);
  });

  it('should return false when no entries match', () => {
    const map = new TreeMap<number, string>([
      [1, 'a'],
      [2, 'b']
    ]);
    const result = map.deleteWhere(() => false);
    expect(result).toBe(false);
    expect(map.size).toBe(2);
  });

  it('should handle empty map', () => {
    const map = new TreeMap<number, string>();
    expect(map.deleteWhere(() => true)).toBe(false);
  });

  it('should pass correct arguments to predicate', () => {
    const map = new TreeMap<number, string>([
      [10, 'x'],
      [20, 'y']
    ]);
    const calls: [number, string | undefined, number][] = [];
    map.deleteWhere((key, value, index) => {
      calls.push([key, value, index]);
      return false;
    });
    expect(calls).toEqual([
      [10, 'x', 0],
      [20, 'y', 1]
    ]);
  });
});
