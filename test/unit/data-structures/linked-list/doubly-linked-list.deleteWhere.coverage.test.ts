import { DoublyLinkedList } from '../../../../src';

describe('DoublyLinkedList.deleteWhere coverage', () => {
  it('should delete first matching element', () => {
    const list = new DoublyLinkedList<number>([1, 2, 3, 4]);
    expect(list.deleteWhere(v => v === 3)).toBe(true);
    expect([...list]).toEqual([1, 2, 4]);
    expect(list.length).toBe(3);
  });

  it('should delete head element', () => {
    const list = new DoublyLinkedList<number>([10, 20, 30]);
    expect(list.deleteWhere(v => v === 10)).toBe(true);
    expect([...list]).toEqual([20, 30]);
  });

  it('should delete tail element', () => {
    const list = new DoublyLinkedList<number>([10, 20, 30]);
    expect(list.deleteWhere(v => v === 30)).toBe(true);
    expect([...list]).toEqual([10, 20]);
  });

  it('should return false when no match', () => {
    const list = new DoublyLinkedList<number>([1, 2, 3]);
    expect(list.deleteWhere(v => v === 999)).toBe(false);
    expect(list.length).toBe(3);
  });

  it('should handle empty list', () => {
    const list = new DoublyLinkedList<number>();
    expect(list.deleteWhere(() => true)).toBe(false);
  });

  it('should pass correct index to predicate', () => {
    const list = new DoublyLinkedList<number>([10, 20, 30]);
    const indices: number[] = [];
    list.deleteWhere((_v, i) => {
      indices.push(i);
      return false;
    });
    expect(indices).toEqual([0, 1, 2]);
  });
});
