import {MapGraphCoordinate, VertexId } from '../types';
import {DirectedEdge, DirectedGraph, DirectedVertex} from './directed-graph';

export class MapVertex<T = any> extends DirectedVertex<T> {

    constructor(id: VertexId, lat: number, long: number, val?: T) {
        super(id, val);
        this.lat = lat;
        this.long = long;
    }
    lat: number;
    long: number;
}

export class MapEdge<T = any> extends DirectedEdge<T> {
    constructor(src: VertexId, dest: VertexId, weight?: number, val?: T) {
        super(src, dest, weight, val);
    }
}


export class MapGraph<V extends MapVertex<V['val']> = MapVertex, E extends MapEdge = MapEdge> extends DirectedGraph<V, E> {
    constructor(topLeft: MapGraphCoordinate, bottomRight: MapGraphCoordinate) {
        super();
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    topLeft: MapGraphCoordinate;
    bottomRight: MapGraphCoordinate;

    override createVertex(id: VertexId, val?: V['val'], lat: number = this.topLeft[0], long: number = this.topLeft[1]): V {
        return new MapVertex(id, lat, long, val) as V;
    }

    override createEdge(src: VertexId, dest: VertexId, weight?: number, val?: E['val']): E {
        return new MapEdge(src, dest, weight, val) as E;
    }
}