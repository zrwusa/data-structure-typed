import { Deque } from '../../../../src';

describe('Deque remaining branch coverage (batch 3)', () => {
  it('unshiftMany covers else-branch when toElementFn is not provided', () => {
    const d = new Deque<number>();
    expect(d.unshiftMany([1, 2])).toEqual([true, true]);
    expect(d.toArray()).toEqual([2, 1]);
  });
});
