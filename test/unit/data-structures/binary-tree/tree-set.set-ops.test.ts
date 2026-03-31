import { TreeSet } from '../../../../src';

describe('TreeSet ES2025 Set operations', () => {
  const a = new TreeSet([1, 2, 3, 4, 5]);
  const b = new TreeSet([3, 4, 5, 6, 7]);

  describe('union', () => {
    it('@example [TreeSet.union] Merge two sets', () => {
      expect([...a.union(b)]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it('works with plain array', () => {
      expect([...a.union([10, 11])]).toEqual([1, 2, 3, 4, 5, 10, 11]);
    });
    it('works with native Set', () => {
      expect([...a.union(new Set([4, 5, 6]))]).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('does not mutate original', () => {
      const result = a.union(b);
      expect(a.size).toBe(5);
      expect(result.size).toBe(7);
    });
    it('empty union', () => {
      expect([...new TreeSet<number>().union([1, 2])]).toEqual([1, 2]);
    });
  });

  describe('intersection', () => {
    it('@example [TreeSet.intersection] Find common elements', () => {
      expect([...a.intersection(b)]).toEqual([3, 4, 5]);
    });
    it('returns empty when disjoint', () => {
      expect([...a.intersection(new TreeSet([8, 9]))]).toEqual([]);
    });
    it('works with native Set', () => {
      expect([...a.intersection(new Set([2, 4, 6]))]).toEqual([2, 4]);
    });
  });

  describe('difference', () => {
    it('@example [TreeSet.difference] Find exclusive elements', () => {
      expect([...a.difference(b)]).toEqual([1, 2]);
    });
    it('returns all when disjoint', () => {
      expect([...a.difference(new TreeSet([8, 9]))]).toEqual([1, 2, 3, 4, 5]);
    });
    it('returns empty when subset', () => {
      expect([...a.difference(new TreeSet([1, 2, 3, 4, 5, 6]))]).toEqual([]);
    });
  });

  describe('symmetricDifference', () => {
    it('@example [TreeSet.symmetricDifference] Find symmetric difference', () => {
      expect([...a.symmetricDifference(b)]).toEqual([1, 2, 6, 7]);
    });
    it('equals union when disjoint', () => {
      const c = new TreeSet([8, 9]);
      expect([...a.symmetricDifference(c)]).toEqual([1, 2, 3, 4, 5, 8, 9]);
    });
    it('returns empty when identical', () => {
      expect([...a.symmetricDifference(a)]).toEqual([]);
    });
  });

  describe('isSubsetOf', () => {
    it('@example [TreeSet.isSubsetOf] Check subset', () => {
      expect(new TreeSet([3, 4]).isSubsetOf(a)).toBe(true);
    });
    it('returns true for equal sets', () => {
      expect(a.isSubsetOf(new TreeSet([1, 2, 3, 4, 5]))).toBe(true);
    });
    it('returns false when not subset', () => {
      expect(a.isSubsetOf(b)).toBe(false);
    });
    it('empty is subset of everything', () => {
      expect(new TreeSet<number>().isSubsetOf(a)).toBe(true);
    });
  });

  describe('isSupersetOf', () => {
    it('@example [TreeSet.isSupersetOf] Check superset', () => {
      expect(a.isSupersetOf(new TreeSet([2, 3]))).toBe(true);
    });
    it('returns false when not superset', () => {
      expect(a.isSupersetOf(b)).toBe(false);
    });
    it('everything is superset of empty', () => {
      expect(a.isSupersetOf(new TreeSet<number>())).toBe(true);
    });
  });

  describe('isDisjointFrom', () => {
    it('@example [TreeSet.isDisjointFrom] Check disjoint', () => {
      expect(a.isDisjointFrom(new TreeSet([8, 9]))).toBe(true);
    });
    it('returns false when overlap exists', () => {
      expect(a.isDisjointFrom(b)).toBe(false);
    });
    it('empty is disjoint from everything', () => {
      expect(new TreeSet<number>().isDisjointFrom(a)).toBe(true);
    });
  });
});
