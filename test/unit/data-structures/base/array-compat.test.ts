import { Queue, Deque, DoublyLinkedList, SinglyLinkedList, Stack, Heap } from '../../../../src';

describe('Array-compatible API: includes, entries, keys', () => {
  describe('includes (alias for has)', () => {
    it('Queue', () => {
      const q = new Queue([1, 2, 3]);
      expect(q.includes(2)).toBe(true);
      expect(q.includes(99)).toBe(false);
    });

    it('Deque', () => {
      const d = new Deque(['a', 'b', 'c']);
      expect(d.includes('b')).toBe(true);
      expect(d.includes('z')).toBe(false);
    });

    it('DoublyLinkedList', () => {
      const ll = new DoublyLinkedList([10, 20, 30]);
      expect(ll.includes(20)).toBe(true);
      expect(ll.includes(0)).toBe(false);
    });

    it('SinglyLinkedList', () => {
      const ll = new SinglyLinkedList([10, 20, 30]);
      expect(ll.includes(30)).toBe(true);
      expect(ll.includes(0)).toBe(false);
    });

    it('Stack', () => {
      const s = new Stack([1, 2, 3]);
      expect(s.includes(1)).toBe(true);
      expect(s.includes(5)).toBe(false);
    });

    it('Heap', () => {
      const h = new Heap([3, 1, 2], { comparator: (a: number, b: number) => a - b });
      expect(h.includes(1)).toBe(true);
      expect(h.includes(99)).toBe(false);
    });

    it('empty container', () => {
      expect(new Queue().includes(1)).toBe(false);
      expect(new Stack().includes(1)).toBe(false);
    });
  });

  describe('entries', () => {
    it('Queue returns [index, value] pairs', () => {
      const q = new Queue(['a', 'b', 'c']);
      expect([...q.entries()]).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
    });

    it('Stack returns [index, value] pairs', () => {
      const s = new Stack([10, 20]);
      expect([...s.entries()]).toEqual([[0, 10], [1, 20]]);
    });

    it('empty container', () => {
      expect([...new Deque().entries()]).toEqual([]);
    });
  });

  describe('keys', () => {
    it('Queue returns indices', () => {
      const q = new Queue([1, 2, 3]);
      expect([...q.keys()]).toEqual([0, 1, 2]);
    });

    it('Heap returns indices', () => {
      const h = new Heap([3, 1, 2], { comparator: (a: number, b: number) => a - b });
      expect([...h.keys()]).toEqual([0, 1, 2]);
    });

    it('empty container', () => {
      expect([...new Stack().keys()]).toEqual([]);
    });
  });
});

describe('Deque findLast / findLastIndex', () => {
  it('findLast returns last matching value', () => {
    const d = new Deque([1, 2, 3, 4, 5]);
    expect(d.findLast(v => v > 2)).toBe(5);
    expect(d.findLast(v => v % 2 === 0)).toBe(4);
  });

  it('findLast returns undefined when no match', () => {
    const d = new Deque([1, 2, 3]);
    expect(d.findLast(v => v > 100)).toBeUndefined();
  });

  it('findLast on empty deque', () => {
    expect(new Deque().findLast(() => true)).toBeUndefined();
  });

  it('findLast passes correct index', () => {
    const d = new Deque([10, 20, 30]);
    const indices: number[] = [];
    d.findLast((_v, i) => { indices.push(i); return false; });
    expect(indices).toEqual([2, 1, 0]);
  });

  it('findLastIndex returns last matching index', () => {
    const d = new Deque([10, 20, 30, 20, 10]);
    expect(d.findLastIndex(v => v === 20)).toBe(3);
    expect(d.findLastIndex(v => v === 10)).toBe(4);
  });

  it('findLastIndex returns -1 when no match', () => {
    const d = new Deque([1, 2, 3]);
    expect(d.findLastIndex(v => v > 100)).toBe(-1);
  });

  it('findLastIndex on empty deque', () => {
    expect(new Deque().findLastIndex(() => true)).toBe(-1);
  });
});

describe('DoublyLinkedList findLastIndex', () => {
  it('returns last matching index', () => {
    const ll = new DoublyLinkedList([10, 20, 30, 20, 10]);
    expect(ll.findLastIndex(v => v === 20)).toBe(3);
  });

  it('returns -1 when no match', () => {
    const ll = new DoublyLinkedList([1, 2, 3]);
    expect(ll.findLastIndex(v => v > 100)).toBe(-1);
  });

  it('returns -1 on empty list', () => {
    expect(new DoublyLinkedList().findLastIndex(() => true)).toBe(-1);
  });

  it('passes correct index (tail to head)', () => {
    const ll = new DoublyLinkedList([10, 20, 30]);
    const indices: number[] = [];
    ll.findLastIndex((_v, i) => { indices.push(i); return false; });
    expect(indices).toEqual([2, 1, 0]);
  });
});

describe('toReversed', () => {
  it('Deque returns new reversed instance', () => {
    const d = new Deque([1, 2, 3]);
    const rev = d.toReversed();
    expect([...rev]).toEqual([3, 2, 1]);
    expect([...d]).toEqual([1, 2, 3]); // original unchanged
    expect(rev).toBeInstanceOf(Deque);
  });

  it('Queue returns new reversed instance', () => {
    const q = new Queue([1, 2, 3]);
    const rev = q.toReversed();
    expect([...rev]).toEqual([3, 2, 1]);
    expect([...q]).toEqual([1, 2, 3]);
    expect(rev).toBeInstanceOf(Queue);
  });

  it('DoublyLinkedList returns new reversed instance', () => {
    const ll = new DoublyLinkedList([1, 2, 3]);
    const rev = ll.toReversed();
    expect([...rev]).toEqual([3, 2, 1]);
    expect([...ll]).toEqual([1, 2, 3]);
    expect(rev).toBeInstanceOf(DoublyLinkedList);
  });

  it('SinglyLinkedList returns new reversed instance', () => {
    const ll = new SinglyLinkedList([1, 2, 3]);
    const rev = ll.toReversed();
    expect([...rev]).toEqual([3, 2, 1]);
    expect([...ll]).toEqual([1, 2, 3]);
    expect(rev).toBeInstanceOf(SinglyLinkedList);
  });

  it('empty container', () => {
    const d = new Deque();
    const rev = d.toReversed();
    expect([...rev]).toEqual([]);
  });
});
