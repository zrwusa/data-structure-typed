[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / MapGraph

# Class: MapGraph\<V, E, VO, EO\>

Defined in: [data-structures/graph/map-graph.ts:96](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L96)

Directed graph variant carrying geospatial coordinates.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// City navigation with shortest path
 const map = new MapGraph([0, 0], [10, 10]);

    map.addVertex(new MapVertex('Home', '', 0, 0));
    map.addVertex(new MapVertex('Office', '', 3, 4));
    map.addVertex(new MapVertex('Cafe', '', 1, 2));
    map.addVertex(new MapVertex('Park', '', 2, 1));

    map.addEdge('Home', 'Cafe', 2.2);
    map.addEdge('Cafe', 'Office', 3.5);
    map.addEdge('Home', 'Park', 2.0);
    map.addEdge('Park', 'Office', 4.0);
    map.addEdge('Home', 'Office', 7.0);

    // Find shortest path
    const result = map.dijkstra('Home', 'Office', true, true);
    console.log(result?.minDist); // 5.7; // Home → Cafe → Office
    console.log(result?.minPath.map(v => v.key)); // ['Home', 'Cafe', 'Office'];
```

```ts
// Delivery route optimization
 const routes = new MapGraph([0, 0], [10, 10]);

    routes.addVertex(new MapVertex('Warehouse', '', 0, 0));
    routes.addVertex(new MapVertex('Customer A', '', 2, 3));
    routes.addVertex(new MapVertex('Customer B', '', 5, 1));
    routes.addVertex(new MapVertex('Customer C', '', 3, 5));

    routes.addEdge('Warehouse', 'Customer A', 3.6);
    routes.addEdge('Warehouse', 'Customer B', 5.1);
    routes.addEdge('Customer A', 'Customer C', 2.2);
    routes.addEdge('Customer A', 'Customer B', 3.6);
    routes.addEdge('Customer B', 'Customer C', 4.5);

    // Check outgoing neighbors of Customer A
    const neighbors = routes.getNeighbors('Customer A');
    console.log(neighbors.map(n => n.key).sort()); // ['Customer B', 'Customer C'];

    // Shortest path from Warehouse to Customer C
    const path = routes.getMinPathBetween('Warehouse', 'Customer C', true);
    console.log(path?.map(v => v.key)); // ['Warehouse', 'Customer A', 'Customer C'];
```

```ts
// Campus map with building connections
 const campus = new MapGraph([0, 0], [5, 5]);

    campus.addVertex(new MapVertex('Library', '', 0, 0));
    campus.addVertex(new MapVertex('Lab', '', 1, 1));
    campus.addVertex(new MapVertex('Cafeteria', '', 2, 0));

    campus.addEdge('Library', 'Lab', 5);
    campus.addEdge('Lab', 'Cafeteria', 3);
    campus.addEdge('Library', 'Cafeteria', 10);

    console.log(campus.hasVertex('Library')); // true;
    console.log(campus.hasVertex('Gym')); // false;

    // Direct distance vs shortest path
    const direct = campus.dijkstra('Library', 'Cafeteria', true, true);
    console.log(direct?.minDist); // 8;
```

## Extends

- [`DirectedGraph`](DirectedGraph.md)\<`V`, `E`, `VO`, `EO`\>

## Type Parameters

### V

`V` = `any`

Vertex value type.

### E

`E` = `any`

Edge value type.

### VO

`VO` *extends* [`MapVertex`](MapVertex.md)\<`V`\> = [`MapVertex`](MapVertex.md)\<`V`\>

Concrete vertex class (MapVertex&lt;V&gt;).

### EO

`EO` *extends* [`MapEdge`](MapEdge.md)\<`E`\> = [`MapEdge`](MapEdge.md)\<`E`\>

Concrete edge class (MapEdge&lt;E&gt;).

## Constructors

### Constructor

```ts
new MapGraph<V, E, VO, EO>(originCoord, bottomRight?): MapGraph<V, E, VO, EO>;
```

Defined in: [data-structures/graph/map-graph.ts:108](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L108)

Construct a MapGraph.

#### Parameters

##### originCoord

`MapGraphCoordinate`

Origin coordinate `[lat, long]` used as default.

##### bottomRight?

`MapGraphCoordinate`

Optional bottom-right coordinate for bounding boxes.

#### Returns

`MapGraph`\<`V`, `E`, `VO`, `EO`\>

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`DirectedGraph`](DirectedGraph.md).[`constructor`](DirectedGraph.md#constructor)

## Accessors

### \_edgeConnector

#### Get Signature

```ts
get protected _edgeConnector(): string;
```

Defined in: [data-structures/graph/directed-graph.ts:136](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L136)

The edge connector string used in visual output.
Override in subclasses (e.g., '--' for undirected, '->' for directed).

##### Returns

`string`

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_edgeConnector`](DirectedGraph.md#edgeconnector)

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/graph/abstract-graph.ts:89](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L89)

