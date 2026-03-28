[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TreeMultiSet

# Class: TreeMultiSet\<K, R\>

Defined in: [data-structures/binary-tree/tree-multi-set.ts:16](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L16)

## Type Parameters

### K

`K` = `any`

### R

`R` = `K`

## Implements

- `Iterable`\<`K`\>

## Constructors

### Constructor

```ts
new TreeMultiSet<K, R>(elements?, options?): TreeMultiSet<K, R>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:34](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L34)

Creates a new TreeMultiSet.

#### Parameters

##### elements?

`Iterable`\<`K`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Initial elements to add, or raw elements if `toElementFn` is provided.

##### options?

`TreeMultiSetOptions`\<`K`, `R`\> = `{}`

Configuration options including optional `toElementFn` to transform raw elements.

#### Returns

`TreeMultiSet`\<`K`, `R`\>

#### Remarks

Time O(m log m), Space O(m) where m is the number of initial elements

#### Example

```ts
// Standard usage with elements
const mset = new TreeMultiSet([1, 2, 2, 3]);

// Using toElementFn to transform raw objects
const items = [{ score: 100 }, { score: 200 }, { score: 100 }];
const mset = new TreeMultiSet<number, Item>(items, { toElementFn: item => item.score });
```

## Accessors

### comparator

#### Get Signature

```ts
get comparator(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1047](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1047)

Expose comparator for advanced usage/testing (read-only).

##### Remarks

Time O(1), Space O(1)

##### Returns

`Comparator`\<`K`\>

***

### distinctSize

#### Get Signature

```ts
get distinctSize(): number;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:109](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L109)

Number of distinct keys.

##### Remarks

Time O(1), Space O(1)

 *

##### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 3);
      ms.add(2, 2);
console.log(ms.distinctSize); // 2
```

##### Returns

`number`

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:80](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L80)

Total occurrences (sumCounts).

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

## Methods

### \[iterator\]()

```ts
iterator: Iterator<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:862](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L862)

Expanded iteration (default). Each key is yielded `count(key)` times.

#### Returns

`Iterator`\<`K`\>

#### Remarks

Time O(size), Space O(1) where size is total occurrences

#### Implementation of

```ts
Iterable.[iterator]
```

***

### add()

```ts
add(key, n?): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:487](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L487)

Add `n` occurrences of `key`.

#### Parameters

##### key

`K`

##### n?

`number` = `1`

#### Returns

`boolean`

True if the multiset changed.

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1);
      ms.add(1);
      ms.add(2);
console.log(ms.count(1)); // 2
console.log(ms.size); // 3
```

***

### ceiling()

```ts
ceiling(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1394](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1394)

Returns the smallest key >= given key, or undefined.

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(10);
      ms.add(20);
      ms.add(30);
console.log(ms.ceiling(15)); // 20
```

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1167](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1167)

Remove all elements from the multiset.

#### Returns

`void`

#### Remarks

Time O(1), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1);
      ms.clear();
console.log(ms.isEmpty()); // true
```

***

### clone()

```ts
clone(): TreeMultiSet<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2313](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L2313)

Creates an independent copy of this multiset.

#### Returns

`TreeMultiSet`\<`K`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 3);
      const copy = ms.clone();
      copy.deleteAll(1);
console.log(ms.has(1)); // true
```

***

### count()

```ts
count(key): number;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:372](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L372)

Returns the count of occurrences for the given key.

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
const ms = new TreeMultiSet<number>();
      ms.add(1, 5);
console.log(ms.count(1)); // 5
```

***

### delete()

```ts
delete(key, n?): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:658](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L658)

Delete `n` occurrences of `key` (default 1).

#### Parameters

##### key

`K`

##### n?

`number` = `1`

#### Returns

`boolean`

True if any occurrence was removed.

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 3);
      ms.delete(1);
console.log(ms.count(1)); // 2
```

***

### deleteAll()

```ts
deleteAll(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:702](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L702)

Delete all occurrences of the given key.

#### Parameters

##### key

`K`

#### Returns

`boolean`

True if any occurrence was removed.

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 3);
      ms.deleteAll(1);
console.log(ms.has(1)); // false
```

***

### entries()

```ts
entries(): IterableIterator<[K, number]>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:852](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L852)

Iterates over entries as [key, count] pairs.

#### Returns

`IterableIterator`\<\[`K`, `number`\]\>

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
console.log([...ms.entries()].length); // > 0
```

***

### filter()

```ts
filter(predicate): TreeMultiSet<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1931](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1931)

Creates a new TreeMultiSet with entries that match the predicate.

#### Parameters

##### predicate

(`key`, `count`) => `boolean`

#### Returns

`TreeMultiSet`\<`K`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 3);
      ms.add(2, 1);
      ms.add(3, 2);
      const filtered = ms.filter((k, c) => c > 1);
console.log([...filtered.keysDistinct()]); // [1, 3]
```

***

### first()

```ts
first(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1200](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1200)

Returns the smallest key, or undefined if empty.

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(3);
      ms.add(1);
console.log(ms.first()); // 1
```

***

### floor()

```ts
floor(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1492](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1492)

Returns the largest key <= given key, or undefined.

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(10);
      ms.add(20);
      ms.add(30);
console.log(ms.floor(25)); // 20
```

***

### forEach()

