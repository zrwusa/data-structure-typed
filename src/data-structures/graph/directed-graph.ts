/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { TopologicalStatus, VertexKey } from '../../types';
import { AbstractEdge, AbstractGraph, AbstractVertex } from './abstract-graph';
import { IGraph } from '../../interfaces';
import { arrayRemove } from '../../utils';

export class DirectedVertex<V = any> extends AbstractVertex<V> {
  /**
   * The constructor function initializes a vertex with an optional value.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex. It is
   * used to uniquely identify the vertex within a graph or data structure.
   * @param {V} [value] - The "value" parameter is an optional parameter of type V. It is used to initialize the value of the
   * vertex. If no value is provided, the vertex will be initialized with a default value.
   */
  constructor(key: VertexKey, value?: V) {
    super(key, value);
  }
}

export class DirectedEdge<E = any> extends AbstractEdge<E> {
  src: VertexKey;
  dest: VertexKey;

  /**
   * The constructor function initializes the source and destination vertexMap of an edge, along with an optional weight
   * and value.
   * @param {VertexKey} src - The `src` parameter is the source vertex ID. It represents the starting point of an edge in
   * a graph.
   * @param {VertexKey} dest - The `dest` parameter represents the destination vertex of an edge. It is of type
   * `VertexKey`, which is likely a unique identifier for a vertex in a graph.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
   * @param {E} [value] - The `value` parameter is an optional parameter of type `E`. It represents the value associated with
   * the edge.
   */
  constructor(src: VertexKey, dest: VertexKey, weight?: number, value?: E) {
    super(weight, value);
    this.src = src;
    this.dest = dest;
  }
}

export class DirectedGraph<
  V = any,
  E = any,
  VO extends DirectedVertex<V> = DirectedVertex<V>,
  EO extends DirectedEdge<E> = DirectedEdge<E>