Total number of entries.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Entry count.

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`size`](DirectedGraph.md#size)

## Methods

### \_addEdge()

```ts
protected _addEdge(edge): boolean;
```

Defined in: [data-structures/graph/directed-graph.ts:994](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L994)

Internal hook to attach a directed edge into adjacency maps.

#### Parameters

##### edge

`EO`

Edge instance.

#### Returns

`boolean`

`true` if inserted; otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_addEdge`](DirectedGraph.md#addedge)

***

### \_addVertex()

```ts
protected _addVertex(newVertex): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:1054](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1054)

Insert a pre-built vertex into the graph.

#### Parameters

##### newVertex

`VO`

Concrete vertex instance.

#### Returns

`boolean`

`true` if inserted; `false` if key already exists.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_addVertex`](DirectedGraph.md#addvertex)

***

### \_createInstance()

```ts
protected _createInstance(options?): this;
```

Defined in: [data-structures/graph/map-graph.ts:181](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L181)

Re-create a same-species MapGraph instance from snapshot options.

#### Parameters

##### options?

`Partial`\<`Record`\<`string`, `unknown`\>\>

Snapshot options providing `originCoord`/`bottomRight`.

#### Returns

`this`

Empty MapGraph instance of `this` type.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`DirectedGraph`](DirectedGraph.md).[`_createInstance`](DirectedGraph.md#createinstance)

***

### \_createLike()

```ts
protected _createLike(iter?, options?): this;
```

Defined in: [data-structures/graph/abstract-graph.ts:1009](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1009)

Create a same-species graph populated with entries; preserves edges among kept vertices.

#### Parameters

##### iter?

`Iterable`\<\[`VertexKey`, `V` \| `undefined`\], `any`, `any`\>

Optional entries to seed the new graph.

##### options?

`Partial`\<`Record`\<`string`, `unknown`\>\>

Snapshot options.

#### Returns

`this`

A new graph of `this` type.

#### Remarks

Time O(V + E), Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_createLike`](DirectedGraph.md#createlike)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/graph/abstract-graph.ts:958](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L958)

Internal iterator over `[key, value]` entries in insertion order.

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[VertexKey, V | undefined]`.

#### Remarks

Time O(V), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_getIterator`](DirectedGraph.md#getiterator)

***

### \_getVertex()

```ts
protected _getVertex(vertexOrKey): VO | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:1068](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1068)

Resolve a vertex key or instance to the concrete vertex instance.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex key or existing vertex.

#### Returns

`VO` \| `undefined`

Vertex instance or `undefined`.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_getVertex`](DirectedGraph.md#getvertex)

***

### \_getVertexKey()

```ts
protected _getVertexKey(vertexOrKey): VertexKey;
```

Defined in: [data-structures/graph/abstract-graph.ts:1079](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1079)

Resolve a vertex key from a key or vertex instance.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex key or existing vertex.

#### Returns

`VertexKey`

The vertex key.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`_getVertexKey`](DirectedGraph.md#getvertexkey)

***

### \_snapshotOptions()

```ts
protected _snapshotOptions(): Record<string, unknown>;
```

Defined in: [data-structures/graph/map-graph.ts:171](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L171)

Include `originCoord` and `bottomRight` so `clone()/filter()` preserve geospatial settings.

#### Returns

`Record`\<`string`, `unknown`\>

Options bag extending super snapshot.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`DirectedGraph`](DirectedGraph.md).[`_snapshotOptions`](DirectedGraph.md#snapshotoptions)

***

### \[iterator\]()

```ts
iterator: IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L22)

Default iterator yielding `[key, value]` entries.

#### Parameters

##### args

...`any`[]

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n) to iterate, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`[iterator]`](DirectedGraph.md#iterator)

***

### addEdge()

Add an edge by instance or by `(src, dest, weight?, value?)`.

#### Param

Edge instance or source vertex/key.

#### Param

Destination vertex/key (when adding by pair).

#### Param

Edge weight.

#### Param

Edge payload.

#### Remarks

Time O(1) avg, Space O(1)

#### Call Signature

```ts
addEdge(edge): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:254](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L254)

