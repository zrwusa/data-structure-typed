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
import {IUNDirectedGraph} from '../interfaces';

export class UndirectedVertex<T = number> extends AbstractVertex<T> {
    /**
     * The constructor function initializes a vertex with an optional value.
     * @param {VertexId} id - The `id` parameter is of type `VertexId` and represents the identifier of the vertex. It is
     * used to uniquely identify the vertex within a graph or network.
     * @param {T} [val] - The "val" parameter is an optional parameter of type T. It is used to initialize the value of the
     * vertex. If no value is provided, the vertex will be initialized with a default value.
     */
    constructor(id: VertexId, val?: T) {
        super(id, val);
    }
}

export class UndirectedEdge<T = number> extends AbstractEdge<T> {
    /**
     * The constructor function creates an instance of a class with two vertex IDs, an optional weight, and an optional
     * value.
     * @param {VertexId} v1 - The first vertex ID of the edge.
     * @param {VertexId} v2 - The parameter `v2` is a `VertexId`, which represents the identifier of the second vertex in a
     * graph edge.
     * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
     * @param {T} [val] - The "val" parameter is an optional parameter of type T. It is used to store a value associated
     * with the edge.
     */
    constructor(v1: VertexId, v2: VertexId, weight?: number, val?: T) {
        super(weight, val);
        this._vertices = [v1, v2];
    }

    private _vertices: [VertexId, VertexId];

    get vertices() {
        return this._vertices;
    }

    set vertices(v: [VertexId, VertexId]) {
        this._vertices = v;
    }
}

export class UndirectedGraph<V extends UndirectedVertex<any> = UndirectedVertex, E extends UndirectedEdge<any> = UndirectedEdge> extends AbstractGraph<V, E> implements IUNDirectedGraph<V, E> {

    /**
     * The constructor initializes a new Map object to store edges.
     */
    constructor() {
        super();
        this._edges = new Map<V, E[]>();
    }

    protected _edges: Map<V, E[]>;

    get edges(): Map<V, E[]> {
        return this._edges;
    }

    /**
     * The function creates a new vertex with an optional value and returns it.
     * @param {VertexId} id - The `id` parameter is the unique identifier for the vertex. It is used to distinguish one
     * vertex from another in the graph.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the vertex. If a value is provided,
     * it will be used as the value of the vertex. If no value is provided, the `id` parameter will be used as the value of
     * the vertex.
     * @returns The method is returning a new instance of the `UndirectedVertex` class, casted as type `V`.
     */
    override createVertex(id: VertexId, val?: V['val']): V {
        return new UndirectedVertex(id, val ?? id) as V;
    }

    /**
     * The function creates an undirected edge between two vertices with an optional weight and value.
     * @param {VertexId} v1 - The parameter `v1` represents the first vertex of the edge.
     * @param {VertexId} v2 - The parameter `v2` represents the second vertex of the edge.
     * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the edge. If
     * no weight is provided, it defaults to 1.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the edge. It can be of any type and
     * is used to store additional information or data associated with the edge.
     * @returns a new instance of the `UndirectedEdge` class, which is casted as type `E`.
     */
    override createEdge(v1: VertexId, v2: VertexId, weight?: number, val?: E['val']): E {
        return new UndirectedEdge(v1, v2, weight ?? 1, val) as E;
    }

    /**
     * The function `getEdge` returns the first edge that connects two vertices, or null if no such edge exists.
     * @param {V | null | VertexId} v1 - The parameter `v1` represents a vertex or vertex ID. It can be of type `V` (vertex
     * object), `null`, or `VertexId` (a string or number representing the ID of a vertex).
     * @param {V | null | VertexId} v2 - The parameter `v2` represents a vertex or vertex ID. It can be of type `V` (vertex
     * object), `null`, or `VertexId` (vertex ID).
     * @returns an edge (E) or null.
     */
    getEdge(v1: V | null | VertexId, v2: V | null | VertexId): E | null {
        let edges: E[] | undefined = [];

        if (v1 !== null && v2 !== null) {
            const vertex1: V | null = this._getVertex(v1);
            const vertex2: V | null = this._getVertex(v2);

            if (vertex1 && vertex2) {
                edges = this._edges.get(vertex1)?.filter(e => e.vertices.includes(vertex2.id));
            }
        }

        return edges ? edges[0] || null : null;
    }

