import { DirectedGraph, DirectedVertex, DirectedEdge } from '../../../../src';

// TODO too few unit tests
describe('DirectedGraph', () => {
    let graph: DirectedGraph<DirectedVertex, DirectedEdge>;

    beforeEach(() => {
        graph = new DirectedGraph();
    });

    it('should add vertices', () => {
        const vertex1 = new DirectedVertex('A');
        const vertex2 = new DirectedVertex('B');

        graph.addVertex(vertex1);
        graph.addVertex(vertex2);

        expect(graph.containsVertex(vertex1)).toBe(true);
        expect(graph.containsVertex(vertex2)).toBe(true);
    });

    it('should add edges', () => {
        const vertex1 = new DirectedVertex('A');
        const vertex2 = new DirectedVertex('B');
        const edge = new DirectedEdge('A', 'B');

        graph.addVertex(vertex1);
        graph.addVertex(vertex2);
        graph.addEdge(edge);

        expect(graph.containsEdge('A', 'B')).toBe(true);
        expect(graph.containsEdge('B', 'A')).toBe(false);
    });

    it('should remove edges', () => {
        const vertex1 = new DirectedVertex('A');
        const vertex2 = new DirectedVertex('B');
        const edge = new DirectedEdge('A', 'B');

        graph.addVertex(vertex1);
        graph.addVertex(vertex2);
        graph.addEdge(edge);

        expect(graph.removeEdge(edge)).toBe(edge);
        expect(graph.containsEdge('A', 'B')).toBe(false);
    });

    // Add more test cases for other methods...

    it('should perform topological sort', () => {
        // Create a graph with vertices and edges
        const vertexA = new DirectedVertex('A');
        const vertexB = new DirectedVertex('B');
        const vertexC = new DirectedVertex('C');
        const edgeAB = new DirectedEdge('A', 'B');
        const edgeBC = new DirectedEdge('B', 'C');

        graph.addVertex(vertexA);
        graph.addVertex(vertexB);
        graph.addVertex(vertexC);
        graph.addEdge(edgeAB);
        graph.addEdge(edgeBC);

        // Perform topological sort
        const topologicalOrder = graph.topologicalSort();

        if (topologicalOrder) expect(topologicalOrder.map(v => v.id)).toEqual(['A', 'B', 'C']);

    });

    // Add more test cases for other methods...
});
