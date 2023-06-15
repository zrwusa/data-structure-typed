import {arrayRemove} from '../../utils';
import {AbstractEdge, AbstractGraph, AbstractVertex, VertexId} from './abstract-graph';

export class UndirectedVertex extends AbstractVertex {
    constructor(id: VertexId) {
        super(id);
    }
}

export class UndirectedEdge extends AbstractEdge {
    private _vertices: [VertexId, VertexId];

    public get vertices() {
        return this._vertices;
    }

    public set vertices(v: [VertexId, VertexId]) {
        this._vertices = v;
    }

    constructor(v1: VertexId, v2: VertexId, weight?: number) {
        super(weight);
        this._vertices = [v1, v2];
    }
}

export class UndirectedGraph<V extends UndirectedVertex, E extends UndirectedEdge> extends AbstractGraph<V, E> {
    constructor() {
        super();
    }

    protected _edges: Map<V, E[]> = new Map();

    getEdge(v1: V | null | VertexId, v2: V | null | VertexId): E | null {
        let edges: E[] | undefined = [];

        if (v1 !== null && v2 !== null) {
            const vertex1: V | null = this.getVertex(v1);
            const vertex2: V | null = this.getVertex(v2);

            if (vertex1 && vertex2) {
                edges = this._edges.get(vertex1)?.filter(e => e.vertices.includes(vertex2.id));
            }
        }

        return edges ? edges[0] || null : null;
    }

    addEdge(edge: E): boolean {
        for (const end of edge.vertices) {
            const endVertex = this.getVertex(end);
            if (endVertex === null) return false;
            if (endVertex) {
                const edges = this._edges.get(endVertex);
                if (edges) {
                    edges.push(edge);
                } else {
                    this._edges.set(endVertex, [edge]);
                }
            }
        }
        return true;
    }

    removeEdgeBetween(v1: V | VertexId, v2: V | VertexId): E | null {

        const vertex1: V | null = this.getVertex(v1);
        const vertex2: V | null = this.getVertex(v2);

        if (!vertex1 || !vertex2) {
            return null;
        }

        const v1Edges = this._edges.get(vertex1);
        let removed: E | null = null;
        if (v1Edges) {
            removed = arrayRemove<E>(v1Edges, e => e.vertices.includes(vertex2.id))[0] || null;
        }
        const v2Edges = this._edges.get(vertex2);
        if (v2Edges) {
            arrayRemove<E>(v2Edges, e => e.vertices.includes(vertex1.id));
        }
        return removed;
    }


    removeEdge(edge: E): E | null {
        return this.removeEdgeBetween(edge.vertices[0], edge.vertices[1]);
    }

    degreeOf(vertexOrId: VertexId | V): number {
        const vertex = this.getVertex(vertexOrId);
        if (vertex) {
            return this._edges.get(vertex)?.length || 0;
        } else {
            return 0;
        }
    }

    edgesOf(vertexOrId: VertexId | V): E[] {
        const vertex = this.getVertex(vertexOrId);
        if (vertex) {
            return this._edges.get(vertex) || [];
        } else {
            return [];
        }
    }

    edgeSet(): E[] {
        const edgeSet: Set<E> = new Set();
        this._edges.forEach(edges => {
            edges.forEach(edge => {
                edgeSet.add(edge);
            });
        });
        return [...edgeSet];
    }

    getEdgesOf(vertexOrId: V | VertexId): E[] {
        const vertex = this.getVertex(vertexOrId);
        if (!vertex) {
            return [];
        }
        return this._edges.get(vertex) || [];
    }

    getNeighbors(vertexOrId: V | VertexId): V[] {
        const neighbors: V[] = [];
        const vertex = this.getVertex(vertexOrId);
        if (vertex) {
            const neighborEdges = this.getEdgesOf(vertex);
            for (const edge of neighborEdges) {
                const neighbor = this.getVertex(edge.vertices.filter(e => e !== vertex.id)[0]);
                if (neighbor) {
                    neighbors.push(neighbor);
                }
            }
        }
        return neighbors;
    }

    getEndsOfEdge(edge: E): [V, V] | null {
        if (!this.containsEdge(edge.vertices[0], edge.vertices[1])) {
            return null;
        }
        const v1 = this.getVertex(edge.vertices[0]);
        const v2 = this.getVertex(edge.vertices[1]);
        if (v1 && v2) {
            return [v1, v2];
        } else {
            return null;
        }
    }
}
