import { DirectedEdge, DirectedGraph, DirectedVertex, VertexKey } from '../../../../src';

describe('DirectedGraph Operation Test', () => {
  let graph: DirectedGraph;

  beforeEach(() => {
    graph = new DirectedGraph();
  });

  it('should add vertexMap', () => {
    const vertex1 = new DirectedVertex('A');
    const vertex2 = new DirectedVertex('B');

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);

    expect(graph.hasVertex(vertex1)).toBe(true);
    expect(graph.hasVertex(vertex2)).toBe(true);
  });

  it('should add edges', () => {
    const vertex1 = new DirectedVertex('A');
    const vertex2 = new DirectedVertex('B');
    const edge = new DirectedEdge('A', 'B');
    edge.src = edge.src;
    edge.dest = edge.dest;

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addEdge(edge);

    expect(graph.outEdgeMap.size).toBe(1);
    expect(graph.inEdgeMap.size).toBe(1);
    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(false);
  });

  it('should delete edges', () => {
    const vertex1 = new DirectedVertex('A');
    // const vertex2 = new DirectedVertex('B');
    graph.createVertex('B');
    const edge = new DirectedEdge('A', 'B');

    graph.addVertex(vertex1);
    graph.addVertex('B');
    graph.addEdge(edge);

    expect(graph.deleteEdge(edge)).toBe(edge);
    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('should perform topological sort', () => {
    const vertexA = new DirectedVertex('A');
    const vertexB = new DirectedVertex('B');
    const vertexC = new DirectedVertex('C');
    const edgeAB = new DirectedEdge('A', 'B');
    graph.createEdge('B', 'C');

    graph.addVertex(vertexA);
    graph.addVertex(vertexB);
    graph.addVertex(vertexC);
    graph.addEdge(edgeAB);
    graph.addEdge('B', 'C');

    expect(graph.getEdgeSrc(edgeAB)).toBe(vertexA);

    const topologicalOrder = graph.topologicalSort();
    if (topologicalOrder) expect(topologicalOrder).toEqual(['A', 'B', 'C']);

    graph.deleteEdgesBetween('A', 'B');

    const topologicalOrder1 = graph.topologicalSort();
    if (topologicalOrder1) expect(topologicalOrder1).toEqual(['B', 'C', 'A']);

    expect(graph.incomingEdgesOf(vertexC)?.length).toBe(1);
    expect(graph.degreeOf(vertexA)).toBe(0);
    expect(graph.inDegreeOf(vertexC)).toBe(1);
    expect(graph.outDegreeOf(vertexC)).toBe(0);
    expect(graph.edgesOf(vertexC)?.length).toBe(1);

    expect(graph.tarjan().dfnMap.size).toBe(3);
    expect(graph.bellmanFord(vertexC, true, true, true)?.paths.length).toBe(3);
    expect(graph.getMinPathBetween('B', 'C', true)?.length).toBe(2);
    expect(graph.setEdgeWeight('B', 'C', 100)).toBe(true);
    expect(graph.getMinCostBetween('B', 'C', true)).toBe(100);
    expect(graph.getMinCostBetween('B', 'C')).toBe(1);
    expect(graph.getAllPathsBetween('B', 'C')?.length).toBe(1);
    expect(graph.deleteVertex(vertexB)).toBe(true);
    expect(graph.getAllPathsBetween('B', 'C')?.length).toBe(0);

    expect(graph.removeManyVertices([vertexB, vertexC])).toBe(true);
  });
});

class MyVertex<V = any> extends DirectedVertex<V> {
  constructor(key: VertexKey, value?: V) {
    super(key, value);
    this._data = value;
  }

  protected _data: V | undefined;

  get data(): V | undefined {
    return this._data;
  }

  set data(value: V | undefined) {
    this._data = value;
  }
}

class MyEdge<E = any> extends DirectedEdge<E> {
  constructor(v1: VertexKey, v2: VertexKey, weight?: number, value?: E) {
    super(v1, v2, weight, value);
    this._data = value;
  }

  protected _data: E | undefined;

  get data(): E | undefined {
    return this._data;
  }

  set data(value: E | undefined) {
    this._data = value;
  }
}

class MyDirectedGraph<
  V = any,
  E = any,
  VO extends MyVertex<V> = MyVertex<V>,
  EO extends MyEdge<E> = MyEdge<E>
> extends DirectedGraph<V, E, VO, EO> {
  override createVertex(key: VertexKey, value: V): VO {
    return new MyVertex(key, value) as VO;
  }

  override createEdge(src: VertexKey, dest: VertexKey, weight?: number, value?: E): EO {
    return new MyEdge(src, dest, weight ?? 1, value) as EO;
  }

  setInEdgeMap(value: Map<VO, EO[]>) {
    this._inEdgeMap = value;
  }

  setOutEdgeMap(value: Map<VO, EO[]>) {
    this._outEdgeMap = value;
  }
}

describe('Inherit from DirectedGraph and perform operations', () => {
  let myGraph = new MyDirectedGraph<string, string>();
  beforeEach(() => {
    myGraph = new MyDirectedGraph();
  });

  it('Add vertexMap', () => {
    myGraph.addVertex(1, 'data1');
    myGraph.addVertex(2, 'data2');
    myGraph.addVertex(3, 'data3');
    myGraph.addVertex(4, 'data4');
    myGraph.addVertex(5, 'data5');
    myGraph.addVertex(new MyVertex(6, 'data6'));
    myGraph.addVertex(new MyVertex(7, 'data7'));
    myGraph.addVertex(new MyVertex(8, 'data8'));
    myGraph.addVertex(new MyVertex(9, 'data9'));
  });

  it('Add edges', () => {
    myGraph.addVertex(1, 'data1');
    myGraph.addVertex(2, 'data2');
    myGraph.addEdge(1, 2, 10, 'edge-data1-2');
    myGraph.addEdge(new MyEdge(2, 1, 20, 'edge-data2-1'));
    myGraph.setInEdgeMap(myGraph.inEdgeMap);
    myGraph.setOutEdgeMap(myGraph.outEdgeMap);

    expect(myGraph.edgeSet().length).toBe(2);
    // TODO
    expect(myGraph.getEdge(1, 2)).toBeInstanceOf(MyEdge);
    expect(myGraph.getEdge(2, 1)).toBeInstanceOf(MyEdge);
  });

  it('Get edge', () => {
    myGraph.addVertex(1, 'val1');
    myGraph.addVertex(2, 'val1');
    myGraph.addEdge(1, 2, 1, 'val1');
    const edge1 = myGraph.getEdge(1, 2);
    const edge2 = myGraph.getEdge(myGraph.getVertex(1), myGraph.getVertex(2));
    const edge3 = myGraph.getEdge(1, '100');
    // edge1.data has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(edge1).toBeInstanceOf(MyEdge);
    if (edge1) {
      expect(edge1.data).toBe('val1');
      expect(edge1?.value).toBe('val1');
      expect(edge1).toBeInstanceOf(MyEdge);
      expect(edge1.src).toBe(1);
      expect(edge1).toEqual(edge2);
      expect(edge3).toBe(undefined);
    }
  });

  it('Edge set and vertex set', () => {
    expect(true).toBeTruthy();
  });

  it('Remove edge between vertexMap', () => {
    myGraph.addVertex(1, 'data1');
    myGraph.addVertex(2, 'data2');
    myGraph.addEdge(1, 2, 10, 'edge-data1-2');

    const removedEdge = myGraph.deleteEdgeSrcToDest(1, 2);
    const edgeAfterRemoval = myGraph.getEdge(1, 2);

    expect(removedEdge).toBeInstanceOf(MyEdge);
    if (removedEdge) {
      removedEdge && expect(removedEdge.value).toBe('edge-data1-2');
      removedEdge && expect(removedEdge.src).toBe(1);
    }
    expect(edgeAfterRemoval).toBe(undefined);
  });

  it('Topological sort', () => {
    const sorted = myGraph.topologicalSort();

    expect(sorted).toBeInstanceOf(Array);
    if (sorted && sorted.length > 0) {
      expect(sorted.length).toBe(9);
      if (sorted[0] instanceof MyVertex) expect(sorted[0].data).toBe('data9');
      sorted[3] instanceof MyVertex && expect(sorted[3].data).toBe('data6');
      sorted[8] instanceof MyVertex && expect(sorted[8].key).toBe(1);
    }
  });

  it('Minimum path between vertexMap', () => {
    myGraph.addVertex(new MyVertex(1, 'data1'));
    myGraph.addVertex(new MyVertex(2, 'data2'));
    myGraph.addEdge(new MyEdge(1, 2, 10, 'edge-data1-2'));
  });

  it('All paths between vertexMap', () => {
    // Add vertexMap and edges as needed for this test
    myGraph.addVertex(new MyVertex(1, 'data1'));
    myGraph.addVertex(new MyVertex(2, 'data2'));
    myGraph.addEdge(new MyEdge(1, 2, 10, 'edge-data1-2'));

    // Add expect statements here to verify the allPaths
  });
});

describe('Inherit from DirectedGraph and perform operations test2.', () => {
  const myGraph = new MyDirectedGraph<string, string>();

  it('should test graph operations', () => {
    const vertex1 = new MyVertex(1, 'data1');
    const vertex2 = new MyVertex(2, 'data2');
    const vertex3 = new MyVertex(3, 'data3');
    const vertex4 = new MyVertex(4, 'data4');
    const vertex5 = new MyVertex(5, 'data5');
    const vertex6 = new MyVertex(6, 'data6');
    const vertex7 = new MyVertex(7, 'data7');
    const vertex8 = new MyVertex(8, 'data8');
    const vertex9 = new MyVertex(9, 'data9');
    myGraph.addVertex(vertex1);
    myGraph.addVertex(vertex2);
    myGraph.addVertex(vertex3);
    myGraph.addVertex(vertex4);
    myGraph.addVertex(vertex5);
    myGraph.addVertex(vertex6);
    myGraph.addVertex(vertex7);
    myGraph.addVertex(vertex8);
    myGraph.addVertex(vertex9);

    myGraph.addEdge(new MyEdge(1, 2, 10, 'edge-data1-2'));
    myGraph.addEdge(new MyEdge(2, 1, 20, 'edge-data2-1'));

    expect(myGraph.getEdge(1, 2)).toBeTruthy();
    expect(myGraph.getEdge(2, 1)).toBeTruthy();
    expect(myGraph.getEdge(1, '100')).toBeFalsy();

    myGraph.deleteEdgeSrcToDest(1, 2);
    expect(myGraph.getEdge(1, 2)).toBeFalsy();

    myGraph.addEdge(3, 1, 3, 'edge-data-3-1');

    myGraph.addEdge(1, 9, 19, 'edge-data1-9');

    myGraph.addEdge(9, 7, 97, 'edge-data9-7');

    myGraph.addEdge(7, 9, 79, 'edge-data7-9');

    myGraph.addEdge(1, 4, 14, 'edge-data1-4');

    myGraph.addEdge(4, 7, 47, 'edge-data4-7');

    myGraph.addEdge(1, 2, 12, 'edge-data1-2');

    myGraph.addEdge(2, 3, 23, 'edge-data2-3');

    myGraph.addEdge(3, 5, 35, 'edge-data3-5');

    myGraph.addEdge(5, 7, 57, 'edge-data5-7');

    myGraph.addEdge(new MyEdge(7, 3, 73, 'edge-data7-3'));
    const topologicalSorted = myGraph.topologicalSort();
    expect(topologicalSorted).toBe(undefined);

    const minPath1to7 = myGraph.getMinPathBetween(1, 7);

    expect(minPath1to7).toBeInstanceOf(Array);
    if (minPath1to7 && minPath1to7.length > 0) {
      expect(minPath1to7).toHaveLength(3);
      expect(minPath1to7[0]).toBeInstanceOf(MyVertex);
      expect(minPath1to7[0].key).toBe(1);
      expect(minPath1to7[1].key).toBe(9);
      expect(minPath1to7[2].key).toBe(7);
    }

    const fordResult1 = myGraph.bellmanFord(1);
    expect(fordResult1).toBeTruthy();
    expect(fordResult1.hasNegativeCycle).toBeUndefined();
    const { distMap, preMap, paths, min, minPath } = fordResult1;
    expect(distMap).toBeInstanceOf(Map);
    expect(distMap.size).toBe(9);
    expect(distMap.get(vertex1)).toBe(0);
    expect(distMap.get(vertex2)).toBe(12);
    expect(distMap.get(vertex3)).toBe(35);
    expect(distMap.get(vertex4)).toBe(14);
    expect(distMap.get(vertex5)).toBe(70);
    expect(distMap.get(vertex6)).toBe(Infinity);
    expect(distMap.get(vertex7)).toBe(61);
    expect(distMap.get(vertex8)).toBe(Infinity);
    expect(distMap.get(vertex9)).toBe(19);

    expect(preMap).toBeInstanceOf(Map);
    expect(preMap.size).toBe(0);

    expect(paths).toBeInstanceOf(Array);
    expect(paths.length).toBe(0);
    expect(min).toBe(Infinity);
    expect(minPath).toBeInstanceOf(Array);

    const floydResult = myGraph.floydWarshall();
    expect(floydResult).toBeTruthy();
    if (floydResult) {
      const { costs, predecessor } = floydResult;
      expect(costs).toBeInstanceOf(Array);
      expect(costs.length).toBe(9);
      expect(costs[0]).toEqual([32, 12, 35, 14, 70, Infinity, 61, Infinity, 19]);
      expect(costs[1]).toEqual([20, 32, 23, 34, 58, Infinity, 81, Infinity, 39]);
      expect(costs[2]).toEqual([3, 15, 38, 17, 35, Infinity, 64, Infinity, 22]);
      expect(costs[3]).toEqual([123, 135, 120, 137, 155, Infinity, 47, Infinity, 126]);
      expect(costs[4]).toEqual([133, 145, 130, 147, 165, Infinity, 57, Infinity, 136]);
      expect(costs[5]).toEqual([
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity
      ]);
      expect(costs[6]).toEqual([76, 88, 73, 90, 108, Infinity, 137, Infinity, 79]);
      expect(costs[7]).toEqual([
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity
      ]);
      expect(costs[8]).toEqual([173, 185, 170, 187, 205, Infinity, 97, Infinity, 176]);

      expect(predecessor).toBeInstanceOf(Array);
      expect(predecessor.length).toBe(9);
      expect(predecessor[0]).toEqual([
        vertex2,
        undefined,
        vertex2,
        undefined,
        vertex3,
        undefined,
        vertex4,
        undefined,
        undefined
      ]);
      expect(predecessor[1]).toEqual([
        undefined,
        vertex1,
        undefined,
        vertex1,
        vertex3,
        undefined,
        vertex4,
        undefined,
        vertex1
      ]);
      expect(predecessor[5]).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ]);
      expect(predecessor[7]).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ]);
      expect(predecessor[8]).toEqual([
        vertex7,
        vertex7,
        vertex7,
        vertex7,
        vertex7,
        undefined,
        undefined,
        undefined,
        vertex7
      ]);
    }

    const dijkstraRes12tt = myGraph.dijkstra(1, 2, true, true);

    expect(dijkstraRes12tt).toBeTruthy();
    if (dijkstraRes12tt) {
      const { distMap, minDist, minPath, paths } = dijkstraRes12tt;
      expect(distMap).toBeInstanceOf(Map);
      expect(distMap.size).toBe(9);
      expect(distMap.get(vertex1)).toBe(0);
      expect(distMap.get(vertex2)).toBe(12);
      expect(distMap.get(vertex3)).toBe(Infinity);
      expect(distMap.get(vertex4)).toBe(14);
      expect(distMap.get(vertex5)).toBe(Infinity);
      expect(distMap.get(vertex6)).toBe(Infinity);
      expect(distMap.get(vertex7)).toBe(Infinity);
      expect(distMap.get(vertex8)).toBe(Infinity);
      expect(distMap.get(vertex9)).toBe(19);

      expect(minDist).toBe(12);
      expect(minPath).toBeInstanceOf(Array);
      expect(minPath.length).toBe(2);
      expect(minPath[0]).toBe(vertex1);
      expect(minPath[1]).toBe(vertex2);

      expect(paths).toBeInstanceOf(Array);
      expect(paths.length).toBe(9);
      expect(paths[0]).toBeInstanceOf(Array);
      expect(paths[0][0]).toBe(vertex1);

      expect(paths[1]).toBeInstanceOf(Array);
      expect(paths[1][0]).toBe(vertex1);
      expect(paths[1][1]).toBe(vertex2);

      expect(paths[2]).toBeInstanceOf(Array);
      expect(paths[2][0]).toBe(vertex3);
      expect(paths[3]).toBeInstanceOf(Array);
      expect(paths[3][0]).toBe(vertex1);
      expect(paths[3][1]).toBe(vertex4);
      expect(paths[4]).toBeInstanceOf(Array);
      expect(paths[4][0]).toBe(vertex5);

      expect(paths[5]).toBeInstanceOf(Array);
      expect(paths[5][0]).toBe(vertex6);
      expect(paths[6]).toBeInstanceOf(Array);
      expect(paths[6][0]).toBe(vertex7);
      expect(paths[7]).toBeInstanceOf(Array);
      expect(paths[7][0]).toBe(vertex8);
      expect(paths[8]).toBeInstanceOf(Array);
      expect(paths[8][0]).toBe(vertex1);
      expect(paths[8][1]).toBe(vertex9);
    }

    const dijkstraRes1ntt = myGraph.dijkstra(1, undefined, true, true);

    expect(dijkstraRes1ntt).toBeTruthy();
    if (dijkstraRes1ntt) {
      const { distMap, minDist, minPath, paths } = dijkstraRes1ntt;
      expect(distMap).toBeInstanceOf(Map);
      expect(distMap.size).toBe(9);
      expect(distMap.get(vertex1)).toBe(0);
      expect(distMap.get(vertex2)).toBe(12);
      expect(distMap.get(vertex3)).toBe(35);
      expect(distMap.get(vertex4)).toBe(14);
      expect(distMap.get(vertex5)).toBe(70);
      expect(distMap.get(vertex6)).toBe(Infinity);
      expect(distMap.get(vertex7)).toBe(61);
      expect(distMap.get(vertex8)).toBe(Infinity);
      expect(distMap.get(vertex9)).toBe(19);

      expect(minDist).toBe(12);
      expect(minPath).toBeInstanceOf(Array);
      expect(minPath.length).toBe(2);
      expect(minPath[0]).toBe(vertex1);
      expect(minPath[1]).toBe(vertex2);

      expect(paths).toBeInstanceOf(Array);
      expect(paths.length).toBe(9);
      expect(paths[0]).toBeInstanceOf(Array);
      expect(paths[0][0]).toBe(vertex1);

      expect(paths[1]).toBeInstanceOf(Array);
      expect(paths[1][0]).toBe(vertex1);
      expect(paths[1][1]).toBe(vertex2);

      expect(paths[2]).toBeInstanceOf(Array);
      expect(paths[2][0]).toBe(vertex1);
      expect(paths[2][1]).toBe(vertex2);
      expect(paths[2][2]).toBe(vertex3);

      expect(paths[3]).toBeInstanceOf(Array);
      expect(paths[3][0]).toBe(vertex1);
      expect(paths[3][1]).toBe(vertex4);

      expect(paths[4]).toBeInstanceOf(Array);
      expect(paths[4][0]).toBe(vertex1);
      expect(paths[4][1]).toBe(vertex2);
      expect(paths[4][2]).toBe(vertex3);
      expect(paths[4][3]).toBe(vertex5);

      expect(paths[5]).toBeInstanceOf(Array);
      expect(paths[5][0]).toBe(vertex6);

      expect(paths[6]).toBeInstanceOf(Array);
      expect(paths[6][0]).toBe(vertex1);
      expect(paths[6][1]).toBe(vertex4);
      expect(paths[6][2]).toBe(vertex7);

      expect(paths[7]).toBeInstanceOf(Array);
      expect(paths[7][0]).toBe(vertex8);

      expect(paths[8]).toBeInstanceOf(Array);
      expect(paths[8][0]).toBe(vertex1);
      expect(paths[8][1]).toBe(vertex9);
    }

    const dijkstraWithoutHeapRes1ntt = myGraph.dijkstraWithoutHeap(1, undefined, true, true);
    expect(dijkstraWithoutHeapRes1ntt).toBeTruthy();
    if (dijkstraWithoutHeapRes1ntt) {
      const { distMap, minDist, minPath, paths } = dijkstraWithoutHeapRes1ntt;
      expect(distMap).toBeInstanceOf(Map);
      expect(distMap.size).toBe(9);
      expect(distMap.get(vertex1)).toBe(0);
      expect(distMap.get(vertex2)).toBe(12);
      expect(distMap.get(vertex3)).toBe(35);
      expect(distMap.get(vertex4)).toBe(14);
      expect(distMap.get(vertex5)).toBe(70);
      expect(distMap.get(vertex6)).toBe(Infinity);
      expect(distMap.get(vertex7)).toBe(61);
      expect(distMap.get(vertex8)).toBe(Infinity);
      expect(distMap.get(vertex9)).toBe(19);

      expect(minDist).toBe(12);
      expect(minPath).toBeInstanceOf(Array);
      expect(minPath.length).toBe(2);
      expect(minPath[0]).toBe(vertex1);
      expect(minPath[1]).toBe(vertex2);

      expect(paths).toBeInstanceOf(Array);
      expect(paths.length).toBe(9);
      expect(paths[0]).toBeInstanceOf(Array);
      expect(paths[0][0]).toBe(vertex1);

      expect(paths[1]).toBeInstanceOf(Array);
      expect(paths[1][0]).toBe(vertex1);
      expect(paths[1][1]).toBe(vertex2);

      expect(paths[2]).toBeInstanceOf(Array);
      expect(paths[2][0]).toBe(vertex1);
      expect(paths[2][1]).toBe(vertex2);
      expect(paths[2][2]).toBe(vertex3);

      expect(paths[3]).toBeInstanceOf(Array);
      expect(paths[3][0]).toBe(vertex1);
      expect(paths[3][1]).toBe(vertex4);

      expect(paths[4]).toBeInstanceOf(Array);
      expect(paths[4][0]).toBe(vertex1);
      expect(paths[4][1]).toBe(vertex2);
      expect(paths[4][2]).toBe(vertex3);
      expect(paths[4][3]).toBe(vertex5);

      expect(paths[5]).toBeInstanceOf(Array);
      expect(paths[5][0]).toBe(vertex6);

      expect(paths[6]).toBeInstanceOf(Array);
      expect(paths[6][0]).toBe(vertex1);
      expect(paths[6][1]).toBe(vertex4);
      expect(paths[6][2]).toBe(vertex7);

      expect(paths[7]).toBeInstanceOf(Array);
      expect(paths[7][0]).toBe(vertex8);

      expect(paths[8]).toBeInstanceOf(Array);
      expect(paths[8][0]).toBe(vertex1);
      expect(paths[8][1]).toBe(vertex9);
    }
  });
});

