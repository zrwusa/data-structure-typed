import {VertexKey} from '../types';
import {IAbstractGraph} from './abstract-graph';

export interface IUNDirectedGraph<V, E> extends IAbstractGraph<V, E> {
  removeEdgeBetween(v1: V | VertexKey, v2: V | VertexKey): E | null;
}
