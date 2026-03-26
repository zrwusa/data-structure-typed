import { PriorityQueue } from '../../../../src';
import { PriorityQueue as CPriorityQueue } from 'js-sdsl';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;

describe('classic use', () => {
  it('@example Hospital emergency room triage', () => {
    interface Patient {
      name: string;
      severity: number; // 1 = critical, 5 = minor
    }

    const er = new PriorityQueue<Patient>([], {
      comparator: (a, b) => a.severity - b.severity
    });

    er.add({ name: 'Flu symptoms', severity: 4 });
    er.add({ name: 'Heart attack', severity: 1 });
    er.add({ name: 'Broken arm', severity: 3 });
    er.add({ name: 'Stroke', severity: 1 });

    // Most critical patients first
    expect(er.poll()?.severity).toBe(1);
    expect(er.poll()?.severity).toBe(1);
    expect(er.poll()?.severity).toBe(3);
    expect(er.poll()?.severity).toBe(4);
  });

  it('@example Task scheduler with deadlines', () => {
    interface Task {
      name: string;
      deadline: number; // hours until due
    }

    const scheduler = new PriorityQueue<Task>([], {
      comparator: (a, b) => a.deadline - b.deadline
    });

    scheduler.add({ name: 'Report', deadline: 24 });
    scheduler.add({ name: 'Email', deadline: 2 });
    scheduler.add({ name: 'Meeting prep', deadline: 4 });
    scheduler.add({ name: 'Code review', deadline: 8 });

    // Process most urgent first
    expect(scheduler.peek()?.name).toBe('Email');
    expect(scheduler.size).toBe(4);

    const order = [];
    while (scheduler.size > 0) {
      order.push(scheduler.poll()!.name);
    }
    expect(order).toEqual(['Email', 'Meeting prep', 'Code review', 'Report']);
  });

  it('@example Bandwidth allocation with priorities', () => {
    const bandwidth = new PriorityQueue<[number, string]>([], {
      comparator: (a, b) => a[0] - b[0]
    });

    bandwidth.add([1, 'Video call']);     // highest priority
    bandwidth.add([3, 'File download']);
    bandwidth.add([2, 'Web browsing']);
    bandwidth.add([1, 'Voice call']);

    // Allocate bandwidth to highest priority first
    expect(bandwidth.poll()?.[1]).toBe('Video call');
    expect(bandwidth.poll()?.[1]).toBe('Voice call');
    expect(bandwidth.size).toBe(2);
  });
});
describe('PriorityQueue Operation Test', () => {
  it('should PriorityQueue poll, pee, heapify, toArray work well', function () {
    const minPQ = new PriorityQueue<number>([], {
      comparator: (a, b) => a - b
    });
    minPQ.refill([5, 2, 3, 4, 6, 1]);
    expect(minPQ.toArray()).toEqual([1, 2, 3, 4, 6, 5]);
    minPQ.poll();
    minPQ.poll();
    minPQ.poll();
    expect(minPQ.toArray()).toEqual([4, 5, 6]);
    expect(minPQ.peek()).toBe(4);
    expect(
      PriorityQueue.heapify([3, 2, 1, 5, 6, 7, 8, 9, 10], {
        comparator: (a, b) => a - b
      }).toArray()
    ).toEqual([1, 3, 2, 5, 6, 7, 8, 9, 10]);
  });

  it('should Max PriorityQueue poll, peek, heapify, toArray work well', function () {
    const maxPriorityQueue = new PriorityQueue<number>([], {
      comparator: (a, b) => b - a
    });
    maxPriorityQueue.refill([5, 2, 3, 4, 6, 1]);
    expect(maxPriorityQueue.toArray()).toEqual([6, 5, 3, 4, 2, 1]);
    maxPriorityQueue.poll();
    maxPriorityQueue.poll();
    maxPriorityQueue.poll();
    expect(maxPriorityQueue.toArray()).toEqual([3, 2, 1]);
    expect(maxPriorityQueue.peek()).toBe(3);
    expect(
      PriorityQueue.heapify([3, 2, 1, 5, 6, 7, 8, 9, 10], {
        comparator: (a, b) => a - b
      }).toArray()
    ).toEqual([1, 3, 2, 5, 6, 7, 8, 9, 10]);
  });

  it('should PriorityQueue clone, sort, getNodes, dfs work well', function () {
    const minPQ1 = new PriorityQueue<number>([], {
      comparator: (a, b) => a - b
    });
    minPQ1.refill([2, 5, 8, 3, 1, 6, 7, 4]);
    const clonedPriorityQueue = minPQ1.clone();
    expect(clonedPriorityQueue.elements).toEqual(minPQ1.elements);
    expect(clonedPriorityQueue.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(minPQ1.dfs('IN')).toEqual([4, 3, 2, 5, 1, 8, 6, 7]);
    expect(minPQ1.dfs('POST')).toEqual([4, 3, 5, 2, 8, 7, 6, 1]);
    expect(minPQ1.dfs('PRE')).toEqual([1, 2, 3, 4, 5, 6, 8, 7]);
  });

  it('should PriorityQueue filter, map work well', function () {
    const minPQ2 = new PriorityQueue<number>([], {
      comparator: (a, b) => a - b
    });
    minPQ2.refill([2, 5, 8, 3, 1, 6, 7, 4]);
    const filtered = minPQ2.filter(item => item % 2 === 1);
    expect(filtered instanceof PriorityQueue).toBe(true);
    expect([...filtered]).toEqual([1, 3, 5, 7]);

    const mapped = filtered.map(item => ({ key: item }), { comparator: (a, b) => a.key - b.key });
    expect(mapped instanceof PriorityQueue).toBe(true);
    expect([...mapped]).toEqual([{ key: 1 }, { key: 3 }, { key: 5 }, { key: 7 }]);
  });
});

describe('Priority Queue Performance Test', () => {
  it('should numeric heap work well', function () {
    const pq = new PriorityQueue<number>([], {
      comparator: (a, b) => b - a
    });

    const tS = performance.now();

    for (let i = 0; i < 100000; i++) {
      pq.add(i);
    }

    // for (let i = 0; i < 10000; i++) {
    //   pq.pop();
    // }
    if (isDebug) console.log(performance.now() - tS);
    if (isDebug) console.log(pq.size);
    const cS = performance.now();
    const cpq = new CPriorityQueue();

    for (let i = 0; i < 100000; i++) {
      cpq.push(i);
    }
    //
    // for (let i = 0; i < 10000; i++) {
    //   cpq.pop();
    // }
    if (isDebug) console.log(performance.now() - cS);
    if (isDebug) console.log(cpq.size());
  });
});
