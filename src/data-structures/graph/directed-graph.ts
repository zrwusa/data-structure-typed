/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { GraphOptions, TopologicalStatus, VertexKey } from '../../types';
import { AbstractEdge, AbstractGraph, AbstractVertex } from './abstract-graph';
import { IGraph } from '../../interfaces';
import { arrayRemove } from '../../utils';

export class DirectedVertex<V = any> extends AbstractVertex<V> {
  constructor(key: VertexKey, value?: V) {
    super(key, value);
  }
}

export class DirectedEdge<E = any> extends AbstractEdge<E> {
  src: VertexKey;
  dest: VertexKey;

  constructor(src: VertexKey, dest: VertexKey, weight?: number, value?: E) {
    super(weight, value);
    this.src = src;
    this.dest = dest;
  }
}

/**
 * Directed graph implementation.
 * @template V - Vertex value type.
 * @template E - Edge value type.
 * @template VO - Concrete vertex class (extends AbstractVertex<V>).
 * @template EO - Concrete edge class (extends AbstractEdge<E>).
 * @remarks Time O(1), Space O(1)
 * @example
 * // basic DirectedGraph vertex and edge creation
 *  // Create a simple directed graph
 *     const graph = new DirectedGraph<string>();
 *
 *     // Add vertices
 *     graph.addVertex('A');
 *     graph.addVertex('B');
 *     graph.addVertex('C');
 *
 *     // Verify vertices exist
 *     console.log(graph.hasVertex('A')); // true;
 *     console.log(graph.hasVertex('B')); // true;
 *     console.log(graph.hasVertex('C')); // true;
 *     console.log(graph.hasVertex('D')); // false;
 *
 *     // Check vertex count
 *     console.log(graph.size); // 3;
 * @example
 * // DirectedGraph edge operations
 *  const graph = new DirectedGraph<string>();
 *
 *     // Add vertices
 *     graph.addVertex('A');
 *     graph.addVertex('B');
 *     graph.addVertex('C');
 *
 *     // Add directed edges
 *     graph.addEdge('A', 'B', 1);
 *     graph.addEdge('B', 'C', 2);
 *     graph.addEdge('A', 'C', 3);
 *
 *     // Verify edges exist
 *     console.log(graph.hasEdge('A', 'B')); // true;
 *     console.log(graph.hasEdge('B', 'C')); // true;
 *     console.log(graph.hasEdge('C', 'B')); // false; // Graph is directed
 *
 *     // Get neighbors of A
 *     const neighborsA = graph.getNeighbors('A');
 *     console.log(neighborsA[0].key); // 'B';
 *     console.log(neighborsA[1].key); // 'C';
 * @example
 * // DirectedGraph deleteEdge and vertex operations
 *  const graph = new DirectedGraph<string>();
 *
 *     // Build a small graph
 *     graph.addVertex('X');
 *     graph.addVertex('Y');
 *     graph.addVertex('Z');
 *     graph.addEdge('X', 'Y', 1);
 *     graph.addEdge('Y', 'Z', 2);
 *
 *     // Delete an edge
 *     graph.deleteEdgeSrcToDest('X', 'Y');
 *     console.log(graph.hasEdge('X', 'Y')); // false;
 *
 *     // Edge in other direction should not exist
 *     console.log(graph.hasEdge('Y', 'X')); // false;
 *
 *     // Other edges should remain
 *     console.log(graph.hasEdge('Y', 'Z')); // true;
 *
 *     // Delete a vertex
 *     graph.deleteVertex('Y');
 *     console.log(graph.hasVertex('Y')); // false;
 *     console.log(graph.size); // 2;
 * @example
 * // DirectedGraph topologicalSort for task scheduling
 *  const graph = new DirectedGraph<string>();
 *
 *     // Build a DAG (Directed Acyclic Graph) for task dependencies
 *     graph.addVertex('Design');
 *     graph.addVertex('Implement');
 *     graph.addVertex('Test');
 *     graph.addVertex('Deploy');
 *
 *     // Add dependency edges
 *     graph.addEdge('Design', 'Implement', 1); // Design must come before Implement
 *     graph.addEdge('Implement', 'Test', 1); // Implement must come before Test
 *     graph.addEdge('Test', 'Deploy', 1); // Test must come before Deploy
 *
 *     // Topological sort gives valid execution order
 *     const executionOrder = graph.topologicalSort();
 *     console.log(executionOrder); // defined;
 *     console.log(executionOrder); // ['Design', 'Implement', 'Test', 'Deploy'];
 *
 *     // All vertices should be included
 *     console.log(executionOrder?.length); // 4;
 * @example
 * // DirectedGraph dijkstra shortest path for network routing
 *  // Build a weighted directed graph representing network nodes and costs
 *     const network = new DirectedGraph<string>();
 *
 *     // Add network nodes
 *     network.addVertex('Router-A');
 *     network.addVertex('Router-B');
 *     network.addVertex('Router-C');
 *     network.addVertex('Router-D');
 *     network.addVertex('Router-E');
 *
 *     // Add weighted edges (network latency costs)
 *     network.addEdge('Router-A', 'Router-B', 5);
 *     network.addEdge('Router-A', 'Router-C', 10);
 *     network.addEdge('Router-B', 'Router-D', 3);
 *     network.addEdge('Router-C', 'Router-D', 2);
 *     network.addEdge('Router-D', 'Router-E', 4);
 *     network.addEdge('Router-B', 'Router-E', 12);
 *
 *     // Find shortest path from Router-A to Router-E
 *     const { minDist, minPath } = network.dijkstra('Router-A', 'Router-E', true, true) || {
 *       minDist: undefined,
 *       minPath: undefined
 *     };
 *
 *     // Verify shortest path is found
 *     console.log(minDist); // defined;
 *     console.log(minPath); // defined;
 *
 *     // Shortest path should be A -> B -> D -> E with cost 5+3+4=12
 *     // Or A -> C -> D -> E with cost 10+2+4=16
 *     // So the minimum is 12
 *     console.log(minDist); // <= 16;
 *
 *     // Verify path is valid (includes start and end)
 *     console.log(minPath?.[0].key); // 'Router-A';
 *     console.log(minPath?.[minPath.length - 1].key); // 'Router-E';
 */
