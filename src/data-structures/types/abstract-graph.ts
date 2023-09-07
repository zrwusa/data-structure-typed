export type VertexId = string | number;
export type EdgeId = string;
export type DijkstraResult<V> =
    { distMap: Map<V, number>, distPaths?: Map<V, V[]> ,preMap: Map<V, V | null>, seen: Set<V>, paths: V[][], minDist: number, minPath: V[] }
    | null;
