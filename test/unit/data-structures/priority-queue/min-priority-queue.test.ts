import { MinPriorityQueue } from '../../../../src';

describe('classic use', () => {
  it('@example Shortest job first scheduling', () => {
    const jobs = new MinPriorityQueue<number>();

    jobs.add(8); // 8 seconds
    jobs.add(2); // 2 seconds
    jobs.add(5); // 5 seconds
    jobs.add(1); // 1 second

    // Shortest job first
    expect(jobs.poll()).toBe(1);
    expect(jobs.poll()).toBe(2);
    expect(jobs.poll()).toBe(5);
    expect(jobs.poll()).toBe(8);
  });

  it('@example Event-driven simulation with timestamps', () => {
    interface Event {
      time: number;
      action: string;
    }

    const timeline = new MinPriorityQueue<Event>([], {
      comparator: (a, b) => a.time - b.time
    });

    timeline.add({ time: 300, action: 'Timeout' });
    timeline.add({ time: 100, action: 'Request received' });
    timeline.add({ time: 200, action: 'Processing done' });
    timeline.add({ time: 150, action: 'Cache hit' });

    const order = [];
    while (timeline.size > 0) {
      order.push(timeline.poll()!.action);
    }
    expect(order).toEqual(['Request received', 'Cache hit', 'Processing done', 'Timeout']);
  });

  it('@example Huffman coding frequency selection', () => {
    // Character frequencies for Huffman tree building
    const freq = new MinPriorityQueue<[number, string]>([], {
      comparator: (a, b) => a[0] - b[0]
    });

    freq.add([5, 'a']);
    freq.add([9, 'b']);
    freq.add([12, 'c']);
    freq.add([2, 'd']);

    // Always pick two lowest frequencies
    const first = freq.poll()!;
    const second = freq.poll()!;
    expect(first[1]).toBe('d'); // freq 2
    expect(second[1]).toBe('a'); // freq 5

    // Combined node goes back
    freq.add([first[0] + second[0], first[1] + second[1]]);
    expect(freq.peek()![0]).toBe(7); // 2+5 = 7, which is less than 9
  });
});

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

  it('should MinPriorityQueue filter, map work well', function () {
    const minPQ2 = new MinPriorityQueue<number>([2, 5, 8, 1, 6, 7, 4]);

    const cloned = minPQ2.clone();
    const filtered = cloned.filter(item => item % 2 === 1);
    expect(filtered instanceof MinPriorityQueue).toBe(true);
    expect([...filtered]).toEqual([1, 5, 7]);

    const mapped = filtered.map(item => ({ key: item }), { comparator: (a, b) => a.key - b.key });
    expect(mapped instanceof MinPriorityQueue).toBe(true);
    expect([...mapped]).toEqual([{ key: 1 }, { key: 5 }, { key: 7 }]);
    expect(mapped.toVisual()).toEqual([{ key: 1 }, { key: 5 }, { key: 7 }]);
  });
});
