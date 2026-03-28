[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TreeMultiMap

# Class: TreeMultiMap\<K, V, R\>

Defined in: [data-structures/binary-tree/tree-multi-map.ts:28](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L28)

TreeMultiMap (ordered MultiMap) — key → bucket (Array of values).

Semantics (RFC):
- Bucketed design: each key appears once; duplicates live in the bucket.
- `get(key)` returns a **live** bucket reference.
- Default iteration yields bucket entries: `[K, V[]]`.
- Navigable operations (`first/last/ceiling/...`) return entry tuples like TreeMap.

## Example

```ts
// Morris traversal (O(1) space)
 const tmm = new TreeMultiMap<number>([5, 3, 7]);
    const result = tmm.morris(n => n.key, 'IN');
    console.log(result.length); // > 0;
```

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### R

`R` = `any`

## Implements

- `Iterable`\<\[`K`, `V`[]\]\>

## Constructors

### Constructor

```ts
new TreeMultiMap<K, V, R>(keysNodesEntriesOrRaws?, options?): TreeMultiMap<K, V, R>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:45](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L45)

Creates a new TreeMultiMap.

#### Parameters

##### keysNodesEntriesOrRaws?

`Iterable`\<
  \| `K`
  \| `R`
  \| \[`K` \| `null` \| `undefined`, `V`[] \| `undefined`\]
  \| `null`
  \| `undefined`\> = `[]`

Initial entries, or raw elements if `toEntryFn` is provided.

##### options?

`TreeMultiMapOptions`\<`K`, `V`[], `R`\> = `{}`

Configuration options including optional `toEntryFn` to transform raw elements.

#### Returns

`TreeMultiMap`\<`K`, `V`, `R`\>

#### Remarks

Time O(m log m), Space O(m) where m is the number of initial entries

#### Example

```ts
// Standard usage with entries
const mmap = new TreeMultiMap([['a', ['x', 'y']], ['b', ['z']]]);

// Using toEntryFn to transform raw objects
const players = [{ score: 100, items: ['sword'] }, { score: 200, items: ['shield', 'bow'] }];
const mmap = new TreeMultiMap(players, { toEntryFn: p => [p.score, p.items] });
```

## Accessors

### comparator

#### Get Signature

```ts
get comparator(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:3152](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L3152)

Expose comparator for advanced usage/testing (read-only).

##### Remarks

Time O(1), Space O(1)

##### Returns

`Comparator`\<`K`\>

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:109](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L109)

Number of distinct keys.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

***

### totalSize

#### Get Signature

```ts
get totalSize(): number;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:400](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L400)

Total number of values across all buckets (Σ bucket.length).

##### Remarks

Time O(n), Space O(1)

 *

##### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
console.log(mm.totalSize); // 3
```

##### Returns

`number`

## Methods

### \[iterator\]()

```ts
iterator: Iterator<[K, V[]]>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1237](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1237)

Iterates over all entries as [key, bucket] pairs.

#### Returns

`Iterator`\<\[`K`, `V`[]\]\>

#### Remarks

Time O(n), Space O(1)

#### Implementation of

```ts
Iterable.[iterator]
```

***

### add()

```ts
add(key, value): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:804](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L804)

Append a single value.

#### Parameters

##### key

`K`

##### value

`V`

#### Returns

`boolean`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
console.log(mm.get(1)); // ['a', 'b']
```

***

### ceiling()

```ts
ceiling(key): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1876](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1876)

Returns the entry with the smallest key >= given key.

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
console.log(mm.ceiling(15)?.[0]); // 20
```

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:340](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L340)

Removes all entries from the map.

#### Returns

`void`

#### Remarks

Time O(1), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.clear();
console.log(mm.isEmpty()); // true
```

***

### clone()

```ts
clone(): TreeMultiMap<K, V, R>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:3144](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L3144)

Creates a shallow clone of this map.

#### Returns

`TreeMultiMap`\<`K`, `V`, `R`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      const copy = mm.clone();
      copy.delete(1);
console.log(mm.has(1)); // true
```

***

### count()

```ts
count(key): number;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:369](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L369)

Bucket length for a key (missing => 0).

#### Parameters

##### key

`K`

#### Returns

`number`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
console.log(mm.count(1)); // 2
```

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1118](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1118)

Deletes a key and its entire bucket.

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.delete(1);
console.log(mm.has(1)); // false
```

***

### deleteValue()

```ts
deleteValue(
   key, 
   value, 
   eq?): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1180](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1180)

Delete a single occurrence of a value from a key's bucket.

#### Parameters

##### key

`K`

##### value

`V`

##### eq?

(`a`, `b`) => `boolean`

