import { FibonacciHeap, Heap } from '../../../../src';

describe('Heap new API coverage', () => {
  describe('pop (primary method)', () => {
    it('should remove and return top element', () => {
      const h = new Heap<number>([3, 1, 2], { comparator: (a, b) => a - b });
      expect(h.pop()).toBe(1);
      expect(h.pop()).toBe(2);
      expect(h.pop()).toBe(3);
      expect(h.pop()).toBeUndefined();
    });
  });

  describe('poll (deprecated, delegates to pop)', () => {
    it('should work the same as pop', () => {
      const h = new Heap<number>([5, 3, 7], { comparator: (a, b) => a - b });
      expect(h.poll()).toBe(3);
      expect(h.size).toBe(2);
    });
  });

  describe('deleteWhere', () => {
    it('should delete first matching element', () => {
      const h = new Heap<number>([5, 3, 7, 1, 9], { comparator: (a, b) => a - b });
      expect(h.deleteWhere(e => e === 7)).toBe(true);
      expect(h.size).toBe(4);
      // 7 should be gone — poll all to verify
      const all: number[] = [];
      while (h.size > 0) all.push(h.pop()!);
      expect(all).toEqual([1, 3, 5, 9]);
    });

    it('should delete top element via pop path', () => {
      const h = new Heap<number>([1, 5, 3], { comparator: (a, b) => a - b });
      expect(h.deleteWhere(e => e === 1)).toBe(true);
      expect(h.peek()).toBe(3);
    });

    it('should delete last element via pop path', () => {
      const h = new Heap<number>([1, 5, 3], { comparator: (a, b) => a - b });
      // The last element in the backing array
      const lastIdx = h.size - 1;
      const lastEl = h.toArray()[lastIdx];
      expect(h.deleteWhere(e => e === lastEl)).toBe(true);
    });

    it('should return false when no match', () => {
      const h = new Heap<number>([1, 2, 3], { comparator: (a, b) => a - b });
      expect(h.deleteWhere(e => e === 999)).toBe(false);
    });

    it('should handle empty heap', () => {
      const h = new Heap<number>([], { comparator: (a, b) => a - b });
      expect(h.deleteWhere(() => true)).toBe(false);
    });
  });

  describe('deleteBy (deprecated, delegates to deleteWhere)', () => {
    it('should work the same as deleteWhere', () => {
      const h = new Heap<number>([5, 3, 7], { comparator: (a, b) => a - b });
      expect(h.deleteBy(e => e === 5)).toBe(true);
      expect(h.size).toBe(2);
    });
  });
});

describe('FibonacciHeap poll/pop coverage', () => {
  it('poll should delegate to pop', () => {
    const fh = new FibonacciHeap<number>((a, b) => a - b);
    fh.push(5);
    fh.push(3);
    fh.push(7);
    expect(fh.poll()).toBe(3);
    expect(fh.pop()).toBe(5);
    expect(fh.size).toBe(1);
  });
});
