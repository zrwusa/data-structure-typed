import { UndirectedEdge, UndirectedGraph, UndirectedVertex } from '../../../../src';
import saltyVertexes from './salty-vertexes.json';
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

  it('should add vertexMap', () => {
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

  // Test adding vertexMap to the graph
  it('should add vertexMap to the graph', () => {
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

    edgeAB.vertexMap = edgeAB.vertexMap;
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
    for (const v of saltyVertexes) {
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
    dg.addVertex('hello')
    dg.addVertex('hi')
    dg.addVertex('hey')
    dg.addEdge('hello', 'hi')
    dg.addEdge('hello', 'hey')
    expect(dg.getEdge('hello', 'hi')?.vertexMap[0]).toBe('hello')
    expect(dg.getEdge('hello', 'hi')?.vertexMap[1]).toBe('hi')
    expect(dg.getEdge('hello', 'hey')?.vertexMap[0]).toBe('hello')
    expect(dg.getEdge('hello', 'hey')?.vertexMap[1]).toBe('hey')
    dg.deleteEdge('hello', 'hi')
    expect(dg.getEdge('hello', 'hi')).toBe(undefined)
    expect(dg.getEdge('hello', 'hey')).toBeInstanceOf(UndirectedEdge)
  });

  test('Removing a vertex from a UndirectedGraph should remove its edges', () => {
    const dg = new UndirectedGraph();
    dg.addVertex('hello')
    dg.addVertex('world')
    dg.addVertex('earth')

    dg.addEdge('hello', 'world')
    dg.addEdge('hello', 'earth')
    dg.addEdge('world', 'earth')

    expect(dg.getEdge('hello', 'world')?.vertexMap[0]).toBe('hello');
    expect(dg.edgeSet().length).toBe(3)
    expect(dg.edgeSet()[0].vertexMap).toEqual(['hello', 'world'])

    dg.deleteVertex('hello')
    expect(dg.edgeSet().length).toBe(1)
    expect(dg.edgeSet()?.[0].vertexMap[0]).toBe('world')

    expect(dg.getEdge('hello', 'world')).toBe(undefined);
  })
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
  const scCs = graph.getSCCs();
  const bridges = graph.getBridges();
  const cutVertexes = graph.getCutVertexes();
  const dfnMap = graph.getDFNMap();
  const lowMap = graph.getLowMap();
  expect(cycles.size).toBe(2);
  expect(scCs.size).toBe(5);
  expect(bridges.length).toBe(4);
  expect(cutVertexes.length).toBe(4);
  expect(dfnMap.size).toBe(8);
  expect(lowMap.size).toBe(8);
});

it("Should return Infinity if dest is not found", () => {

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
    expect(cycles.size).toBe(2);
    expect(cycles.get(1)).toEqual([{ "key": "A", "value": "A" }, { "key": "B", "value": "B" }, { "key": "D", "value": "D" }, { "key": "C", "value": "C" }]);
    expect(cycles.get(2)).toEqual([{ "key": "B", "value": "B" }, { "key": "D", "value": "D" }, { "key": "E", "value": "E" }]);
  })
})