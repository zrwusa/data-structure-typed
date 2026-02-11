import { DirectedGraph } from '../../../../src';

describe('AbstractGraph additional branch coverage (2)', () => {
  it('getMinCostBetween(unweighted) returns undefined when either vertex missing', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    expect(g.getMinCostBetween('A', 'MISSING' as any, false)).toBeUndefined();
  });

  it('getMinPathBetween(weighted, DFS) returns undefined when no paths exist (covers allPaths[-1] || undefined)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('C');
    // no edges => no paths
    const out = g.getMinPathBetween('A', 'C', true, true);
    expect(out).toBeUndefined();
  });

  it('getMinPathBetween(weighted, Dijkstra) returns [] when src missing (covers ?.minPath ?? [])', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 1);

    const out = g.getMinPathBetween('MISSING' as any, 'B', true, false);
    expect(out).toEqual([]);
  });

  it('dijkstraWithoutHeap returns undefined when src missing', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    expect(g.dijkstraWithoutHeap('MISSING' as any)).toBeUndefined();
  });

  it('dijkstra returns undefined when src missing', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    expect(g.dijkstra('MISSING' as any)).toBeUndefined();
  });
});
