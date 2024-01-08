import { UndirectedEdge, UndirectedGraph, UndirectedVertex } from '../../../../src';
import saltyVertices from './salty-vertexes.json';
import saltyEdges from './salty-edges.json';

describe('UndirectedGraph Operation Test', () => {
  let graph: UndirectedGraph;

  beforeEach(() => {
    graph = new UndirectedGraph();
  });

  it('should edge cases', () => {
    expect(graph.deleteEdge(new UndirectedEdge('c', 'd'))).toBe(undefined);
    expect(graph.deleteEdgeBetween('c', 'd')).toBe(undefined);
    expect(graph.degreeOf('c')).toBe(0);
    expect(graph.edgesOf('c').length).toBe(0);
    expect(graph.getEndsOfEdge(new UndirectedEdge('c', 'd'))).toBe(undefined);
  });

  it('should add vertices', () => {
    const vertex1 = new UndirectedVertex('A');
    const vertex2 = new UndirectedVertex('B');

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);

    expect(graph.hasVertex(vertex1)).toBe(true);
    expect(graph.hasVertex(vertex2)).toBe(true);
  });

  it('should add edges', () => {
    const vertex1 = new UndirectedVertex('A');
    const vertex2 = new UndirectedVertex('B');
    const edge = new UndirectedEdge('A', 'B');

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addEdge(edge);

    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true);
  });

  it('should delete edges', () => {
    const vertex1 = new UndirectedVertex('A');
    const vertex2 = new UndirectedVertex('B');
    const edge = new UndirectedEdge('A', 'B');

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addEdge(edge);

    expect(graph.deleteEdge(edge)).toBe(edge);
    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('should perform topological sort', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.deleteVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'D');

    const dijkstraResult = graph.dijkstra('A');
    expect(Array.from(dijkstraResult?.seen ?? []).map(vertex => vertex.key)).toEqual(['A', 'B', 'D']);
  });
});

