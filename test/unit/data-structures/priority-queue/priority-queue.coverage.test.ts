import { PriorityQueue } from '../../../../src';

/**
 * Coverage-focused test for PriorityQueue thin wrapper.
 * Keep existing @example tests intact.
 */
describe('PriorityQueue coverage', () => {
  it('constructs and supports basic add/poll via Heap API', () => {
    const pq = new PriorityQueue<number>();
    pq.add(3);
    pq.add(1);
    pq.add(2);

    // Default PriorityQueue here behaves as a min-heap.
    expect(pq.peek()).toBe(1);
    expect(pq.poll()).toBe(1);
    expect(pq.poll()).toBe(2);
    expect(pq.poll()).toBe(3);
    expect(pq.poll()).toBe(undefined);
  });
});
