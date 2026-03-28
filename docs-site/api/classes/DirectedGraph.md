[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / DirectedGraph

# Class: DirectedGraph\<V, E, VO, EO\>

Defined in: [data-structures/graph/directed-graph.ts:118](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L118)

Directed graph implementation.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// basic DirectedGraph vertex and edge creation
 // Create a simple directed graph
    const graph = new DirectedGraph<string>();

    // Add vertices
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    // Verify vertices exist
    console.log(graph.hasVertex('A')); // true;
    console.log(graph.hasVertex('B')); // true;
    console.log(graph.hasVertex('C')); // true;
    console.log(graph.hasVertex('D')); // false;

    // Check vertex count
    console.log(graph.size); // 3;
```

```ts
// DirectedGraph edge operations
 const graph = new DirectedGraph<string>();

    // Add vertices
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');

    // Add directed edges
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', 2);
    graph.addEdge('A', 'C', 3);

    // Verify edges exist
    console.log(graph.hasEdge('A', 'B')); // true;
    console.log(graph.hasEdge('B', 'C')); // true;
    console.log(graph.hasEdge('C', 'B')); // false; // Graph is directed

    // Get neighbors of A
    const neighborsA = graph.getNeighbors('A');
    console.log(neighborsA[0].key); // 'B';
    console.log(neighborsA[1].key); // 'C';
```

```ts
// DirectedGraph dijkstra shortest path for network routing
 // Build a weighted directed graph representing network nodes and costs
    const network = new DirectedGraph<string>();

    // Add network nodes
    network.addVertex('Router-A');
    network.addVertex('Router-B');
    network.addVertex('Router-C');
    network.addVertex('Router-D');
    network.addVertex('Router-E');

    // Add weighted edges (network latency costs)
    network.addEdge('Router-A', 'Router-B', 5);
    network.addEdge('Router-A', 'Router-C', 10);
    network.addEdge('Router-B', 'Router-D', 3);
    network.addEdge('Router-C', 'Router-D', 2);
    network.addEdge('Router-D', 'Router-E', 4);
    network.addEdge('Router-B', 'Router-E', 12);

    // Find shortest path from Router-A to Router-E
    const { minDist, minPath } = network.dijkstra('Router-A', 'Router-E', true, true) || {
      minDist: undefined,
      minPath: undefined
    };

    // Verify shortest path is found
    console.log(minDist); // defined;
    console.log(minPath); // defined;

    // Shortest path should be A -> B -> D -> E with cost 5+3+4=12
    // Or A -> C -> D -> E with cost 10+2+4=16
    // So the minimum is 12
    console.log(minDist); // <= 16;

    // Verify path is valid (includes start and end)
    console.log(minPath?.[0].key); // 'Router-A';
    console.log(minPath?.[minPath.length - 1].key); // 'Router-E';
```

## Extends

- [`AbstractGraph`](AbstractGraph.md)\<`V`, `E`, `VO`, `EO`\>

## Extended by

- [`MapGraph`](MapGraph.md)

## Type Parameters

### V

`V` = `any`

Vertex value type.

### E

`E` = `any`

Edge value type.

### VO

`VO` *extends* [`DirectedVertex`](DirectedVertex.md)\<`V`\> = [`DirectedVertex`](DirectedVertex.md)\<`V`\>

Concrete vertex class (extends AbstractVertex&lt;V&gt;).

### EO

`EO` *extends* [`DirectedEdge`](DirectedEdge.md)\<`E`\> = [`DirectedEdge`](DirectedEdge.md)\<`E`\>

Concrete edge class (extends AbstractEdge&lt;E&gt;).

## Implements

- `IGraph`\<`V`, `E`, `VO`, `EO`\>

## Constructors

### Constructor

```ts
new DirectedGraph<V, E, VO, EO>(options?): DirectedGraph<V, E, VO, EO>;
```

Defined in: [data-structures/graph/directed-graph.ts:132](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L132)

Construct a directed graph with runtime defaults.

#### Parameters

##### options?

`Partial`\<`GraphOptions`\<`V`\>\>

`GraphOptions<V>` (e.g. `vertexValueInitializer`, `defaultEdgeWeight`).

#### Returns

`DirectedGraph`\<`V`, `E`, `VO`, `EO`\>

#### Remarks

Time O(1), Space O(1)

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`constructor`](AbstractGraph.md#constructor)

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/graph/abstract-graph.ts:89](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L89)

Total number of entries.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Entry count.

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`size`](AbstractGraph.md#size)

## Methods

### \[iterator\]()

```ts
iterator: IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L22)

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

