import {VertexId} from '../types';

export interface IGraph<V, E> {

    hasVertex(vertexOrId: V | VertexId): boolean;

    getVertex(vertexOrId: VertexId | V): V | null;

    getVertexId(vertexOrId: V | VertexId): VertexId;

    vertexSet(): Map<VertexId, V>;

    addVertex(v: V): boolean;

    removeVertex(vertexOrId: V | VertexId): boolean;

    removeAllVertices(vertices: V[] | VertexId[]): boolean;

    degreeOf(vertexOrId: V | VertexId): number;

    edgesOf(vertexOrId: V | VertexId): E[];

    hasEdge(src: V | VertexId, dest: V | VertexId): boolean;

    getEdge(srcOrId: V | VertexId, destOrId: V | VertexId): E | null;

    edgeSet(): E[];

    addEdge(edge: E): boolean;

    removeEdgeBetween(srcOrId: V | VertexId, destOrId: V | VertexId): E | null;

    removeEdge(edge: E): E | null;

    setEdgeWeight(srcOrId: V | VertexId, destOrId: V | VertexId, weight: number): boolean;

    getMinPathBetween(v1: V | VertexId, v2: V | VertexId, isWeight?: boolean): V[] | null;

    getNeighbors(vertexOrId: V | VertexId): V[];
}