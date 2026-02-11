import { MaxPriorityQueue } from '../../../../src';

describe('MaxPriorityQueue remaining branch coverage', () => {
  it('default comparator throws when comparing object elements', () => {
    const pq = new MaxPriorityQueue<any>();
    // call comparator directly to deterministically hit the throw branch
    const cmp = (pq as any).comparator as (a: any, b: any) => number;
    expect(() => cmp({ a: 1 }, { b: 2 })).toThrow(TypeError);
  });
});