```ts
forEach(callback): void;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1809](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1809)

Iterates over distinct keys with their counts.

#### Parameters

##### callback

(`key`, `count`) => `void`

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
      ms.add(2);
      const pairs: [number, number][] = [];
      ms.forEach((k, c) => pairs.push([k, c]));
console.log(pairs); // [[1, 2], [2, 1]]
```

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:343](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L343)

Whether the multiset contains the given key.

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
const ms = new TreeMultiSet<number>();
      ms.add(1);
console.log(ms.has(1)); // true
console.log(ms.has(2)); // false
```

***

### higher()

```ts
higher(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1589](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1589)

Returns the smallest key > given key, or undefined.

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(10);
      ms.add(20);
console.log(ms.higher(10)); // 20
```

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:223](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L223)

Whether the multiset is empty.

#### Returns

`boolean`

#### Remarks

Time O(1), Space O(1)

 *

#### Example

```ts
console.log(new TreeMultiSet().isEmpty()); // true
```

***

### keysDistinct()

```ts
keysDistinct(): IterableIterator<K>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:736](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L736)

Iterates over distinct keys (each key yielded once).

#### Returns

`IterableIterator`\<`K`\>

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
      ms.add(2);
console.log([...ms.keysDistinct()]); // [1, 2]
```

***

### last()

```ts
last(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1230](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1230)

Returns the largest key, or undefined if empty.

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1);
      ms.add(3);
console.log(ms.last()); // 3
```

***

### lower()

```ts
lower(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1686](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1686)

Returns the largest key < given key, or undefined.

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(10);
      ms.add(20);
console.log(ms.lower(20)); // 10
```

***

### map()

```ts
map<K2>(mapper, options?): TreeMultiSet<K2>;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2183](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L2183)

Maps keys and counts to a new TreeMultiSet.
When multiple keys map to the same new key, counts are merged (added).

#### Type Parameters

##### K2

`K2`

#### Parameters

##### mapper

(`key`, `count`) => \[`K2`, `number`\]

##### options?

###### comparator?

`Comparator`\<`K2`\>

#### Returns

`TreeMultiSet`\<`K2`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
      ms.add(2, 3);
      const doubled = ms.map((k, c) => [k * 10, c] as [number, number]);
console.log([...doubled.keysDistinct()]); // [10, 20]
```

***

### pollFirst()

```ts
pollFirst(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1261](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1261)

Removes all occurrences of the smallest key and returns it.

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(2);
      ms.add(1);
console.log(ms.pollFirst()); // 1
console.log(ms.has(1)); // false
```

***

### pollLast()

```ts
pollLast(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1294](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1294)

Removes all occurrences of the largest key and returns it.

#### Returns

`K` \| `undefined`

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1);
      ms.add(3);
console.log(ms.pollLast()); // 3
```

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2541](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L2541)

Prints the internal tree structure (for debugging).

#### Returns

`void`

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1);
```

***

### rangeSearch()

```ts
rangeSearch<C>(range, callback?): C extends undefined ? K : ReturnType<C>[];
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2420](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L2420)

Returns keys within the given range.

#### Type Parameters

##### C

`C` *extends* (`key`) => `any`

#### Parameters

##### range

\[`K`, `K`\]

##### callback?

`C`

#### Returns

`C` *extends* `undefined` ? `K` : `ReturnType`\<`C`\>[]

#### Remarks

Time O(log n + k), Space O(k) where k is result size

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(10);
      ms.add(20);
      ms.add(30);
      const result = ms.rangeSearch([15, 25]);
console.log(result.length); // 1
```

***

### reduce()

```ts
reduce<U>(callback, initialValue): U;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2059](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L2059)

Reduces the multiset to a single value.

#### Type Parameters

##### U

`U`

#### Parameters

##### callback

(`accumulator`, `key`, `count`) => `U`

##### initialValue

`U`

#### Returns

`U`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
      ms.add(2, 3);
      const sum = ms.reduce((acc, k, c) => acc + k * c, 0);
console.log(sum); // 8
```

***

### setCount()

```ts
setCount(key, n): boolean;
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:524](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L524)

Set count for `key` to exactly `n`.

#### Parameters

##### key

`K`

##### n

`number`

#### Returns

`boolean`

True if changed.

#### Remarks

Time O(log n), Space O(1)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.setCount(1, 3);
console.log(ms.count(1)); // 3
```

***

### toArray()

```ts
toArray(): K[];
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:981](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L981)

Returns an array with all elements (expanded).

#### Returns

`K`[]

#### Remarks

Time O(size), Space O(size)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
      ms.add(2);
console.log(ms.toArray()); // [1, 1, 2]
```

***

### toDistinctArray()

```ts
toDistinctArray(): K[];
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1010](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1010)

Returns an array with distinct keys only.

#### Returns

`K`[]

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 3);
      ms.add(2);
console.log(ms.toDistinctArray()); // [1, 2]
```

***

### toEntries()

```ts
toEntries(): [K, number][];
```

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1039](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/binary-tree/tree-multi-set.ts#L1039)

Returns an array of [key, count] entries.

#### Returns

\[`K`, `number`\][]

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const ms = new TreeMultiSet<number>();
      ms.add(1, 2);
      ms.add(3);
console.log(ms.toEntries()); // [[1, 2], [3, 1]]
```