describe('UndirectedGraph', () => {
  let undirectedGraph: UndirectedGraph<string, string>;

  beforeEach(() => {
    // Create a new UndirectedGraph instance before each test
    undirectedGraph = new UndirectedGraph<string, string>();
  });

  // Test adding vertices to the graph
  it('should add vertices to the graph', () => {
    const vertexA = new UndirectedVertex('A', 'Location A');
    const vertexB = new UndirectedVertex('B', 'Location B');

    undirectedGraph.addVertex(vertexA);
    undirectedGraph.addVertex(vertexB);

    expect(undirectedGraph.hasVertex('A')).toBe(true);
    expect(undirectedGraph.hasVertex('B')).toBe(true);
  });

  // Test adding edges to the graph
  it('should add edges to the graph', () => {
    const vertexA = new UndirectedVertex('A', 'Location A');
    const vertexB = new UndirectedVertex('B', 'Location B');
    const edgeAB = new UndirectedEdge('A', 'B', 1, 'Edge between A and B');

    undirectedGraph.addVertex(vertexA);
    undirectedGraph.addVertex(vertexB);
    undirectedGraph.addEdge(edgeAB);

    expect(undirectedGraph.hasEdge('A', 'B')).toBe(true);
  });

  // Test getting neighbors of a vertex
  it('should return the neighbors of a vertex', () => {
    const vertexA = new UndirectedVertex('A', 'Location A');
    const vertexB = new UndirectedVertex('B', 'Location B');
    const vertexC = new UndirectedVertex('C', 'Location C');
    const edgeAB = new UndirectedEdge('A', 'B', 1, 'Edge between A and B');
    const edgeBC = new UndirectedEdge('B', 'C', 2, 'Edge between B and C');

    undirectedGraph.addVertex(vertexA);
    undirectedGraph.addVertex(vertexB);
    undirectedGraph.addVertex(vertexC);
    undirectedGraph.addEdge(edgeAB);
    undirectedGraph.addEdge(edgeBC);

    const neighborsOfA = undirectedGraph.getNeighbors('A');
    const neighborsOfB = undirectedGraph.getNeighbors('B');

    expect(neighborsOfA).toEqual([vertexB]);
    expect(neighborsOfB).toEqual([vertexA, vertexC]);
  });

  // Test degree of a vertex
  it('should return the degree of a vertex', () => {
    const vertexA = new UndirectedVertex('A', 'Location A');
    const vertexB = new UndirectedVertex('B', 'Location B');
    const vertexC = new UndirectedVertex('C', 'Location C');
    const edgeAB = new UndirectedEdge('A', 'B', 3, 'Edge between A and B');
    const edgeBC = new UndirectedEdge('B', 'C', 4, 'Edge between B and C');

    edgeAB.endpoints = edgeAB.endpoints;
    expect(undirectedGraph.edgeMap.size).toBe(0);
    undirectedGraph.addVertex(vertexA);
    undirectedGraph.addVertex(vertexB);
    undirectedGraph.addVertex(vertexC);
    undirectedGraph.addEdge(edgeAB);
    undirectedGraph.addEdge(edgeBC);

    const degreeOfA = undirectedGraph.degreeOf('A');
    const degreeOfB = undirectedGraph.degreeOf('B');
    const degreeOfC = undirectedGraph.degreeOf('C');
    expect(undirectedGraph.edgeSet().length).toBe(2);
    expect(undirectedGraph.getEndsOfEdge(edgeBC)?.length).toBe(2);

    expect(degreeOfA).toBe(1);
    expect(degreeOfB).toBe(2);
    expect(degreeOfC).toBe(1);
  });

  it('should getAllPathsBetween work well in 66 vertexes 97 edges graph', () => {
    const graph = new UndirectedGraph<{ name: string }, number>();
    for (const v of saltyVertices) {
      graph.addVertex(v.name, v);
    }
    for (const e of saltyEdges) {
      const [s, d] = e;
      graph.addEdge(s.name, d.name, d.weight);
    }
    const allPaths = graph.getAllPathsBetween('Intersection_1', 'Intersection_5');
    expect(allPaths.length).toBe(1000);
    const minWeightedPathDFS = graph.getMinPathBetween('Intersection_1', 'Intersection_5', true, true);
    expect(minWeightedPathDFS?.[0]?.key).toBe('Intersection_1');
    expect(minWeightedPathDFS?.[5]?.key).toBe('Intersection_42');
    expect(minWeightedPathDFS?.[8]?.key).toBe('Intersection_18');
    expect(minWeightedPathDFS?.[27]?.key).toBe('Intersection_6');
    const minWeightedPath = graph.dijkstra('Intersection_1', 'Intersection_5', true, true);

    expect(minWeightedPath?.minPath?.[0]?.key).toBe('Intersection_1');
    expect(minWeightedPath?.minPath?.[1]?.key).toBe('Intersection_2');
    expect(minWeightedPath?.minPath?.[2]?.key).toBe('Intersection_3');
    expect(minWeightedPath?.minPath?.[3]?.key).toBe('Intersection_4');
    expect(minWeightedPath?.minPath?.[4]?.key).toBe('Intersection_5');
  });

  test('Removing an edge of a UndirectedGraph should not delete additional edges', () => {
    const dg = new UndirectedGraph();
    dg.addVertex('hello');
    dg.addVertex('hi');
    dg.addVertex('hey');
    dg.addEdge('hello', 'hi');
    dg.addEdge('hello', 'hey');
    expect(dg.getEdge('hello', 'hi')?.endpoints[0]).toBe('hello');
    expect(dg.getEdge('hello', 'hi')?.endpoints[1]).toBe('hi');
    expect(dg.getEdge('hello', 'hey')?.endpoints[0]).toBe('hello');
    expect(dg.getEdge('hello', 'hey')?.endpoints[1]).toBe('hey');
    dg.deleteEdge('hello', 'hi');
    expect(dg.getEdge('hello', 'hi')).toBe(undefined);
    expect(dg.getEdge('hello', 'hey')).toBeInstanceOf(UndirectedEdge);
  });

  test('Removing a vertex of a UndirectedGraph should delete additional edges', () => {
    const graph = new UndirectedGraph();

    graph.addVertex('Hello');
    graph.addVertex('Hi');

    graph.addEdge('Hello', 'Hi');
    graph.deleteVertex('Hello');

    expect(graph.edgesOf('Hi')).toEqual([]);
  });

  test('Removing a vertex from a UndirectedGraph should remove its edges', () => {
    const dg = new UndirectedGraph();
    dg.addVertex('hello');
    dg.addVertex('world');
    dg.addVertex('earth');

    dg.addEdge('hello', 'world');
    dg.addEdge('hello', 'earth');
    dg.addEdge('world', 'earth');

    expect(dg.getEdge('hello', 'world')?.endpoints[0]).toBe('hello');
    expect(dg.edgeSet().length).toBe(3);
    expect(dg.edgeSet()[0].endpoints).toEqual(['hello', 'world']);

    dg.deleteVertex('hello');
    expect(dg.edgeSet().length).toBe(1);
    expect(dg.edgeSet()?.[0].endpoints[0]).toBe('world');

    expect(dg.getEdge('hello', 'world')).toBe(undefined);
  });
});

