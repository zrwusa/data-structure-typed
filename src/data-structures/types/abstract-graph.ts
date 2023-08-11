export type VertexId = string | number;
export type DijkstraResult<V> =
    { distMap: Map<V, number>, preMap: Map<V, V | null>, seen: Set<V>, paths: V[][], minDist: number, minPath: V[] }
    | null;

export interface IGraph<V, E> {

    containsVertex(vertexOrId: V | VertexId): boolean;

    getVertex(vertexOrId: VertexId | V): V | null;

    getVertexId(vertexOrId: V | VertexId): VertexId;

    vertexSet(): Map<VertexId, V>;

    addVertex(v: V): boolean;

    removeVertex(vertexOrId: V | VertexId): boolean;

    removeAllVertices(vertices: V[] | VertexId[]): boolean;

    degreeOf(vertexOrId: V | VertexId): number;

    edgesOf(vertexOrId: V | VertexId): E[];

    containsEdge(src: V | VertexId, dest: V | VertexId): boolean;

    // containsEdge(e: E): boolean;

    getEdge(srcOrId: V | VertexId, destOrId: V | VertexId): E | null;

    // getAllEdges(src: V, dest: V): E[];

    edgeSet(): E[];

    addEdge(edge: E): boolean;

    removeEdgeBetween(srcOrId: V | VertexId, destOrId: V | VertexId): E | null;

    removeEdge(edge: E): E | null;

    // removeAllEdges(v1: VertexId | V, v2: VertexId | V): (E | null)[];

    // removeAllEdges(edges: E[] | [VertexId, VertexId]): boolean;

    setEdgeWeight(srcOrId: V | VertexId, destOrId: V | VertexId, weight: number): boolean;

    getMinPathBetween(v1: V | VertexId, v2: V | VertexId, isWeight?: boolean): V[] | null;

    getNeighbors(vertexOrId: V | VertexId): V[];
}