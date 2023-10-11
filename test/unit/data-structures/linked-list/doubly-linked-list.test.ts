import {DoublyLinkedList} from '../../../../src';
import {bigO, magnitude} from '../../../utils';

describe('DoublyLinkedList Operation Test', () => {
  let list: DoublyLinkedList<number>;
  let objectList: DoublyLinkedList<{keyA: number}>;

  beforeEach(() => {
    list = new DoublyLinkedList();
    objectList = new DoublyLinkedList();
  });

  it('should initialize an empty list', () => {
    expect(list.length).toBe(0);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });

  it('should push elements to the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    expect(list.length).toBe(3);
    expect(list.head!.val).toBe(1);
    expect(list.tail!.val).toBe(3);
  });

  it('should pop elements from the end of the list', () => {
    list.push(1);
    list.push(2);
    const poppedValue = list.pop();
    expect(poppedValue).toBe(2);
    expect(list.length).toBe(1);
    expect(list.head!.val).toBe(1);
    expect(list.tail!.val).toBe(1);
  });
  it('should insert elements at specific positions', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    // Inserting at the beginning
    list.insertAt(0, 0);
    expect(list.length).toBe(4);
    expect(list.getAt(0)).toBe(0);
    expect(list.getAt(1)).toBe(1);

    // Inserting in the middle
    list.insertAt(2, 1.5);
    expect(list.length).toBe(5);
    expect(list.getAt(2)).toBe(1.5);
    expect(list.getAt(3)).toBe(2);

    // Inserting at the end
    list.insertAt(5, 4);
    expect(list.length).toBe(6);
    expect(list.getAt(5)).toBe(4);
    expect(list.tail!.val).toBe(4);
  });

  it('should delete elements at specific positions', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    // Deleting from the beginning
    const deletedValue = list.deleteAt(0);
    expect(deletedValue).toBe(1);
    expect(list.length).toBe(2);
    expect(list.head!.val).toBe(2);

    // Deleting from the middle
    list.deleteAt(0); // Deleting the second element
    expect(list.length).toBe(1);
    expect(list.head!.val).toBe(3);

    // Deleting from the end
    list.deleteAt(0);
    expect(list.length).toBe(0);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });

  it('should delete elements by value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.delete(2);
    expect(list.length).toBe(2);
    expect(list.head!.val).toBe(1);
    expect(list.tail!.val).toBe(3);

    list.delete(1);
    expect(list.length).toBe(1);
    expect(list.head!.val).toBe(3);

    list.delete(3);
    expect(list.length).toBe(0);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });

  it('should reverse the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.reverse();

    expect(list.toArray()).toEqual([3, 2, 1]);
    expect(list.toArrayReverse()).toEqual([1, 2, 3]);
  });

  it('should map elements using a callback function', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const mappedList = list.map(val => val * 2);

    expect(mappedList.toArray()).toEqual([2, 4, 6]);
  });

  it('should filter elements using a callback function', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const filteredList = list.filter(val => val % 2 === 0);

    expect(filteredList.toArray()).toEqual([2, 4]);
  });

  it('should reduce elements using a callback function and an initial value', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const sum = list.reduce((acc, val) => acc + val, 0);

    expect(sum).toBe(10);
  });

  it('should insert an element after a specific value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.insertAfter(2, 2.5);

    expect(list.toArray()).toEqual([1, 2, 2.5, 3]);
  });

  it('should insert an element before a specific value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.insertBefore(2, 1.5);

    expect(list.toArray()).toEqual([1, 1.5, 2, 3]);
  });
  it('should find the first element that satisfies a condition', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const found = list.find(val => val % 2 === 0);

    expect(found).toBe(2);
  });

  it('should find the index of an element', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const index = list.indexOf(2);

    expect(index).toBe(1);
  });

  it('should find the last element that satisfies a condition', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const lastEven = list.findLast(val => val % 2 === 0);

    expect(lastEven).toBe(4);
  });

  it('should clear the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.clear();

    expect(list.length).toBe(0);
    expect(list.head).toBe(null);
    expect(list.tail).toBe(null);
  });

  it('should create a reversed array of values', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const reversedArray = list.toArrayReverse();

    expect(reversedArray).toEqual([3, 2, 1]);
  });

  it('should reverse the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.reverse();

    expect(list.toArray()).toEqual([3, 2, 1]);
    expect(list.head?.val).toBe(3);
    expect(list.tail?.val).toBe(1);
  });

  it('should iterate over each element and apply a callback', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const result: number[] = [];
    list.forEach(val => {
      result.push(val * 2);
    });

    expect(result).toEqual([2, 4, 6]);
  });

  it('should create a new linked list by applying a mapping function', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const mappedList = list.map(val => val * 2);

    expect(mappedList.toArray()).toEqual([2, 4, 6]);
  });

  it('should create a new linked list by filtering elements', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const filteredList = list.filter(val => val % 2 === 0);

    expect(filteredList.toArray()).toEqual([2, 4]);
  });

  it('should reduce the linked list to a single value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const sum = list.reduce((acc, val) => acc + val, 0);

    expect(sum).toBe(6);
  });

  it('should insert a new value after an existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.insertAfter(2, 4);
    expect(success).toBe(true);
    expect(list.toArray()).toEqual([1, 2, 4, 3]);
  });

  it('should insert a new value before an existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.insertBefore(2, 0);
    expect(success).toBe(true);
    expect(list.toArray()).toEqual([1, 0, 2, 3]);
  });

  it('should not insert a new value after a non-existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.insertAfter(4, 5);
    expect(success).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should not insert a new value before a non-existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.insertBefore(4, 0);
    expect(success).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should insert and manipulate objects with numeric properties', () => {
    const obj1 = {keyA: 10};
    const obj2 = {keyA: 20};
    const obj3 = {keyA: 30};

    objectList.push(obj1);
    objectList.push(obj2);
    objectList.push(obj3);

    expect(objectList.toArray()).toEqual([obj1, obj2, obj3]);

    const newObj = {keyA: 25}; // Corrected newObj value
    const insertSuccess = objectList.insertBefore(obj2, newObj);
    expect(insertSuccess).toBe(true);

    const findNode = objectList.findNode(newObj); // Use newObj instead of obj2
    expect(findNode?.val).toEqual(newObj);

    const deleted = objectList.delete(newObj); // Use newObj instead of obj2
    expect(deleted).toBe(true);

    const poppedObj = objectList.pop();
    expect(poppedObj).toBe(obj3);

    const shiftedObj = objectList.shift();
    expect(shiftedObj).toBe(obj1);
  });
});

describe('DoublyLinkedList Performance Test', () => {
  it('should the push and pop methods adhere to a time complexity of O(n) and executed correctly under large scale data', () => {
    const list = new DoublyLinkedList<number>();

    const startPushTime = performance.now();
    for (let i = 0; i < magnitude.LINEAR; i++) {
      list.unshift(i);
    }
    expect(performance.now() - startPushTime).toBeLessThan(bigO.LINEAR * 20);

    expect(list.length).toBeGreaterThan(0);
    const startPopTime = performance.now();
    for (let i = 0; i < magnitude.LINEAR; i++) {
      list.shift();
    }
    expect(performance.now() - startPopTime).toBeLessThan(bigO.LINEAR * 100);

    expect(list.pop()).toBeUndefined();
    expect(list.length).toBe(0);
  });
});
