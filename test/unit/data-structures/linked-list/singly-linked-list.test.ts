import { SinglyLinkedList, SinglyLinkedListNode, Stack } from '../../../../src';

describe('SinglyLinkedListNode', () => {
  it('should SinglyLinkedList', () => {
    const node1 = new SinglyLinkedListNode<number>(2);
    expect(node1.value).toBe(2);
    node1.value = 1;
    expect(node1.value).toBe(1);
  });
});

describe('SinglyLinkedList Initiate Test', () => {
  it('should initiate with toElementFn', () => {
    const sl = new SinglyLinkedList([{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }], {
      toElementFn: ({ key }) => key
    });

    expect([...sl]).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('SinglyLinkedList Operation Test', () => {
  let list: SinglyLinkedList<number>;
  let objectList: SinglyLinkedList<{
    keyA: number;
  }>;
  beforeEach(() => {
    list = new SinglyLinkedList<number>();
    objectList = new SinglyLinkedList<{
      keyA: number;
    }>();
  });

  describe('push', () => {
    it('should add elements to the end of the list', () => {
      list.push(1);
      list.push(2);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it('push with maxLen', () => {
      const list = new SinglyLinkedList<number>([], { maxLen: 10 });
      for (let i = 0; i < 1000; i++) {
        list.push(i);
      }
      expect(list.maxLen).toBe(10);
      expect(list.length).toBe(10);
      expect(list.first).toBe(990);
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
      list.addAfter(list.getNode(2)!, 4);
      expect(list.toArray()).toEqual([1, 2, 4, 4, 3]);
      list.addAfter(list.getNode(3)!, 4);
      expect(list.toArray()).toEqual([1, 2, 4, 4, 3, 4]);
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
      expect(list.delete(undefined)).toBe(false);
      expect(list.delete(2)).toBe(true);
      expect(list.toArray()).toEqual([1, 3, 4, 5]);
      expect(list.delete(1)).toBe(true);
      expect(list.toArray()).toEqual([3, 4, 5]);
      expect(list.delete(5)).toBe(true);
      expect(list.toArray()).toEqual([3, 4]);
      expect(list.delete(4)).toBe(true);
      expect(list.toArray()).toEqual([3]);
      expect(list.delete(3)).toBe(true);
      expect(list.toArray()).toEqual([]);
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
      expect(list.length).toBe(0);
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
      expect(list.addBefore(2, 4)).toBe(false);
      list.push(1);
      list.push(2);
      list.push(3);
      list.addBefore(2, 4);
      expect(list.toArray()).toEqual([1, 4, 2, 3]);
      expect(list.addBefore(list.getNode(2)!, 4)).toBe(true);
      expect([...list]).toEqual([1, 4, 4, 2, 3]);
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
      expect(list.length).toBe(0);
      list.push(1);
      list.push(2);
      expect(list.length).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete and return the element at the specified index', () => {
      list.push(1);
      list.push(2);
      list.push(3);
      const removed = list.deleteAt(1);
      expect(removed).toBe(2);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it('should return undefined for an out-of-bounds index', () => {
      list.push(1);
      const removed = list.deleteAt(1);
      expect(removed).toBe(undefined);
    });

    it('should delete and return the first element', () => {
      list.push(1);
      list.push(2);
      expect(list.first).toBe(1);
      expect(list.last).toBe(2);
      const removed = list.deleteAt(0);
      expect(list.first).toBe(2);
      expect(list.last).toBe(2);
      expect(removed).toBe(1);
      expect(list.toArray()).toEqual([2]);
    });

    it('should delete and return the last element', () => {
      list.push(1);
      list.push(2);
      const removed = list.deleteAt(1);
      expect(removed).toBe(2);
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
      expect(list.addAt(5, 5)).toBe(false);
      expect(list.addAt(-1, -1)).toBe(false);
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
    sList.delete('1');
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
    sList.delete(sList.getNode('0'));
    expect([...sList]).toEqual(['1', '6', '9']);
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

describe('SinglyLinkedList Additional Methods', () => {
  // Slice method implementation and test
  test('slice should return a new list with specified range', () => {
    const list = new SinglyLinkedList([1, 2, 3, 4, 5]);
    const slicedList = list.slice(1, 4);

    expect(slicedList.toArray()).toEqual([2, 3, 4]);
    expect(list.length).toBe(5); // Original list unchanged
  });

  // Splice method implementation
  test('splice should modify list and return removed elements', () => {
    const list = new SinglyLinkedList([1, 2, 3, 4, 5]);
    const removedList = list.splice(2, 2, 6, 7);

    expect(list.toArray()).toEqual([1, 2, 6, 7, 5]);
    expect(removedList.toArray()).toEqual([3, 4]);
  });

  // Concat method test
  test('concat should combine multiple lists', () => {
    const list1 = new SinglyLinkedList([1, 2]);
    const list2 = new SinglyLinkedList([3, 4]);
    const list3 = new SinglyLinkedList([5, 6]);

    const concatenatedList = list1.concat(list2, list3);
    expect(concatenatedList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  // Sort method test
  test('sort should order elements in ascending order', () => {
    const list = new SinglyLinkedList([5, 2, 8, 1, 9]);
    list.sort((a, b) => a - b);

    expect(list.toArray()).toEqual([1, 2, 5, 8, 9]);
  });

  // Reverse method test
  test('reverse should invert the list order', () => {
    const list = new SinglyLinkedList([1, 2, 3, 4, 5]);
    list.reverse();

    expect(list.toArray()).toEqual([5, 4, 3, 2, 1]);
  });

  // Join method test
  test('join should convert list to string with separator', () => {
    const list = new SinglyLinkedList(['a', 'b', 'c']);

    expect(list.join('-')).toBe('a-b-c');
    expect(list.join()).toBe('a,b,c');
  });

  // IndexOf method test
  test('indexOf should return first occurrence index', () => {
    const list = new SinglyLinkedList([1, 2, 3, 2, 1]);

    expect(list.indexOf(2)).toBe(1);
    expect(list.indexOf(4)).toBe(-1);
  });

  // LastIndexOf method test
  test('lastIndexOf should return last occurrence index', () => {
    const list = new SinglyLinkedList([1, 2, 3, 2, 1]);

    expect(list.lastIndexOf(2)).toBe(3);
    expect(list.lastIndexOf(4)).toBe(-1);
  });

  // findIndex method test
  test('findIndex should return first occurrence index', () => {
    const list = new SinglyLinkedList([1, 2, 3, 2, 1]);
    expect(list.findIndex(item => item === 2)).toBe(1);
    expect(list.findIndex(item => item === 4)).toBe(-1);
  });

  // fill method test
  test('fill should return fill all the list', () => {
    let list = new SinglyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9)]).toEqual([9, 9, 9, 9, 9]);
    list = new SinglyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9, 2, 3)]).toEqual([1, 2, 9, 2, 1]);
    list = new SinglyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9, -3, -2)]).toEqual([1, 2, 9, 2, 1]);
    list = new SinglyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9, -2, -3)]).toEqual([1, 2, 3, 2, 1]);
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
    expect(list.length).toBe(0);
  });

  it('should push elements to the end of the list', () => {
    list.push(1);
    list.push(2);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(2);
    expect(list.length).toBe(2);
  });

  it('should pop elements from the end of the list', () => {
    list.push(1);
    list.push(2);
    const popped = list.pop();
    expect(popped).toBe(2);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(1);
    expect(list.length).toBe(1);
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
    const mappedSl = sl.map(element => element * 2);
    expect([...mappedSl]).toEqual([2, 4, 6]);
    expect(sl.reduce((accumulator, element) => accumulator + element, 0)).toEqual(6);
  });
});

describe('classic uses', () => {

  it('@example implementation of a basic text editor', () => {

    class TextEditor {
      private content: SinglyLinkedList<string>;
      private cursorIndex: number;
      private undoStack: Stack<{ operation: string; data?: any }>;

      constructor() {
        this.content = new SinglyLinkedList<string>();
        this.cursorIndex = 0; // Cursor starts at the beginning
        this.undoStack = new Stack<{ operation: string; data?: any }>(); // Stack to keep track of operations for undo
      }

      /**
       * Inserts a character at the current cursor position.
       * @param char - The character to insert.
       */
      insert(char: string) {
        this.content.addAt(this.cursorIndex, char);
        this.cursorIndex++;
        this.undoStack.push({ operation: 'insert', data: { index: this.cursorIndex - 1 } });
      }

      /**
       * Deletes the character at the current cursor position.
       * If the cursor is at the end, deletes the character before the cursor.
       */
      delete() {
        if (this.cursorIndex === 0) return; // Nothing to delete
        const deleted = this.content.deleteAt(this.cursorIndex - 1);
        this.cursorIndex--;
        this.undoStack.push({ operation: 'delete', data: { index: this.cursorIndex, char: deleted } });
      }

      /**
       * Moves the cursor to a specific position.
       * @param index - The position to move the cursor to.
       */
      moveCursor(index: number) {
        this.cursorIndex = Math.max(0, Math.min(index, this.content.length));
      }

      /**
       * Undoes the last operation (insert or delete).
       */
      undo() {
        if (this.undoStack.size === 0) return; // No operations to undo
        const lastAction = this.undoStack.pop();

        if (lastAction!.operation === 'insert') {
          this.content.deleteAt(lastAction!.data.index);
          this.cursorIndex = lastAction!.data.index;
        } else if (lastAction!.operation === 'delete') {
          this.content.addAt(lastAction!.data.index, lastAction!.data.char);
          this.cursorIndex = lastAction!.data.index + 1;
        }
      }

      /**
       * Displays the current text content of the editor.
       * @returns The concatenated string representation of the text.
       */
      getText(): string {
        return [...this.content].join('');
      }
    }

    // Example Usage
    const editor = new TextEditor();
    editor.insert('H');
    editor.insert('e');
    editor.insert('l');
    editor.insert('l');
    editor.insert('o');
    expect(editor.getText()).toBe('Hello'); // Output: "Hello"

    editor.delete();
    expect(editor.getText()).toBe('Hell'); // Output: "Hell"

    editor.undo();
    expect(editor.getText()).toBe('Hello'); // Output: "Hello"

    editor.moveCursor(1);
    editor.insert('a');
    expect(editor.getText()).toBe('Haello'); // Output: "Haello"
  });
});
