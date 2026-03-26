import { DirectedGraph } from '../../../../src';

describe('IterableEntryBase has/get via DirectedGraph', () => {
  it('has() returns false for non-existent key', () => {
    const g = new DirectedGraph();
    g.addVertex('a', 1);
    expect(g.has('a')).toBe(true);
    expect(g.has('z')).toBe(false);
  });

  it('get() returns undefined for non-existent key', () => {
    const g = new DirectedGraph();
    g.addVertex('a', 1);
    expect(g.get('a')).toBe(1);
    expect(g.get('z')).toBeUndefined();
  });
});
