/**
 * data-structure-typed
 *
 * @author Tyler Zeng
 * @copyright Copyright (c) 2022 Tyler Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import {arrayRemove} from '../../utils';
import {AbstractEdge, AbstractGraph, AbstractVertex} from './abstract-graph';
import type {TopologicalStatus, VertexKey} from '../../types';
import {IGraph} from '../../interfaces';

export class DirectedVertex<V = any> extends AbstractVertex<V> {
  /**
   * The constructor function initializes a vertex with an optional value.
   * @param {VertexKey} key - The `key` parameter is of type `VertexKey` and represents the identifier of the vertex. It is
   * used to uniquely identify the vertex within a graph or data structure.
   * @param {V} [val] - The "val" parameter is an optional parameter of type V. It is used to initialize the value of the
   * vertex. If no value is provided, the vertex will be initialized with a default value.
   */
  constructor(key: VertexKey, val?: V) {
    super(key, val);
  }
}

export class DirectedEdge<E = any> extends AbstractEdge<E> {
  /**
   * The constructor function initializes the source and destination vertices of an edge, along with an optional weight
   * and value.
   * @param {VertexKey} src - The `src` parameter is the source vertex ID. It represents the starting point of an edge in
   * a graph.
   * @param {VertexKey} dest - The `dest` parameter represents the destination vertex of an edge. It is of type
   * `VertexKey`, which is likely a unique identifier for a vertex in a graph.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge.
   * @param {E} [val] - The `val` parameter is an optional parameter of type `E`. It represents the value associated with
   * the edge.
   */
  constructor(src: VertexKey, dest: VertexKey, weight?: number, val?: E) {
    super(weight, val);
    this._src = src;
    this._dest = dest;
  }

  private _src: VertexKey;

  get src(): VertexKey {
    return this._src;
  }

  set src(v: VertexKey) {
    this._src = v;
  }

  private _dest: VertexKey;

  get dest(): VertexKey {
    return this._dest;
  }

