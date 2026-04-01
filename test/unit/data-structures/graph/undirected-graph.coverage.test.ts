import { UndirectedEdge, UndirectedGraph } from '../../../../src';

describe('UndirectedGraph misc coverage', () => {
  describe('branch (batch 2)', () => {
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

  describe('branch', () => {
    it('createEdge falls back to hard-coded weight=1 when weight and defaultEdgeWeight are both undefined', () => {
      const g = new UndirectedGraph<string, any>();
      const e = g.createEdge('a', 'b');
      expect(e.weight).toBe(1);
    });

    it('getEdge returns undefined via edgeMap falsy branch when vertices exist but no edgeMap entry', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('a');
      g.addVertex('b');

      // No edge inserted => _edgeMap.get(vertex1) is undefined => edgeMap becomes undefined
      expect(g.getEdge('a', 'b')).toBeUndefined();
    });

    it('deleteEdgeBetween executes "|| undefined" fallback when v1Edges exists but no matching edge is found', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('a');
      g.addVertex('b');
      g.addVertex('c');

      // Create a--c edge so v1Edges exists for a, but there is no a--b edge.
      g.addEdge('a', 'c');

      expect(g.deleteEdgeBetween('a', 'b')).toBeUndefined();
    });

    it('deleteEdge(key, missingOtherKey) returns undefined via early return branch', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('a');
      g.addVertex('b');
      g.addEdge('a', 'b');

      expect(g.deleteEdge('a' as any, undefined as any)).toBeUndefined();
    });

    it('deleteVertex(vertexInstance) covers non-key input branch', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('a');

      const v = g.getVertex('a')!;
      expect(g.deleteVertex(v as any)).toBe(true);
      expect(g.hasVertex('a')).toBe(false);
    });

    it('degreeOf returns 0 via "|| 0" fallback when vertex exists but has no incident edges', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('solo');
      expect(g.degreeOf('solo')).toBe(0);
    });

    it('getEndsOfEdge returns undefined when hasEdge is true but endpoint lookup fails', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('a');
      g.addVertex('b');
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

    it('_addEdge returns false when _getVertex yields undefined for an endpoint (covers endVertex===undefined branch)', () => {
      const g = new UndirectedGraph<string, any>();
      g.addVertex('a');
      g.addVertex('b');

      const origGetVertex = (g as any)._getVertex;
      (g as any)._getVertex = () => undefined;
      try {
        expect((g as any)._addEdge(new UndirectedEdge('a', 'b', 1) as any)).toBe(false);
      } finally {
        (g as any)._getVertex = origGetVertex;
      }
    });
  });
});
