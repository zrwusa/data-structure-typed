[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TreeMultiSet

# Class: TreeMultiSet\<K, R\>

Defined in: [data-structures/binary-tree/tree-multi-set.ts:16](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L16)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:34](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L34)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1158](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1158)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:112](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L112)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:80](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L80)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:952](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L952)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:538](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L538)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1544](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1544)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1293](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1293)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2574](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2574)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:408](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L408)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:727](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L727)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:774](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L774)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:942](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L942)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2147](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2147)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1329](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1329)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1654](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1654)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2010](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2010)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:376](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L376)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1763](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1763)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:241](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L241)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:811](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L811)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1362](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1362)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1872](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1872)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2429](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2429)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1396](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1396)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1432](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1432)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2829](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2829)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2693](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2693)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:2290](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L2290)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:578](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L578)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1086](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1086)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1118](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1118)

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

Defined in: [data-structures/binary-tree/tree-multi-set.ts:1150](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-multi-set.ts#L1150)

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