[`AbstractGraph`](AbstractGraph.md).[`[iterator]`](AbstractGraph.md#iterator)

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

Defined in: [data-structures/graph/abstract-graph.ts:254](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L254)

##### Parameters

###### edge

`EO`

##### Returns

`boolean`

##### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 5);
console.log(g.hasEdge('A', 'B')); // true
console.log(g.hasEdge('B', 'A')); // false
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addEdge`](AbstractGraph.md#addedge)

#### Call Signature

```ts
addEdge(
   src, 
   dest, 
   weight?, 
   value?): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:256](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L256)

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

##### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 5);
console.log(g.hasEdge('A', 'B')); // true
console.log(g.hasEdge('B', 'A')); // false
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addEdge`](AbstractGraph.md#addedge)

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

Defined in: [data-structures/graph/abstract-graph.ts:189](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L189)

##### Parameters

###### vertex

`VO`

##### Returns

`boolean`

##### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
console.log(g.hasVertex('A')); // true
```

##### Implementation of

```ts
IGraph.addVertex
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addVertex`](AbstractGraph.md#addvertex)

#### Call Signature

```ts
addVertex(key, value?): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:191](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L191)

##### Parameters

###### key

`VertexKey`

###### value?

`V`

##### Returns

`boolean`

##### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
console.log(g.hasVertex('A')); // true
```

##### Implementation of

```ts
IGraph.addVertex
```

##### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`addVertex`](AbstractGraph.md#addvertex)

***

### bellmanFord()

```ts
bellmanFord(
   src, 
   scanNegativeCycle?, 
   getMin?, 
   genPath?): object;
```

Defined in: [data-structures/graph/abstract-graph.ts:705](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L705)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', -2);
    g.addEdge('A', 'C', 10);
    const result = g.bellmanFord('A');
console.log(result?.distMap.get(g.getVertex('C')!)); // -1
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`bellmanFord`](AbstractGraph.md#bellmanford)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/graph/directed-graph.ts:848](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L848)

Remove all vertices and edges.

#### Returns

`void`

#### Remarks

Time O(V + E), Space O(1)

#### Implementation of

```ts
IGraph.clear
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`clear`](AbstractGraph.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/graph/directed-graph.ts:859](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L859)

Deep clone as the same concrete class.

#### Returns

`this`

A new graph of the same concrete class (`this` type).

#### Remarks

Time O(V + E), Space O(V + E)

#### Implementation of

```ts
IGraph.clone
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`clone`](AbstractGraph.md#clone)

***

### createEdge()

```ts
createEdge(
   src, 
   dest, 
   weight?, 
   value?): EO;
```

Defined in: [data-structures/graph/directed-graph.ts:210](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L210)

Create a directed edge instance. Does not insert into the graph.

#### Parameters

##### src

`VertexKey`

Source vertex key.

##### dest

`VertexKey`

Destination vertex key.

##### weight?

`number`

Edge weight; defaults to `defaultEdgeWeight`.

##### value?

`E`

Edge payload.

#### Returns

`EO`

Concrete edge instance.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.createEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`createEdge`](AbstractGraph.md#createedge)

***

### createVertex()

```ts
createVertex(key, value?): VO;
```

Defined in: [data-structures/graph/directed-graph.ts:197](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L197)

Create a directed vertex instance. Does not insert into the graph.

#### Parameters

##### key

`VertexKey`

Vertex identifier.

##### value?

`VO`\[`"value"`\]

Optional payload.

#### Returns

`VO`

Concrete vertex instance.

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.createVertex
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`createVertex`](AbstractGraph.md#createvertex)

***

### degreeOf()

```ts
degreeOf(vertexOrKey): number;
```

Defined in: [data-structures/graph/directed-graph.ts:566](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L566)

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

#### Implementation of

```ts
IGraph.degreeOf
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`degreeOf`](AbstractGraph.md#degreeof)

***

### deleteEdge()

```ts
deleteEdge(edgeOrSrcVertexKey, destVertexKey?): EO | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:357](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L357)

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

