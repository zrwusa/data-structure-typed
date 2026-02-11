import { SinglyLinkedList, SinglyLinkedListNode } from '../../../../src';

describe('SinglyLinkedList coverage', () => {
  it('push respects maxLen by shifting when over capacity', () => {
    const list = new SinglyLinkedList<number>([], { maxLen: 2 });
    list.push(1);
    list.push(2);
    list.push(3); // should shift 1
    expect([...list]).toEqual([2, 3]);
    expect(list.length).toBe(2);
    expect(list.first).toBe(2);
    expect(list.last).toBe(3);
  });

  it('pop covers empty, single-node, and multi-node cases', () => {
    const empty = new SinglyLinkedList<number>();
    expect(empty.pop()).toBeUndefined();

    const single = new SinglyLinkedList<number>([1]);
    expect(single.pop()).toBe(1);
    expect(single.length).toBe(0);
    expect(single.head).toBeUndefined();
    expect(single.tail).toBeUndefined();

    const multi = new SinglyLinkedList<number>([1, 2, 3]);
    expect(multi.pop()).toBe(3);
    expect([...multi]).toEqual([1, 2]);
    expect(multi.tail?.value).toBe(2);
  });

  it('shift/unshift handle empty and update tail when last removed', () => {
    const list = new SinglyLinkedList<number>();
    expect(list.shift()).toBeUndefined();

    list.unshift(1);
    expect(list.shift()).toBe(1);
    expect(list.head).toBeUndefined();
    expect(list.tail).toBeUndefined();
    expect(list.length).toBe(0);
  });

  it('pushMany/unshiftMany exercise toElementFn conversion branch', () => {
    const list = new SinglyLinkedList<number, { v: number }>([], { toElementFn: r => r.v });

    expect(list.pushMany([{ v: 1 }, { v: 2 }])).toEqual([true, true]);
    expect([...list]).toEqual([1, 2]);

    expect(list.unshiftMany([{ v: 3 }, { v: 4 }])).toEqual([true, true]);
    expect([...list]).toEqual([4, 3, 1, 2]);
  });

  it('at/getNodeAt/setAt cover bounds and success cases', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3]);

    expect(list.at(-1)).toBeUndefined();
    expect(list.at(999)).toBeUndefined();
    expect(list.at(1)).toBe(2);

    expect(list.getNodeAt(-1)).toBeUndefined();
    expect(list.getNodeAt(999)).toBeUndefined();

    expect(list.setAt(999, 0)).toBe(false);
    expect(list.setAt(1, 20)).toBe(true);
    expect([...list]).toEqual([1, 20, 3]);
  });

  it('deleteAt covers head delete, tail delete, and middle delete', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3]);

    expect(list.deleteAt(-1)).toBeUndefined();
    expect(list.deleteAt(999)).toBeUndefined();

    // head
    expect(list.deleteAt(0)).toBe(1);
    expect([...list]).toEqual([2, 3]);

    // tail
    expect(list.deleteAt(1)).toBe(3);
    expect([...list]).toEqual([2]);
    expect(list.tail?.value).toBe(2);

    // middle (rebuild)
    list.pushMany([3, 4]); // [2,3,4]
    expect(list.deleteAt(1)).toBe(3);
    expect([...list]).toEqual([2, 4]);
  });

  it('delete covers undefined input, missing node, and deleting head/tail', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3]);

    expect(list.delete(undefined)).toBe(false);
    expect(list.delete(999)).toBe(false);

    // delete head
    expect(list.delete(1)).toBe(true);
    expect([...list]).toEqual([2, 3]);

    // delete tail
    expect(list.delete(3)).toBe(true);
    expect([...list]).toEqual([2]);
    expect(list.tail?.value).toBe(2);
  });

  it('reverse early-return and full reverse path', () => {
    const empty = new SinglyLinkedList<number>();
    expect(empty.reverse()).toBe(empty);

    const single = new SinglyLinkedList<number>([1]);
    expect([...single.reverse()]).toEqual([1]);

    const list = new SinglyLinkedList<number>([1, 2, 3]);
    list.reverse();
    expect([...list]).toEqual([3, 2, 1]);
    expect(list.first).toBe(3);
    expect(list.last).toBe(1);
  });

  it('getNode/search handle undefined, node pass-through, and predicate branches', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3]);
    expect(list.getNode(undefined)).toBeUndefined();

    const n2 = list.getNodeAt(1)!;
    expect(list.getNode(n2)).toBe(n2);

    expect(list.getNode(node => node.value === 3)?.value).toBe(3);
    expect(list.search(node => node.value === 2)).toBe(2);
  });

  it('addAt/addBefore/addAfter cover boundary and missing-node cases', () => {
    const list = new SinglyLinkedList<number>([2, 4]);

    expect(list.addAt(-1, 0)).toBe(false);
    expect(list.addAt(999, 0)).toBe(false);

    // addAt head/tail/middle
    expect(list.addAt(0, 1)).toBe(true);
    expect(list.addAt(list.length, 5)).toBe(true);
    expect(list.addAt(2, 3)).toBe(true);
    expect([...list]).toEqual([1, 2, 3, 4, 5]);

    // addBefore/After missing
    expect(list.addBefore(999, 0)).toBe(false);
    expect(list.addAfter(999, 0)).toBe(false);

    // addBefore head
    expect(list.addBefore(1, 0)).toBe(true);
    // addAfter tail
    expect(list.addAfter(5, 6)).toBe(true);
    expect([...list]).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('splice covers remove-only, insert-only, remove+insert, and empty-result reset', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3, 4]);

    // remove middle
    const removed = list.splice(1, 2);
    expect([...removed]).toEqual([2, 3]);
    expect([...list]).toEqual([1, 4]);

    // insert at head without deletion
    const removed2 = list.splice(0, 0, 9, 8);
    expect([...removed2]).toEqual([]);
    expect([...list]).toEqual([9, 8, 1, 4]);

    // remove tail and insert
    const removed3 = list.splice(3, 10, 7);
    expect([...removed3]).toEqual([4]);
    expect([...list]).toEqual([9, 8, 1, 7]);

    // remove everything, expect head/tail reset
    const removedAll = list.splice(0, 999);
    expect([...removedAll]).toEqual([9, 8, 1, 7]);
    expect(list.length).toBe(0);
    expect(list.head).toBeUndefined();
    expect(list.tail).toBeUndefined();
  });

  it('countOccurrences covers element/node/predicate branches and setEquality', () => {
    type Obj = { id: number };
    const a: Obj = { id: 1 };
    const b: Obj = { id: 1 };
    const c: Obj = { id: 2 };

    const list = new SinglyLinkedList<Obj>([a, c]);

    // default Object.is: b is not the same ref as a
    expect(list.countOccurrences(b)).toBe(0);

    list.setEquality((x, y) => x.id === y.id);
    expect(list.countOccurrences(b)).toBe(1);

    const nodeA = list.getNodeAt(0)!;
    expect(list.countOccurrences(nodeA)).toBe(1);

    expect(list.countOccurrences(node => node.value.id === 2)).toBe(1);
  });

  it('deleteWhere covers deleting head and tail branches + no-match', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3]);

    // delete head branch
    expect(list.deleteWhere(v => v === 1)).toBe(true);
    expect([...list]).toEqual([2, 3]);

    // delete tail branch
    expect(list.deleteWhere(v => v === 3)).toBe(true);
    expect([...list]).toEqual([2]);
    expect(list.tail?.value).toBe(2);

    // no match
    expect(list.deleteWhere(v => v === 999)).toBe(false);
  });

  it('_getPrevNode not-found branch via foreign node', () => {
    const list = new SinglyLinkedList<number>([1, 2, 3]);
    const foreign = new SinglyLinkedListNode(2);

    // Access protected for branch coverage.
    expect((list as any)._getPrevNode(foreign)).toBeUndefined();
  });
});
