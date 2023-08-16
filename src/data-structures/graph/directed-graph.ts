/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {arrayRemove} from '../../utils';
import {AbstractEdge, AbstractGraph, AbstractVertex} from './abstract-graph';
import type {IDirectedGraph, TopologicalStatus, VertexId} from '../types';

export class DirectedVertex extends AbstractVertex {
    /**
     * The constructor function initializes an object with a given id.
     * @param {VertexId} id - The `id` parameter is the identifier for the vertex. It is used to uniquely identify the
     * vertex within a graph or network.
     */
    constructor(id: VertexId) {
        super(id);
    }
}

export class DirectedEdge extends AbstractEdge {
    /**
     * The constructor function initializes the source and destination vertices of an edge, with an optional weight.
     * @param {VertexId} src - The `src` parameter is the source vertex ID. It represents the starting point of an edge in
     * a graph.
     * @param {VertexId} dest - The `dest` parameter is the identifier of the destination vertex. It represents the vertex
     * to which an edge is directed.
     * @param {number} [weight] - The `weight` parameter is an optional number that represents the weight of the edge
     * between two vertices.
     */
    constructor(src: VertexId, dest: VertexId, weight?: number) {
        super(weight);
        this._src = src;
        this._dest = dest;
    }

    private _src: VertexId;
    get src(): VertexId {
        return this._src;
    }

    set src(v: VertexId) {
        this._src = v;
    }

    private _dest: VertexId;

    get dest(): VertexId {
        return this._dest;
    }

    set dest(v: VertexId) {
        this._dest = v;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getSrc(): VertexId {
        return this._src;
    }

    /**
     * Starting from TypeScript version 5.0 and onwards, the use of distinct access modifiers for Getters and Setters is not permitted. As an alternative, to ensure compatibility, it is necessary to adopt a Java-style approach for Setters (using the same name as the property) while utilizing separate method names for Getters.
     */
    getDest(): VertexId {
        return this._dest;
    }
}

// Strongly connected, One direction connected, Weakly connected
export class DirectedGraph<V extends DirectedVertex, E extends DirectedEdge> extends AbstractGraph<V, E> implements IDirectedGraph<V, E> {

    protected _outEdgeMap: Map<V, E[]> = new Map<V, E[]>();

    protected _inEdgeMap: Map<V, E[]> = new Map<V, E[]>();

    constructor() {
        super();
    }

    /**
     * The function `getEdge` returns the first edge between two vertices, given their source and destination.
     * @param {V | null | VertexId} srcOrId - The `srcOrId` parameter can be either a vertex object (`V`), a vertex ID
     * (`VertexId`), or `null`. It represents the source vertex of the edge.
     * @param {V | null | VertexId} destOrId - The `destOrId` parameter is either a vertex object (`V`), a vertex ID
     * (`VertexId`), or `null`. It represents the destination vertex of the edge.
     * @returns an edge (E) or null.
     */
    getEdge(srcOrId: V | null | VertexId, destOrId: V | null | VertexId): E | null {
        let edges: E[] = [];

        if (srcOrId !== null && destOrId !== null) {
            const src: V | null = this.getVertex(srcOrId);
            const dest: V | null = this.getVertex(destOrId);

            if (src && dest) {
                const srcOutEdges = this._outEdgeMap.get(src);
                if (srcOutEdges) {
                    edges = srcOutEdges.filter(edge => edge.dest === dest.id);
                }
            }
        }

        return edges[0] || null;
    }