describe('cycles, strongly connected components, bridges, articular points in DirectedGraph', () => {
  const graph = new DirectedGraph();
  graph.addVertex('A');
  graph.addVertex('B');
  graph.addVertex('C');
  graph.addVertex('D');
  graph.addVertex('E');
  graph.addVertex('F');
  graph.addVertex('G');
  graph.addVertex('H');
  graph.addEdge('A', 'B');
  graph.addEdge('B', 'D');
  graph.addEdge('D', 'C');
  graph.addEdge('C', 'A');
  graph.addEdge('C', 'B');
  graph.addEdge('D', 'E');
  graph.addEdge('E', 'G');
  graph.addEdge('E', 'H');
  graph.addEdge('H', 'F');
  const cycles = graph.getCycles();
  const scCs = graph.getSCCs();
  // const bridges = graph.getBridges();
  // const cutVertices = graph.getCutVertices();
  const dfnMap = graph.getDFNMap();
  const lowMap = graph.getLowMap();
  expect(cycles.length).toBe(2);
  expect(scCs.size).toBe(5);
  // expect(bridges.length).toBe(4);
  // expect(cutVertices.length).toBe(4);
  expect(dfnMap.size).toBe(8);
  expect(lowMap.size).toBe(8);
});

describe('DirectedGraph iterative Methods', () => {
  let graph: DirectedGraph<string>;
  let vertexMap: string[];

  beforeEach(() => {
    graph = new DirectedGraph();
    vertexMap = ['A', 'B', 'C', 'D'];
    vertexMap.forEach(vertex => graph.addVertex(vertex));
  });

  test('[Symbol.iterator] should iterate over all vertexMap', () => {
    const iteratedVertices = [];
    for (const vertex of graph) {
      iteratedVertices.push(vertex[0]);
    }
    expect(iteratedVertices).toEqual(vertexMap);
  });

  test('forEach should apply a function to each vertex', () => {
    const result: VertexKey[] = [];
    graph.forEach((value, key) => key && result.push(key));
    expect(result).toEqual(vertexMap);
  });

  test('filter should return vertexMap that satisfy the condition', () => {
    const filtered = graph.filter((value, vertex) => vertex === 'A' || vertex === 'B');
    expect(filtered).toEqual([
      ['A', undefined],
      ['B', undefined]
    ]);
  });

  test('map should apply a function to each vertex and return a new array', () => {
    const mapped = graph.map((value, vertex) => vertex + '_mapped');
    expect(mapped).toEqual(vertexMap.map(v => v + '_mapped'));
  });

  test('reduce should accumulate a value based on each vertex', () => {
    const concatenated = graph.reduce((acc, value, key) => acc + key, '');
    expect(concatenated).toBe(vertexMap.join(''));
  });

  test('Removing an edge of a DirectedGraph should delete additional edges', () => {
    const dg = new DirectedGraph();
    dg.addVertex('hello');
    dg.addVertex('hi');
    dg.addVertex('hey');
    dg.addEdge('hello', 'hi');
    dg.addEdge('hello', 'hey');
    expect(dg.getEdge('hello', 'hi')?.src).toBe('hello');
    expect(dg.getEdge('hello', 'hi')?.dest).toBe('hi');
    expect(dg.getEdge('hello', 'hey')?.src).toBe('hello');
    expect(dg.getEdge('hello', 'hey')?.dest).toBe('hey');
    dg.deleteEdge('hello', 'hi');
    expect(dg.getEdge('hello', 'hi')).toBe(undefined);
    expect(dg.getEdge('hello', 'hey')).toBeInstanceOf(DirectedEdge);
    expect(dg.incomingEdgesOf('Hi')).toEqual([]);
  });

  test('Removing a vertex of a DirectedGraph should delete additional edges', () => {
    const graph = new DirectedGraph();

    graph.addVertex('Hello');
    graph.addVertex('Hi');

    graph.addEdge('Hello', 'Hi');
    graph.deleteVertex('Hello');

    expect(graph.incomingEdgesOf('Hi')).toEqual([]);
  });

  test('Removing a vertex from a DirectedGraph should remove its edges', () => {
    const dg = new DirectedGraph();
    dg.addVertex('hello');
    dg.addVertex('world');
    dg.addVertex('earth');

    dg.addEdge('hello', 'world');
    dg.addEdge('hello', 'earth');
    dg.addEdge('world', 'earth');

    expect(dg.getEdge('hello', 'world')?.src).toBe('hello');
    expect(dg.edgeSet().length).toBe(3);
    expect(dg.edgeSet()[0].dest).toBe('world');

    dg.deleteVertex('hello');
    expect(dg.edgeSet().length).toBe(1);
    expect(dg.edgeSet()?.[0].src).toBe('world');

    expect(dg.getEdge('hello', 'world')).toBe(undefined);
  });
});