    /**
     * The function removes an edge between two vertices in a graph and returns the removed edge.
     * @param {V | VertexId} v1 - The parameter `v1` represents either a vertex object (`V`) or a vertex ID (`VertexId`).
     * @param {V | VertexId} v2 - V | VertexId - This parameter can be either a vertex object (V) or a vertex ID
     * (VertexId). It represents the second vertex of the edge that needs to be removed.
     * @returns the removed edge (E) if it exists, or null if either of the vertices (V) does not exist.
     */
    removeEdgeBetween(v1: V | VertexId, v2: V | VertexId): E | null {

        const vertex1: V | null = this._getVertex(v1);
        const vertex2: V | null = this._getVertex(v2);

        if (!vertex1 || !vertex2) {
            return null;
        }

        const v1Edges = this._edges.get(vertex1);
        let removed: E | null = null;
        if (v1Edges) {
            removed = arrayRemove<E>(v1Edges, (e: E) => e.vertices.includes(vertex2.id))[0] || null;
        }
        const v2Edges = this._edges.get(vertex2);
        if (v2Edges) {
            arrayRemove<E>(v2Edges, (e: E) => e.vertices.includes(vertex1.id));
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
     * edges connected to that vertex.
     */
    degreeOf(vertexOrId: VertexId | V): number {
        const vertex = this._getVertex(vertexOrId);
        if (vertex) {
            return this._edges.get(vertex)?.length || 0;
        } else {
            return 0;
        }
    }

    /**
     * The function returns the edges of a given vertex or vertex ID.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`. A `VertexId` is a
     * unique identifier for a vertex in a graph, while `V` represents the type of the vertex.
     * @returns an array of edges.
     */
    edgesOf(vertexOrId: VertexId | V): E[] {
        const vertex = this._getVertex(vertexOrId);
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
     * The function "getNeighbors" returns an array of neighboring vertices for a given vertex or vertex ID.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns an array of vertices (V[]).
     */
    getNeighbors(vertexOrId: V | VertexId): V[] {
        const neighbors: V[] = [];
        const vertex = this._getVertex(vertexOrId);
        if (vertex) {
            const neighborEdges = this.edgesOf(vertex);
            for (const edge of neighborEdges) {
                const neighbor = this._getVertex(edge.vertices.filter(e => e !== vertex.id)[0]);
                if (neighbor) {
                    neighbors.push(neighbor);
                }
            }
        }
        return neighbors;
    }

    /**
     * The function "getEndsOfEdge" returns the vertices at the ends of an edge if the edge exists in the graph, otherwise
     * it returns null.
     * @param {E} edge - The parameter "edge" is of type E, which represents an edge in a graph.
     * @returns The function `getEndsOfEdge` returns an array containing two vertices `[V, V]` if the edge exists in the
     * graph. If the edge does not exist, it returns `null`.
     */
    getEndsOfEdge(edge: E): [V, V] | null {
        if (!this.hasEdge(edge.vertices[0], edge.vertices[1])) {
            return null;
        }
        const v1 = this._getVertex(edge.vertices[0]);
        const v2 = this._getVertex(edge.vertices[1]);
        if (v1 && v2) {
            return [v1, v2];
        } else {
            return null;
        }
    }

    /**
     * The function adds an edge to the graph by updating the adjacency list with the vertices of the edge.
     * @param {E} edge - The parameter "edge" is of type E, which represents an edge in a graph.
     * @returns a boolean value.
     */
    protected _addEdgeOnly(edge: E): boolean {
        for (const end of edge.vertices) {
            const endVertex = this._getVertex(end);
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
     * The function sets the edges of a graph.
     * @param v - A map where the keys are of type V and the values are arrays of type E.
     */
    protected _setEdges(v: Map<V, E[]>) {
        this._edges = v;
    }
}