#### Example

```ts
const graph = new DirectedGraph<string>();

    // Build a small graph
    graph.addVertex('X');
    graph.addVertex('Y');
    graph.addVertex('Z');
    graph.addEdge('X', 'Y', 1);
    graph.addEdge('Y', 'Z', 2);

    // Delete an edge
    graph.deleteEdgeSrcToDest('X', 'Y');
console.log(graph.hasEdge('X', 'Y')); // false

    // Edge in other direction should not exist
console.log(graph.hasEdge('Y', 'X')); // false

    // Other edges should remain
console.log(graph.hasEdge('Y', 'Z')); // true

    // Delete a vertex
    graph.deleteVertex('Y');
console.log(graph.hasVertex('Y')); // false
console.log(graph.size); // 2
```

#### Implementation of

```ts
IGraph.deleteEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`deleteEdge`](AbstractGraph.md#deleteedge)

***

### deleteEdgeSrcToDest()

```ts
deleteEdgeSrcToDest(srcOrKey, destOrKey): EO | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:278](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L278)

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

***

### deleteVertex()

```ts
deleteVertex(vertexOrKey): boolean;
```

Defined in: [data-structures/graph/directed-graph.ts:423](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L423)

Remove a vertex

 *

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

#### Returns

`boolean`

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
    g.deleteVertex('A');