describe('DirectedGraph getCycles', () => {
  test('should getCycles return correct result', () => {
    const graph = new DirectedGraph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'E');
    graph.addEdge('E', 'B');
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(1);
    expect(cycles[0]).toEqual(['B', 'D', 'E']);
  });

  test('should simple cycles graph getCycles return correct result', () => {
    const graph = new DirectedGraph();

    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');
    graph.addEdge('A', 'D');
    graph.addEdge('D', 'C');
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(2);
    expect(cycles).toEqual([
      ['A', 'B', 'C'],
      ['A', 'D', 'C']
    ]);
  });

  test('should 3 cycles graph getCycles return correct result', () => {
    const graph = new DirectedGraph();

    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addVertex('F');
    graph.addVertex('G');

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'E');
    graph.addEdge('E', 'B');
    graph.addEdge('B', 'F');
    graph.addEdge('F', 'E');
    graph.addEdge('C', 'G');
    graph.addEdge('G', 'A');

    const cycles = graph.getCycles();
    expect(cycles.length).toBe(3);
    expect(cycles).toEqual([
      ['A', 'C', 'G'],
      ['B', 'D', 'E'],
      ['B', 'F', 'E']
    ]);
  });
});

describe('DirectedGraph tarjan', () => {
  test('should simple cycles graph tarjan cycles return correct result', () => {
    const graph = new DirectedGraph();

    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');
    graph.addEdge('A', 'D');
    graph.addEdge('D', 'C');
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(2);
    expect(cycles).toEqual([
      ['A', 'B', 'C'],
      ['A', 'D', 'C']
    ]);
  });

  function getAsVerticesArrays(vss: Map<number, DirectedVertex<any>[]>) {
    return [...vss.values()].map(vs => vs.map(vertex => vertex.key));
  }

  function createExampleGraph1() {
    const graph = new DirectedGraph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'E');
    graph.addEdge('E', 'B');
    return graph;
  }

  test('should tarjan cycles return correct result', () => {
    const graph = createExampleGraph1();
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(1);
    expect(cycles).toEqual([['B', 'D', 'E']]);
  });

  test('should tarjan SCCs return correct result', () => {
    const graph = createExampleGraph1();
    const sccs = graph.tarjan().SCCs;
    expect(sccs.size).toBe(3);
    expect(getAsVerticesArrays(sccs)).toEqual([['E', 'D', 'B'], ['C'], ['A']]);
  });

  function createExampleGraph2() {
    const graph = createExampleGraph1();
    graph.addVertex('F');
    graph.addVertex('G');
    graph.addEdge('B', 'F');
    graph.addEdge('F', 'E');
    graph.addEdge('C', 'G');
    graph.addEdge('G', 'A');
    return graph;
  }

  test('should 3 cycles graph tarjan cycles return correct result', () => {
    const graph = createExampleGraph2();
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(3);
    expect(cycles).toEqual([
      ['A', 'C', 'G'],
      ['B', 'D', 'E'],
      ['B', 'F', 'E']
    ]);
  });

  test('should 3 cycles graph tarjan SCCs return correct result', () => {
    const graph = createExampleGraph2();
    const sccs = graph.tarjan().SCCs;
    expect(sccs.size).toBe(2);
    expect(getAsVerticesArrays(sccs)).toEqual([
      ['F', 'E', 'D', 'B'],
      ['G', 'C', 'A']
    ]);
  });

  function createExampleGraph3() {
    const graph = new DirectedGraph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.addVertex('E');
    graph.addVertex('F');
    graph.addVertex('G');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'B');
    graph.addEdge('A', 'E');
    graph.addEdge('E', 'F');
    graph.addEdge('F', 'G');
    graph.addEdge('G', 'E');
    return graph;
  }

  test('should cuttable graph tarjan cycles return correct result', () => {
    const graph = createExampleGraph3();
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(2);
    expect(cycles).toEqual([
      ['B', 'C', 'D'],
      ['E', 'F', 'G']
    ]);
  });

  test('should cuttable graph tarjan SCCs return correct result', () => {
    const graph = createExampleGraph3();
    const sccs = graph.tarjan().SCCs;
    expect(sccs.size).toBe(3);
    expect(getAsVerticesArrays(sccs)).toEqual([['D', 'C', 'B'], ['G', 'F', 'E'], ['A']]);
  });

  function createExampleGraph4() {
    const graph = createExampleGraph3();
    graph.addVertex('H');
    graph.addVertex('I');
    graph.addVertex('J');
    graph.addVertex('K');
    graph.addEdge('C', 'H');
    graph.addEdge('H', 'I');
    graph.addEdge('I', 'D');
    graph.addEdge('H', 'J');
    graph.addEdge('J', 'K');
    graph.addEdge('K', 'H');
    return graph;
  }

  test('should more cuttable graph tarjan cycles return correct result', () => {
    const graph = createExampleGraph4();
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(4);
    expect(cycles).toEqual([
      ['B', 'C', 'D'],
      ['B', 'C', 'H', 'I', 'D'],
      ['E', 'F', 'G'],
      ['H', 'J', 'K']
    ]);
  });

  test('should more cuttable graph tarjan SCCs return correct result', () => {
    const graph = createExampleGraph4();
    const sccs = graph.tarjan().SCCs;
    expect(sccs.size).toBe(3);
    expect(getAsVerticesArrays(sccs)).toEqual([['K', 'J', 'I', 'H', 'D', 'C', 'B'], ['G', 'F', 'E'], ['A']]);
  });

  function createExampleGraph5() {
    const graph = createExampleGraph4();
    graph.addEdge('F', 'H');
    return graph;
  }

  test('should uncuttable graph tarjan cycles return correct result', () => {
    const graph = createExampleGraph5();
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(4);
    expect(cycles).toEqual([
      ['B', 'C', 'D'],
      ['B', 'C', 'H', 'I', 'D'],
      ['E', 'F', 'G'],
      ['H', 'J', 'K']
    ]);
  });

  test('should uncuttable graph tarjan SCCs return correct result', () => {
    const graph = createExampleGraph5();
    const sccs = graph.tarjan().SCCs;
    expect(sccs.size).toBe(3);
    expect(getAsVerticesArrays(sccs)).toEqual([['K', 'J', 'I', 'H', 'D', 'C', 'B'], ['G', 'F', 'E'], ['A']]);
  });
});

describe('delete', () => {
  it(`deleteVertex deletes all of it's neighbors from the inEdge Map`, () => {

    const graph = new DirectedGraph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    graph.addEdge('B', 'A');
    graph.addEdge('C', 'A');

    // 'Incoming to A should contain ['B','C']
    expect(graph.incomingEdgesOf('A').map((e) => e.src)).toEqual(['B','C']); //  ['B','C']

    // Now delete B, which has no direct link to C, only that C -> A.
    graph.deleteVertex('B');

    // Now if we do the same call to incoming edges for we should get only ['C']
    expect(graph.incomingEdgesOf('A').map((e) => e.src)).toEqual(['C']); // [];

    // but it only shows an empty array, since we deleted all of `A's edges, not just the one to `B`.

    // If we check C, it correctly shows A as an outgoing edge,
    // even though A no longer has any knowledge of C linking to it.
    expect(graph.outgoingEdgesOf('C').map((e) => e.dest)).toEqual(['A']);
  });
})
