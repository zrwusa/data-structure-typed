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
     * @param {VertexId} id - The `id` parameter is the identifier for the vertex. It is of type `VertexId`, which is
     * typically a unique identifier for each vertex in a graph.
     * @param {T} [val] - The "val" parameter is an optional parameter of type T. It is used to initialize the value of the
     * vertex. If no value is provided, the vertex will be initialized with a default value.
     */
    constructor(id: VertexId, val?: T) {
        super(id, val);
    }
}

export class UndirectedEdge<T = number> extends AbstractEdge<T> {
    /**
     * The constructor function initializes an instance of a class with two vertex IDs, an optional weight, and an optional
     * value.
     * @param {VertexId} v1 - The parameter `v1` is of type `VertexId` and represents the first vertex in the edge.
     * @param {VertexId} v2 - The parameter `v2` is a `VertexId`, which represents the identifier of the second vertex in a
     * graph edge.
     * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
     * @param {T} [val] - The "val" parameter is an optional parameter of type T. It represents the value associated with
     * the edge.
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

export class UndirectedGraph<V extends UndirectedVertex<any> = UndirectedVertex, E extends UndirectedEdge<any> = UndirectedEdge> extends AbstractGraph<V, E> implements IUNDirectedGraph<V, E>{

    constructor() {
        super();
        this._edges = new Map<V, E[]>();
    }

    protected _edges: Map<V, E[]>;

    get edges(): Map<V, E[]> {
        return this._edges;
    }

    /**
     * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
     * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
     * @param id
     * @param val
     */
    override createVertex(id: VertexId, val?: V['val']): V {
        return new UndirectedVertex(id, val ?? id) as V;
    }


    /**
     * The function createEdge creates an undirected edge between two vertices with an optional weight and value.
     * @param {VertexId} v1 - The parameter `v1` represents the first vertex of the edge. It is of type `VertexId`, which
     * could be a unique identifier or label for the vertex.
     * @param {VertexId} v2 - The parameter `v2` represents the second vertex of the edge. It is of type `VertexId`, which
     * is typically a unique identifier for a vertex in a graph.
     * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge. If no
     * weight is provided, the default value is 1.
     * @param [val] - The `val` parameter is an optional value that can be assigned to the edge. It can be of any type and
     * is used to store additional information or data associated with the edge.
     * @returns an instance of the UndirectedEdge class, casted as type E.
     */
    override createEdge(v1: VertexId, v2: VertexId, weight?: number, val?: E['val']): E {
        return new UndirectedEdge(v1, v2, weight ?? 1, val) as E;
    }

    /**
     * The function `getEdge` returns the first undirected edge that connects two given vertices, or null if no such edge
     * exists.
     * @param {V | null | VertexId} v1 - The parameter `v1` represents either an `V`
     * object, `null`, or a `VertexId`. It is used to specify one of the vertices of the edge.
     * @param {V | null | VertexId} v2 - The parameter `v2` represents either an `UndirectedVertex`
     * object or a `VertexId` (identifier) of an undirected vertex.
     * @returns an instance of `E` or `null`.
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
     * The function adds an undirected edge to a graph by updating the adjacency list.
     * @param edge - An object representing an undirected edge in a graph. It has a property called "vertices" which is an
     * array of two vertices connected by the edge.
     * @returns a boolean value.
     */
    addEdge(edge: E): boolean {
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
     * The function removes an edge between two vertices in an undirected graph.
     * @param {V | VertexId} v1 - The parameter `v1` represents either an `V` object or
     * a `VertexId`. It is used to specify one of the vertices of the edge that needs to be removed.
     * @param {V | VertexId} v2 - The parameter `v2` represents either an instance of the
     * `UndirectedVertex` class or a `VertexId`. It is used to identify the second vertex of the edge that needs to be
     * removed.
     * @returns The function `removeEdgeBetween` returns an `E` object if an edge is successfully removed
     * between the two vertices `v1` and `v2`. If either `v1` or `v2` is not found in the graph, or if there is no edge
     * between them, the function returns `null`.
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
     * The removeEdge function removes an edge between two vertices in an undirected graph.
     * @param edge - An object representing an undirected edge. It has a property called "vertices" which is an array
     * containing the two vertices connected by the edge.
     * @returns The method is returning an UndirectedEdge object or null.
     */
    removeEdge(edge: E): E | null {
        return this.removeEdgeBetween(edge.vertices[0], edge.vertices[1]);
    }

    /**
     * The function "degreeOf" returns the degree of a given vertex in an undirected graph.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or an
     * `V`.
     * @returns the degree of the vertex.
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
     * The function "edgesOf" returns an array of undirected edges connected to a given vertex or vertex ID.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or an
     * `V`.
     * @returns an array of UndirectedEdge objects.
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
     * The function "edgeSet" returns an array of unique undirected edges from a set of edges.
     * @returns The method `edgeSet()` returns an array of `E` objects.
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
     * The function `getNeighbors` returns an array of neighboring vertices of a given vertex in an undirected graph.
     * @param {V | VertexId} vertexOrId - The `vertexOrId` parameter can be either an
     * `V` object or a `VertexId`. It represents the vertex for which we want to find the neighbors.
     * @returns an array of UndirectedVertex objects.
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
     * The function "getEndsOfEdge" returns the two vertices that form the ends of a given undirected edge, or null if the
     * edge does not exist in the graph.
     * @param edge - An object representing an undirected edge in a graph. It has a property called "vertices" which is an
     * array containing two vertices that the edge connects.
     * @returns The function `getEndsOfEdge` returns an array containing the two ends of the given `edge` if the edge
     * exists in the graph. If the edge does not exist, it returns `null`.
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

    protected _setEdges(v: Map<V, E[]>) {
        this._edges = v;
    }
}
