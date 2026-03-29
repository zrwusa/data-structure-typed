import {
  RedBlackTree,
  TreeMap,
  TreeSet,
  Heap,
  Matrix,
  BinaryIndexedTree
} from '../../../src';

describe('Centralized Error Handling (raise)', () => {
  describe('data integrity errors always throw', () => {
    it('TreeMap: invalid entry throws TypeError', () => {
      expect(() => new TreeMap([42 as any])).toThrow(TypeError);
    });

    it('TreeMap: unsupported key type throws TypeError', () => {
      expect(() => {
        const map = new TreeMap<object, number>();
        map.set({} as any, 1);
      }).toThrow(/[Cc]omparator/);
    });

    it('TreeSet: unsupported key type throws TypeError', () => {
      expect(() => {
        const set = new TreeSet<object>();
        set.add({} as any);
      }).toThrow(/[Cc]omparator/);
    });

    it('Heap.map: missing comparator throws TypeError', () => {
      const heap = new Heap<number>([1, 2, 3]);
      expect(() => heap.map((v) => ({ val: v }))).toThrow(/[Cc]omparator/);
    });

    it('BinaryIndexedTree: negative size throws RangeError', () => {
      expect(() => new BinaryIndexedTree(-1)).toThrow(RangeError);
    });

    it('Matrix: dimension mismatch throws Error', () => {
      const a = new Matrix([[1, 2], [3, 4]]);
      const b = new Matrix([[1, 2, 3]]);
      expect(() => a.add(b)).toThrow(/dimension/i);
    });
  });

  describe('feature errors throw with clear message', () => {
    it('order-statistic: disabled throws with enableOrderStatistic hint', () => {
      const tree = new RedBlackTree<number>([1, 2, 3]);
      expect(() => tree.getByRank(0)).toThrow(/enableOrderStatistic/);
      expect(() => tree.getRank(1)).toThrow(/enableOrderStatistic/);
      expect(() => tree.rangeByRank(0, 2)).toThrow(/enableOrderStatistic/);
    });
  });

  describe('errors use correct Error subclass', () => {
    it('type errors use TypeError', () => {
      expect(() => new TreeMap([42 as any])).toThrow(TypeError);
    });

    it('range errors use RangeError', () => {
      expect(() => new BinaryIndexedTree(-1)).toThrow(RangeError);
    });

    it('operation errors use Error', () => {
      const a = new Matrix([[1, 2], [3, 4]]);
      const b = new Matrix([[1, 2, 3]]);
      expect(() => a.add(b)).toThrow(Error);
    });
  });
});
