import {
  setErrorHandling,
  getErrorHandling,
  RedBlackTree,
  TreeMap,
  TreeSet,
  Heap,
  HashMap,
  Trie,
  Matrix,
  BinaryIndexedTree
} from '../../../src';

describe('Global Error Handling', () => {
  afterEach(() => {
    setErrorHandling('throw'); // restore default
  });

  describe('setErrorHandling / getErrorHandling', () => {
    it('default mode is throw', () => {
      expect(getErrorHandling()).toBe('throw');
    });

    it('can switch to warn', () => {
      setErrorHandling('warn');
      expect(getErrorHandling()).toBe('warn');
    });

    it('can switch to error', () => {
      setErrorHandling('error');
      expect(getErrorHandling()).toBe('error');
    });

    it('can switch to silent', () => {
      setErrorHandling('silent');
      expect(getErrorHandling()).toBe('silent');
    });
  });

  describe('throw mode (default)', () => {
    it('TreeMap: invalid entry throws', () => {
      expect(() => new TreeMap([42 as any])).toThrow();
    });

    it('TreeMap: unsupported key type throws', () => {
      expect(() => {
        const map = new TreeMap<object, number>();
        map.set({} as any, 1);
      }).toThrow(/[Cc]omparator/);
    });

    it('TreeSet: unsupported key type throws', () => {
      expect(() => {
        const set = new TreeSet<object>();
        set.add({} as any);
      }).toThrow(/[Cc]omparator/);
    });

    it('Heap.map: missing comparator throws', () => {
      const heap = new Heap<number>([1, 2, 3]);
      expect(() => heap.map((v) => ({ val: v }))).toThrow(/[Cc]omparator/);
    });

    it('BinaryIndexedTree: negative size throws', () => {
      expect(() => new BinaryIndexedTree(-1)).toThrow();
    });

    it('Matrix: dimension mismatch throws', () => {
      const a = new Matrix([[1, 2], [3, 4]]);
      const b = new Matrix([[1, 2, 3]]);
      expect(() => a.add(b)).toThrow();
    });

    it('order-statistic: disabled throws', () => {
      const tree = new RedBlackTree<number>([1, 2, 3]);
      expect(() => tree.select(0)).toThrow(/enableOrderStatistic/);
    });
  });

  describe('warn mode', () => {
    beforeEach(() => setErrorHandling('warn'));

    it('TreeMap: invalid entry warns but continues', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      const map = new TreeMap([42 as any]);
      expect(spy).toHaveBeenCalled();
      expect(map.size).toBe(0);
      spy.mockRestore();
    });

    it('order-statistic: disabled warns, returns fallback', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      const tree = new RedBlackTree<number>([1, 2, 3]);
      expect(tree.select(0)).toBeUndefined();
      expect(tree.rank(1)).toBe(-1);
      expect(tree.rangeByRank(0, 2)).toEqual([]);
      expect(spy).toHaveBeenCalledTimes(3);
      spy.mockRestore();
    });

    it('Matrix: dimension mismatch warns', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      const a = new Matrix([[1, 2], [3, 4]]);
      const b = new Matrix([[1, 2, 3]]);
      a.add(b); // should not throw
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('silent mode', () => {
    beforeEach(() => setErrorHandling('silent'));

    it('TreeMap: invalid entry silently skipped', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      const map = new TreeMap([42 as any]);
      expect(spy).not.toHaveBeenCalled();
      expect(map.size).toBe(0);
      spy.mockRestore();
    });

    it('order-statistic: disabled silently returns fallback', () => {
      const tree = new RedBlackTree<number>([1, 2, 3]);
      expect(tree.select(0)).toBeUndefined();
      expect(tree.rank(1)).toBe(-1);
      expect(tree.rangeByRank(0, 2)).toEqual([]);
    });

    it('BinaryIndexedTree: negative size silent', () => {
      const tree = new BinaryIndexedTree(-1);
      // should not throw, constructor may produce empty/invalid state
      expect(tree).toBeDefined();
    });
  });

  describe('error mode', () => {
    beforeEach(() => setErrorHandling('error'));

    it('uses console.error instead of throw', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      const tree = new RedBlackTree<number>([1, 2, 3]);
      expect(tree.select(0)).toBeUndefined();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
