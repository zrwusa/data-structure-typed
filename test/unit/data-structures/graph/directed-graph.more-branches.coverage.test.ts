import { DirectedEdge, DirectedGraph } from '../../../../src';

describe('DirectedGraph additional branch coverage', () => {
  it('static fromKeys/fromEntries build graphs', () => {
    const g1 = DirectedGraph.fromKeys(['a', 'b']);
    expect(g1.hasVertex('a')).toBe(true);
    // value initializer behavior may vary; key must exist.
    expect(g1.getVertex('b')?.key).toBe('b');

    const g2 = DirectedGraph.fromEntries([
      ['x', 1],
      ['y', 2]
    ]);
    expect(g2.getVertex('x')?.value).toBe(1);
    expect(g2.getVertex('y')?.value).toBe(2);
  });

  it('deleteEdge(srcKey) returns undefined when destVertexKey is not a key', () => {
    const g = new DirectedGraph<string, number>();
    g.addVertex('a');
    g.addVertex('b');
    g.addEdge('a', 'b');

    expect(g.deleteEdge('a' as any, undefined as any)).toBeUndefined();
  });

  it('outgoingEdgesOf returns [] when target missing', () => {
    const g = new DirectedGraph<string, number>();
    expect(g.outgoingEdgesOf('missing' as any)).toEqual([]);
  });

  it('getDestinations(undefined) returns []', () => {
    const g = new DirectedGraph<string, number>();
    expect(g.getDestinations(undefined)).toEqual([]);
  });

  it('getEndsOfEdge returns undefined when edge missing, and when vertex lookup fails', () => {
    const g = new DirectedGraph<string, number>();
    g.addVertex('a');
    g.addVertex('b');

    const eMissing = new DirectedEdge('a', 'b', 1);
    expect(g.getEndsOfEdge(eMissing as any)).toBeUndefined();

    g.addEdge('a', 'b');
    const e = g.getEdge('a', 'b')!;

    // Corrupt internal vertex map so hasEdge stays true but _getVertex fails.
    const vm = (g as any)._vertexMap as Map<any, any>;
    const saved = vm.get('b');
    vm.delete('b');
    try {
      expect(g.getEndsOfEdge(e as any)).toBeUndefined();
    } finally {
      vm.set('b', saved);
    }
  });

  it('_addEdge returns false when vertices are missing, and when _getVertex returns undefined', () => {
    const g = new DirectedGraph<string, number>();

    // Missing vertices => early return false
    expect((g as any)._addEdge(new DirectedEdge('a', 'b', 1))).toBe(false);

    g.addVertex('a');
    g.addVertex('b');

    const origGetVertex = (g as any)._getVertex;
    (g as any)._getVertex = () => undefined;
    try {
      // hasVertex() is still true, but srcVertex/destVertex become undefined => else return false
      expect((g as any)._addEdge(new DirectedEdge('a', 'b', 1))).toBe(false);
    } finally {
      (g as any)._getVertex = origGetVertex;
    }
  });
});