describe('cycles, strongly connected components, bridges, articular points in UndirectedGraph', () => {
  const graph = new UndirectedGraph();
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
  // const cCs = graph.getCCs();
  const bridges = graph.getBridges();
  const cutVertices = graph.getCutVertices();
  const dfnMap = graph.getDFNMap();
  const lowMap = graph.getLowMap();
  expect(cycles.length).toBe(3);
  // expect(cCs.size).toBe(5);
  expect(bridges.length).toBe(4);
  expect(cutVertices.length).toBe(4);
  expect(dfnMap.size).toBe(8);
  expect(lowMap.size).toBe(8);
});

it('Should return Infinity if dest is not found', () => {
  const graph = new UndirectedGraph<string>();

  for (let i = 0; i < 3; ++i) {
    graph.addVertex(graph.createVertex(i, `${i}`));
  }

  graph.addEdge(0, 1, 1);

  const minCost02 = graph.getMinCostBetween(0, 2, true);
  expect(minCost02).toBe(Infinity);

  const minCost01 = graph.getMinCostBetween(0, 1, true);
  expect(minCost01).toBe(1);
});

describe('UndirectedGraph getCycles', () => {
  test('should getCycles return correct result', () => {
    const graph = new UndirectedGraph();
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
    expect(cycles.length).toBe(3);
    expect(cycles).toEqual([
      ['A', 'B', 'D', 'C'],
      ['A', 'B', 'E', 'D', 'C'],
      ['B', 'D', 'E']
    ]);
  });

  test('should simple cycles graph getCycles return correct result', () => {
    const graph = new UndirectedGraph();

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
    expect(cycles.length).toBe(3);
    expect(cycles).toEqual([
      ['A', 'B', 'C'],
      ['A', 'B', 'C', 'D'],
      ['A', 'C', 'D']
    ]);
  });

  test('should 3 cycles graph getCycles return correct result', () => {
    const graph = new UndirectedGraph();

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
    expect(cycles.length).toBe(10);
    expect(cycles).toEqual([
      ['A', 'B', 'D', 'C'],
      ['A', 'B', 'D', 'C', 'G'],
      ['A', 'B', 'E', 'D', 'C'],
      ['A', 'B', 'E', 'D', 'C', 'G'],
      ['A', 'B', 'F', 'E', 'D', 'C'],
      ['A', 'B', 'F', 'E', 'D', 'C', 'G'],
      ['A', 'C', 'G'],
      ['B', 'D', 'E'],
      ['B', 'D', 'E', 'F'],
      ['B', 'E', 'F']
    ]);
  });
});