#### Returns

`boolean`

#### Remarks

Time O(log n + m), Space O(1) where m is bucket size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.deleteValue(1, 'a');
console.log(mm.get(1)); // ['b']
```

***

### deleteValues()

```ts
deleteValues(
   key, 
   value, 
   eq?): number;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1217](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1217)

Delete all occurrences of a value from a key's bucket.

#### Parameters

##### key

`K`

##### value

`V`

##### eq?

(`a`, `b`) => `boolean`

#### Returns

`number`

#### Remarks

Time O(log n + m), Space O(1) where m is bucket size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'a');
      mm.add(1, 'b');
      const count = mm.deleteValues(1, 'a');
console.log(count); // 2
```

***

### entriesOf()

```ts
entriesOf(key): IterableIterator<[K, V]>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1505](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1505)

Iterates over all entries for a specific key.

#### Parameters

##### key

`K`

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

#### Remarks

Time O(log n + m), Space O(1) where m is bucket size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
console.log([...mm.entriesOf(1)]); // [[1, 'a'], [1, 'b']]
```

***

### filter()

```ts
filter(predicate): TreeMultiMap<K, V, R>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2563](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2563)

Creates a new map with entries that pass the predicate.

#### Parameters

##### predicate

(`value`, `key`, `map`) => `boolean`

#### Returns

`TreeMultiMap`\<`K`, `V`, `R`\>

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      mm.add(3, 'c');
      const filtered = mm.filter((v, k) => k > 1);
console.log([...filtered.keys()]); // [2, 3]
```

***

### first()

```ts
first(): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1626](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1626)

Returns the entry with the smallest key.

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(3, 'c');
      mm.add(1, 'a');
console.log(mm.first()?.[0]); // 1
```

***

### flatEntries()

```ts
flatEntries(): IterableIterator<[K, V]>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1568](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1568)

Iterates over all [key, value] pairs (flattened from buckets).

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

#### Remarks

Time O(T), Space O(1) where T is totalSize

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
      mm.add(2, 'c');
console.log([...mm.flatEntries()]); // [[1, 'a'], [1, 'b'], [2, 'c']]
```

***

### floor()

```ts
floor(key): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2001](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2001)

Returns the entry with the largest key <= given key.

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
console.log(mm.floor(25)?.[0]); // 20
```

***

### forEach()

```ts
forEach(callback): void;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2442](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2442)

Executes a callback for each entry.

#### Parameters

##### callback

(`value`, `key`, `map`) => `void`

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(2, 'b');
      const keys: number[] = [];
      mm.forEach((v, k) => keys.push(k));
console.log(keys); // [1, 2]
```

***

### get()

```ts
get(key): V[] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:691](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L691)

Live bucket reference (do not auto-delete key if bucket becomes empty via mutation).

#### Parameters

##### key

`K`

#### Returns

`V`[] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
console.log(mm.get(1)); // ['a', 'b']
```

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:546](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L546)

Whether the map contains the given key.

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
console.log(mm.has(1)); // true
console.log(mm.has(2)); // false
```

***

### hasEntry()

```ts
hasEntry(
   key, 
   value, 
   eq?): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1148](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1148)

Check if a specific value exists in a key's bucket.

#### Parameters

##### key

`K`

##### value

`V`

##### eq?

(`a`, `b`) => `boolean`

#### Returns

`boolean`

#### Remarks

Time O(log n + m), Space O(1) where m is bucket size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
console.log(mm.hasEntry(1, 'a')); // true
console.log(mm.hasEntry(1, 'z')); // false
```

***

### higher()

```ts
higher(key): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2101](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2101)

Returns the entry with the smallest key > given key.

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
console.log(mm.higher(10)?.[0]); // 20
```

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:223](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L223)

Whether the map is empty.

#### Returns

`boolean`

#### Remarks

Time O(1), Space O(1)

 *

#### Example

```ts
console.log(new TreeMultiMap().isEmpty()); // true
```

***

### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1357](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1357)

Iterates over all keys.

#### Returns

`IterableIterator`\<`K`\>

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(3, 'c');
      mm.add(1, 'a');
console.log([...mm.keys()]); // [1, 3]
```

***

### last()

```ts
last(): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1683](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1683)

Returns the entry with the largest key.

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(3, 'c');
console.log(mm.last()?.[0]); // 3
```

***

### lower()

```ts
lower(key): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2201](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2201)

Returns the entry with the largest key < given key.

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
console.log(mm.lower(20)?.[0]); // 10
```

***

### map()

```ts
map<V2>(mapper): TreeMultiMap<K, V2, R>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2684](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2684)

Creates a new map by transforming each entry.

#### Type Parameters

