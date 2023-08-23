import {VertexId} from '../types';
import {IAbstractGraph} from './abstract-graph';

export interface IDirectedGraph<V, E> extends IAbstractGraph<V, E> {
    incomingEdgesOf(vertex: V): E[];

    outgoingEdgesOf(vertex: V): E[];

    inDegreeOf(vertexOrId: V | VertexId): number;

    outDegreeOf(vertexOrId: V | VertexId): number;

    getEdgeSrc(e: E): V | null;

    getEdgeDest(e: E): V | null;

    removeEdgeSrcToDest(srcOrId: V | VertexId, destOrId: V | VertexId): E | null;

    removeEdgesBetween(v1: V | VertexId, v2: V | VertexId): E[];
}