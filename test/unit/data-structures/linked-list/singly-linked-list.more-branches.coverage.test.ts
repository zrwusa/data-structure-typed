import { SinglyLinkedList, SinglyLinkedListNode } from '../../../../src';

describe('SinglyLinkedList additional branch coverage', () => {
  it('unshiftMany uses toElementFn branch when provided', () => {
    const l = new SinglyLinkedList<number, { v: number }>([], {
      toElementFn: r => r.v
    });
    expect(l.unshiftMany([{ v: 1 }, { v: 2 }])).toEqual([true, true]);
    expect(l.toArray()).toEqual([2, 1]);
  });

  it('addBefore sets tail when prevNode is undefined and internal tail is missing (covers if(!this._tail))', () => {
    const l = new SinglyLinkedList<number>();
    l.push(1);

    // Corrupt internal tail so the recovery branch runs.
    (l as any)._tail = undefined;

    expect(l.addBefore(1, 0)).toBe(true);
    expect(l.toArray()).toEqual([0, 1]);
    // and tail should be restored (best-effort invariant)
    expect((l as any)._tail).toBeDefined();
  });

  it('splice uses default deleteCount=0 when omitted', () => {
    const l = new SinglyLinkedList<number>();
    l.pushMany([1, 2, 3]);

    const removed = l.splice(1); // deleteCount omitted
    expect(removed.toArray()).toEqual([]);
    expect(l.toArray()).toEqual([1, 2, 3]);
  });

  it('deleteWhere sets tail to undefined when removing the only element (covers current===_tail branch)', () => {
    const l = new SinglyLinkedList<number>();
    l.push(1);

    expect(l.deleteWhere(v => v === 1)).toBe(true);
    expect(l.length).toBe(0);
    expect((l as any)._tail).toBeUndefined();
  });

  it('mapSame covers both ternary arms (thisArg undefined vs defined)', () => {
    const l = new SinglyLinkedList<number>();
    l.pushMany([1, 2]);

    // thisArg === undefined branch
    expect(l.mapSame(v => v + 1).toArray()).toEqual([2, 3]);

    // thisArg provided branch
    const ctx = { add: 10 };
    expect(
      l
        .mapSame(function (this: any, v: number) {
          return v + this.add;
        }, ctx)
        .toArray()
    ).toEqual([11, 12]);
  });

  it('_ensureNode returns the same node when input is a node (covers isNode true branch)', () => {
    const l = new SinglyLinkedList<number>();
    l.pushMany([1, 3]);

    const existing = l.getNodeAt(0)!;
    const newNode = new SinglyLinkedListNode(2);

    // addAfter calls _ensureNode(newElementOrNode)
    expect(l.addAfter(existing, newNode)).toBe(true);
    expect(l.toArray()).toEqual([1, 2, 3]);
  });

  it('_ensurePredicate covers isNode(target) branch via search(node)', () => {
    const l = new SinglyLinkedList<number>();
    l.pushMany([1, 2, 3]);

    const target = l.getNodeAt(1)!;
    expect(l.search(target)).toBe(2);
  });

  it('_createLike default-arg path can be called with no args', () => {
    const l = new SinglyLinkedList<number>();
    const like = (l as any)._createLike();
    expect(like.length).toBe(0);
  });
});