##### Parameters

###### edge

`EO`

##### Returns

`boolean`

##### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`addEdge`](DirectedGraph.md#addedge)

#### Call Signature

```ts
addEdge(
   src, 
   dest, 
   weight?, 
   value?): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:256](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L256)

##### Parameters

###### src

`VertexKey` \| `VO`

###### dest

`VertexKey` \| `VO`

###### weight?

`number`

###### value?

`E`

##### Returns

`boolean`

##### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`addEdge`](DirectedGraph.md#addedge)

***

### addVertex()

Add a vertex by key/value or by pre-built vertex.

#### Param

Vertex key or existing vertex instance.

#### Param

Optional payload.

#### Remarks

Time O(1) avg, Space O(1)

#### Call Signature

```ts
addVertex(vertex): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:189](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L189)

##### Parameters

###### vertex

`VO`

##### Returns

`boolean`

##### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`addVertex`](DirectedGraph.md#addvertex)

#### Call Signature

```ts
addVertex(key, value?): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:191](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L191)

##### Parameters

###### key

`VertexKey`

###### value?

`V`

##### Returns

`boolean`

##### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`addVertex`](DirectedGraph.md#addvertex)

***

### bellmanFord()

```ts
bellmanFord(
   src, 
   scanNegativeCycle?, 
   getMin?, 
   genPath?): object;
```

Defined in: [data-structures/graph/abstract-graph.ts:705](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L705)

Bellman-Ford single-source shortest paths with option to scan negative cycles.

#### Parameters

##### src

`VertexKey` \| `VO`

Source vertex or key.

##### scanNegativeCycle?

`boolean`

If `true`, also detect negative cycles.

##### getMin?

`boolean`

If `true`, compute global minimum distance.

##### genPath?

`boolean`

If `true`, generate path arrays via predecessor map.

#### Returns

`object`

Result bag including distances, predecessors, and optional cycle flag.

##### distMap

```ts
distMap: Map<VO, number>;
```

##### hasNegativeCycle

```ts
hasNegativeCycle: boolean | undefined;
```

##### min

```ts
min: number;
```

##### minPath

```ts
minPath: VO[];
```

##### paths

```ts
paths: VO[][];
```

##### preMap

```ts
preMap: Map<VO, VO>;
```

#### Remarks

Time O(V * E), Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`bellmanFord`](DirectedGraph.md#bellmanford)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/graph/directed-graph.ts:824](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L824)

Remove all vertices and edges.

#### Returns

`void`

#### Remarks

Time O(V + E), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`clear`](DirectedGraph.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/graph/map-graph.ts:162](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L162)

Deep clone as the same concrete class.

#### Returns

`this`

A new graph of the same concrete class (`this` type).

#### Remarks

Time O(V + E), Space O(V + E)

#### Overrides

[`DirectedGraph`](DirectedGraph.md).[`clone`](DirectedGraph.md#clone)

***

### createEdge()

```ts
createEdge(
   src, 
   dest, 
   weight?, 
   value?): EO;
```

Defined in: [data-structures/graph/map-graph.ts:153](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L153)

Create a map edge (directed) with optional weight/value.

#### Parameters

##### src

`VertexKey`

Source key.

##### dest

`VertexKey`

Destination key.

##### weight?

`number`

Edge weight.

##### value?

`E`

Edge payload.

#### Returns

`EO`

MapEdge instance.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`DirectedGraph`](DirectedGraph.md).[`createEdge`](DirectedGraph.md#createedge)

***

### createVertex()

```ts
createVertex(
   key, 
   value?, 
   lat?, 
   long?): VO;
