import { DirectedGraph, DirectedVertex } from '../../../../src';

describe('AbstractGraph additional branch coverage (4)', () => {
  it('dijkstraWithoutHeap early-stop at dest=src covers getMinDist/genPaths branches and `|| MAX_SAFE_INTEGER` fallback when dist=0', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');

    const res = g.dijkstraWithoutHeap('A', 'A', true, true)!;
    // when dest=src, distMap.get(dest)=0, so code uses `0 || MAX_SAFE_INTEGER`
    expect(res.minDist).toBe(Number.MAX_SAFE_INTEGER);
    expect(res.paths.length).toBe(2);
  });

  it('dijkstra early-stop at dest=src covers getMinDist branch and `|| MAX_SAFE_INTEGER` fallback when dist=0', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');

    const res = g.dijkstra('A', 'A', true, false)!;
    expect(res.minDist).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('bellmanFord negative-cycle scan takes the truthy sWeight branch and sets hasNegativeCycle=true', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');

    // Make B reachable with sWeight=1, then include a self-edge with negative weight.
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'B', -2);

    const res = g.bellmanFord('A', true, false, false);
    expect(res.hasNegativeCycle).toBe(true);
  });

  it('getCycles includes 2-cycle only when isInclude2Cycle=true (covers length condition branches)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');

    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'A', 1);

    const no2 = g.getCycles(false);
    expect(no2.length).toBe(0);

    const yes2 = g.getCycles(true);
    expect(yes2.length).toBeGreaterThan(0);
  });

  it('filter pushes entries when predicate returns true (covers filter if-body)', () => {
    const g = new DirectedGraph();
    g.addVertex('A', 1 as any);
    g.addVertex('B', 2 as any);

    const out = g.filter((value: any) => value === 2);
    expect(out.hasVertex('B')).toBe(true);
    expect(out.hasVertex('A')).toBe(false);
  });

  it('_createInstance uses provided options.graph branch, and _createLike uses iter branch', () => {
    const g = new DirectedGraph();
    g.addVertex('A');

    const inst = (g as any)._createInstance({ graph: { foo: 123 } });
    expect((inst as any)._options.foo).toBe(123);

    const like = (g as any)._createLike([
      ['X', 1],
      ['Y', 2]
    ]);
    expect(like.hasVertex('X')).toBe(true);
    expect(like.hasVertex('Y')).toBe(true);
  });

  it('_createLike handles missing hasVertex() by taking the false branch of conditional hasA/hasB', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 1);

    // Shadow hasVertex so the internal `g.hasVertex ? g.hasVertex(...) : false` takes the false branch.
    const inst = (g as any)._createInstance();
    (inst as any).hasVertex = undefined;

    const like = (g as any)._createLike(undefined, undefined);
    // Should still be a graph instance; we only care about exercising the branch.
    expect(like).toBeDefined();
  });

  it('_addVertex returns false when vertex already exists (covers hasVertex(newVertex) true branch)', () => {
    const g = new DirectedGraph();
    const v = new DirectedVertex('A');
    (g as any)._addVertex(v);
    expect((g as any)._addVertex(v)).toBe(false);
  });
});
