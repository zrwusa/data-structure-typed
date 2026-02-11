import { DirectedGraph } from '../../../../src';

describe('AbstractGraph additional branch coverage (3)', () => {
  it('getMinPathBetween(unweighted) returns [] when either vertex missing (covers guard)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    expect(g.getMinPathBetween('A', 'MISSING' as any, false)).toEqual([]);
  });

  it('getMinPathBetween(weighted, DFS) returns a real min path when multiple paths exist (covers allPaths[minIndex])', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');

    // two paths A->C (weight 5) and A->B->C (weight 3)
    g.addEdge('A', 'C', 5);
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 2);

    const out = g.getMinPathBetween('A', 'C', true, true)!;
    expect(out.map(v => v.key)).toEqual(['A', 'B', 'C']);
  });

  it('getMinPathBetween(weighted, Dijkstra) returns minPath when dijkstra returns it (covers ?.minPath ?? [] left side)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');

    g.addEdge('A', 'C', 5);
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 2);

    const out = g.getMinPathBetween('A', 'C', true, false)!;
    expect(out.map(v => v.key)).toEqual(['A', 'B', 'C']);
  });

  it('bellmanFord returns early when src missing and scanNegativeCycle true (covers hasNegativeCycle init + early return)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');

    const res = g.bellmanFord('MISSING' as any, true, true, true);
    expect(res.hasNegativeCycle).toBe(false);
    expect(res.distMap.size).toBe(0);
  });

  it('bellmanFord with getMin+genPath builds minPath and leaves hasNegativeCycle false when sWeight is 0 (covers branches at 752/754/771/784)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');

    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 1);

    const res = g.bellmanFord('A', true, true, true);

    // min path should end at the closest reachable vertex (B)
    expect(res.min).toBe(1);
    expect(res.minPath.map(v => v.key)).toEqual(['A', 'B']);
    expect(res.hasNegativeCycle).toBe(false);
    expect(res.paths.length).toBe(3);
  });
});
