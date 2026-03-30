import { UndirectedGraph } from '../../../../src';

describe('UndirectedGraph static factory coverage', () => {
  it('fromKeys should create graph with vertices from keys', () => {
    const g = UndirectedGraph.fromKeys([1, 2, 3]);
    expect(g.hasVertex(1)).toBe(true);
    expect(g.hasVertex(2)).toBe(true);
    expect(g.hasVertex(3)).toBe(true);
    expect(g.size).toBe(3);
  });

  it('fromEntries should create graph with vertices from entries', () => {
    const g = UndirectedGraph.fromEntries([
      ['a', 'Alice'],
      ['b', 'Bob']
    ]);
    expect(g.hasVertex('a')).toBe(true);
    expect(g.hasVertex('b')).toBe(true);
    expect(g.size).toBe(2);
  });

  it('fromKeys with empty iterable', () => {
    const g = UndirectedGraph.fromKeys([]);
    expect(g.size).toBe(0);
  });
});
