import { DirectedEdge, DirectedGraph } from '../../../../src';

describe('DirectedGraph misc coverage', () => {
  describe('branch (batch 2)', () => {
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

  describe('branch (batch 3)', () => {
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

  describe('branch', () => {
    it('static fromKeys/fromEntries build graphs (and exercises vertexValueInitializer body)', () => {
      const g1 = DirectedGraph.fromKeys(['a', 'b']);
      expect(g1.hasVertex('a')).toBe(true);
      // value initializer behavior may vary; key must exist.
      expect(g1.getVertex('b')?.key).toBe('b');

      // Force execution of the initializer function body (coverage line ~212).
      const init = (g1 as any).options?.vertexValueInitializer;
      if (typeof init === 'function') {
        expect(init('z')).toBe('z');
      }

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

    it('getEndsOfEdge returns undefined when edge missing, and hits the else-branch when endpoint lookup fails', () => {
      const g = new DirectedGraph<string, number>();
      g.addVertex('a');
      g.addVertex('b');

      const eMissing = new DirectedEdge('a', 'b', 1);
      expect(g.getEndsOfEdge(eMissing as any)).toBeUndefined();

      // Force hasEdge=true but _getVertex failure to hit the `else { return undefined; }` branch (coverage line ~568).
      const origHasEdge = (g as any).hasEdge;
      const origGetVertex = (g as any)._getVertex;
      (g as any).hasEdge = () => true;
      (g as any)._getVertex = () => undefined;
      try {
        expect(g.getEndsOfEdge(new DirectedEdge('a', 'b', 1) as any)).toBeUndefined();
      } finally {
        (g as any).hasEdge = origHasEdge;
        (g as any)._getVertex = origGetVertex;
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
});
