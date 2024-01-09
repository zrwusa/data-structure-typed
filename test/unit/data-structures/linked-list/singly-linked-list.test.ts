import { SinglyLinkedList, SinglyLinkedListNode } from '../../../../src';

describe('SinglyLinkedListNode', () => {
  it('should SinglyLinkedList', () => {
    const node1 = new SinglyLinkedListNode<number>(2);
    expect(node1.value).toBe(2);
    node1.value = 1;
    expect(node1.value).toBe(1);
  });
});

describe('SinglyLinkedList Operation Test', () => {
  let list: SinglyLinkedList<number>;
  let objectList: SinglyLinkedList<{ keyA: number }>;
  beforeEach(() => {
    list = new SinglyLinkedList<number>();
    objectList = new SinglyLinkedList<{ keyA: number }>();
  });

  describe('push', () => {
    it('should add elements to the end of the list', () => {
      list.push(1);
      list.push(2);
      expect(list.toArray()).toEqual([1, 2]);
    });
  });

  describe('pop', () => {
    it('should delete and return the last element of the list', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const popped = list.pop();
      expect(popped).toBe(3);
      expect(list.pop()).toBe(2);
      expect(list.toArray()).toEqual([1]);
    });

    it('should return undefined if the list is empty', () => {
      const popped = list.pop();
      expect(popped).toBeUndefined();
    });
  });

  describe('shift', () => {
    it('should delete and return the first element of the list', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const shifted = list.shift();
      expect(shifted).toBe(1);
      expect(list.shift()).toBe(2);
      expect(list.toArray()).toEqual([3]);
    });

    it('should return undefined if the list is empty', () => {
      const shifted = list.shift();
      expect(shifted).toBeUndefined();
    });
  });

  describe('unshift', () => {
    it('should add elements to the beginning of the list', () => {
      list.unshift(1);
      list.unshift(2);
      expect(list.toArray()).toEqual([2, 1]);
    });
  });

  describe('get', () => {
    it('should return the element at the specified index', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const element = list.at(1);
      expect(element).toBe(2);
      expect(list.getNodeAt(2)?.value).toBe(3);
    });

    it('should return undefined for an out-of-bounds index', () => {
      list.push(1);
      const element = list.at(1);
      expect(element).toBeUndefined();
    });
  });

  describe('addAfter', () => {
    it('should insert an element after an existing value', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      list.addAfter(2, 4);
      expect(list.toArray()).toEqual([1, 2, 4, 3]);
    });

    it('should return false if the existing value is not found', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const result = list.addAfter(5, 4);
      expect(result).toBe(false);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of a value in the list', () => {
      list.push(1);
      list.push(2);
      list.push(2);
      list.push(3);
      const count = list.countOccurrences(2);
      expect(count).toBe(2);
    });

    it('should return 0 if the value is not found', () => {
      list.push(1);
      list.push(2);
      const count = list.countOccurrences(3);
      expect(count).toBe(0);
    });
  });

  describe('removeValue', () => {
    it('should delete the first occurrence of a value from the list', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      list.push(4);
      list.push(5);
      expect(list.delete(2)).toBe(true);
      expect(list.toArray()).toEqual([1, 3, 4, 5]);
      expect(list.delete(1)).toBe(true);
      expect(list.toArray()).toEqual([3, 4, 5]);
      expect(list.delete(5)).toBe(true);
      expect(list.toArray()).toEqual([3, 4]);
    });

    it('should return false if the value is not found', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const removed = list.delete(4);
      expect(removed).toBe(false);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for an empty list', () => {
      expect(list.isEmpty()).toBe(true);
    });

    it('should return false for a non-empty list', () => {
      list.push(1);
      expect(list.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all elements from the list', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      list.clear();
      expect(list.toArray()).toEqual([]);
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('reverse', () => {
    it('should reverse the order of elements in the list', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
    });

    it('should handle an empty list', () => {
      list.reverse();
      expect(list.toArray()).toEqual([]);
    });

    it('should handle a list with a single element', () => {
      list.push(1);
      list.reverse();
      expect(list.toArray()).toEqual([1]);
    });
  });

  describe('indexOf', () => {
    it('should return the index of the first occurrence of a value', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const index = list.indexOf(2);
      expect(index).toBe(1);
    });

    it('should return -1 if the value is not found', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const index = list.indexOf(4);
      expect(index).toBe(-1);
    });
  });

  describe('toArray', () => {
    it('should convert the list to an array', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const array = list.toArray();
      expect(array).toEqual([1, 2, 3]);
    });

    it('should return an empty array for an empty list', () => {
      const array = list.toArray();
      expect(array).toEqual([]);
    });
  });

  describe('addBefore', () => {
    it('should insert an element before an existing value', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      list.addBefore(2, 4);
      expect(list.toArray()).toEqual([1, 4, 2, 3]);
    });

    it('should insert an element at the beginning', () => {
      list.push(1);
      list.push(2);
      list.addBefore(1, 3);
      expect(list.toArray()).toEqual([3, 1, 2]);
    });

    it('should return false if the existing value is not found', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const result = list.addBefore(5, 4);
      expect(result).toBe(false);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('getLength', () => {
    it('should return the correct length of the list', () => {
      expect(list.size).toBe(0);
      list.push(1);
      list.push(2);
      expect(list.size).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete and return the element at the specified index', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const removed = list.deleteAt(1);
      expect(removed).toBe(true);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it('should return undefined for an out-of-bounds index', () => {
      list.push(1);
      const removed = list.deleteAt(1);
      expect(removed).toBe(false);
    });

    it('should delete and return the first element', () => {
      list.push(1);
      list.push(2);
      const removed = list.deleteAt(0);
      expect(removed).toBe(true);
      expect(list.toArray()).toEqual([2]);
    });

    it('should delete and return the last element', () => {
      list.push(1);
      list.push(2);
      const removed = list.deleteAt(1);
      expect(removed).toBe(true);
      expect(list.toArray()).toEqual([1]);
    });
  });

  describe('push and pop', () => {
    it('should push and pop elements correctly', () => {
      list.push(1);
      list.push(2);
      expect(list.pop()).toBe(2);
      expect(list.pop()).toBe(1);
      expect(list.pop()).toBeUndefined();
    });
  });

  describe('shift and unshift', () => {
    it('should shift and unshift elements correctly', () => {
      list.unshift(1);
      list.unshift(2);
      expect(list.shift()).toBe(2);
      expect(list.shift()).toBe(1);
      expect(list.shift()).toBeUndefined();
    });
  });

  describe('insert and toArray', () => {
    it('should insert elements and return array correctly', () => {
      list.addAt(0, 1);
      list.addAt(1, 3);
      list.addAt(1, 2);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('find', () => {
    it('should find elements using a callback function', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const result = list.find(data => data % 2 === 0);
      expect(result).toBe(2);
      expect(list.find(value => value === 3)).toBe(3);
    });

    it('should return undefined if element is not found', () => {
      list.push(1);
      list.push(3);
      const result = list.find(data => data % 2 === 0);
      expect(result).toBe(undefined);
    });
  });

  describe('reverse', () => {
    it('should reverse the order of elements', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
    });
  });

  it('should clone', function () {
    const sList = new SinglyLinkedList<string>();
    sList.push('1');
    sList.push('6');
    sList.push('2');
    sList.push('0');
    sList.push('5');
    sList.push('9');
    sList.delete('2');
    expect([...sList]).toEqual(['1', '6', '0', '5', '9']);
    const cloned = sList.clone();
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    sList.delete('5');
    expect([...sList]).toEqual(['1', '6', '0', '9']);
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
  });

  describe('countOccurrences', () => {
    it('should count occurrences of a value', () => {
      list.push(1);
      list.push(2);
      list.push(2);
      list.push(3);
      const count = list.countOccurrences(2);
      expect(count).toBe(2);
    });

    it('should return 0 if value is not found', () => {
      list.push(1);
      list.push(2);
      const count = list.countOccurrences(3);
      expect(count).toBe(0);
    });
  });

  it('should insert and manipulate objects with numeric properties', () => {
    const obj1 = { keyA: 1 };
    const obj2 = { keyA: 2 };
    const obj3 = { keyA: 3 };

    objectList.push(obj1);
    objectList.push(obj2);
    objectList.push(obj3);

    expect(objectList.toArray()).toEqual([obj1, obj2, obj3]);

    const newObj = { keyA: 2.5 }; // Corrected newObj value
    const insertSuccess = objectList.addBefore(obj2, newObj);
    expect(insertSuccess).toBe(true);

    const getNode = objectList.getNode(newObj); // Use newObj instead of obj2
    expect(getNode?.value).toEqual(newObj);

    const deleted = objectList.delete(newObj); // Use newObj instead of obj2
    expect(deleted).toBe(true);

    const poppedObj = objectList.pop();
    expect(poppedObj).toBe(obj3);

    const shiftedObj = objectList.shift();
    expect(shiftedObj).toBe(obj1);
  });
});

describe('SinglyLinkedList', () => {
  let list: SinglyLinkedList<number>;

  beforeEach(() => {
    list = new SinglyLinkedList<number>();
  });

  it('should initialize an empty list', () => {
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
    expect(list.size).toBe(0);
  });

  it('should push elements to the end of the list', () => {
    list.push(1);
    list.push(2);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(2);
    expect(list.size).toBe(2);
  });

  it('should pop elements from the end of the list', () => {
    list.push(1);
    list.push(2);
    const popped = list.pop();
    expect(popped).toBe(2);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(1);
    expect(list.size).toBe(1);
  });

  it('should reverse the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.reverse();
    expect(list.head!.value).toBe(3);
    expect(list.tail!.value).toBe(1);
    // Add more assertions for reversed order.
  });

  it('should convert the list to an array', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    const array = list.toArray();
    expect(array).toEqual([1, 2, 3]);
    expect([...list]).toEqual([1, 2, 3]);
  });

  it('should filter the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    expect(list.filter(value => value !== 2).toArray()).toEqual([1, 3]);
  });

  it('should forEach the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.forEach(value => value++);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should map the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    expect(list.map(value => value * 2).toArray()).toEqual([2, 4, 6]);
  });

  it('should reduce the list', () => {
    const list1 = SinglyLinkedList.fromArray([1, 2, 3]);
    expect(list1.reduce((acc, value) => acc + value, 0)).toEqual(6);
  });
});

describe('iterable methods', () => {
  it('should forEach, some, every, filter, map, reduce of the deque', () => {
    const sl = new SinglyLinkedList<number>([1, 2, 3]);

    const mockCallback = jest.fn();
    sl.forEach(element => {
      mockCallback(element);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1]);
    expect(mockCallback.mock.calls[1]).toEqual([2]);
    expect(mockCallback.mock.calls[2]).toEqual([3]);

    expect(sl.every(element => element > 0)).toBe(true);
    expect(sl.every(element => element > 1)).toBe(false);
    expect(sl.some(element => element > 2)).toBe(true);

    expect([...sl.filter(element => element > 2)]).toEqual([3]);
    expect([...sl.map(element => element * 2)]).toEqual([2, 4, 6]);
    expect(sl.reduce((accumulator, element) => accumulator + element, 0)).toEqual(6);
  });
});