export class DirectedGraph<
  V = any,
  E = any,
  VO extends DirectedVertex<V> = DirectedVertex<V>,
  EO extends DirectedEdge<E> = DirectedEdge<E>
>
  extends AbstractGraph<V, E, VO, EO>
  implements IGraph<V, E, VO, EO>
{
  /**
   * Construct a directed graph with runtime defaults.
   * @param options - `GraphOptions<V>` (e.g. `vertexValueInitializer`, `defaultEdgeWeight`).
   * @remarks Time O(1), Space O(1)
   */
  constructor(options?: Partial<GraphOptions<V>>) {
    super(options);
  }

  protected _outEdgeMap: Map<VO, EO[]> = new Map<VO, EO[]>();

  get outEdgeMap(): Map<VO, EO[]> {
    return this._outEdgeMap;
  }

  set outEdgeMap(v: Map<VO, EO[]>) {
    this._outEdgeMap = v;
  }

  protected _inEdgeMap: Map<VO, EO[]> = new Map<VO, EO[]>();

  get inEdgeMap(): Map<VO, EO[]> {
    return this._inEdgeMap;
  }

  set inEdgeMap(v: Map<VO, EO[]>) {
    this._inEdgeMap = v;
  }

  /**
   * Construct a directed graph from keys with value initializer `v => v`.
   * @template K - Vertex key type.
   * @param keys - Iterable of vertex keys.
   * @returns DirectedGraph with all keys added.
   * @remarks Time O(V), Space O(V)
   */
  static fromKeys<K extends VertexKey>(keys: Iterable<K>): DirectedGraph<K, any, DirectedVertex<K>, DirectedEdge<any>> {
    const g: DirectedGraph<K, any, DirectedVertex<K>, DirectedEdge<any>> = new DirectedGraph<K, any>({
      vertexValueInitializer: (k: VertexKey) => k as K
    });
    for (const k of keys) g.addVertex(k);
    return g;
  }

  /**
   * Construct a directed graph from `[key, value]` entries.
   * @template V - Vertex value type.
   * @param entries - Iterable of `[key, value]` pairs.
   * @returns DirectedGraph with all vertices added.
   * @remarks Time O(V), Space O(V)
   */
  static fromEntries<V>(
    entries: Iterable<[VertexKey, V]>
  ): DirectedGraph<V, any, DirectedVertex<V>, DirectedEdge<any>> {
    const g: DirectedGraph<V, any, DirectedVertex<V>, DirectedEdge<any>> = new DirectedGraph<V, any>();
    for (const [k, v] of entries) g.addVertex(k, v);
    return g;
  }

  /**
   * Create a directed vertex instance. Does not insert into the graph.
   * @param key - Vertex identifier.
   * @param value - Optional payload.
   * @returns Concrete vertex instance.
   * @remarks Time O(1), Space O(1)
   */
  createVertex(key: VertexKey, value?: VO['value']): VO {
    return new DirectedVertex(key, value) as VO;
  }

  /**
   * Create a directed edge instance. Does not insert into the graph.
   * @param src - Source vertex key.
   * @param dest - Destination vertex key.
   * @param weight - Edge weight; defaults to `defaultEdgeWeight`.
   * @param value - Edge payload.
   * @returns Concrete edge instance.
   * @remarks Time O(1), Space O(1)
   */
  createEdge(src: VertexKey, dest: VertexKey, weight?: number, value?: E): EO {
    return new DirectedEdge(src, dest, weight ?? this.options.defaultEdgeWeight ?? 1, value) as EO;
  }

  /**
   * Get the unique edge from `src` to `dest`, if present.
   * @param srcOrKey - Source vertex or key.
   * @param destOrKey - Destination vertex or key.
   * @returns Edge instance or `undefined`.
   * @remarks Time O(1) avg, Space O(1)
   */
  getEdge(srcOrKey: VO | VertexKey | undefined, destOrKey: VO | VertexKey | undefined): EO | undefined {
    let edgeMap: EO[] = [];

    if (srcOrKey !== undefined && destOrKey !== undefined) {
      const src: VO | undefined = this._getVertex(srcOrKey);
      const dest: VO | undefined = this._getVertex(destOrKey);

      if (src && dest) {
        const srcOutEdges = this._outEdgeMap.get(src);
        if (srcOutEdges) {
          edgeMap = srcOutEdges.filter(edge => edge.dest === dest.key);
        }
      }
    }

    return edgeMap[0] || undefined;
  }

  /**
   * Delete edge `src -> dest` if present.
   * @param srcOrKey - Source vertex or key.
   * @param destOrKey - Destination vertex or key.
   * @returns Removed edge or `undefined`.
   * @remarks Time O(1) avg, Space O(1)
   */
  deleteEdgeSrcToDest(srcOrKey: VO | VertexKey, destOrKey: VO | VertexKey): EO | undefined {
    const src: VO | undefined = this._getVertex(srcOrKey);
    const dest: VO | undefined = this._getVertex(destOrKey);
    let removed: EO | undefined = undefined;
    if (!src || !dest) {
      return undefined;
    }

    const srcOutEdges = this._outEdgeMap.get(src);
    if (srcOutEdges) {
      arrayRemove<EO>(srcOutEdges, (edge: EO) => edge.dest === dest.key);
    }

    const destInEdges = this._inEdgeMap.get(dest);
    if (destInEdges) {
      removed = arrayRemove<EO>(destInEdges, (edge: EO) => edge.src === src.key)[0] || undefined;
    }
    return removed;
  }

  /**
   * Delete an edge by instance or by `(srcKey, destKey)`.
   * @param edgeOrSrcVertexKey - Edge instance or source vertex/key.
   * @param destVertexKey - Optional destination vertex/key when deleting by pair.
   * @returns Removed edge or `undefined`.
   * @remarks Time O(1) avg, Space O(1)
   */
  deleteEdge(edgeOrSrcVertexKey: EO | VertexKey, destVertexKey?: VertexKey): EO | undefined {
    let removed: EO | undefined = undefined;
    let src: VO | undefined, dest: VO | undefined;
    if (this.isVertexKey(edgeOrSrcVertexKey)) {
      if (this.isVertexKey(destVertexKey)) {
        src = this._getVertex(edgeOrSrcVertexKey);
        dest = this._getVertex(destVertexKey);
      } else {
        return;
      }
    } else {
      src = this._getVertex(edgeOrSrcVertexKey.src);
      dest = this._getVertex(edgeOrSrcVertexKey.dest);
    }

    if (src && dest) {
      const srcOutEdges = this._outEdgeMap.get(src);
      if (srcOutEdges && srcOutEdges.length > 0) {
        arrayRemove(srcOutEdges, (edge: EO) => edge.src === src!.key && edge.dest === dest?.key);
      }

      const destInEdges = this._inEdgeMap.get(dest);
      if (destInEdges && destInEdges.length > 0) {
        removed = arrayRemove(destInEdges, (edge: EO) => edge.src === src!.key && edge.dest === dest!.key)[0];
      }
    }

    return removed;
  }

  deleteVertex(vertexOrKey: VO | VertexKey): boolean {
    let vertexKey: VertexKey;
    let vertex: VO | undefined;
    if (this.isVertexKey(vertexOrKey)) {
      vertex = this.getVertex(vertexOrKey);
      vertexKey = vertexOrKey;
    } else {
      vertex = vertexOrKey;
      vertexKey = this._getVertexKey(vertexOrKey);
    }

    if (vertex) {
      /**
       * One-step neighbors following outgoing edges.
       * @param vertexOrKey - Vertex or key.
       * @returns Array of neighbor vertices.
       * @remarks Time O(deg_out), Space O(deg_out)
       */
      const neighbors = this.getNeighbors(vertex);
      for (const neighbor of neighbors) {
        this.deleteEdgeSrcToDest(vertex, neighbor);
      }
      this._outEdgeMap.delete(vertex);
      this._inEdgeMap.delete(vertex);
    }

    return this._vertexMap.delete(vertexKey);
  }

  deleteEdgesBetween(v1: VertexKey | VO, v2: VertexKey | VO): EO[] {
    const removed: EO[] = [];

    if (v1 && v2) {
      const v1ToV2 = this.deleteEdgeSrcToDest(v1, v2);
      const v2ToV1 = this.deleteEdgeSrcToDest(v2, v1);

      if (v1ToV2) removed.push(v1ToV2);
      if (v2ToV1) removed.push(v2ToV1);
    }

    return removed;
  }

  /**
   * Incoming edges of a vertex.
   * @param vertexOrKey - Vertex or key.
   * @returns Array of incoming edges.
   * @remarks Time O(deg_in), Space O(deg_in)
   */
  incomingEdgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const target = this._getVertex(vertexOrKey);
    if (target) {
      return this.inEdgeMap.get(target) || [];
    }
    return [];
  }

  /**
   * Outgoing edges of a vertex.
   * @param vertexOrKey - Vertex or key.
   * @returns Array of outgoing edges.
   * @remarks Time O(deg_out), Space O(deg_out)
   */
  outgoingEdgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const target = this._getVertex(vertexOrKey);
    if (target) {
      return this._outEdgeMap.get(target) || [];
    }
    return [];
  }

  /**
   * Degree (in + out) of a vertex.
   * @param vertexOrKey - Vertex or key.
   * @returns Non-negative integer.
   * @remarks Time O(1) avg, Space O(1)
   */
  degreeOf(vertexOrKey: VertexKey | VO): number {
    /**
     * In-degree of a vertex.
     * @param vertexOrKey - Vertex or key.
     * @returns Non-negative integer.
     * @remarks Time O(1) avg, Space O(1)
     */
    /**
     * Out-degree of a vertex.
     * @param vertexOrKey - Vertex or key.
     * @returns Non-negative integer.
     * @remarks Time O(1) avg, Space O(1)
     */
    return this.outDegreeOf(vertexOrKey) + this.inDegreeOf(vertexOrKey);
  }

  inDegreeOf(vertexOrKey: VertexKey | VO): number {
    return this.incomingEdgesOf(vertexOrKey).length;
  }

  outDegreeOf(vertexOrKey: VertexKey | VO): number {
    return this.outgoingEdgesOf(vertexOrKey).length;
  }

  /**
   * All incident edges of a vertex.
   * @param vertexOrKey - Vertex or key.
   * @returns Array of incident edges.
   * @remarks Time O(deg_in + deg_out), Space O(deg_in + deg_out)
   */
  edgesOf(vertexOrKey: VertexKey | VO): EO[] {
    return [...this.outgoingEdgesOf(vertexOrKey), ...this.incomingEdgesOf(vertexOrKey)];
  }

  getEdgeSrc(e: EO): VO | undefined {
    return this._getVertex(e.src);
  }

  getEdgeDest(e: EO): VO | undefined {
    return this._getVertex(e.dest);
  }

  /**
   * Direct children reachable by one outgoing edge.
   * @param vertex - Vertex or key.
   * @returns Array of neighbor vertices.
   * @remarks Time O(deg_out), Space O(deg_out)
   */
  getDestinations(vertex: VO | VertexKey | undefined): VO[] {
    if (vertex === undefined) {
      return [];
    }
    const destinations: VO[] = [];
    const outgoingEdges = this.outgoingEdgesOf(vertex);
    for (const outEdge of outgoingEdges) {
      const child = this.getEdgeDest(outEdge);
      if (child) {
        destinations.push(child);
      }
    }
    return destinations;
  }

  /**
   * Topological sort if DAG; returns `undefined` if a cycle exists.
   * @param propertyName - `'key'` to map to keys; `'vertex'` to keep instances.
   * @returns Array of keys/vertices, or `undefined` when cycle is found.
   * @remarks Time O(V + E), Space O(V)
   */
  topologicalSort(propertyName?: 'vertex' | 'key'): Array<VO | VertexKey> | undefined {
    propertyName = propertyName ?? 'key';

    const statusMap: Map<VO | VertexKey, TopologicalStatus> = new Map<VO | VertexKey, TopologicalStatus>();
    for (const entry of this.vertexMap) {
      statusMap.set(entry[1], 0);
    }

    let sorted: (VO | VertexKey)[] = [];
    let hasCycle = false;
    const dfs = (cur: VO | VertexKey) => {
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

    for (const entry of this.vertexMap) {
      if (statusMap.get(entry[1]) === 0) {
        dfs(entry[1]);
      }
    }

    if (hasCycle) return undefined;

    if (propertyName === 'key') sorted = sorted.map(vertex => (vertex instanceof DirectedVertex ? vertex.key : vertex));
    return sorted.reverse();
  }

  edgeSet(): EO[] {
    let edgeMap: EO[] = [];
    this._outEdgeMap.forEach(outEdges => {
      edgeMap = [...edgeMap, ...outEdges];
    });
    return edgeMap;
  }

  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const neighbors: VO[] = [];
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      const outEdges = this.outgoingEdgesOf(vertex);
      for (const outEdge of outEdges) {
        const neighbor = this._getVertex(outEdge.dest);

        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  /**
   * Resolve an edge's `[src, dest]` endpoints to vertex instances.
   * @param edge - Edge instance.
   * @returns `[src, dest]` or `undefined` if either endpoint is missing.
   * @remarks Time O(1), Space O(1)
   */
  getEndsOfEdge(edge: EO): [VO, VO] | undefined {
    if (!this.hasEdge(edge.src, edge.dest)) {
      return undefined;
    }
    const v1 = this._getVertex(edge.src);
    const v2 = this._getVertex(edge.dest);
    if (v1 && v2) {
      return [v1, v2];
    } else {
      return undefined;
    }
  }

  /**
   * Whether the graph has no vertices and no edges.
   * @remarks Time O(1), Space O(1)
   */
  isEmpty(): boolean {
    return this.vertexMap.size === 0 && this.inEdgeMap.size === 0 && this.outEdgeMap.size === 0;
  }

  /**
   * Remove all vertices and edges.
   * @remarks Time O(V + E), Space O(1)
   */
  clear() {
    this._vertexMap = new Map<VertexKey, VO>();
    this._inEdgeMap = new Map<VO, EO[]>();
    this._outEdgeMap = new Map<VO, EO[]>();
  }

  /**
   * Deep clone as the same concrete class.
   * @returns A new graph of the same concrete class (`this` type).
   * @remarks Time O(V + E), Space O(V + E)
   */
  override clone(): this {
    return super.clone();
  }

  /**
   * Tarjan's algorithm for strongly connected components.
   * @returns `{ dfnMap, lowMap, SCCs }`.
   * @remarks Time O(V + E), Space O(V + E)
   */
  tarjan(): { dfnMap: Map<VO, number>; lowMap: Map<VO, number>; SCCs: Map<number, VO[]> } {
    const dfnMap = new Map<VO, number>();
    const lowMap = new Map<VO, number>();
    const SCCs = new Map<number, VO[]>();

    let time = 0;

    const stack: VO[] = [];
    const inStack: Set<VO> = new Set();

    const dfs = (vertex: VO) => {
      dfnMap.set(vertex, time);
      lowMap.set(vertex, time);
      time++;

      stack.push(vertex);
      inStack.add(vertex);

      const neighbors = this.getNeighbors(vertex);
      for (const neighbor of neighbors) {
        if (!dfnMap.has(neighbor)) {
          dfs(neighbor);
          lowMap.set(vertex, Math.min(lowMap.get(vertex)!, lowMap.get(neighbor)!));
        } else if (inStack.has(neighbor)) {
          lowMap.set(vertex, Math.min(lowMap.get(vertex)!, dfnMap.get(neighbor)!));
        }
      }

      if (dfnMap.get(vertex) === lowMap.get(vertex)) {
        const SCC: VO[] = [];
        let poppedVertex: VO | undefined;

        do {
          poppedVertex = stack.pop();
          inStack.delete(poppedVertex!);
          SCC.push(poppedVertex!);
        } while (poppedVertex !== vertex);

        SCCs.set(SCCs.size, SCC);
      }
    };

    for (const vertex of this.vertexMap.values()) {
      if (!dfnMap.has(vertex)) {
        dfs(vertex);
      }
    }

    return { dfnMap, lowMap, SCCs };
  }

  /**
   * DFN index map computed by `tarjan()`.
   * @returns Map from vertex to DFN index.
   * @remarks Time O(V), Space O(V)
   */
  getDFNMap(): Map<VO, number> {
    return this.tarjan().dfnMap;
  }

  /**
   * LOW link map computed by `tarjan()`.
   * @returns Map from vertex to LOW value.
   * @remarks Time O(V), Space O(V)
   */
  getLowMap(): Map<VO, number> {
    return this.tarjan().lowMap;
  }

  /**
   * Strongly connected components computed by `tarjan()`.
   * @returns Map from SCC id to vertices.
   * @remarks Time O(#SCC + V), Space O(V)
   */
  getSCCs(): Map<number, VO[]> {
    return this.tarjan().SCCs;
  }

  /**
   * Internal hook to attach a directed edge into adjacency maps.
   * @param edge - Edge instance.
   * @returns `true` if inserted; otherwise `false`.
   * @remarks Time O(1) avg, Space O(1)
   */
  protected _addEdge(edge: EO): boolean {
    if (!(this.hasVertex(edge.src) && this.hasVertex(edge.dest))) {
      return false;
    }

    const srcVertex = this._getVertex(edge.src);
    const destVertex = this._getVertex(edge.dest);

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
}