```

Defined in: [data-structures/graph/map-graph.ts:135](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/map-graph.ts#L135)

Create a map vertex with optional coordinates.

#### Parameters

##### key

`VertexKey`

Vertex identifier.

##### value?

`V`

Optional payload.

##### lat?

`number` = `...`

Latitude (defaults to `originCoord[0]`).

##### long?

`number` = `...`

Longitude (defaults to `originCoord[1]`).

#### Returns

`VO`

MapVertex instance.

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`DirectedGraph`](DirectedGraph.md).[`createVertex`](DirectedGraph.md#createvertex)

***

### degreeOf()

```ts
degreeOf(vertexOrKey): number;
```

Defined in: [data-structures/graph/directed-graph.ts:551](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L551)

Degree (in + out) of a vertex.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`number`

Non-negative integer.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`degreeOf`](DirectedGraph.md#degreeof)

***

### deleteEdge()

```ts
deleteEdge(edgeOrSrcVertexKey, destVertexKey?): EO | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:351](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L351)

Delete an edge by instance or by `(srcKey, destKey)`.

#### Parameters

##### edgeOrSrcVertexKey

`VertexKey` \| `EO`

Edge instance or source vertex/key.

##### destVertexKey?

`VertexKey`

Optional destination vertex/key when deleting by pair.

#### Returns

`EO` \| `undefined`

Removed edge or `undefined`.

#### Remarks

Time O(1) avg, Space O(1)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`deleteEdge`](DirectedGraph.md#deleteedge)

***

### deleteEdgeSrcToDest()

```ts
deleteEdgeSrcToDest(srcOrKey, destOrKey): EO | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:275](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L275)

Delete edge `src -> dest` if present.

#### Parameters

##### srcOrKey

`VertexKey` \| `VO`

Source vertex or key.

##### destOrKey

`VertexKey` \| `VO`

Destination vertex or key.

#### Returns

`EO` \| `undefined`

Removed edge or `undefined`.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`deleteEdgeSrcToDest`](DirectedGraph.md#deleteedgesrctodest)

***

### deleteVertex()

```ts
deleteVertex(vertexOrKey): boolean;
```

Defined in: [data-structures/graph/directed-graph.ts:414](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L414)

Remove a vertex

 *

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

#### Returns

`boolean`

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`deleteVertex`](DirectedGraph.md#deletevertex)

***

### dijkstraWithoutHeap()

```ts
dijkstraWithoutHeap(
   src, 
   dest?, 
   getMinDist?, 
genPaths?): DijkstraResult<VO>;
```

Defined in: [data-structures/graph/abstract-graph.ts:484](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L484)

Dijkstra without heap (array-based selection).

#### Parameters

##### src

`VertexKey` \| `VO`

Source vertex or key.

##### dest?

`VertexKey` \| `VO` \| `undefined`

Optional destination for early stop.

##### getMinDist?

`boolean` = `false`

If `true`, compute global minimum distance.

##### genPaths?

`boolean` = `false`

If `true`, also generate path arrays.

#### Returns

`DijkstraResult`\<`VO`\>

Result bag or `undefined` if source missing.

#### Remarks

Time O(V^2 + E), Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`dijkstraWithoutHeap`](DirectedGraph.md#dijkstrawithoutheap)

***

### edgeSet()

```ts
edgeSet(): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:734](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L734)

Get all edges

 *

#### Returns

`EO`[]

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`edgeSet`](DirectedGraph.md#edgeset)

***

### edgesOf()

```ts
edgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:581](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L581)

All incident edges of a vertex.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`EO`[]

Array of incident edges.

#### Remarks

Time O(deg_in + deg_out), Space O(deg_in + deg_out)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`edgesOf`](DirectedGraph.md#edgesof)

***

### entries()

```ts
entries(): IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`entries`](DirectedGraph.md#entries)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L66)

Test whether all entries satisfy the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if all pass; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`every`](DirectedGraph.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/graph/abstract-graph.ts:897](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L897)

Induced-subgraph filter: keep vertices where `predicate(key, value)` is true,
and only keep edges whose endpoints both survive.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`this`

A new graph of the same concrete class (`this` type).

#### Remarks