>
  extends AbstractGraph<V, E, VO, EO>
  implements IGraph<V, E, VO, EO> {
  /**
   * The constructor function initializes an instance of a class.
   */
  constructor() {
    super();
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
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */

  /**
   * The function creates a new vertex with an optional value and returns it.
   * @param {VertexKey} key - The `key` parameter is the unique identifier for the vertex. It is of type `VertexKey`, which
   * could be a number or a string depending on how you want to identify your vertexMap.
   * @param [value] - The 'value' parameter is an optional value that can be assigned to the vertex. If a value is provided,
   * it will be assigned to the 'value' property of the vertex. If no value is provided, the 'value' property will be
   * assigned the same value as the 'key' parameter
   * @returns a new instance of a DirectedVertex object, casted as type VO.
   */
  createVertex(key: VertexKey, value?: V): VO {
    return new DirectedVertex(key, value) as VO;
  }

  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */

  /**
   * The function creates a directed edge between two vertexMap with an optional weight and value.
   * @param {VertexKey} src - The source vertex ID of the edge. It represents the starting point of the edge.
   * @param {VertexKey} dest - The `dest` parameter is the identifier of the destination vertex for the edge.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge. If no
   * weight is provided, it defaults to 1.
   * @param [value] - The 'value' parameter is an optional value that can be assigned to the edge. It can be of any type and
   * is used to store additional information or data associated with the edge.
   * @returns a new instance of a DirectedEdge object, casted as type EO.
   */
  createEdge(src: VertexKey, dest: VertexKey, weight?: number, value?: E): EO {
    return new DirectedEdge(src, dest, weight ?? 1, value) as EO;
  }

  /**
   * Time Complexity: O(|V|) where |V| is the number of vertexMap
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|V|) where |V| is the number of vertexMap
   * Space Complexity: O(1)
   *
   * The `getEdge` function retrieves an edge between two vertexMap based on their source and destination IDs.
   * @param {VO | VertexKey | undefined} srcOrKey - The source vertex or its ID. It can be either a vertex object or a vertex ID.
   * @param {VO | VertexKey | undefined} destOrKey - The `destOrKey` parameter in the `getEdge` function represents the
   * destination vertex of the edge. It can be either a vertex object (`VO`), a vertex ID (`VertexKey`), or `undefined` if the
   * destination is not specified.
   * @returns the first edge found between the source and destination vertexMap, or undefined if no such edge is found.
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
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function removes an edge between two vertexMap in a graph and returns the removed edge.
   * @param {VO | VertexKey} srcOrKey - The source vertex or its ID.
   * @param {VO | VertexKey} destOrKey - The `destOrKey` parameter represents the destination vertex or its ID.
   * @returns the removed edge (EO) if it exists, or undefined if either the source or destination vertex does not exist.
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
   * Time Complexity: O(E) where E is the number of edgeMap
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(E) where E is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The `deleteEdge` function removes an edge from a graph and returns the removed edge.
   * @param {EO | VertexKey} edgeOrSrcVertexKey - The `edge` parameter can be either an `EO` object (edge object) or
   * a `VertexKey` (key of a vertex).
   * @param {VertexKey} [destVertexKey] - The `destVertexKey` parameter is an optional parameter that
   * represents the key of the destination vertex of the edge. It is used to specify the destination
   * vertex when the `edge` parameter is a vertex key. If `destVertexKey` is not provided, the function
   * assumes that the `edge`
   * @returns the removed edge (EO) or undefined if no edge was removed.
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

  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   */

  /**
   * Time Complexity: O(1) - Constant time for Map operations.
   * Space Complexity: O(1) - Constant space, as it creates only a few variables.
   *
   * The `deleteVertex` function removes a vertex from a graph by its ID or by the vertex object itself.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method is returning a boolean value.
   */
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
      const neighbors = this.getNeighbors(vertex);
      for (const neighbor of neighbors) {
        // this._inEdgeMap.delete(neighbor);
        this.deleteEdgeSrcToDest(vertex, neighbor);
      }
      this._outEdgeMap.delete(vertex);
      this._inEdgeMap.delete(vertex);
    }

    return this._vertexMap.delete(vertexKey);
  }

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function removes edgeMap between two vertexMap and returns the removed edgeMap.
   * @param {VertexKey | VO} v1 - The parameter `v1` can be either a `VertexKey` or a `VO`. A `VertexKey` represents the
   * unique identifier of a vertex in a graph, while `VO` represents the actual vertex object.
   * @param {VertexKey | VO} v2 - The parameter `v2` represents either a `VertexKey` or a `VO` object. It is used to specify
   * the second vertex in the edge that needs to be removed.
   * @returns an array of removed edgeMap (EO[]).
   */
  deleteEdgesBetween(v1: VertexKey | VO, v2: VertexKey | VO): EO[] {
    const removed: EO[] = [];

    if (v1 && v2) {
      const v1ToV2 = this.deleteEdgeSrcToDest(v1, v2);
      const v2ToV1 = this.deleteEdgeSrcToDest(v2, v1);

      v1ToV2 && removed.push(v1ToV2);
      v2ToV1 && removed.push(v2ToV1);
    }

    return removed;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `incomingEdgesOf` returns an array of incoming edgeMap for a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method `incomingEdgesOf` returns an array of edgeMap (`EO[]`).
   */
  incomingEdgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const target = this._getVertex(vertexOrKey);
    if (target) {
      return this.inEdgeMap.get(target) || [];
    }
    return [];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `outgoingEdgesOf` returns an array of outgoing edgeMap from a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can accept either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method `outgoingEdgesOf` returns an array of edgeMap (`EO[]`).
   */
  outgoingEdgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const target = this._getVertex(vertexOrKey);
    if (target) {
      return this._outEdgeMap.get(target) || [];
    }
    return [];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "degreeOf" returns the total degree of a vertex, which is the sum of its out-degree and in-degree.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The sum of the out-degree and in-degree of the specified vertex or vertex ID.
   */
  degreeOf(vertexOrKey: VertexKey | VO): number {
    return this.outDegreeOf(vertexOrKey) + this.inDegreeOf(vertexOrKey);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "inDegreeOf" returns the number of incoming edgeMap for a given vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The number of incoming edgeMap of the specified vertex or vertex ID.
   */
  inDegreeOf(vertexOrKey: VertexKey | VO): number {
    return this.incomingEdgesOf(vertexOrKey).length;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `outDegreeOf` returns the number of outgoing edgeMap from a given vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The number of outgoing edgeMap from the specified vertex or vertex ID.
   */
  outDegreeOf(vertexOrKey: VertexKey | VO): number {
    return this.outgoingEdgesOf(vertexOrKey).length;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "edgesOf" returns an array of both outgoing and incoming edgeMap of a given vertex or vertex ID.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The function `edgesOf` returns an array of edgeMap.
   */
  edgesOf(vertexOrKey: VertexKey | VO): EO[] {
    return [...this.outgoingEdgesOf(vertexOrKey), ...this.incomingEdgesOf(vertexOrKey)];
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEdgeSrc" returns the source vertex of an edge, or undefined if the edge does not exist.
   * @param {EO} e - The parameter "e" is of type EO, which represents an edge in a graph.
   * @returns either a vertex object (VO) or undefined.
   */
  getEdgeSrc(e: EO): VO | undefined {
    return this._getVertex(e.src);
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEdgeDest" returns the destination vertex of an edge.
   * @param {EO} e - The parameter "e" is of type "EO", which represents an edge in a graph.
   * @returns either a vertex object of type VO or undefined.
   */
  getEdgeDest(e: EO): VO | undefined {
    return this._getVertex(e.dest);
  }

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function `getDestinations` returns an array of destination vertexMap connected to a given vertex.
   * @param {VO | VertexKey | undefined} vertex - The `vertex` parameter represents the starting vertex from which we want to
   * find the destinations. It can be either a `VO` object, a `VertexKey` value, or `undefined`.
   * @returns an array of vertexMap (VO[]).
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
   * Time Complexity: O(|V| + |E|) where |V| is the number of vertexMap and |E| is the number of edgeMap
   * Space Complexity: O(|V|)
   */

  /**
   * Time Complexity: O(|V| + |E|) where |V| is the number of vertexMap and |E| is the number of edgeMap
   * Space Complexity: O(|V|)
   *
   * The `topologicalSort` function performs a topological sort on a graph and returns an array of vertexMap or vertex IDs
   * in the sorted order, or undefined if the graph contains a cycle.
   * @param {'vertex' | 'key'} [propertyName] - The `propertyName` parameter is an optional parameter that specifies the
   * property to use for sorting the vertexMap. It can have two possible values: 'vertex' or 'key'. If 'vertex' is
   * specified, the vertexMap themselves will be used for sorting. If 'key' is specified, the ids of
   * @returns an array of vertexMap or vertex IDs in topological order. If there is a cycle in the graph, it returns undefined.
   */
  topologicalSort(propertyName?: 'vertex' | 'key'): Array<VO | VertexKey> | undefined {
    propertyName = propertyName ?? 'key';
    // When judging whether there is a cycle in the undirected graph, all nodes with degree of **<= 1** are enqueued
    // When judging whether there is a cycle in the directed graph, all nodes with **in degree = 0** are enqueued
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

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(|E|)
   */

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(|E|)
   *
   * The `edgeSet` function returns an array of all the edgeMap in the graph.
   * @returns The `edgeSet()` method returns an array of edgeMap (`EO[]`).
   */
  edgeSet(): EO[] {
    let edgeMap: EO[] = [];
    this._outEdgeMap.forEach(outEdges => {
      edgeMap = [...edgeMap, ...outEdges];
    });
    return edgeMap;
  }

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(|E|) where |E| is the number of edgeMap
   * Space Complexity: O(1)
   *
   * The function `getNeighbors` returns an array of neighboring vertexMap of a given vertex or vertex ID in a graph.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns an array of vertexMap (VO[]).
   */
  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const neighbors: VO[] = [];
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      const outEdges = this.outgoingEdgesOf(vertex);
      for (const outEdge of outEdges) {
        const neighbor = this._getVertex(outEdge.dest);
        // TODO after no-non-undefined-assertion not ensure the logic
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function "getEndsOfEdge" returns the source and destination vertexMap of an edge if it exists in the graph,
   * otherwise it returns undefined.
   * @param {EO} edge - The parameter `edge` is of type `EO`, which represents an edge in a graph.
   * @returns The function `getEndsOfEdge` returns an array containing two vertexMap `[VO, VO]` if the edge exists in the
   * graph. If the edge does not exist, it returns `undefined`.
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
   * The isEmpty function checks if the graph is empty.
   *
   * @return A boolean value
   */
  isEmpty(): boolean {
    return this.vertexMap.size === 0 && this.inEdgeMap.size === 0 && this.outEdgeMap.size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The clear function resets the vertex map, in-edge map, and out-edge map.
   */
  clear() {
    this._vertexMap = new Map<VertexKey, VO>();
    this._inEdgeMap = new Map<VO, EO[]>();
    this._outEdgeMap = new Map<VO, EO[]>();
  }

  /**
   * The clone function creates a new DirectedGraph object with the same vertices and edges as the original.
   *
   * @return A new instance of the directedgraph class
   */
  clone(): DirectedGraph<V, E, VO, EO> {
    const cloned = new DirectedGraph<V, E, VO, EO>();
    cloned.vertexMap = new Map<VertexKey, VO>(this.vertexMap);
    cloned.inEdgeMap = new Map<VO, EO[]>(this.inEdgeMap);
    cloned.outEdgeMap = new Map<VO, EO[]>(this.outEdgeMap);
    return cloned;
  }

  /**
   *  Time Complexity: O(V + E)
   *  Space Complexity: O(V)
   *  Tarjan is an algorithm based on dfs,which is used to solve the connectivity problem of graphs.
   *  Tarjan can find the SSC(strongly connected components), articulation points, and bridges of directed graphs.
   */

  /**
   *  Time Complexity: O(V + E)
   *  Space Complexity: O(V)
   *  Tarjan is an algorithm based on dfs,which is used to solve the connectivity problem of graphs.
   *  Tarjan can find the SSC(strongly connected components), articulation points, and bridges of directed graphs.
   *
   * The function `tarjan` implements the Tarjan's algorithm to find strongly connected components in a
   * graph.
   * @returns The function `tarjan()` returns an object with three properties: `dfnMap`, `lowMap`, and
   * `SCCs`.
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
   * Time Complexity: O(V + E) - Depends on the implementation (Tarjan's algorithm).
   * Space Complexity: O(V) - Depends on the implementation (Tarjan's algorithm).
   */

  /**
   * Time Complexity: O(V + E) - Depends on the implementation (Tarjan's algorithm).
   * Space Complexity: O(V) - Depends on the implementation (Tarjan's algorithm).
   *
   * The function returns a map that associates each vertex object with its corresponding depth-first
   * number.
   * @returns A Map object with keys of type VO and values of type number.
   */
  getDFNMap(): Map<VO, number> {
    return this.tarjan().dfnMap;
  }

  /**
   * The function returns a Map object that contains the low values of each vertex in a Tarjan
   * algorithm.
   * @returns The method `getLowMap()` is returning a `Map` object with keys of type `VO` and values of
   * type `number`.
   */
  getLowMap(): Map<VO, number> {
    return this.tarjan().lowMap;
  }

  /**
   * The function "getSCCs" returns a map of strongly connected components (SCCs) using the Tarjan
   * algorithm.
   * @returns a map where the keys are numbers and the values are arrays of VO objects.
   */
  getSCCs(): Map<number, VO[]> {
    return this.tarjan().SCCs;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `_addEdge` adds an edge to a graph if the source and destination vertexMap exist.
   * @param {EO} edge - The parameter `edge` is of type `EO`, which represents an edge in a graph. It is the edge that
   * needs to be added to the graph.
   * @returns a boolean value. It returns true if the edge was successfully added to the graph, and false if either the
   * source or destination vertex does not exist in the graph.
   */
  protected _addEdge(edge: EO): boolean {
    if (!(this.hasVertex(edge.src) && this.hasVertex(edge.dest))) {
      return false;
    }

    const srcVertex = this._getVertex(edge.src);
    const destVertex = this._getVertex(edge.dest);

    // TODO after no-non-undefined-assertion not ensure the logic
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