    /**
     * The `addEdge` function adds an edge to a graph if the source and destination vertices exist.
     * @param {E} edge - The parameter `edge` is of type `E`, which represents an edge in the graph. It contains
     * information about the source vertex (`src`) and the destination vertex (`dest`) of the edge.
     * @returns The `addEdge` function returns a boolean value. It returns `true` if the edge was successfully added to the
     * graph, and `false` if either the source or destination vertices of the edge are not present in the graph.
     */
    addEdge(edge: E): boolean {
        if (!(this.hasVertex(edge.src) && this.hasVertex(edge.dest))) {
            return false;
        }

        const srcVertex = this.getVertex(edge.src);
        const destVertex = this.getVertex(edge.dest);

        // TODO after no-non-null-assertion not ensure the logic
        if (srcVertex && destVertex) {
            const srcOutEdges = this._outEdgeMap.get(srcVertex);
            if (srcOutEdges) {
                srcOutEdges.push(edge);
            } else {
                this._outEdgeMap.set(srcVertex, [edge]);
            }

            const destInEdges = this._inEdgeMap.get(destVertex);
            if (destInEdges) {
                destInEdges.push(edge);
            } else {
                this._inEdgeMap.set(destVertex, [edge]);
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * The function removes an edge between two vertices in a directed graph and returns the removed edge.
     * @param {V | VertexId} srcOrId - The source vertex or its ID.
     * @param {V | VertexId} destOrId - The `destOrId` parameter in the `removeEdgeBetween` function represents the
     * destination vertex of the edge that needs to be removed. It can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns The function `removeEdgeBetween` returns the removed edge (`E`) if the edge between the source and
     * destination vertices is successfully removed. If either the source or destination vertex is not found, or if the
     * edge does not exist, it returns `null`.
     */
    removeEdgeBetween(srcOrId: V | VertexId, destOrId: V | VertexId): E | null {

        const src: V | null = this.getVertex(srcOrId);
        const dest: V | null = this.getVertex(destOrId);
        let removed: E | null = null;
        if (!src || !dest) {
            return null;
        }

        const srcOutEdges = this._outEdgeMap.get(src);
        if (srcOutEdges) {
            /**
             * The removeEdge function removes an edge from a graph and returns the removed edge, or null if the edge was not
             * found.
             * @param {E} edge - The `edge` parameter represents the edge that you want to remove from the graph. It should be an
             * object that has `src` and `dest` properties, which represent the source and destination vertices of the edge,
             * respectively.
             * @returns The method `removeEdge` returns the removed edge (`E`) if it exists, or `null` if the edge does not exist.
             */
            arrayRemove<E>(srcOutEdges, (edge: DirectedEdge) => edge.dest === dest.id);
        }

        const destInEdges = this._inEdgeMap.get(dest);
        if (destInEdges) {
            removed = arrayRemove<E>(destInEdges, (edge: DirectedEdge) => edge.src === src.id)[0] || null;
        }
        return removed;
    }

    /**
     * The removeEdge function removes an edge from a graph and returns the removed edge, or null if the edge was not
     * found.
     * @param {E} edge - The `edge` parameter is an object that represents an edge in a graph. It has two properties: `src`
     * and `dest`, which represent the source and destination vertices of the edge, respectively.
     * @returns The method `removeEdge` returns the removed edge (`E`) if it exists, or `null` if the edge does not exist.
     */
    removeEdge(edge: E): E | null {
        let removed: E | null = null;
        const src = this.getVertex(edge.src);
        const dest = this.getVertex(edge.dest);
        if (src && dest) {
            const srcOutEdges = this._outEdgeMap.get(src);
            if (srcOutEdges && srcOutEdges.length > 0) {
                arrayRemove(srcOutEdges, (edge: DirectedEdge) => edge.src === src.id);
            }

            const destInEdges = this._inEdgeMap.get(dest);
            if (destInEdges && destInEdges.length > 0) {
                removed = arrayRemove(destInEdges, (edge: E) => edge.dest === dest.id)[0];
            }

        }

        return removed;
    }

    /**
     * The function removeAllEdges removes all edges between two vertices.
     * @param {VertexId | V} src - The `src` parameter represents the source vertex from which the edges will be removed.
     * It can be either a `VertexId` or a `V` type, which represents the identifier or object of the vertex.
     * @param {VertexId | V} dest - The `dest` parameter represents the destination vertex of an edge. It can be either a
     * `VertexId` or a vertex object `V`.
     * @returns An empty array is being returned.
     */
    removeAllEdges(src: VertexId | V, dest: VertexId | V): E[] {
        return [];
    }

    /**
     * The function `incomingEdgesOf` returns an array of incoming edges for a given vertex or vertex ID.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns The method `incomingEdgesOf` returns an array of edges (`E[]`).
     */
    incomingEdgesOf(vertexOrId: V | VertexId): E[] {
        const target = this.getVertex(vertexOrId);
        if (target) {
            return this._inEdgeMap.get(target) || [];
        }
        return [];
    }

    /**
     * The function `outgoingEdgesOf` returns an array of outgoing edges from a given vertex or vertex ID.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can accept either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns The method `outgoingEdgesOf` returns an array of outgoing edges from a given vertex or vertex ID.
     */
    outgoingEdgesOf(vertexOrId: V | VertexId): E[] {
        const target = this.getVertex(vertexOrId);
        if (target) {
            return this._outEdgeMap.get(target) || [];
        }
        return [];
    }

    /**
     * The function "degreeOf" returns the total degree of a vertex, which is the sum of its out-degree and in-degree.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns the sum of the out-degree and in-degree of the specified vertex or vertex ID.
     */
    degreeOf(vertexOrId: VertexId | V): number {
        return this.outDegreeOf(vertexOrId) + this.inDegreeOf(vertexOrId);
    }

    /**
     * The function "inDegreeOf" returns the number of incoming edges for a given vertex.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns The number of incoming edges of the specified vertex or vertex ID.
     */
    inDegreeOf(vertexOrId: VertexId | V): number {
        return this.incomingEdgesOf(vertexOrId).length;
    }

    /**
     * The function `outDegreeOf` returns the number of outgoing edges from a given vertex.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns The number of outgoing edges from the specified vertex or vertex ID.
     */
    outDegreeOf(vertexOrId: VertexId | V): number {
        return this.outgoingEdgesOf(vertexOrId).length;
    }

    /**
     * The function "edgesOf" returns an array of both outgoing and incoming edges of a given vertex or vertex ID.
     * @param {VertexId | V} vertexOrId - The parameter `vertexOrId` can be either a `VertexId` or a `V`.
     * @returns The function `edgesOf` returns an array of edges.
     */
    edgesOf(vertexOrId: VertexId | V): E[] {
        return [...this.outgoingEdgesOf(vertexOrId), ...this.incomingEdgesOf(vertexOrId)];
    }

    /**
     * The function "getEdgeSrc" returns the source vertex of an edge, or null if the edge does not exist.
     * @param {E} e - E - an edge object
     * @returns the source vertex of the given edge, or null if the edge does not exist.
     */
    getEdgeSrc(e: E): V | null {
        return this.getVertex(e.src);
    }

    /**
     * The function "getEdgeDest" returns the vertex associated with the destination of an edge.
     * @param {E} e - The parameter `e` is of type `E`, which represents an edge in a graph.
     * @returns either a vertex object (of type V) or null.
     */
    getEdgeDest(e: E): V | null {
        return this.getVertex(e.dest);
    }

    /**
     * The function `getDestinations` returns an array of destination vertices connected to a given vertex.
     * @param {V | VertexId | null} vertex - The `vertex` parameter represents the starting vertex from which we want to
     * find the destinations. It can be either a `V` object, a `VertexId` (which is a unique identifier for a vertex), or
     * `null` if we want to find destinations from all vertices.
     * @returns an array of vertices (V[]).
     */
    getDestinations(vertex: V | VertexId | null): V[] {
        if (vertex === null) {
            return [];
        }
        const destinations: V[] = [];
        const outgoingEdges = this.outgoingEdgesOf(vertex);
        for (const outEdge of outgoingEdges) {
            const child = this.getEdgeDest(outEdge);
            if (child) {
                destinations.push(child);
            }
        }
        return destinations;
    }

    /**--- start find cycles --- */

    /**
     * when stored with adjacency list time: O(V+E)
     * when stored with adjacency matrix time: O(V^2)
     * The `topologicalSort` function performs a topological sort on a graph and returns the sorted vertices in reverse
     * order, or null if the graph contains a cycle.
     * @returns The `topologicalSort()` function returns an array of vertices (`V[]`) in topological order if there is no
     * cycle in the graph. If there is a cycle, it returns `null`.
     */
    topologicalSort(): V[] | null {
        // When judging whether there is a cycle in the undirected graph, all nodes with degree of **<= 1** are enqueued
        // When judging whether there is a cycle in the directed graph, all nodes with **in degree = 0** are enqueued
        const statusMap: Map<V, TopologicalStatus> = new Map<V, TopologicalStatus>();
        for (const entry of this._vertices) {
            statusMap.set(entry[1], 0);
        }

        const sorted: (V)[] = [];
        let hasCycle = false;
        const dfs = (cur: V) => {
            statusMap.set(cur, 1);
            const children = this.getDestinations(cur);
            for (const child of children) {
                const childStatus = statusMap.get(child);
                if (childStatus === 0) {
                    dfs(child);
                } else if (childStatus === 1) {
                    hasCycle = true;
                }
            }
            statusMap.set(cur, 2);
            sorted.push(cur);
        };

        for (const entry of this._vertices) {
            if (statusMap.get(entry[1]) === 0) {
                dfs(entry[1]);
            }
        }

        if (hasCycle) return null;

        return sorted.reverse();
    }

    /**--- end find cycles --- */

    /**
     * The `edgeSet` function returns an array of all the edges in the graph.
     * @returns The `edgeSet()` method returns an array of edges (`E[]`).
     */
    edgeSet(): E[] {
        let edges: E[] = [];
        this._outEdgeMap.forEach(outEdges => {
            edges = [...edges, ...outEdges];
        });
        return edges;
    }

    /**
     * The function `getNeighbors` returns an array of neighboring vertices for a given vertex or vertex ID.
     * @param {V | VertexId} vertexOrId - The parameter `vertexOrId` can be either a vertex object (`V`) or a vertex ID
     * (`VertexId`).
     * @returns an array of vertices (V[]).
     */
    getNeighbors(vertexOrId: V | VertexId): V[] {
        const neighbors: V[] = [];
        const vertex = this.getVertex(vertexOrId);
        if (vertex) {
            const outEdges = this.outgoingEdgesOf(vertex);
            for (const outEdge of outEdges) {
                const neighbor = this.getVertex(outEdge.dest);
                // TODO after no-non-null-assertion not ensure the logic
                if (neighbor) {
                    neighbors.push(neighbor);
                }
            }
        }
        return neighbors;
    }

    /**
     * The function "getEndsOfEdge" returns the source and destination vertices of an edge if it exists in the graph,
     * otherwise it returns null.
     * @param {E} edge - The parameter "edge" is of type E, which represents an edge in a graph.
     * @returns an array containing two vertices [V, V] if the edge is found in the graph. If the edge is not found, it
     * returns null.
     */
    getEndsOfEdge(edge: E): [V, V] | null {
        if (!this.hasEdge(edge.src, edge.dest)) {
            return null;
        }
        const v1 = this.getVertex(edge.src);
        const v2 = this.getVertex(edge.dest);
        if (v1 && v2) {
            return [v1, v2];
        } else {
            return null;
        }
    }
}
