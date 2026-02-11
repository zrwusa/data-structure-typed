import { DirectedGraph } from '../../../../src';

describe('DirectedGraph remaining branch coverage (batch 2)', () => {
  it('createEdge falls back to weight=1 when weight and defaultEdgeWeight are both undefined', () => {
    const g = new DirectedGraph<string, any>();
    const e = g.createEdge('a', 'b');
    expect(e.weight).toBe(1);
  });

  it('deleteEdgeSrcToDest hits "[0] || undefined" fallback when inEdgeMap exists but no matching edge', () => {
    const g = new DirectedGraph<string, any>();
    g.addVertex('a');
    g.addVertex('b');
    g.addVertex('c');

    // Only add c->b, so b has an inEdge that does not match src=a
    g.addEdge('c', 'b');

    const removed = (g as any).deleteEdgeSrcToDest('a', 'b');
    expect(removed).toBeUndefined();
  });

  it('deleteEdgesBetween skips body when v1 or v2 is falsy (covers if(v1&&v2) false branch)', () => {
    const g = new DirectedGraph<string, any>();
    expect(g.deleteEdgesBetween(undefined as any, 'x' as any)).toEqual([]);
  });

  it('topologicalSort("key") covers mapping else-arm when sorted contains a raw key (not a DirectedVertex)', () => {
    const g = new DirectedGraph<string, any>();
    g.addVertex('a');

    // Corrupt vertexMap to include a non-DirectedVertex entry value.
    (g as any)._vertexMap.set('b', 'b');

    const sorted = g.topologicalSort('key') as any[];
    expect(sorted).toContain('b');
  });
});