Time O(V + E), Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`filter`](DirectedGraph.md#filter)

***

### filterEntries()

```ts
filterEntries(predicate, thisArg?): [VertexKey, V | undefined][];
```

Defined in: [data-structures/graph/abstract-graph.ts:913](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L913)

Preserve the old behavior: return filtered entries as an array.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

##### thisArg?

`any`

#### Returns

\[`VertexKey`, `V` \| `undefined`\][]

#### Remarks

Time O(V), Space O(V)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`filterEntries`](DirectedGraph.md#filterentries)

***

### find()

```ts
find(callbackfn, thisArg?): [VertexKey, V | undefined] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L114)

Find the first entry that matches a predicate.

#### Parameters

##### callbackfn

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

\[`VertexKey`, `V` \| `undefined`\] \| `undefined`

Matching `[key, value]` or `undefined`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`find`](DirectedGraph.md#find)

***

### floydWarshall()

```ts
floydWarshall(): object;
```

Defined in: [data-structures/graph/abstract-graph.ts:798](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L798)

Floyd–Warshall all-pairs shortest paths.

#### Returns

`object`

`{ costs, predecessor }` matrices.

##### costs

```ts
costs: number[][];
```

##### predecessor

```ts
predecessor: (VO | undefined)[][];
```

#### Remarks

Time O(V^3), Space O(V^2)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`floydWarshall`](DirectedGraph.md#floydwarshall)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L99)

Visit each entry, left-to-right.

#### Parameters

##### callbackfn

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `void`\>

`(key, value, index, self) => void`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`forEach`](DirectedGraph.md#foreach)

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:156](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L156)

Get the value under a key.

#### Parameters

##### key

`VertexKey`

Key to look up.

#### Returns

`V` \| `undefined`

Value or `undefined`.

#### Remarks

Time O(n) generic, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`get`](DirectedGraph.md#get)

***

### getAllPathsBetween()

```ts
getAllPathsBetween(
   v1, 
   v2, 
   limit?): VO[][];
```

Defined in: [data-structures/graph/abstract-graph.ts:309](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L309)

Enumerate simple paths up to a limit.

#### Parameters

##### v1

`VertexKey` \| `VO`

Source vertex or key.

##### v2

`VertexKey` \| `VO`

Destination vertex or key.

##### limit?

`number` = `1000`

Maximum number of paths to collect.

#### Returns

`VO`[][]

Array of paths (each path is an array of vertices).

#### Remarks

Time O(paths) worst-case exponential, Space O(V + paths)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getAllPathsBetween`](DirectedGraph.md#getallpathsbetween)

***

### getCycles()

```ts
getCycles(isInclude2Cycle?): VertexKey[][];
```

Defined in: [data-structures/graph/abstract-graph.ts:838](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L838)

Enumerate simple cycles (may be expensive).

#### Parameters

##### isInclude2Cycle?

`boolean` = `false`

If `true`, include 2-cycles when graph semantics allow.

#### Returns

`VertexKey`[][]

Array of cycles (each as array of vertex keys).

#### Remarks

Time exponential in worst-case, Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getCycles`](DirectedGraph.md#getcycles)

***

### getDestinations()

```ts
getDestinations(vertex): VO[];
```

Defined in: [data-structures/graph/directed-graph.ts:599](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L599)

Direct children reachable by one outgoing edge.

#### Parameters

##### vertex

`VertexKey` \| `VO` \| `undefined`

Vertex or key.

#### Returns

`VO`[]

Array of neighbor vertices.

#### Remarks

Time O(deg_out), Space O(deg_out)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getDestinations`](DirectedGraph.md#getdestinations)

***

### getDFNMap()

```ts
getDFNMap(): Map<VO, number>;
```

Defined in: [data-structures/graph/directed-graph.ts:934](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L934)

DFN index map computed by `tarjan()`.

#### Returns

`Map`\<`VO`, `number`\>

Map from vertex to DFN index.

#### Remarks

Time O(V), Space O(V)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getDFNMap`](DirectedGraph.md#getdfnmap)

***

### getEdge()

```ts
getEdge(srcOrKey, destOrKey): EO | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:250](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L250)

Get the unique edge from `src` to `dest`, if present.

#### Parameters

##### srcOrKey

`VertexKey` \| `VO` \| `undefined`

Source vertex or key.

##### destOrKey

`VertexKey` \| `VO` \| `undefined`

Destination vertex or key.

#### Returns

`EO` \| `undefined`

Edge instance or `undefined`.

#### Remarks

Time O(1) avg, Space O(1)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getEdge`](DirectedGraph.md#getedge)

***

### getEndsOfEdge()

```ts
getEndsOfEdge(edge): [VO, VO] | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:799](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L799)

