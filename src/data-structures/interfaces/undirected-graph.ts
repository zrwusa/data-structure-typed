import {VertexId} from '../types';
import {IAbstractGraph} from './abstract-graph';

export interface IUNDirectedGraph<V, E> extends IAbstractGraph<V, E>{
    removeEdgeBetween(v1: V | VertexId, v2: V | VertexId): E | null;
}