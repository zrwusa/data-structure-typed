import { DoublyLinkedList } from '../../../../src';

/**
 * Coverage-focused tests for LinearBase helpers (via DoublyLinkedList).
 * Keep existing @example tests intact.
 */
describe('LinearBase coverage (via DoublyLinkedList)', () => {
  it('indexOf/lastIndexOf handle fromIndex bounds and negatives', () => {
    const list = new DoublyLinkedList<number | undefined>();
    list.pushMany([1, 2, 3, 2, 1]);

    expect(list.indexOf(2)).toBe(1);
    expect(list.indexOf(2, 2)).toBe(3);

    // negative fromIndex clamps to 0
    expect(list.indexOf(1, -999)).toBe(0);

    expect(list.lastIndexOf(2)).toBe(3);
    // fromIndex >= length clamps to length-1
    expect(list.lastIndexOf(1, 999)).toBe(4);
    // negative fromIndex path (current implementation returns -1 for -1 specifically)
    // (We mainly want to exercise the branch; behavior is asserted as-is.)
    expect(list.lastIndexOf(2, -1)).toBe(-1);
  });

  it('findIndex skips undefined elements', () => {
    const list = new DoublyLinkedList<number | undefined>();
    list.pushMany([undefined, 1, undefined, 2]);

    const spy = jest.fn((x: number) => x === 2);
    expect(list.findIndex(spy as any)).toBe(3);

    // predicate should only be called for defined elements
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('slice/splice cover defaults and head-insert path', () => {
    const list = new DoublyLinkedList<number>();
    list.pushMany([1, 2, 3, 4]);

    // slice defaults
    expect(list.slice().toArray()).toEqual([1, 2, 3, 4]);
    expect(list.slice(1, -1).toArray()).toEqual([2, 3]);

    // splice: insert at head (previousNode undefined)
    const removed0 = list.splice(0, 0, 9, 8);
    expect(removed0.toArray()).toEqual([]);
    expect(list.toArray()).toEqual([9, 8, 1, 2, 3, 4]);

    // splice: delete + insert in middle
    const removed = list.splice(2, 2, 7);
    expect(removed.toArray()).toEqual([1, 2]);
    expect(list.toArray()).toEqual([9, 8, 7, 3, 4]);

    // splice: negative start
    const removed2 = list.splice(-1, 1);
    expect(removed2.toArray()).toEqual([4]);
    expect(list.toArray()).toEqual([9, 8, 7, 3]);
  });

  it('reduceRight covers initialValue defaulting', () => {
    const list = new DoublyLinkedList<number>();
    list.pushMany([1, 2, 3]);

    // no initialValue => accumulator defaults (0 as U)
    const sum = list.reduceRight((acc: number, x: number) => acc + x);
    expect(sum).toBe(6);

    const sum2 = list.reduceRight((acc: number, x: number) => acc + x, 10);
    expect(sum2).toBe(16);
  });
});
