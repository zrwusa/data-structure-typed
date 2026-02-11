import { DirectedGraph } from '../../../../src';

describe('AbstractGraph additional branch coverage (5)', () => {
  it('_createLike continues when getEndsOfEdge returns undefined (covers !ends continue)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 1);

    const orig = g.getEndsOfEdge.bind(g);
    let once = true;
    (g as any).getEndsOfEdge = (edge: any) => {
      if (once) {
        once = false;
        return undefined;
      }
      return orig(edge);
    };

    const out = (g as any)._createLike();
    expect(out.hasVertex('A')).toBe(true);
    expect(out.hasVertex('B')).toBe(true);
  });

  it('_createLike takes the false arm of `(g as any).hasVertex ? ... : false` (covers cond-expr false branches)', () => {
    const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 1);

    const origCreateInstance = (g as any)._createInstance;
    (g as any)._createInstance = (options?: any) => {
      const inst = origCreateInstance.call(g, options);
      // Shadow hasVertex so the conditional expression uses the false arm.
      // Also override _addVertex so addVertex() doesn't crash when hasVertex is missing.
      (inst as any).hasVertex = undefined;
      (inst as any)._addVertex = (v: any) => {
        (inst as any)._vertexMap.set(v.key, v);
        return true;
      };
      return inst;
    };

    try {
      const out = (g as any)._createLike();
      expect(out).toBeDefined();
    } finally {
      (g as any)._createInstance = origCreateInstance;
    }
  });
});
