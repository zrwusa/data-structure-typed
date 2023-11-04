import {UndirectedEdge, UndirectedGraph, UndirectedVertex} from '../../../../src';
import saltyVertexes from './salty-vertexes.json';
import saltyEdges from './salty-edges.json';

describe('UndirectedGraph Operation Test', () => {
  let graph: UndirectedGraph;

  beforeEach(() => {
    graph = new UndirectedGraph();
  });

  it('should edge cases', () => {
    expect(graph.deleteEdge(new UndirectedEdge('c', 'd'))).toBe(null);
    expect(graph.deleteEdgeBetween('c', 'd')).toBe(null);
    expect(graph.degreeOf('c')).toBe(0);
    expect(graph.edgesOf('c').length).toBe(0);
    expect(graph.getEndsOfEdge(new UndirectedEdge('c', 'd'))).toBe(null);
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

    edgeAB.vertices = edgeAB.vertices;
    expect(undirectedGraph.edges.size).toBe(0);
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
    const graph = new UndirectedGraph<{name: string}, number>();
    for (const v of saltyVertexes) {
      graph.addVertex(v.name, v);
    }
    for (const e of saltyEdges) {
      const [s, d] = e;
      graph.addEdge(s.name, d.name, d.weight);
    }
    const allPaths = graph.getAllPathsBetween('Intersection_1','Intersection_5');
    expect(allPaths.length).toBe(1000);
    const minWeightedPathDFS = graph.getMinPathBetween('Intersection_1','Intersection_5', true, true);
    const minWeightedPath = graph.dijkstra('Intersection_1','Intersection_5', true, true);
    expect(minWeightedPathDFS?.[0].key).toBe('Intersection_1');
    expect(minWeightedPathDFS?.[5].key).toBe('Intersection_42');
    expect(minWeightedPathDFS?.[8].key).toBe('Intersection_18');
    expect(minWeightedPathDFS?.[31].key).toBe('Intersection_5');
    expect(minWeightedPath?.minPath?.[0].key).toBe('Intersection_1')
    expect(minWeightedPath?.minPath?.[1].key).toBe('Intersection_2')
    expect(minWeightedPath?.minPath?.[2].key).toBe('Intersection_3')
    expect(minWeightedPath?.minPath?.[3].key).toBe('Intersection_4')
    expect(minWeightedPath?.minPath?.[4].key).toBe('Intersection_5')
  });
});
