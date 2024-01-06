import { AbstractEdge, AbstractGraph, AbstractVertex, VertexKey } from '../../../../src';

class MyVertex<V = any> extends AbstractVertex<V> {
  data?: V;

  constructor(key: VertexKey, value?: V) {
    super(key, value);
    this.data = value;
  }
}

class MyEdge<E = any> extends AbstractEdge<E> {
  data?: E;
  src: VertexKey;
  dest: VertexKey;

  constructor(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, value?: E) {
    super(weight, value);
    this.src = srcOrV1;
    this.dest = destOrV2;
    this.data = value;
  }
}

class MyGraph<
  V = any,
  E = any,
  VO extends MyVertex<V> = MyVertex<V>,
  EO extends MyEdge<E> = MyEdge<E>
> extends AbstractGraph<V, E, VO, EO> {
  createVertex(key: VertexKey, value?: V): VO {
    return new MyVertex(key, value) as VO;
  }

  createEdge(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, value?: E): EO {
    return new MyEdge(srcOrV1, destOrV2, weight, value) as EO;
  }

  deleteEdge(edge: EO): EO | undefined {
    return edge;
  }

  getEdge(srcOrKey: VertexKey, destOrKey: VertexKey): EO | undefined {
    return new MyEdge(srcOrKey, destOrKey) as EO;
  }

  degreeOf(vertexOrKey: VO | VertexKey): number {
    return 1 ?? Number(vertexOrKey);
  }

  edgeSet(): EO[] {
    return [new MyEdge('a', 'b') as EO];
  }

  edgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const a = typeof vertexOrKey === 'string' ? vertexOrKey : 'a';
    return [new MyEdge(a, 'b') as EO];
  }

  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const a = typeof vertexOrKey === 'string' ? vertexOrKey : 'a';
    return [new MyVertex(a, 'b') as VO];
  }

  getEndsOfEdge(edge: EO): [VO, VO] | undefined {
    return edge ? undefined : undefined;
  }

  deleteVertex(vertexOrKey: VertexKey | VO): boolean {
    let vertexKey: VertexKey;
    if (this.isVertexKey(vertexOrKey)) {
      vertexKey = vertexOrKey;
    } else {
      vertexKey = vertexOrKey.key;
    }
    this._vertexMap.delete(vertexKey);
    return true;
  }

  isEmpty(): boolean {
    return true;
  }

  clear(): void {
  }

  clone(): any {
    return {};
  }

  protected _addEdge(edge: EO): boolean {
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
    vA!.value = vA?.value ?? 2;

    eAB!.value = eAB.value;
    const hs = eAB.hashCode;

    expect(hs.length).toBe(36);
  });
});
