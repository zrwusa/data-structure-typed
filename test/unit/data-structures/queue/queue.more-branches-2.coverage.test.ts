import { Queue } from '../../../../src';

describe('Queue remaining branch coverage (batch 2)', () => {
  it('splice(start) hits default deleteCount=0 and can trigger auto-compaction branch', () => {
    const q = new Queue<number>();
    q.pushMany([1, 2, 3]);

    // Prevent auto-compaction during the shifts; we want a non-zero offset.
    q.autoCompactRatio = 1;

    // Create offset > 0 while keeping underlying elements array non-empty.
    expect(q.shift()).toBe(1);
    expect(q.shift()).toBe(2);
    expect(q.offset).toBe(2);

    // Now ensure the condition `offset/elements.length > autoCompactRatio` is true at splice-time.
    q.autoCompactRatio = 0;

    // Omit deleteCount to hit the default-arg branch.
    const removed = q.splice(0, undefined as any, 9);

    // Should have compacted (offset reset) and inserted item.
    expect(q.offset).toBe(0);
    expect(q.toArray()).toEqual([9, 3]);
    expect(removed.toArray()).toEqual([]);
  });
});
