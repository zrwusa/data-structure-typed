import { Heap, FibonacciHeap } from '../../../../src';

describe('Heap / FibonacciHeap misc branch coverage', () => {
  it('Heap.deleteBy covers not-found, idx=0 poll, idx=last pop, idx=middle splice paths', () => {
    const h = new Heap<number>();
    h.add(3);
    h.add(1);
    h.add(2);

    expect(h.deleteBy(() => false)).toBe(false); // idx stays -1

    // idx === 0
    expect(h.deleteBy(x => x === h.peek())).toBe(true);

    // ensure at least 2 elems again
    h.add(4);
    h.add(5);

    // idx === last
    const last = (h as any).elements[(h as any).elements.length - 1];
    expect(h.deleteBy(x => x === last)).toBe(true);

    // idx in middle
    const mid = (h as any).elements[1];
    expect(h.deleteBy(x => x === mid)).toBe(true);
  });

  it('Heap.filter covers thisArg branch and else(i++) branch', () => {
    const h = new Heap<number>();
    h.add(1);
    h.add(2);
    h.add(3);

    const ctx = { ok: true };
    const out = h.filter(function (this: any, x: number) {
      // keep only one element so the else branch runs too
      return this.ok && x === 2;
    }, ctx);

    expect(out.toArray()).toEqual([2]);
  });

  it('Heap.map throws when comparator missing, and uses thisArg branch when provided', () => {
    const h = new Heap<number>();
    h.add(1);
    h.add(2);

    expect(() => h.map(x => ({ x }), {} as any)).toThrow(/requires options\.comparator/i);

    const ctx = { mul: 10 };
    const mapped = h.map(
      function (this: any, x: number) {
        return x * this.mul;
      },
      { comparator: (a: number, b: number) => a - b },
      ctx
    );

    expect(mapped.peek()).toBe(10);
  });

  it('Heap.mapSame covers thisArg branch', () => {
    const h = new Heap<number>();
    h.add(1);
    h.add(3);

    const ctx = { add: 7 };
    const out = h.mapSame(function (this: any, x: number) {
      return x + this.add;
    }, ctx);

    expect(out.peek()).toBe(8);
  });

  it('Heap._createLike default-arg path can be called via (heap as any)._createLike()', () => {
    const h = new Heap<number>();
    const like = (h as any)._createLike();
    expect(like.size).toBe(0);
  });

  it('FibonacciHeap constructor throws when comparator is not a function', () => {
    expect(() => new FibonacciHeap<number>(123 as any)).toThrow(/comparator must be a function/i);
  });

  it('FibonacciHeap.consumeLinkedList(undefined) returns [] (covers !head guard)', () => {
    const fh = new FibonacciHeap<number>();
    expect(fh.consumeLinkedList(undefined)).toEqual([]);
  });

  it('FibonacciHeap.merge covers empty-merge early return, empty-this adopt-root, and non-empty root-merge', () => {
    const a = new FibonacciHeap<number>();
    const b = new FibonacciHeap<number>();

    // empty merge early return
    a.merge(b);
    expect(a.size).toBe(0);

    // empty-this adopt-root
    b.add(5);
    a.merge(b);
    expect(a.size).toBe(1);

    // non-empty root-merge + min update paths
    const c = new FibonacciHeap<number>();
    c.add(1);
    c.add(10);
    a.merge(c);
    expect(a.peek()).toBe(1);
  });
});