console.log(g.hasVertex('A')); // false
console.log(g.hasEdge('A', 'B')); // false
```

#### Implementation of

```ts
IGraph.deleteVertex
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`deleteVertex`](AbstractGraph.md#deletevertex)

***

### dijkstraWithoutHeap()

```ts
dijkstraWithoutHeap(
   src, 
   dest?, 
   getMinDist?, 
genPaths?): DijkstraResult<VO>;
```

Defined in: [data-structures/graph/abstract-graph.ts:484](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L484)

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

[`AbstractGraph`](AbstractGraph.md).[`dijkstraWithoutHeap`](AbstractGraph.md#dijkstrawithoutheap)

***

### edgeSet()

```ts
edgeSet(): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:755](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L755)

Get all edges

 *

#### Returns

`EO`[]

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 3);
console.log(g.edgeSet().length); // 1
```

#### Implementation of

```ts
IGraph.edgeSet
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`edgeSet`](AbstractGraph.md#edgeset)

***

### edgesOf()

```ts
edgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:596](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L596)

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

#### Implementation of

```ts
IGraph.edgesOf
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`edgesOf`](AbstractGraph.md#edgesof)

***

### entries()

```ts
entries(): IterableIterator<[VertexKey, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`VertexKey`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`entries`](AbstractGraph.md#entries)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L66)

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

[`AbstractGraph`](AbstractGraph.md).[`every`](AbstractGraph.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/graph/abstract-graph.ts:897](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L897)

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

#### Implementation of

```ts
IGraph.filter
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`filter`](AbstractGraph.md#filter)

***

### filterEntries()

```ts
filterEntries(predicate, thisArg?): [VertexKey, V | undefined][];
```

Defined in: [data-structures/graph/abstract-graph.ts:913](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L913)

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

[`AbstractGraph`](AbstractGraph.md).[`filterEntries`](AbstractGraph.md#filterentries)

***

### find()

```ts
find(callbackfn, thisArg?): [VertexKey, V | undefined] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L114)

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

[`AbstractGraph`](AbstractGraph.md).[`find`](AbstractGraph.md#find)

***

### floydWarshall()

```ts
floydWarshall(): object;
```

Defined in: [data-structures/graph/abstract-graph.ts:798](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L798)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 2);
    // costs is a 2D number array indexed by vertex position
    const { costs } = g.floydWarshall();
console.log(costs.length); // 3
    // A→B→C should have total cost 3 at some index pair
    const flatCosts = costs.flat().filter(c => c !== Infinity && c > 0);
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`floydWarshall`](AbstractGraph.md#floydwarshall)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L99)

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

[`AbstractGraph`](AbstractGraph.md).[`forEach`](AbstractGraph.md#foreach)

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:156](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L156)

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

[`AbstractGraph`](AbstractGraph.md).[`get`](AbstractGraph.md#get)

***

### getAllPathsBetween()

```ts
getAllPathsBetween(
   v1, 
   v2, 
   limit?): VO[][];
```

Defined in: [data-structures/graph/abstract-graph.ts:309](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L309)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
    g.addEdge('B', 'C');
    const paths = g.getAllPathsBetween('A', 'C');
console.log(paths.length); // 2
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getAllPathsBetween`](AbstractGraph.md#getallpathsbetween)

***

### getCycles()

```ts
getCycles(isInclude2Cycle?): VertexKey[][];
```

Defined in: [data-structures/graph/abstract-graph.ts:838](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L838)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'A'); // cycle of length 3
    const cycles = g.getCycles(); // VertexKey[][]
console.log(cycles.length); // > 0
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getCycles`](AbstractGraph.md#getcycles)

***

### getDestinations()

```ts
getDestinations(vertex): VO[];
```

Defined in: [data-structures/graph/directed-graph.ts:614](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L614)

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

***

### getDFNMap()

```ts
getDFNMap(): Map<VO, number>;
```

Defined in: [data-structures/graph/directed-graph.ts:961](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L961)

DFN index map computed by `tarjan()`.

#### Returns

`Map`\<`VO`, `number`\>

Map from vertex to DFN index.

#### Remarks

Time O(V), Space O(V)

***

### getEdge()

```ts
getEdge(srcOrKey, destOrKey): EO | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:253](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L253)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B', 5);
    const edge = g.getEdge('A', 'B');
console.log(edge?.weight); // 5
```

#### Implementation of

```ts
IGraph.getEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`getEdge`](AbstractGraph.md#getedge)

***

### getEndsOfEdge()

```ts
getEndsOfEdge(edge): [VO, VO] | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:823](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L823)

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

#### Implementation of

```ts
IGraph.getEndsOfEdge
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`getEndsOfEdge`](AbstractGraph.md#getendsofedge)

***

### getLowMap()

```ts
getLowMap(): Map<VO, number>;
```

Defined in: [data-structures/graph/directed-graph.ts:970](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L970)

LOW link map computed by `tarjan()`.

#### Returns

`Map`\<`VO`, `number`\>

Map from vertex to LOW value.

#### Remarks

Time O(V), Space O(V)

***

### getMinCostBetween()

```ts
getMinCostBetween(
   v1, 
   v2, 
   isWeight?): number | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:362](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L362)

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

