import { Queue, Deque } from '../../../../src';

describe('Queue new methods coverage', () => {
  describe('peek', () => {
    it('should return first element without removing', () => {
      const q = new Queue<number>([10, 20, 30]);
      expect(q.peek()).toBe(10);
      expect(q.length).toBe(3);
    });

    it('should return undefined for empty queue', () => {
      const q = new Queue<number>();
      expect(q.peek()).toBeUndefined();
    });
  });

  describe('deleteWhere', () => {
    it('should delete first matching element', () => {
      const q = new Queue<number>([1, 2, 3, 4, 5]);
      expect(q.deleteWhere(v => v === 3)).toBe(true);
      expect([...q]).toEqual([1, 2, 4, 5]);
    });

    it('should return false when no match', () => {
      const q = new Queue<number>([1, 2, 3]);
      expect(q.deleteWhere(v => v > 100)).toBe(false);
      expect(q.length).toBe(3);
    });

    it('should handle empty queue', () => {
      const q = new Queue<number>();
      expect(q.deleteWhere(() => true)).toBe(false);
    });

    it('should pass correct index', () => {
      const q = new Queue<number>([10, 20, 30]);
      const indices: number[] = [];
      q.deleteWhere((_v, i) => {
        indices.push(i);
        return false;
      });
      expect(indices).toEqual([0, 1, 2]);
    });
  });
});

describe('Deque peek coverage', () => {
  it('should return first element without removing', () => {
    const d = new Deque<number>([10, 20, 30]);
    expect(d.peek()).toBe(10);
    expect(d.length).toBe(3);
  });

  it('should return undefined for empty deque', () => {
    const d = new Deque<number>();
    expect(d.peek()).toBeUndefined();
  });
});
