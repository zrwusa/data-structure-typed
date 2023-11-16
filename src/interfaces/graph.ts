import { VertexKey } from '../types';

export interface IGraph<V, E, VO, EO> {
  createVertex(key: VertexKey, value?: V): VO;

  createEdge(srcOrV1: VertexKey, destOrV2: VertexKey, weight?: number, value?: E): EO;
}