Resolve an edge's `[src, dest]` endpoints to vertex instances.

#### Parameters

##### edge

`EO`

Edge instance.

#### Returns

\[`VO`, `VO`\] \| `undefined`

`[src, dest]` or `undefined` if either endpoint is missing.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getEndsOfEdge`](DirectedGraph.md#getendsofedge)

***

### getLowMap()

```ts
getLowMap(): Map<VO, number>;
```

Defined in: [data-structures/graph/directed-graph.ts:943](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L943)

LOW link map computed by `tarjan()`.

#### Returns

`Map`\<`VO`, `number`\>

Map from vertex to LOW value.

#### Remarks

Time O(V), Space O(V)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getLowMap`](DirectedGraph.md#getlowmap)

***

### getMinCostBetween()

```ts
getMinCostBetween(
   v1, 
   v2, 
   isWeight?): number | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:362](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L362)

Minimum hops/weight between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

Source vertex or key.

##### v2

`VertexKey` \| `VO`

Destination vertex or key.

##### isWeight?

`boolean`

If `true`, compare by path weight; otherwise by hop count.

#### Returns

`number` \| `undefined`

Minimum cost or `undefined` if missing/unreachable.

#### Remarks

Time O((V + E) log V) weighted / O(V + E) unweighted, Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getMinCostBetween`](DirectedGraph.md#getmincostbetween)

***

### getMinPathBetween()

```ts
getMinPathBetween(
   v1, 
   v2, 
   isWeight?, 
   isDFS?): VO[] | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:415](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L415)

Minimum path (as vertex sequence) between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

Source vertex or key.

##### v2

`VertexKey` \| `VO`

Destination vertex or key.

##### isWeight?

`boolean`

If `true`, compare by path weight; otherwise by hop count.

##### isDFS?

`boolean` = `false`

For weighted mode only: if `true`, brute-force all paths; if `false`, use Dijkstra.

#### Returns

`VO`[] \| `undefined`

Vertex sequence, or `undefined`/empty when unreachable depending on branch.

#### Remarks

Time O((V + E) log V) weighted / O(V + E) unweighted, Space O(V + E)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getMinPathBetween`](DirectedGraph.md#getminpathbetween)

***

### getNeighbors()

```ts
getNeighbors(vertexOrKey): VO[];
```

Defined in: [data-structures/graph/directed-graph.ts:777](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L777)

Get outgoing neighbors

 *

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

#### Returns

`VO`[]

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getNeighbors`](DirectedGraph.md#getneighbors)

***

### getPathSumWeight()

```ts
getPathSumWeight(path): number;
```

Defined in: [data-structures/graph/abstract-graph.ts:346](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L346)

Sum the weights along a vertex path.

#### Parameters

##### path

`VO`[]

Sequence of vertices.

#### Returns

`number`

Path weight sum (0 if empty or edge missing).

#### Remarks

Time O(L), Space O(1) where L is path length

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getPathSumWeight`](DirectedGraph.md#getpathsumweight)

***

### getSCCs()

```ts
getSCCs(): Map<number, VO[]>;
```

Defined in: [data-structures/graph/directed-graph.ts:984](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L984)

Strongly connected components computed by `tarjan()`.

#### Returns

`Map`\<`number`, `VO`[]\>

Map from SCC id to vertices.

#### Remarks

Time O(#SCC + V), Space O(V)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getSCCs`](DirectedGraph.md#getsccs)

***

### getVertex()

```ts
getVertex(vertexKey): VO | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:175](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L175)

Get vertex instance by key.

#### Parameters

##### vertexKey

`VertexKey`

Vertex key.

#### Returns

`VO` \| `undefined`

Vertex instance or `undefined`.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`getVertex`](DirectedGraph.md#getvertex)

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:129](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L129)

Whether the given key exists.

#### Parameters

##### key

`VertexKey`

Key to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n) generic, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`has`](DirectedGraph.md#has)

***

### hasEdge()

```ts
hasEdge(v1, v2): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:249](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L249)

Whether an edge exists between two vertices.

#### Parameters

##### v1

`VertexKey` \| `VO`

Endpoint A vertex or key.

##### v2

`VertexKey` \| `VO`

Endpoint B vertex or key.

#### Returns

`boolean`

`true` if present; otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`hasEdge`](DirectedGraph.md#hasedge)

***

### hasValue()

```ts
hasValue(value): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:143](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L143)

Whether there exists an entry with the given value.

#### Parameters

##### value

`V` \| `undefined`

Value to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`hasValue`](DirectedGraph.md#hasvalue)

***

### hasVertex()

```ts
hasVertex(vertexOrKey): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:185](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L185)