[`AbstractGraph`](AbstractGraph.md).[`getMinCostBetween`](AbstractGraph.md#getmincostbetween)

***

### getMinPathBetween()

```ts
getMinPathBetween(
   v1, 
   v2, 
   isWeight?, 
   isDFS?): VO[] | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:415](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L415)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B', 1);
    g.addEdge('B', 'C', 1);
    g.addEdge('A', 'C', 10);
    const path = g.getMinPathBetween('A', 'C');
console.log(path?.length); // 3
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getMinPathBetween`](AbstractGraph.md#getminpathbetween)

***

### getNeighbors()

```ts
getNeighbors(vertexOrKey): VO[];
```

Defined in: [data-structures/graph/directed-graph.ts:801](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L801)

Get outgoing neighbors

 *

#### Parameters

##### vertexOrKey

`VertexKey` \| `VO`

#### Returns

`VO`[]

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
    const neighbors = g.getNeighbors('A');
console.log(neighbors.map(v => v.key).sort()); // ['B', 'C']
```

#### Implementation of

```ts
IGraph.getNeighbors
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`getNeighbors`](AbstractGraph.md#getneighbors)

***

### getPathSumWeight()

```ts
getPathSumWeight(path): number;
```

Defined in: [data-structures/graph/abstract-graph.ts:346](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L346)

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

[`AbstractGraph`](AbstractGraph.md).[`getPathSumWeight`](AbstractGraph.md#getpathsumweight)

***

### getSCCs()

```ts
getSCCs(): Map<number, VO[]>;
```

Defined in: [data-structures/graph/directed-graph.ts:1014](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L1014)

Strongly connected components computed by `tarjan()`.

#### Returns

`Map`\<`number`, `VO`[]\>

Map from SCC id to vertices.

#### Remarks

Time O(#SCC + V), Space O(V)

 *

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex(1);
    g.addVertex(2);
    g.addVertex(3);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 1);
    const sccs = g.getSCCs(); // Map<number, VO[]>
console.log(sccs.size); // >= 1
```

***

### getVertex()

```ts
getVertex(vertexKey): VO | undefined;
```

Defined in: [data-structures/graph/abstract-graph.ts:175](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L175)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    const v = g.getVertex('A');
console.log(v?.key); // 'A'
```

#### Implementation of

```ts
IGraph.getVertex
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`getVertex`](AbstractGraph.md#getvertex)

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:129](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L129)

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

[`AbstractGraph`](AbstractGraph.md).[`has`](AbstractGraph.md#has)

***

### hasEdge()

```ts
hasEdge(v1, v2): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:249](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L249)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
console.log(g.hasEdge('A', 'B')); // true
console.log(g.hasEdge('B', 'A')); // false
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`hasEdge`](AbstractGraph.md#hasedge)

***

### hasValue()

```ts
hasValue(value): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:143](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L143)

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

[`AbstractGraph`](AbstractGraph.md).[`hasValue`](AbstractGraph.md#hasvalue)

***

### hasVertex()

```ts
hasVertex(vertexOrKey): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:185](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L185)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
console.log(g.hasVertex('A')); // true
console.log(g.hasVertex('Z')); // false
```

#### Implementation of

```ts
IGraph.hasVertex
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`hasVertex`](AbstractGraph.md#hasvertex)

***

### incomingEdgesOf()

```ts
incomingEdgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:505](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L505)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'C');
    g.addEdge('B', 'C');
console.log(g.incomingEdgesOf('C').length); // 2
```

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/graph/directed-graph.ts:840](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L840)

Whether the graph has no vertices and no edges.

#### Returns

`boolean`

#### Remarks

Time O(1), Space O(1)

#### Implementation of

```ts
IGraph.isEmpty
```

#### Overrides

