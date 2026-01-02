const { MinHeap } = require('data-structure-typed');

describe('JS Heap Operation Test', () => {
  it('should numeric heap work well', function () {
    const minNumHeap = new MinHeap();
    minNumHeap.add(1);
    minNumHeap.add(6);
    minNumHeap.add(2);
    minNumHeap.add(0);
    minNumHeap.add(5);
    minNumHeap.add(9);
    expect(minNumHeap.poll()).toBe(0);
    expect(minNumHeap.poll()).toBe(1);
    expect(minNumHeap.peek()).toBe(2);
    expect(minNumHeap.toArray().length).toBe(4);
    expect(minNumHeap.toArray()[0]).toBe(2);
    expect(minNumHeap.toArray()[1]).toBe(5);
    expect(minNumHeap.toArray()[2]).toBe(9);
    expect(minNumHeap.toArray()[3]).toBe(6);
  });
});