Whether a vertex exists.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`boolean`

`true` if present, otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`hasVertex`](DirectedGraph.md#hasvertex)

***

### incomingEdgesOf()

```ts
incomingEdgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:493](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L493)

Incoming edges of a vertex.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`EO`[]

Array of incoming edges.

#### Remarks

Time O(deg_in), Space O(deg_in)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`incomingEdgesOf`](DirectedGraph.md#incomingedgesof)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/graph/directed-graph.ts:816](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L816)

Whether the graph has no vertices and no edges.

#### Returns

`boolean`

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`isEmpty`](DirectedGraph.md#isempty)

***

### isVertexKey()

```ts
isVertexKey(potentialKey): potentialKey is VertexKey;
```

Defined in: [data-structures/graph/abstract-graph.ts:215](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L215)

Type guard: check if a value is a valid vertex key.

#### Parameters

##### potentialKey

`any`

Value to test.

#### Returns

`potentialKey is VertexKey`

`true` if string/number; else `false`.

#### Remarks

Time O(1), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`isVertexKey`](DirectedGraph.md#isvertexkey)

***

### keys()

```ts
keys(): IterableIterator<VertexKey>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`VertexKey`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`keys`](DirectedGraph.md#keys)

***

### map()

```ts
map<T>(callback, thisArg?): T[];
```

Defined in: [data-structures/graph/abstract-graph.ts:928](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L928)

Map entries using an implementation-specific strategy.

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `T`\>

##### thisArg?

`any`

#### Returns

`T`[]

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`map`](DirectedGraph.md#map)

***

### outgoingEdgesOf()

```ts
outgoingEdgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:537](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L537)

Outgoing edges of a vertex.

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

Vertex or key.

#### Returns

`EO`[]

Array of outgoing edges.

#### Remarks

Time O(deg_out), Space O(deg_out)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`outgoingEdgesOf`](DirectedGraph.md#outgoingedgesof)

***

### print()

```ts
print(options?): void;
```

Defined in: [data-structures/graph/abstract-graph.ts:1183](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1183)

Print the graph to console.

#### Parameters

##### options?

Display settings passed to `toVisual`.

###### showWeight?

`boolean`

#### Returns

`void`

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`print`](DirectedGraph.md#print)

***

### reduce()

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-entry-base.ts:171](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L171)

Reduce entries into a single accumulator.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

`ReduceEntryCallback`\<`VertexKey`, `V` \| `undefined`, `U`\>

`(acc, value, key, index, self) => acc`.

##### initialValue

`U`

Initial accumulator.

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`reduce`](DirectedGraph.md#reduce)

***

### removeManyVertices()

```ts
removeManyVertices(vertexMap): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:234](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L234)

Delete multiple vertices.

#### Parameters

##### vertexMap

`VertexKey`[] \| `VO`[]

Array of vertices or keys.

#### Returns

`boolean`

`true` if any vertex was removed.

#### Remarks

