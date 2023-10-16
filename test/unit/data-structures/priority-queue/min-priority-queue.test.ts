import {MinPriorityQueue} from '../../../../src';

describe('MinPriorityQueue Operation Test', () => {
  it('should check if a node exists in the queue', () => {
    const priorityQueue = new MinPriorityQueue<number>();
    priorityQueue.add(5);

    expect(priorityQueue.has(5)).toBe(true);
    expect(priorityQueue.has(3)).toBe(false);
  });

  it('should return the smallest element without removing it', () => {
    const priorityQueue = new MinPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    expect(priorityQueue.peek()).toBe(3);
    expect(priorityQueue.size).toBe(3);
  });

  it('should return the last element', () => {
    const priorityQueue = new MinPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    expect(priorityQueue.leaf).toBe(7);
  });

  it('should check if the queue is empty', () => {
    const priorityQueue = new MinPriorityQueue<number>();

    expect(priorityQueue.isEmpty()).toBe(true);

    priorityQueue.add(5);

    expect(priorityQueue.isEmpty()).toBe(false);
  });

  it('should clear the queue', () => {
    const priorityQueue = new MinPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);

    priorityQueue.clear();

    expect(priorityQueue.size).toBe(0);
    expect(priorityQueue.isEmpty()).toBe(true);
  });

  it('should sort the elements', () => {
    const priorityQueue = new MinPriorityQueue<number>();
    priorityQueue.add(5);
    priorityQueue.add(3);
    priorityQueue.add(7);
    priorityQueue.add(1);

    const sortedArray = priorityQueue.sort();
    expect(sortedArray).toEqual([1, 3, 5, 7]);
  });
});
