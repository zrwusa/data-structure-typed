import {DirectedGraph, UndirectedGraph} from '../../../../src';

describe('Overall Graph Operation Test', () => {
  it('Overall DirectedGraph Operation Test', () => {
    const graph = new DirectedGraph();

    graph.addVertex('A');
    graph.addVertex('B');

    graph.hasVertex('A'); // true
    graph.hasVertex('B'); // true
    graph.hasVertex('C'); // false
    expect(graph.hasVertex('A')).toBe(true); // true
    expect(graph.hasVertex('B')).toBe(true); // true
    expect(graph.hasVertex('C')).toBe(false); // false

    graph.addEdge('A', 'B');
    graph.hasEdge('A', 'B'); // true
    graph.hasEdge('B', 'A'); // false
    expect(graph.hasEdge('A', 'B')).toBe(true); // true
    expect(graph.hasEdge('B', 'A')).toBe(false); // false

    graph.removeEdgeSrcToDest('A', 'B');
    graph.hasEdge('A', 'B'); // false
    expect(graph.hasEdge('A', 'B')).toBe(false); // false

    graph.addVertex('C');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');

    const topologicalOrderKeys = graph.topologicalSort();
    expect(topologicalOrderKeys).toEqual(['A', 'B', 'C']);
  });
  it('Overall UndirectedGraph Operation Test', () => {
    const graph = new UndirectedGraph();
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addVertex('D');
    graph.removeVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'D');

    const dijkstraResult = graph.dijkstra('A');
    Array.from(dijkstraResult?.seen ?? []).map(vertex => vertex.key); // ['A', 'B', 'D']
    expect(Array.from(dijkstraResult?.seen ?? []).map(vertex => vertex.key)).toEqual(['A', 'B', 'D']);
  });
});