Time O(sum(deg)), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`removeManyVertices`](DirectedGraph.md#removemanyvertices)

***

### setEdgeWeight()

```ts
setEdgeWeight(
   srcOrKey, 
   destOrKey, 
   weight): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:291](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L291)

Set the weight of an existing edge.

#### Parameters

##### srcOrKey

`VertexKey` \| `VO`

Source vertex or key.

##### destOrKey

`VertexKey` \| `VO`

Destination vertex or key.

##### weight

`number`

New weight.

#### Returns

`boolean`

`true` if updated; otherwise `false`.

#### Remarks

Time O(1) avg, Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`setEdgeWeight`](DirectedGraph.md#setedgeweight)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L83)

Test whether any entry satisfies the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`VertexKey`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if any passes; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`some`](DirectedGraph.md#some)

***

### tarjan()

```ts
tarjan(): object;
```

Defined in: [data-structures/graph/directed-graph.ts:878](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L878)

Tarjan's algorithm for strongly connected components.

#### Returns

`object`

`{ dfnMap, lowMap, SCCs }`.

##### dfnMap

```ts
dfnMap: Map<VO, number>;
```

##### lowMap

```ts
lowMap: Map<VO, number>;
```

##### SCCs

```ts
SCCs: Map<number, VO[]>;
```

#### Remarks

Time O(V + E), Space O(V + E)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`tarjan`](DirectedGraph.md#tarjan)

***

### toArray()

```ts
toArray(): [VertexKey, V | undefined][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`VertexKey`, `V` \| `undefined`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`toArray`](DirectedGraph.md#toarray)

***

### toDot()

```ts
toDot(options?): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1143](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1143)

Generate DOT language representation for Graphviz.

#### Parameters

##### options?

Optional display settings.

###### name?

`string`

Graph name (default: 'G').

###### showWeight?

`boolean`

Whether to label edges with weight (default: true).

#### Returns

`string`

DOT format string.

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`toDot`](DirectedGraph.md#todot)

***

### topologicalSort()

```ts
topologicalSort(propertyName?): (VertexKey | VO)[] | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:666](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L666)

Topological sort if DAG; returns `undefined` if a cycle exists.

#### Parameters

##### propertyName?

`"key"` \| `"vertex"`

`'key'` to map to keys; `'vertex'` to keep instances.

#### Returns

(`VertexKey` \| `VO`)[] \| `undefined`

Array of keys/vertices, or `undefined` when cycle is found.

#### Remarks

Time O(V + E), Space O(V)

 *

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`topologicalSort`](DirectedGraph.md#topologicalsort)

***

### toVisual()

```ts
toVisual(options?): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1108](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/abstract-graph.ts#L1108)

Generate a text-based visual representation of the graph.

**Adjacency list format:**
```
Graph (5 vertices, 6 edges):
A -> B (1), C (2)
B -> D (3)
C -> (no outgoing edges)
D -> A (1)
E (isolated)
```

#### Parameters

##### options?

Optional display settings.

###### showWeight?

`boolean`

Whether to show edge weights (default: true).

#### Returns

`string`

The visual string.

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`toVisual`](DirectedGraph.md#tovisual)

***

### values()

```ts
values(): IterableIterator<V | undefined>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V` \| `undefined`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`values`](DirectedGraph.md#values)

***

### fromEntries()

```ts
static fromEntries<V>(entries): DirectedGraph<V, undefined, DirectedVertex<V>, DirectedEdge<undefined>>;
```

Defined in: [data-structures/graph/directed-graph.ts:182](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L182)

Construct a directed graph from `[key, value]` entries.

#### Type Parameters

##### V

`V`

Vertex value type.

#### Parameters

##### entries

`Iterable`\<\[`VertexKey`, `V`\]\>

Iterable of `[key, value]` pairs.

#### Returns

[`DirectedGraph`](DirectedGraph.md)\<`V`, `undefined`, [`DirectedVertex`](DirectedVertex.md)\<`V`\>, [`DirectedEdge`](DirectedEdge.md)\<`undefined`\>\>

DirectedGraph with all vertices added.

#### Remarks

Time O(V), Space O(V)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`fromEntries`](DirectedGraph.md#fromentries)

***

### fromKeys()

```ts
static fromKeys<K>(keys): DirectedGraph<K, undefined, DirectedVertex<K>, DirectedEdge<undefined>>;
```

Defined in: [data-structures/graph/directed-graph.ts:167](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/graph/directed-graph.ts#L167)

Construct a directed graph from keys with value initializer `v => v`.

#### Type Parameters

##### K

`K` *extends* `VertexKey`

Vertex key type.

#### Parameters

##### keys

`Iterable`\<`K`\>

Iterable of vertex keys.

#### Returns

[`DirectedGraph`](DirectedGraph.md)\<`K`, `undefined`, [`DirectedVertex`](DirectedVertex.md)\<`K`\>, [`DirectedEdge`](DirectedEdge.md)\<`undefined`\>\>

DirectedGraph with all keys added.

#### Remarks

Time O(V), Space O(V)

#### Inherited from

[`DirectedGraph`](DirectedGraph.md).[`fromKeys`](DirectedGraph.md#fromkeys)
