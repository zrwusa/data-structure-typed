import { DoublyLinkedList, SinglyLinkedList } from '../../../../src';

describe('LinkedList unshiftMany else-branch coverage', () => {
  it('DoublyLinkedList.unshiftMany uses else-branch when toElementFn is not provided', () => {
    const l = new DoublyLinkedList<number>();
    expect(l.unshiftMany([1, 2])).toEqual([true, true]);
    expect(l.toArray()).toEqual([2, 1]);
  });

  it('SinglyLinkedList.unshiftMany uses else-branch when toElementFn is not provided', () => {
    const l = new SinglyLinkedList<number>();
    expect(l.unshiftMany([1, 2])).toEqual([true, true]);
    expect(l.toArray()).toEqual([2, 1]);
  });
});
