import { MaxHeap } from '../../../../src';

/**
 * Coverage-focused test for MaxHeap comparator branches.
 * Keep existing @example tests intact.
 */
describe('MaxHeap coverage', () => {
  it('orders numbers as a max-heap (a<b / a>b / equal branches)', () => {
    const h = new MaxHeap<number>();

    h.add(2);
    h.add(1);
    h.add(3);
    h.add(3); // equal branch exercised during comparisons

    expect(h.peek()).toBe(3);
    expect(h.poll()).toBe(3);
    expect(h.poll()).toBe(3);
    expect(h.poll()).toBe(2);
    expect(h.poll()).toBe(1);
    expect(h.poll()).toBe(undefined);
  });

  it('throws when comparing object types without custom comparator', () => {
    const h = new MaxHeap<any>();
    h.add({ k: 1 });
    expect(() => h.add({ k: 2 })).toThrow(TypeError);
  });
});
