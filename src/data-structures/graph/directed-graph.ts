import {arrayRemove} from '../../utils';
import {AbstractEdge, AbstractGraph, AbstractVertex, VertexId} from './abstract-graph';

export class DirectedVertex extends AbstractVertex {
    constructor(id: VertexId) {
        super(id);
    }
}

export class DirectedEdge extends AbstractEdge {
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
}

export interface I_DirectedGraph<V, E> {
    incomingEdgesOf(vertex: V): E[];

    outgoingEdgesOf(vertex: V): E[];

    inDegreeOf(vertexOrId: V | VertexId): number;

    outDegreeOf(vertexOrId: V | VertexId): number;

    getEdgeSrc(e: E): V | null;

    getEdgeDest(e: E): V | null;
}

// 0 means unknown, 1 means visiting, 2 means visited;
export type TopologicalStatus = 0 | 1 | 2;

// Strongly connected, One direction connected, Weakly connected
export class DirectedGraph<V extends DirectedVertex, E extends DirectedEdge> extends AbstractGraph<V, E> implements I_DirectedGraph<V, E> {

    protected _outEdgeMap: Map<V, E[]> = new Map<V, E[]>();

    protected _inEdgeMap: Map<V, E[]> = new Map<V, E[]>();

    constructor() {
        super();
    }

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

    addEdge(edge: E): boolean {
        if (!(this.containsVertex(edge.src) && this.containsVertex(edge.dest))) {
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

    removeEdgeBetween(srcOrId: V | VertexId, destOrId: V | VertexId): E | null {

        const src: V | null = this.getVertex(srcOrId);
        const dest: V | null = this.getVertex(destOrId);
        let removed: E | null = null;
        if (!src || !dest) {
            return null;
        }

        const srcOutEdges = this._outEdgeMap.get(src);
        if (srcOutEdges) {
            arrayRemove<E>(srcOutEdges, edge => edge.dest === dest.id);
        }

        const destInEdges = this._inEdgeMap.get(dest);
        if (destInEdges) {
            removed = arrayRemove<E>(destInEdges, edge => edge.src === src.id)[0] || null;
        }
        return removed;
    }

    removeEdge(edge: E): E | null {
        let removed: E | null = null;
        const src = this.getVertex(edge.src);
        const dest = this.getVertex(edge.dest);
        if (src && dest) {
            const srcOutEdges = this._outEdgeMap.get(src);
            if (srcOutEdges && srcOutEdges.length > 0) {
                arrayRemove(srcOutEdges, edge => edge.src === src.id);
            }

            const destInEdges = this._inEdgeMap.get(dest);
            if (destInEdges && destInEdges.length > 0) {
                removed = arrayRemove(destInEdges, edge => edge.dest === dest.id)[0];
            }

        }

        return removed;
    }

    removeAllEdges(src: VertexId | V, dest: VertexId | V): E[] {
        return [];
    }

    incomingEdgesOf(vertexOrId: V | VertexId): E[] {
        const target = this.getVertex(vertexOrId);
        if (target) {
            return this._inEdgeMap.get(target) || [];
        }
        return [];
    }

    outgoingEdgesOf(vertexOrId: V | VertexId): E[] {
        const target = this.getVertex(vertexOrId);
        if (target) {
            return this._outEdgeMap.get(target) || [];
        }
        return [];
    }

    degreeOf(vertexOrId: VertexId | V): number {
        return this.outDegreeOf(vertexOrId) + this.inDegreeOf(vertexOrId);
    }

    inDegreeOf(vertexOrId: VertexId | V): number {
        return this.incomingEdgesOf(vertexOrId).length;
    }

    outDegreeOf(vertexOrId: VertexId | V): number {
        return this.outgoingEdgesOf(vertexOrId).length;
    }

    edgesOf(vertexOrId: VertexId | V): E[] {
        return [...this.outgoingEdgesOf(vertexOrId), ...this.incomingEdgesOf(vertexOrId)];
    }

    getEdgeSrc(e: E): V | null {
        return this.getVertex(e.src);
    }

    getEdgeDest(e: E): V | null {
        return this.getVertex(e.dest);
    }

    getDestinations(vertex: V | null): V[] {
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
     */
    topologicalSort(): V[] | null {
        // vector<vector<int>> g;
        // vector<int> color;
        // int last;
        // bool hasCycle;
        //
        // bool topo_sort() {
        //     int n = g.size();
        //     vector<int> degree(n, 0);
        //     queue<int> q;
        //     for (int i = 0; i < n; i++) {
        //         degree[i] = g[i].size();
        //         if (degree[i] <= 1) {
        //             q.push(i);
        //         }
        //     }
        //     int cnt = 0;
        //     while (!q.empty()) {
        //         cnt++;
        //         int root = q.front();
        //         q.pop();
        //         for (auto child : g[root]) {
        //             degree[child]--;
        //             if (degree[child] == 1) {
        //                 q.push(child);
        //             }
        //         }
        //     }
        //     return (cnt != n);
        // }
        // When judging whether there is a cycle in the undirected graph, all nodes with degree of **<= 1** are enqueued
        // When judging whether there is a cycle in the directed graph, all nodes with **in degree = 0** are enqueued
        const statusMap: Map<V, TopologicalStatus> = new Map<V, TopologicalStatus>();
        for (const entry of this._vertices) {
            statusMap.set(entry[1], 0);
        }

        const sorted: V[] = [];
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

        if (hasCycle) {
            return null;
        }
        return sorted.reverse();
    }

    /**--- end find cycles --- */

    edgeSet(): E[] {
        let edges: E[] = [];
        this._outEdgeMap.forEach(outEdges => {
            edges = [...edges, ...outEdges];
        });
        return edges;
    }

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

    getEndsOfEdge(edge: E): [V, V] | null {
        if (!this.containsEdge(edge.src, edge.dest)) {
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
