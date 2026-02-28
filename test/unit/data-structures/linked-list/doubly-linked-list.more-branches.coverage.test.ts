import { DoublyLinkedList, DoublyLinkedListNode } from '../../../../src';

describe('DoublyLinkedList additional branch coverage', () => {
  it('unshiftMany uses toElementFn branch when provided', () => {
    const l = new DoublyLinkedList<number, { v: number }>([], {
      toElementFn: r => r.v
    });
    expect(l.unshiftMany([{ v: 1 }, { v: 2 }])).toEqual([true, true]);
    expect(l.toArray()).toEqual([2, 1]);
  });

  it('getNode(undefined) returns undefined (covers early return)', () => {
    const l = new DoublyLinkedList<number>();
    l.pushMany([1, 2]);
    expect(l.getNode(undefined)).toBeUndefined();
  });

  it('setAt returns false when node does not exist', () => {
    const l = new DoublyLinkedList<number>();
    expect(l.setAt(0, 1)).toBe(false);
  });

  it('search returns value when predicate matches (covers predicate(current) true branch)', () => {
    const l = new DoublyLinkedList<number>();
    l.pushMany([1, 2, 3]);
    expect(l.search(n => n.value === 2)).toBe(2);
  });

  it('mapSame covers both thisArg branches', () => {
    const l = new DoublyLinkedList<number>();
    l.pushMany([1, 2]);

    // thisArg === undefined arm
    expect(l.mapSame(v => v + 1).toArray()).toEqual([2, 3]);

    // thisArg provided arm
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
    const l = new DoublyLinkedList<number>();
    l.pushMany([1, 3]);

    const existing = l.getNodeAt(0)!;
    const newNode = new DoublyLinkedListNode(2);

    // addAfter calls _ensureNode(newElementOrNode)
    expect(l.addAfter(existing, newNode)).toBe(true);
    expect(l.toArray()).toEqual([1, 2, 3]);
  });

  it('_ensurePredicate covers isNode(target) branch via search(node)', () => {
    const l = new DoublyLinkedList<number>();
    l.pushMany([1, 2, 3]);

    const target = l.getNodeAt(1)!;
    expect(l.search(target)).toBe(2);
  });

  it('_createLike default-arg path can be called with no args', () => {
    const l = new DoublyLinkedList<number>();
    const like = (l as any)._createLike();
    expect(like.length).toBe(0);
  });
});