##### V2

`V2`

#### Parameters

##### mapper

(`value`, `key`, `map`) => \[`K`, `V2`[]\]

#### Returns

`TreeMultiMap`\<`K`, `V2`, `R`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      const mapped = mm.map((v, k) => [k, v.map(s => s.toUpperCase())] as [number, string[]]);
console.log(mapped.get(1)); // ['A']
```

***

### pollFirst()

```ts
pollFirst(): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1718](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1718)

Removes and returns the entry with the smallest key.

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(2, 'b');
      mm.add(1, 'a');
      const first = mm.pollFirst();
console.log(first?.[0]); // 1
console.log(mm.has(1)); // false
```

***

### pollLast()

```ts
pollLast(): [K, V[]] | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1752](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1752)

Removes and returns the entry with the largest key.

#### Returns

\[`K`, `V`[]\] \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(3, 'c');
      const last = mm.pollLast();
console.log(last?.[0]); // 3
```

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2323](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2323)

Prints the internal tree structure (for debugging).

#### Returns

`void`

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
```

***

### rangeSearch()

```ts
rangeSearch<C>(range, callback?): ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:3023](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L3023)

Searches for entries within a key range.

#### Type Parameters

##### C

`C` *extends* (`node`) => `unknown`

#### Parameters

##### range

`Range`\<`K`\> \| \[`K`, `K`\]

##### callback?

`C`

#### Returns

`ReturnType`\<`C`\>[]

#### Remarks

Time O(log n + k), Space O(k) where k is result size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(10, 'a');
      mm.add(20, 'b');
      mm.add(30, 'c');
      const result = mm.rangeSearch([15, 25]);
console.log(result.length); // 1
```

***

### reduce()

```ts
reduce<U>(callback, initialValue): U;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2808](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2808)

Reduces all entries to a single value.

#### Type Parameters

##### U

`U`

#### Parameters

##### callback

(`accumulator`, `value`, `key`, `map`) => `U`

##### initialValue

`U`

#### Returns

`U`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, number>();
      mm.add(1, 10);
      mm.add(2, 20);
      const sum = mm.reduce((acc, v) => acc + v.reduce((a, b) => a + b, 0), 0);
console.log(sum); // 30
```

***

### set()

#### Call Signature

```ts
set(entry, value?): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:952](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L952)

Alias for compatibility with existing TreeMultiMap semantics.

##### Parameters

###### entry

  \| `K`
  \| \[`K` \| `null` \| `undefined`, `V`[] \| `undefined`\]
  \| `null`
  \| `undefined`

###### value?

`V`

##### Returns

`boolean`

##### Remarks

Time O(log n), Space O(1) for single value; O(log n + m) for bucket append

 *

##### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.set(1, 'a');
      mm.set(1, 'b');
console.log(mm.get(1)); // ['a', 'b']
```

#### Call Signature

```ts
set(key, value): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:953](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L953)

Alias for compatibility with existing TreeMultiMap semantics.

##### Parameters

###### key

`K`

###### value

`V`

##### Returns

`boolean`

##### Remarks

Time O(log n), Space O(1) for single value; O(log n + m) for bucket append

 *

##### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.set(1, 'a');
      mm.set(1, 'b');
console.log(mm.get(1)); // ['a', 'b']
```

***

### setMany()

```ts
setMany(keysNodesEntriesOrRaws): boolean[];
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:2920](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L2920)

Sets multiple entries at once.

#### Parameters

##### keysNodesEntriesOrRaws

`Iterable`\<`K` \| \[`K` \| `null` \| `undefined`, `V`[] \| `undefined`\]\>

#### Returns

`boolean`[]

#### Remarks

Time O(m log n), Space O(m) where m is input size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.setMany([[1, ['a']], [2, ['b']]]);
console.log(mm.size); // 2
```

***

### values()

```ts
values(): IterableIterator<V[]>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1474](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1474)

Iterates over all buckets.

#### Returns

`IterableIterator`\<`V`[]\>

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
console.log([...mm.values()]); // [['a', 'b']]
```

***

### valuesOf()

```ts
valuesOf(key): IterableIterator<V>;
```

Defined in: [data-structures/binary-tree/tree-multi-map.ts:1536](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-map.ts#L1536)

Iterates over all values for a specific key.

#### Parameters

##### key

`K`

#### Returns

`IterableIterator`\<`V`\>

#### Remarks

Time O(log n + m), Space O(1) where m is bucket size

 *

#### Example

```ts
const mm = new TreeMultiMap<number, string>();
      mm.add(1, 'a');
      mm.add(1, 'b');
console.log([...mm.valuesOf(1)]); // ['a', 'b']
```
