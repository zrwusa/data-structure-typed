import {AbstractEdge, AbstractGraph, AbstractVertex, VertexKey} from '../../../../src';

class MyVertex<V = any> extends AbstractVertex<V> {
  data?: V;

  constructor(key: VertexKey, val?: V) {
    super(key, val);
    this.data = val;
  }
}

class MyEdge<E = any> extends AbstractEdge<E> {
  data?: E;
  src: VertexKey;
  dest: VertexKey;

  constructor(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, val?: E) {
    super(weight, val);
    this.src = srcOrV1;
    this.dest = destOrV2;
    this.data = val;
    this._setHashCode('');
  }
}

class MyGraph<
  V = any,
  E = any,
  VO extends MyVertex<V> = MyVertex<V>,
  EO extends MyEdge<E> = MyEdge<E>
> extends AbstractGraph<V, E, VO, EO> {
  createVertex(key: VertexKey, val?: V): VO {
    return new MyVertex(key, val) as VO;
  }

  createEdge(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, val?: E): EO {
    return new MyEdge(srcOrV1, destOrV2, weight, val) as EO;
  }

  deleteEdge(edge: EO): EO | null {
    return edge;
  }

  getEdge(srcOrKey: VertexKey, destOrKey: VertexKey): EO | null {
    return new MyEdge(srcOrKey, destOrKey) as EO;
  }

  degreeOf(vertexOrKey: VO | VertexKey): number {
    return 1 ?? Number(vertexOrKey);
  }

  edgeSet(): EO[] {
    return [new MyEdge('a', 'b') as EO];
  }

  edgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const a = typeof vertexOrKey === "string" ? vertexOrKey : "a";
    return [new MyEdge(a, 'b') as EO];
  }

  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const a = typeof vertexOrKey === "string" ? vertexOrKey : "a";
    return [new MyVertex(a, 'b') as VO];
  }

  getEndsOfEdge(edge: EO): [VO, VO] | null {
    return edge ? null : null;
  }

  protected _addEdgeOnly(edge: EO): boolean {
    return edge ? true : true;
  }
}

describe('AbstractGraph Operation Test', () => {
  const myGraph: MyGraph<number, string> = new MyGraph<number, string>();

  beforeEach(() => {
  });
  it('should edge cases', function () {
    myGraph.addVertex('A', 1);
    myGraph.addVertex('B', 2);
    myGraph.addVertex('C', 3);
    myGraph.addVertex('D', 4);

    const vA = myGraph.getVertex('A');
    // const vB = myGraph.getVertex('B');
    // const vC = myGraph.getVertex('C');
    // const vD = myGraph.getVertex('D');

    const eAB = new MyEdge('A', 'B');
    // const eBC = new MyEdge('B', 'C');
    // const eCD = new MyEdge('C', 'D');
    vA!.key = vA?.key || 1;
    vA!.val = vA?.val ?? 2;

    eAB!.val = eAB.val;
    const hs = eAB.hashCode;

    expect(hs).toBe('');
  });
});
