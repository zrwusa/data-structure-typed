import {UndirectedEdge, UndirectedGraph, UndirectedVertex} from '../../../../src';

describe('UndirectedGraph Operation Test', () => {
    let graph: UndirectedGraph;

    beforeEach(() => {
        graph = new UndirectedGraph();
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

    it('should remove edges', () => {
        const vertex1 = new UndirectedVertex('A');
        const vertex2 = new UndirectedVertex('B');
        const edge = new UndirectedEdge('A', 'B');

        graph.addVertex(vertex1);
        graph.addVertex(vertex2);
        graph.addEdge(edge);

        expect(graph.removeEdge(edge)).toBe(edge);
        expect(graph.hasEdge('A', 'B')).toBe(false);
    });

    it('should perform topological sort', () => {
        const vertexA = new UndirectedVertex('A');
        const vertexB = new UndirectedVertex('B');
        const vertexC = new UndirectedVertex('C');
        const edgeAB = new UndirectedEdge('A', 'B');
        const edgeBC = new UndirectedEdge('B', 'C');

        graph.addVertex(vertexA);
        graph.addVertex(vertexB);
        graph.addVertex(vertexC);
        graph.addEdge(edgeAB);
        graph.addEdge(edgeBC);

        const dijkstraResult = graph.dijkstra('A');
        // TODO to be tested
    });
});