describe('UndirectedGraph tarjan', () => {
  test('should simple cycles graph tarjan cycles return correct result', () => {
    const graph = new UndirectedGraph();

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
    expect(cycles.length).toBe(3);
    expect(cycles).toEqual([
      ['A', 'B', 'C'],
      ['A', 'B', 'C', 'D'],
      ['A', 'C', 'D']
    ]);
  });

  function createExampleGraph1() {
    const graph = new UndirectedGraph();
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

  test('should tarjan cut vertexes return correct result', () => {
    const graph = createExampleGraph1();
    const cutVertices = graph.tarjan().cutVertices;
    expect(cutVertices.length).toBe(0);
  });

  test('should tarjan bridges return correct result', () => {
    const graph = createExampleGraph1();
    const bridges = graph.tarjan().bridges;
    expect(bridges.length).toBe(0);
  });

  test('should 3 cycles graph tarjan cut vertexes return correct result', () => {
    const graph = createExampleGraph1();
    const cutVertices = graph.tarjan().cutVertices;
    expect(cutVertices.length).toBe(0);
  });

  test('should 3 cycles graph tarjan bridges return correct result', () => {
    const graph = createExampleGraph1();
    const bridges = graph.tarjan().bridges;
    expect(bridges.length).toBe(0);
  });

  test('should cuttable graph tarjan cut vertexes return correct result', () => {
    const graph = createExampleGraph3();
    const cutVertices = graph.tarjan().cutVertices;
    expect(cutVertices.length).toBe(3);
    expect(cutVertices.map(cv => cv.key)).toEqual(['B', 'E', 'A']);
  });

  test('should cuttable graph tarjan bridges return correct result', () => {
    const graph = createExampleGraph3();
    const bridges = graph.tarjan().bridges;
    expect(bridges.length).toBe(2);
    expect(bridges.map(edge => edge.endpoints)).toEqual([
      ['A', 'B'],
      ['A', 'E']
    ]);
  });

  test('should more cuttable graph tarjan cut vertexes return correct result', () => {
    const graph = createExampleGraph4();
    const cutVertices = graph.tarjan().cutVertices;
    expect(cutVertices.length).toBe(4);
    expect(cutVertices.map(cv => cv.key)).toEqual(['H', 'B', 'E', 'A']);
  });

  test('should more cuttable graph tarjan bridges return correct result', () => {
    const graph = createExampleGraph4();
    const bridges = graph.tarjan().bridges;
    expect(bridges.length).toBe(2);
    expect(bridges.map(edge => edge.endpoints)).toEqual([
      ['A', 'B'],
      ['A', 'E']
    ]);
  });

  test('should uncuttable graph tarjan cut vertexes return correct result', () => {
    const graph = createExampleGraph5();
    const cutVertices = graph.tarjan().cutVertices;
    expect(cutVertices.length).toBe(1);
  });

  test('should uncuttable graph tarjan bridges return correct result', () => {
    const graph = createExampleGraph5();
    const bridges = graph.tarjan().bridges;
    expect(bridges.length).toBe(0);
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
    expect(cycles.length).toBe(10);
    expect(cycles).toEqual([
      ['A', 'B', 'D', 'C'],
      ['A', 'B', 'D', 'C', 'G'],
      ['A', 'B', 'E', 'D', 'C'],
      ['A', 'B', 'E', 'D', 'C', 'G'],
      ['A', 'B', 'F', 'E', 'D', 'C'],
      ['A', 'B', 'F', 'E', 'D', 'C', 'G'],
      ['A', 'C', 'G'],
      ['B', 'D', 'E'],
      ['B', 'D', 'E', 'F'],
      ['B', 'E', 'F']
    ]);
  });

  function createExampleGraph3() {
    const graph = new UndirectedGraph();
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

  // test('should cuttable graph tarjan CCs return correct result', () => {
  // const graph = createExampleGraph3();
  // const ccs = graph.tarjan().CCs;
  // expect(ccs.size).toBe(3);
  // expect(getAsVerticesArrays(ccs)).toEqual([["D", "C", "B"], ["G", "F", "E"], ["A"]]);
  // });

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
    expect(cycles.length).toBe(5);
    expect(cycles).toEqual([
      ['B', 'C', 'D'],
      ['B', 'C', 'H', 'I', 'D'],
      ['C', 'D', 'I', 'H'],
      ['E', 'F', 'G'],
      ['H', 'J', 'K']
    ]);
  });

  // test('should more cuttable graph tarjan SCCs return correct result', () => {
  //   const graph = createExampleGraph4();
  //   const ccs = graph.tarjan().CCs;
  //   expect(ccs.size).toBe(3);
  //   expect(getAsVerticesArrays(ccs)).toEqual([["K", "J", "I", "H", "D", "C", "B"], ["G", "F", "E"], ["A"]]);
  // });

  function createExampleGraph5() {
    const graph = createExampleGraph4();
    graph.addEdge('F', 'H');
    return graph;
  }

  test('should uncuttable graph tarjan cycles return correct result', () => {
    const graph = createExampleGraph5();
    const cycles = graph.getCycles();
    expect(cycles.length).toBe(13);
    expect(cycles).toEqual([
      ['A', 'B', 'C', 'D', 'I', 'H', 'F', 'E'],
      ['A', 'B', 'C', 'D', 'I', 'H', 'F', 'G', 'E'],
      ['A', 'B', 'C', 'H', 'F', 'E'],
      ['A', 'B', 'C', 'H', 'F', 'G', 'E'],
      ['A', 'B', 'D', 'C', 'H', 'F', 'E'],
      ['A', 'B', 'D', 'C', 'H', 'F', 'G', 'E'],
      ['A', 'B', 'D', 'I', 'H', 'F', 'E'],
      ['A', 'B', 'D', 'I', 'H', 'F', 'G', 'E'],
      ['B', 'C', 'D'],
      ['B', 'C', 'H', 'I', 'D'],
      ['C', 'D', 'I', 'H'],
      ['E', 'F', 'G'],
      ['H', 'J', 'K']
    ]);
  });

  // test('should uncuttable graph tarjan SCCs return correct result', () => {
  //   const graph = createExampleGraph5();
  //   const ccs = graph.tarjan().CCs;
  //   expect(ccs.size).toBe(3);
  //   expect(getAsVerticesArrays(ccs)).toEqual([["K", "J", "I", "H", "D", "C", "B"], ["G", "F", "E"], ["A"]]);
  // });
});
