import { DoublyLinkedList, DoublyLinkedListNode } from '../../../../src';

describe('DoublyLinkedListNode', () => {
  it('should DoublyLinkedListNode', () => {
    const node1 = new DoublyLinkedListNode<number>(2);
    expect(node1.value).toBe(2);
    node1.value = 1;
    expect(node1.value).toBe(1);
  });
});

describe('DoublyLinkedList Operation Test', () => {
  let list: DoublyLinkedList<number>;

  beforeEach(() => {
    list = DoublyLinkedList.fromArray([1, 2, 3, 4, 5]);
  });

  it('should out of bound index', () => {
    expect(list.getNodeAt(-1)).toBe(undefined);
    expect(list.getNodeAt(5)).toBe(undefined);
    expect(list.insertAt(5, 6)).toBe(true);
  });

  it('should insertBefore', () => {
    expect(list.insertBefore(1, 0)).toBe(true);
  });

  it('should deleteAt', () => {
    expect(list.deleteAt(1)).toBeTruthy();
  });

  it('should delete tail', () => {
    expect(list.delete(list.tail)).toBe(true);
    expect(list.tail?.value).toBe(4);
    expect(list.delete(6)).toBe(false);
    expect(list.tail?.value).toBe(4);
  });

  it('should find undefined', () => {
    expect(list.find(value => value === 6)).toBe(undefined);
  });

  it('should indexOf -1', () => {
    expect(list.indexOf(6)).toBe(-1);
  });

  it('should findBackward undefined', () => {
    expect(list.findBackward(value => value === 0)).toBe(undefined);
  });

  it('should insertAfter tail', () => {
    expect(list.insertAfter(list.tail!, 6)).toBe(true);
  });

  it('should insertAfter tail', () => {
    expect([...list]).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('DoublyLinkedList Operation Test', () => {
  let list: DoublyLinkedList<number>;
  let objectList: DoublyLinkedList<{ keyA: number }>;

  beforeEach(() => {
    list = new DoublyLinkedList();
    objectList = new DoublyLinkedList();
  });

  it('should initialize an empty list', () => {
    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should push elements to the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    expect(list.length).toBe(3);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(3);
  });

  it('should pop elements from the end of the list', () => {
    list.push(1);
    list.push(2);
    const poppedValue = list.pop();
    expect(poppedValue).toBe(2);
    expect(list.length).toBe(1);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(1);
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
    expect(list.tail!.value).toBe(4);
  });

  it('should delete elements at specific positions', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    // Deleting from the beginning
    const deletedValue = list.deleteAt(0);
    expect(deletedValue).toBe(1);
    expect(list.length).toBe(2);
    expect(list.head!.value).toBe(2);

    // Deleting from the middle
    list.deleteAt(0); // Deleting the second element
    expect(list.length).toBe(1);
    expect(list.head!.value).toBe(3);

    // Deleting from the end
    list.deleteAt(0);
    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should delete elements by value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.delete(2);
    expect(list.length).toBe(2);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(3);

    list.delete(1);
    expect(list.length).toBe(1);
    expect(list.head!.value).toBe(3);

    list.delete(3);
    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should reverse the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.reverse();

    expect(list.toArray()).toEqual([3, 2, 1]);
    expect(list.toReversedArray()).toEqual([1, 2, 3]);
  });

  it('should map elements using a callback function', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const mappedList = list.map(value => value * 2);

    expect(mappedList.toArray()).toEqual([2, 4, 6]);
  });

  it('should filter elements using a callback function', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const filteredList = list.filter(value => value % 2 === 0);

    expect(filteredList.toArray()).toEqual([2, 4]);
  });

  it('should reduce elements using a callback function and an initial value', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const sum = list.reduce((acc, value) => acc + value, 0);

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

    const found = list.find(value => value % 2 === 0);

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

    const lastEven = list.findBackward(value => value % 2 === 0);

    expect(lastEven).toBe(4);
  });

  it('should clear the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.clear();

    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should create a reversed array of values', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const reversedArray = list.toReversedArray();

    expect(reversedArray).toEqual([3, 2, 1]);
  });

  it('should reverse the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.reverse();

    expect(list.toArray()).toEqual([3, 2, 1]);
    expect(list.head?.value).toBe(3);
    expect(list.tail?.value).toBe(1);
  });

  it('should iterate over each element and apply a callback', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const result: number[] = [];
    list.forEach(value => {
      result.push(value * 2);
    });

    expect(result).toEqual([2, 4, 6]);
  });

  it('should create a new linked list by applying a mapping function', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const mappedList = list.map(value => value * 2);

    expect(mappedList.toArray()).toEqual([2, 4, 6]);
  });

  it('should create a new linked list by filtering elements', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const filteredList = list.filter(value => value % 2 === 0);

    expect(filteredList.toArray()).toEqual([2, 4]);
  });

  it('should reduce the linked list to a single value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const sum = list.reduce((acc, value) => acc + value, 0);

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
    const obj1 = { keyA: 10 };
    const obj2 = { keyA: 20 };
    const obj3 = { keyA: 30 };

    objectList.push(obj1);
    objectList.push(obj2);
    objectList.push(obj3);

    expect(objectList.toArray()).toEqual([obj1, obj2, obj3]);

    const newObj = { keyA: 25 }; // Corrected newObj value
    const insertSuccess = objectList.insertBefore(obj2, newObj);
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


describe('iterable methods', () => {
  it('should forEach, some, every, filter, map, reduce of the deque', () => {
    const dl = new DoublyLinkedList<number>()
    dl.push(1);
    dl.push(2);
    dl.push(3);

    const mockCallback = jest.fn();
    dl.forEach((element) => {
      mockCallback(element);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1]);
    expect(mockCallback.mock.calls[1]).toEqual([2]);
    expect(mockCallback.mock.calls[2]).toEqual([3]);

    expect(dl.every(element => element > 0)).toBe(true);
    expect(dl.every(element => element > 1)).toBe(false);
    expect(dl.some(element => element > 2)).toBe(true);

    expect([...dl.filter(element => element > 2)]).toEqual([3]);
    expect([...dl.map(element => element * 2)]).toEqual([2, 4, 6]);
    expect(dl.reduce((accumulator, element) => accumulator + element, 0)).toEqual(6);
  });
});