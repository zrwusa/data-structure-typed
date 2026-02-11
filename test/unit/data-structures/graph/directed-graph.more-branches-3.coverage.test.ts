import { DirectedGraph } from '../../../../src';

describe('DirectedGraph remaining branch coverage (batch 3)', () => {
  it('createEdge uses final fallback weight=1 when defaultEdgeWeight is explicitly undefined', () => {
    const g = new DirectedGraph<string, any>();

    // Force options.defaultEdgeWeight to be undefined so `weight ?? defaultEdgeWeight ?? 1` uses the final `1`.
    (g as any).options.defaultEdgeWeight = undefined;

    const e = g.createEdge('a', 'b');
    expect(e.weight).toBe(1);
  });

  it('deleteEdgesBetween pushes both directions when both edges exist (covers v2ToV1 truthy branch)', () => {
    const g = new DirectedGraph<string, any>();
    g.addVertex('a');
    g.addVertex('b');

    g.addEdge('a', 'b');
    g.addEdge('b', 'a');

    const removed = g.deleteEdgesBetween('a', 'b');
    expect(removed).toHaveLength(2);
  });
});
