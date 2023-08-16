/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {arrayRemove} from '../../utils';
import {AbstractEdge, AbstractGraph, AbstractVertex} from './abstract-graph';
import type {VertexId} from '../types';

export class UndirectedVertex extends AbstractVertex {
    /**
     * The constructor function initializes an object with a given id.
     * @param {VertexId} id - The `id` parameter is the identifier for the vertex. It is used to uniquely identify the
     * vertex within a graph or network.
     */
    constructor(id: VertexId) {
        super(id);
    }
}

export class UndirectedEdge extends AbstractEdge {
    /**
     * The constructor function initializes an instance of a class with two vertex IDs and an optional weight.
     * @param {VertexId} v1 - The parameter `v1` is of type `VertexId` and represents the first vertex in the edge.
     * @param {VertexId} v2 - The parameter `v2` is a `VertexId`, which represents the identifier of the second vertex in a
     * graph.
     * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the edge
     * between two vertices.
     */
    constructor(v1: VertexId, v2: VertexId, weight?: number) {
        super(weight);
        this._vertices = [v1, v2];
    }

    private _vertices: [VertexId, VertexId];
    get vertices() {
        return this._vertices;
    }

    set vertices(v: [VertexId, VertexId]) {
        this._vertices = v;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getVertices() {
        return this._vertices;
    }
}

export class UndirectedGraph<V extends UndirectedVertex, E extends UndirectedEdge> extends AbstractGraph<V, E> {
    constructor() {
        super();
        this._edges = new Map<V, E[]>();
    }

    protected _edges: Map<V, E[]>;

    get edges(): Map<V, E[]> {
        return this._edges;
    }

    protected set edges(v: Map<V, E[]>) {
        this._edges = v;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getEdges(): Map<V, E[]> {
        return this._edges;
    }

    /**
     * The function `getEdge` returns the first edge that connects two vertices, or null if no such edge exists.
     * @param {V | null | VertexId} v1 - The parameter `v1` represents either a vertex object (`V`) or a vertex ID
     * (`VertexId`). It can also be `null`.
     * @param {V | null | VertexId} v2 - The parameter `v2` represents a vertex or vertex ID. It can be of type `V` (vertex
     * object), `null`, or `VertexId` (vertex ID).
     * @returns an edge (E) or null.
     */
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

    /**
     * The function adds an edge to a graph by connecting two vertices.
     * @param {E} edge - The `edge` parameter is an object of type `E`, which represents an edge in a graph.
     * @returns a boolean value.
     */
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

    /**
     * The function removes an edge between two vertices in a graph and returns the removed edge, or null if either of the
     * vertices does not exist.
     * @param {V | VertexId} v1 - The parameter `v1` represents either a vertex object (`V`) or a vertex ID (`VertexId`).
     * @param {V | VertexId} v2 - V | VertexId: The second vertex or vertex ID of the edge to be removed.
     * @returns the removed edge (E) if it exists, or null if either of the vertices (v1 or v2) does not exist.
     */
    removeEdgeBetween(v1: V | VertexId, v2: V | VertexId): E | null {

        const vertex1: V | null = this.getVertex(v1);
        const vertex2: V | null = this.getVertex(v2);

        if (!vertex1 || !vertex2) {
            return null;
        }

        const v1Edges = this._edges.get(vertex1);
        let removed: E | null = null;
        if (v1Edges) {
            removed = arrayRemove<E>(v1Edges, (e: UndirectedEdge) => e.vertices.includes(vertex2.id))[0] || null;
        }
        const v2Edges = this._edges.get(vertex2);
        if (v2Edges) {
            arrayRemove<E>(v2Edges, (e: UndirectedEdge) => e.vertices.includes(vertex1.id));
        }
        return removed;
    }

    /**
     * The removeEdge function removes an edge between two vertices in a graph.
     * @param {E} edge - The parameter "edge" is of type E, which represents an edge in a graph.
     * @returns The method is returning either the removed edge (of type E) or null if the edge was not found.
     */
    removeEdge(edge: E): E | null {
        return this.removeEdgeBetween(edge.vertices[0], edge.vertices[1]);
    }

    /**
     * The function `degreeOf` returns the degree of a vertex in a graph, which is the number of edges connected to that
     * vertex.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns The function `degreeOf` returns the degree of a vertex in a graph. The degree of a vertex is the number of
     * edges that are incident to that vertex.
     */
    degreeOf(vertexOrId: VertexId | V): number {
        const vertex = this.getVertex(vertexOrId);
        if (vertex) {
            return this._edges.get(vertex)?.length || 0;
        } else {
            return 0;
        }
    }

    /**
     * The function "edgesOf" returns an array of edges connected to a given vertex.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns an array of edges connected to the specified vertex. If the vertex exists in the graph, the function
     * returns the array of edges connected to that vertex. If the vertex does not exist in the graph, the function returns
     * an empty array.
     */
    edgesOf(vertexOrId: VertexId | V): E[] {
        const vertex = this.getVertex(vertexOrId);
        if (vertex) {
            return this._edges.get(vertex) || [];
        } else {
            return [];
        }
    }

    /**
     * The function "edgeSet" returns an array of unique edges from a set of edges.
     * @returns The method `edgeSet()` returns an array of type `E[]`.
     */
    edgeSet(): E[] {
        const edgeSet: Set<E> = new Set();
        this._edges.forEach(edges => {
            edges.forEach(edge => {
                edgeSet.add(edge);
            });
        });
        return [...edgeSet];
    }

    /**
     * The function "getEdgesOf" returns an array of edges connected to a given vertex or vertex ID.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can accept either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns an array of edges (E[]) that are connected to the specified vertex or vertex ID.
     */
    getEdgesOf(vertexOrId: V | VertexId): E[] {
        const vertex = this.getVertex(vertexOrId);
        if (!vertex) {
            return [];
        }
        return this._edges.get(vertex) || [];
    }

    /**
     * The function "getNeighbors" returns an array of neighboring vertices of a given vertex.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns an array of vertices (V[]).
     */
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

    /**
     * The function "getEndsOfEdge" returns the vertices at the ends of a given edge, or null if the edge does not exist in
     * the graph.
     * @param {E} edge - The parameter "edge" is of type E, which represents an edge in a graph.
     * @returns The function `getEndsOfEdge` returns an array containing two vertices `[V, V]` if the edge exists in the
     * graph and both vertices are found. If the edge does not exist or one or both vertices are not found, it returns
     * `null`.
     */
    getEndsOfEdge(edge: E): [V, V] | null {
        if (!this.hasEdge(edge.vertices[0], edge.vertices[1])) {
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
