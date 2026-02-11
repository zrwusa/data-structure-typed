import { UndirectedGraph } from '../../../../src';

describe('UndirectedGraph remaining branch coverage (batch 2)', () => {
  it('createEdge uses final fallback weight=1 when defaultEdgeWeight is explicitly undefined', () => {
    const g = new UndirectedGraph<string, any>();
    (g as any).options.defaultEdgeWeight = undefined;

    const e = g.createEdge('a', 'b');
    expect(e.weight).toBe(1);
  });

  it('getEndsOfEdge hits else-return branch when hasEdge=true but endpoint vertex is missing', () => {
    const g = new UndirectedGraph<string, any>();
    g.addVertex('a');
    g.addVertex('b');

    const edge = g.createEdge('a', 'b');

    const origHasEdge = (g as any).hasEdge;
    const origGetVertex = (g as any)._getVertex;

    (g as any).hasEdge = () => true;
    (g as any)._getVertex = (key: any) => {
      if (key === 'a') return undefined;
      return origGetVertex.call(g, key);
    };

    try {
      expect(g.getEndsOfEdge(edge as any)).toBeUndefined();
    } finally {
      (g as any).hasEdge = origHasEdge;
      (g as any)._getVertex = origGetVertex;
    }
  });
});
