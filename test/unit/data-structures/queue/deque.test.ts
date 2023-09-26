import {Deque, ArrayDeque, ObjectDeque} from '../../../../src';

describe('Deque Tests', () => {
  // Test cases for the Deque class (DoublyLinkedList-based)
  describe('Deque (DoublyLinkedList-based)', () => {
    let deque: Deque<number>;

    beforeEach(() => {
      deque = new Deque<number>();
    });

    it('should add elements at the beginning and end', () => {
      deque.addFirst(1);
      deque.addLast(2);
      expect(deque.peekFirst()).toBe(1);
      expect(deque.peekLast()).toBe(2);
    });

    it('should remove elements from the beginning and end', () => {
      deque.addFirst(1);
      deque.addLast(2);
      deque.pollFirst();
      deque.pollLast();
      expect(deque.isEmpty()).toBe(true);
    });

    it('should handle edge case when removing from an empty deque', () => {
      const result = deque.pollFirst();
      expect(result).toBeUndefined();
    });

    it('should correctly report its size', () => {
      deque.addFirst(1);
      deque.addLast(2);
      expect(deque.size).toBe(2);
    });

    it('should handle adding and removing elements alternately', () => {
      deque.addFirst(1);
      expect(deque.pollFirst()).toBe(1);
      deque.addLast(2);
      expect(deque.pollLast()).toBe(2);
      expect(deque.isEmpty()).toBe(true);
    });

    it('should handle adding and removing elements in a cyclic manner', () => {
      deque.addFirst(1);
      deque.addLast(2);
      expect(deque.pollFirst()).toBe(1);
      deque.addFirst(3);
      expect(deque.pollLast()).toBe(2);
      expect(deque.size).toBe(1);
    });
    // Add more test cases as needed
  });

  // Test cases for the ObjectDeque class
  describe('ObjectDeque', () => {
    let objectDeque: ObjectDeque<string>;

    beforeEach(() => {
      objectDeque = new ObjectDeque<string>();
    });

    it('should add elements at the beginning and end', () => {
      objectDeque.addFirst('one');
      objectDeque.addLast('two');
      expect(objectDeque.peekFirst()).toBe('one');
      expect(objectDeque.peekLast()).toBe('two');
    });

    it('should remove elements from the beginning and end', () => {
      objectDeque.addFirst('one');
      objectDeque.addLast('two');
      objectDeque.pollFirst();
      objectDeque.pollLast();
      expect(objectDeque.isEmpty()).toBe(true);
    });

    it('should handle edge case when removing from an empty deque', () => {
      const result = objectDeque.pollFirst();
      expect(result).toBeUndefined();
    });

    it('should correctly report its size', () => {
      objectDeque.addFirst('one');
      objectDeque.addLast('two');
      expect(objectDeque.size).toBe(2);
    });

    // Add more test cases as needed
  });

  // Test cases for the ArrayDeque class
  describe('ArrayDeque', () => {
    let arrayDeque: ArrayDeque<number>;

    beforeEach(() => {
      arrayDeque = new ArrayDeque<number>();
    });

    it('should add elements at the beginning and end', () => {
      arrayDeque.addFirst(1);
      arrayDeque.addLast(2);
      expect(arrayDeque.peekFirst()).toBe(1);
      expect(arrayDeque.peekLast()).toBe(2);
    });

    it('should remove elements from the beginning and end', () => {
      arrayDeque.addFirst(1);
      arrayDeque.addLast(2);
      arrayDeque.pollFirst();
      arrayDeque.pollLast();
      expect(arrayDeque.isEmpty()).toBe(true);
    });

    it('should handle edge case when removing from an empty deque', () => {
      const result = arrayDeque.pollFirst();
      expect(result).toBeNull();
    });

    it('should correctly report its size', () => {
      arrayDeque.addFirst(1);
      arrayDeque.addLast(2);
      expect(arrayDeque.size).toBe(2);
    });

    // Add more test cases as needed
  });
});
