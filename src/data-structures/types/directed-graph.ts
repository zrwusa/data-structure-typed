import {VertexId} from './abstract-graph';

export interface IDirectedGraph<V, E> {
    incomingEdgesOf(vertex: V): E[];

    outgoingEdgesOf(vertex: V): E[];

    inDegreeOf(vertexOrId: V | VertexId): number;

    outDegreeOf(vertexOrId: V | VertexId): number;

    getEdgeSrc(e: E): V | null;

    getEdgeDest(e: E): V | null;
}

// 0 means unknown, 1 means visiting, 2 means visited;
export type TopologicalStatus = 0 | 1 | 2;