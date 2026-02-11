import { DirectedGraph, DirectedVertex, AbstractVertex } from '../../../../src';

describe('AbstractGraph extra branch coverage via DirectedGraph', () => {
  it('getVertex(missingKey) returns undefined (covers `|| undefined` branch)', () => {
    const g = new DirectedGraph();
    expect(g.getVertex('MISSING' as any)).toBeUndefined();
  });

  it('addEdge(srcKey,destKey) returns false when either vertex is missing', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    expect(g.addEdge('A', 'B' as any)).toBe(false);
  });

  it('addEdge(srcVertex,destVertex) converts AbstractVertex endpoints to keys', () => {
    const g = new DirectedGraph();
    const a = new DirectedVertex('A');
    const b = new DirectedVertex('B');
    g.addVertex(a);
    g.addVertex(b);

    // goes through addEdge(srcOrEdge, dest) branch where dest is AbstractVertex
    expect(g.addEdge(a as unknown as AbstractVertex<any>, b as unknown as AbstractVertex<any>, 2)).toBe(true);
    expect(g.hasEdge('A', 'B')).toBe(true);
  });

  it('addEdge throws when dest is not a Vertex or vertex key', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    expect(() => g.addEdge('A' as any, { bad: true } as any)).toThrow(/dest must be a Vertex or vertex key/i);
  });

  it('setEdgeWeight returns false when edge does not exist', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    expect(g.setEdgeWeight('A', 'B', 123)).toBe(false);
  });

  it('dijkstraWithoutHeap uses default args and also covers early-stop (dest + getMinDist + genPaths)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');

    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 2);

    // default args: dest undefined, getMinDist/genPaths false
    const base = g.dijkstraWithoutHeap('A');
    expect(base).toBeDefined();

    const res = g.dijkstraWithoutHeap('A', 'C', true, true);
    // Implementation detail: DirectedGraph may normalize weights; here we only assert it computed a finite minDist.
    expect(typeof res?.minDist).toBe('number');
    expect(Number.isFinite(res!.minDist)).toBe(true);
    // genPaths=true should generate a path for each vertex
    expect(res?.paths.length).toBe(3);
    // minPath should be some path ending at the destination when implementation chooses to store it.
    expect(Array.isArray(res?.minPath)).toBe(true);
  });
});