  set dest(v: VertexKey) {
    this._dest = v;
  }
}

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
   * The constructor function initializes an instance of a class.
   */
  constructor() {
    super();
  }

  private _outEdgeMap: Map<VO, EO[]> = new Map<VO, EO[]>();

  get outEdgeMap(): Map<VO, EO[]> {
    return this._outEdgeMap;
  }

  private _inEdgeMap: Map<VO, EO[]> = new Map<VO, EO[]>();

  get inEdgeMap(): Map<VO, EO[]> {
    return this._inEdgeMap;
  }

  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */

  /**
   * The function creates a new vertex with an optional value and returns it.
   * @param {VertexKey} key - The `key` parameter is the unique identifier for the vertex. It is of type `VertexKey`, which
   * could be a number or a string depending on how you want to identify your vertices.
   * @param [val] - The 'val' parameter is an optional value that can be assigned to the vertex. If a value is provided,
   * it will be assigned to the 'val' property of the vertex. If no value is provided, the 'val' property will be
   * assigned the same value as the 'key' parameter
   * @returns a new instance of a DirectedVertex object, casted as type VO.
   */
  createVertex(key: VertexKey, val?: V): VO {
    return new DirectedVertex(key, val ?? key) as VO;
  }

  /**
   * In TypeScript, a subclass inherits the interface implementation of its parent class, without needing to implement the same interface again in the subclass. This behavior differs from Java's approach. In Java, if a parent class implements an interface, the subclass needs to explicitly implement the same interface, even if the parent class has already implemented it.
   * This means that using abstract methods in the parent class cannot constrain the grandchild classes. Defining methods within an interface also cannot constrain the descendant classes. When inheriting from this class, developers need to be aware that this method needs to be overridden.
   */

  /**
   * The function creates a directed edge between two vertices with an optional weight and value.
   * @param {VertexKey} src - The source vertex ID of the edge. It represents the starting point of the edge.
   * @param {VertexKey} dest - The `dest` parameter is the identifier of the destination vertex for the edge.
   * @param {number} [weight] - The weight parameter is an optional number that represents the weight of the edge. If no
   * weight is provided, it defaults to 1.
   * @param [val] - The 'val' parameter is an optional value that can be assigned to the edge. It can be of any type and
   * is used to store additional information or data associated with the edge.
   * @returns a new instance of a DirectedEdge object, casted as type EO.
   */
  createEdge(src: VertexKey, dest: VertexKey, weight?: number, val?: E): EO {
    return new DirectedEdge(src, dest, weight ?? 1, val) as EO;
  }

  /**
   * The `getEdge` function retrieves an edge between two vertices based on their source and destination IDs.
   * @param {VO | null | VertexKey} srcOrKey - The source vertex or its ID. It can be either a vertex object or a vertex ID.
   * @param {VO | null | VertexKey} destOrKey - The `destOrKey` parameter in the `getEdge` function represents the
   * destination vertex of the edge. It can be either a vertex object (`VO`), a vertex ID (`VertexKey`), or `null` if the
   * destination is not specified.
   * @returns the first edge found between the source and destination vertices, or null if no such edge is found.
   */
  getEdge(srcOrKey: VO | null | VertexKey, destOrKey: VO | null | VertexKey): EO | null {
    let edges: EO[] = [];

    if (srcOrKey !== null && destOrKey !== null) {
      const src: VO | null = this._getVertex(srcOrKey);
      const dest: VO | null = this._getVertex(destOrKey);

      if (src && dest) {
        const srcOutEdges = this._outEdgeMap.get(src);
        if (srcOutEdges) {
          edges = srcOutEdges.filter(edge => edge.dest === dest.key);
        }
      }
    }

    return edges[0] || null;
  }

  /**
   * The function removes an edge between two vertices in a graph and returns the removed edge.
   * @param {VO | VertexKey} srcOrKey - The source vertex or its ID.
   * @param {VO | VertexKey} destOrKey - The `destOrKey` parameter represents the destination vertex or its ID.
   * @returns the removed edge (EO) if it exists, or null if either the source or destination vertex does not exist.
   */
  deleteEdgeSrcToDest(srcOrKey: VO | VertexKey, destOrKey: VO | VertexKey): EO | null {
    const src: VO | null = this._getVertex(srcOrKey);
    const dest: VO | null = this._getVertex(destOrKey);
    let removed: EO | null = null;
    if (!src || !dest) {
      return null;
    }

    const srcOutEdges = this._outEdgeMap.get(src);
    if (srcOutEdges) {
      arrayRemove<EO>(srcOutEdges, (edge: EO) => edge.dest === dest.key);
    }

    const destInEdges = this._inEdgeMap.get(dest);
    if (destInEdges) {
      removed = arrayRemove<EO>(destInEdges, (edge: EO) => edge.src === src.key)[0] || null;
    }
    return removed;
  }

  /**
   * The function removes an edge from a graph and returns the removed edge, or null if the edge was not found.
   * @param {EO} edge - The `edge` parameter is an object that represents an edge in a graph. It has two properties: `src`
   * and `dest`, which represent the source and destination vertices of the edge, respectively.
   * @returns The method `deleteEdge` returns the removed edge (`EO`) if it exists, or `null` if the edge does not exist.
   */
  deleteEdge(edge: EO): EO | null {
    let removed: EO | null = null;
    const src = this._getVertex(edge.src);
    const dest = this._getVertex(edge.dest);
    if (src && dest) {
      const srcOutEdges = this._outEdgeMap.get(src);
      if (srcOutEdges && srcOutEdges.length > 0) {
        arrayRemove(srcOutEdges, (edge: EO) => edge.src === src.key);
      }

      const destInEdges = this._inEdgeMap.get(dest);
      if (destInEdges && destInEdges.length > 0) {
        removed = arrayRemove(destInEdges, (edge: EO) => edge.dest === dest.key)[0];
      }
    }

    return removed;
  }

  /**
   * The function removes edges between two vertices and returns the removed edges.
   * @param {VertexKey | VO} v1 - The parameter `v1` can be either a `VertexKey` or a `VO`. A `VertexKey` represents the
   * unique identifier of a vertex in a graph, while `VO` represents the actual vertex object.
   * @param {VertexKey | VO} v2 - The parameter `v2` represents either a `VertexKey` or a `VO` object. It is used to specify
   * the second vertex in the edge that needs to be removed.
   * @returns an array of removed edges (EO[]).
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
   * The function `incomingEdgesOf` returns an array of incoming edges for a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method `incomingEdgesOf` returns an array of edges (`EO[]`).
   */
  incomingEdgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const target = this._getVertex(vertexOrKey);
    if (target) {
      return this.inEdgeMap.get(target) || [];
    }
    return [];
  }

  /**
   * The function `outgoingEdgesOf` returns an array of outgoing edges from a given vertex or vertex ID.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can accept either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns The method `outgoingEdgesOf` returns an array of edges (`EO[]`).
   */
  outgoingEdgesOf(vertexOrKey: VO | VertexKey): EO[] {
    const target = this._getVertex(vertexOrKey);
    if (target) {
      return this._outEdgeMap.get(target) || [];
    }
    return [];
  }

  /**
   * The function "degreeOf" returns the total degree of a vertex, which is the sum of its out-degree and in-degree.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The sum of the out-degree and in-degree of the specified vertex or vertex ID.
   */
  degreeOf(vertexOrKey: VertexKey | VO): number {
    return this.outDegreeOf(vertexOrKey) + this.inDegreeOf(vertexOrKey);
  }

  /**
   * The function "inDegreeOf" returns the number of incoming edges for a given vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The number of incoming edges of the specified vertex or vertex ID.
   */
  inDegreeOf(vertexOrKey: VertexKey | VO): number {
    return this.incomingEdgesOf(vertexOrKey).length;
  }

  /**
   * The function `outDegreeOf` returns the number of outgoing edges from a given vertex.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The number of outgoing edges from the specified vertex or vertex ID.
   */
  outDegreeOf(vertexOrKey: VertexKey | VO): number {
    return this.outgoingEdgesOf(vertexOrKey).length;
  }

  /**
   * The function "edgesOf" returns an array of both outgoing and incoming edges of a given vertex or vertex ID.
   * @param {VertexKey | VO} vertexOrKey - The parameter `vertexOrKey` can be either a `VertexKey` or a `VO`.
   * @returns The function `edgesOf` returns an array of edges.
   */
  edgesOf(vertexOrKey: VertexKey | VO): EO[] {
    return [...this.outgoingEdgesOf(vertexOrKey), ...this.incomingEdgesOf(vertexOrKey)];
  }

  /**
   * The function "getEdgeSrc" returns the source vertex of an edge, or null if the edge does not exist.
   * @param {EO} e - The parameter "e" is of type EO, which represents an edge in a graph.
   * @returns either a vertex object (VO) or null.
   */
  getEdgeSrc(e: EO): VO | null {
    return this._getVertex(e.src);
  }

  /**
   * The function "getEdgeDest" returns the destination vertex of an edge.
   * @param {EO} e - The parameter "e" is of type "EO", which represents an edge in a graph.
   * @returns either a vertex object of type VO or null.
   */
  getEdgeDest(e: EO): VO | null {
    return this._getVertex(e.dest);
  }

  /**
   * The function `getDestinations` returns an array of destination vertices connected to a given vertex.
   * @param {VO | VertexKey | null} vertex - The `vertex` parameter represents the starting vertex from which we want to
   * find the destinations. It can be either a `VO` object, a `VertexKey` value, or `null`.
   * @returns an array of vertices (VO[]).
   */
  getDestinations(vertex: VO | VertexKey | null): VO[] {
    if (vertex === null) {
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
   * The `topologicalSort` function performs a topological sort on a graph and returns an array of vertices or vertex IDs
   * in the sorted order, or null if the graph contains a cycle.
   * @param {'vertex' | 'key'} [propertyName] - The `propertyName` parameter is an optional parameter that specifies the
   * property to use for sorting the vertices. It can have two possible values: 'vertex' or 'key'. If 'vertex' is
   * specified, the vertices themselves will be used for sorting. If 'key' is specified, the ids of
   * @returns an array of vertices or vertex IDs in topological order. If there is a cycle in the graph, it returns null.
   */
  topologicalSort(propertyName?: 'vertex' | 'key'): Array<VO | VertexKey> | null {
    propertyName = propertyName ?? 'key';
    // When judging whether there is a cycle in the undirected graph, all nodes with degree of **<= 1** are enqueued
    // When judging whether there is a cycle in the directed graph, all nodes with **in degree = 0** are enqueued
    const statusMap: Map<VO | VertexKey, TopologicalStatus> = new Map<VO | VertexKey, TopologicalStatus>();
    for (const entry of this.vertices) {
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

    for (const entry of this.vertices) {
      if (statusMap.get(entry[1]) === 0) {
        dfs(entry[1]);
      }
    }

    if (hasCycle) return null;

    if (propertyName === 'key') sorted = sorted.map(vertex => (vertex instanceof DirectedVertex ? vertex.key : vertex));
    return sorted.reverse();
  }

  /**
   * The `edgeSet` function returns an array of all the edges in the graph.
   * @returns The `edgeSet()` method returns an array of edges (`EO[]`).
   */
  edgeSet(): EO[] {
    let edges: EO[] = [];
    this._outEdgeMap.forEach(outEdges => {
      edges = [...edges, ...outEdges];
    });
    return edges;
  }

  /**
   * The function `getNeighbors` returns an array of neighboring vertices of a given vertex or vertex ID in a graph.
   * @param {VO | VertexKey} vertexOrKey - The parameter `vertexOrKey` can be either a vertex object (`VO`) or a vertex ID
   * (`VertexKey`).
   * @returns an array of vertices (VO[]).
   */
  getNeighbors(vertexOrKey: VO | VertexKey): VO[] {
    const neighbors: VO[] = [];
    const vertex = this._getVertex(vertexOrKey);
    if (vertex) {
      const outEdges = this.outgoingEdgesOf(vertex);
      for (const outEdge of outEdges) {
        const neighbor = this._getVertex(outEdge.dest);
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
   * @param {EO} edge - The parameter `edge` is of type `EO`, which represents an edge in a graph.
   * @returns The function `getEndsOfEdge` returns an array containing two vertices `[VO, VO]` if the edge exists in the
   * graph. If the edge does not exist, it returns `null`.
   */
  getEndsOfEdge(edge: EO): [VO, VO] | null {
    if (!this.hasEdge(edge.src, edge.dest)) {
      return null;
    }
    const v1 = this._getVertex(edge.src);
    const v2 = this._getVertex(edge.dest);
    if (v1 && v2) {
      return [v1, v2];
    } else {
      return null;
    }
  }

  /**
   * The function `_addEdgeOnly` adds an edge to a graph if the source and destination vertices exist.
   * @param {EO} edge - The parameter `edge` is of type `EO`, which represents an edge in a graph. It is the edge that
   * needs to be added to the graph.
   * @returns a boolean value. It returns true if the edge was successfully added to the graph, and false if either the
   * source or destination vertex does not exist in the graph.
   */
  protected _addEdgeOnly(edge: EO): boolean {
    if (!(this.hasVertex(edge.src) && this.hasVertex(edge.dest))) {
      return false;
    }

    const srcVertex = this._getVertex(edge.src);
    const destVertex = this._getVertex(edge.dest);

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

  protected _setOutEdgeMap(value: Map<VO, EO[]>) {
    this._outEdgeMap = value;
  }

  protected _setInEdgeMap(value: Map<VO, EO[]>) {
    this._inEdgeMap = value;
  }
}