[`AbstractGraph`](AbstractGraph.md).[`isEmpty`](AbstractGraph.md#isempty)

***

### isVertexKey()

```ts
isVertexKey(potentialKey): potentialKey is VertexKey;
```

Defined in: [data-structures/graph/abstract-graph.ts:215](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L215)

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

[`AbstractGraph`](AbstractGraph.md).[`isVertexKey`](AbstractGraph.md#isvertexkey)

***

### keys()

```ts
keys(): IterableIterator<VertexKey>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`VertexKey`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`keys`](AbstractGraph.md#keys)

***

### map()

```ts
map<T>(callback, thisArg?): T[];
```

Defined in: [data-structures/graph/abstract-graph.ts:928](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L928)

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

[`AbstractGraph`](AbstractGraph.md).[`map`](AbstractGraph.md#map)

***

### outgoingEdgesOf()

```ts
outgoingEdgesOf(vertexOrKey): EO[];
```

Defined in: [data-structures/graph/directed-graph.ts:552](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L552)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
console.log(g.outgoingEdgesOf('A').length); // 2
```

***

### print()

```ts
print(options?): void;
```

Defined in: [data-structures/graph/abstract-graph.ts:1183](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L1183)

Print the graph to console.

#### Parameters

##### options?

Display settings passed to `toVisual`.

###### showWeight?

`boolean`

#### Returns

`void`

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`print`](AbstractGraph.md#print)

***

### reduce()

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-entry-base.ts:171](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L171)

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

[`AbstractGraph`](AbstractGraph.md).[`reduce`](AbstractGraph.md#reduce)

***

### removeManyVertices()

```ts
removeManyVertices(vertexMap): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:234](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L234)

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

[`AbstractGraph`](AbstractGraph.md).[`removeManyVertices`](AbstractGraph.md#removemanyvertices)

***

### setEdgeWeight()

```ts
setEdgeWeight(
   srcOrKey, 
   destOrKey, 
   weight): boolean;
```

Defined in: [data-structures/graph/abstract-graph.ts:291](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L291)

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

[`AbstractGraph`](AbstractGraph.md).[`setEdgeWeight`](AbstractGraph.md#setedgeweight)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L83)

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

[`AbstractGraph`](AbstractGraph.md).[`some`](AbstractGraph.md#some)

***

### tarjan()

```ts
tarjan(): object;
```

Defined in: [data-structures/graph/directed-graph.ts:905](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L905)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'A');
    const { SCCs } = g.tarjan();
    // A→B→C→A forms one SCC with 3 members
    const sccArrays = [...SCCs.values()];
console.log(sccArrays.some(scc => scc.length === 3)); // true
```

***

### toArray()

```ts
toArray(): [VertexKey, V | undefined][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`VertexKey`, `V` \| `undefined`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`toArray`](AbstractGraph.md#toarray)

***

### toDot()

```ts
toDot(options?): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1143](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L1143)

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

#### Example

```ts
const g = new DirectedGraph();
    g.addVertex('A');
    g.addVertex('B');
    g.addEdge('A', 'B');
    const dot = g.toDot();
```

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`toDot`](AbstractGraph.md#todot)

***

### topologicalSort()

```ts
topologicalSort(propertyName?): (VertexKey | VO)[] | undefined;
```

Defined in: [data-structures/graph/directed-graph.ts:684](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L684)

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

#### Example

```ts
const graph = new DirectedGraph<string>();

    // Build a DAG (Directed Acyclic Graph) for task dependencies
    graph.addVertex('Design');
    graph.addVertex('Implement');
    graph.addVertex('Test');
    graph.addVertex('Deploy');

    // Add dependency edges
    graph.addEdge('Design', 'Implement', 1); // Design must come before Implement
    graph.addEdge('Implement', 'Test', 1); // Implement must come before Test
    graph.addEdge('Test', 'Deploy', 1); // Test must come before Deploy

    // Topological sort gives valid execution order
    const executionOrder = graph.topologicalSort();
console.log(executionOrder); // ['Design', 'Implement', 'Test', 'Deploy']

    // All vertices should be included
console.log(executionOrder?.length); // 4
```

***

### toVisual()

```ts
toVisual(options?): string;
```

Defined in: [data-structures/graph/abstract-graph.ts:1108](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/abstract-graph.ts#L1108)

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

[`AbstractGraph`](AbstractGraph.md).[`toVisual`](AbstractGraph.md#tovisual)

***

### values()

```ts
values(): IterableIterator<V | undefined>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V` \| `undefined`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`AbstractGraph`](AbstractGraph.md).[`values`](AbstractGraph.md#values)

***

### fromEntries()

```ts
static fromEntries<V>(entries): DirectedGraph<V, undefined, DirectedVertex<V>, DirectedEdge<undefined>>;
```

Defined in: [data-structures/graph/directed-graph.ts:182](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L182)

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

`DirectedGraph`\<`V`, `undefined`, [`DirectedVertex`](DirectedVertex.md)\<`V`\>, [`DirectedEdge`](DirectedEdge.md)\<`undefined`\>\>

DirectedGraph with all vertices added.

#### Remarks

Time O(V), Space O(V)

***

### fromKeys()

```ts
static fromKeys<K>(keys): DirectedGraph<K, undefined, DirectedVertex<K>, DirectedEdge<undefined>>;
```

Defined in: [data-structures/graph/directed-graph.ts:167](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/graph/directed-graph.ts#L167)

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

`DirectedGraph`\<`K`, `undefined`, [`DirectedVertex`](DirectedVertex.md)\<`K`\>, [`DirectedEdge`](DirectedEdge.md)\<`undefined`\>\>

DirectedGraph with all keys added.

#### Remarks

Time O(V), Space O(V)
