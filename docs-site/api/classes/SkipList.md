[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / SkipList

# Class: SkipList\<K, V, R\>

Defined in: [data-structures/linked-list/skip-linked-list.ts:49](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L49)

SkipList — a probabilistic sorted key-value container.

API mirrors TreeMap: users can swap `TreeMap` ↔ `SkipList` with zero code changes.
Reference: Java ConcurrentSkipListMap (NavigableMap interface).

## Example

```ts
// Display skip list
 const sl = new SkipList<number, string>([[1, 'a']]);
    expect(() => sl.print()).not.toThrow();
```

## Extends

- [`IterableEntryBase`](IterableEntryBase.md)\<`K`, `V` \| `undefined`\>

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### R

`R` = \[`K`, `V`\]

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:122](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L122)

Total number of entries.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Entry count.

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`size`](IterableEntryBase.md#size)

## Methods

### \_findNode()

```ts
protected _findNode(key): SkipListNode<K, V> | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:984](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L984)

Finds the node for a given key, or undefined.

#### Parameters

##### key

`K`

#### Returns

[`SkipListNode`](SkipListNode.md)\<`K`, `V`\> \| `undefined`

***

### \_findUpdate()

```ts
protected _findUpdate(key): SkipListNode<K, V>[];
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:966](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L966)

Finds the update array (predecessors at each level) for a given key.

#### Parameters

##### key

`K`

#### Returns

[`SkipListNode`](SkipListNode.md)\<`K`, `V`\>[]

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:950](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L950)

Underlying iterator for the default iteration protocol.

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n), Space O(1)

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`_getIterator`](IterableEntryBase.md#getiterator)

***

### \[iterator\]()

```ts
iterator: IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L22)

Default iterator yielding `[key, value]` entries.

#### Parameters

##### args

...`any`[]

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n) to iterate, Space O(1)

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`[iterator]`](IterableEntryBase.md#iterator)

***

### ceiling()

```ts
ceiling(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:651](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L651)

Least entry ≥ key, or `undefined`.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
console.log(sl.ceiling(15)); // [20, 'b']
console.log(sl.ceiling(20)); // [20, 'b']
```

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:199](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L199)

Remove all entries

 *

#### Returns

`void`

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    sl.clear();
console.log(sl.isEmpty()); // true
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`clear`](IterableEntryBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:235](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L235)

Create independent copy

 *

#### Returns

`this`

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    const copy = sl.clone();
    copy.delete(1);
console.log(sl.has(1)); // true
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`clone`](IterableEntryBase.md#clone)

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:448](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L448)

Delete a key. Returns `true` if the key was found and removed.

 *

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Example

```ts
const cache = new SkipList<string, number>();

    cache.set('alpha', 1);
    cache.set('beta', 2);
    cache.set('gamma', 3);

console.log(cache.has('beta')); // true
    cache.delete('beta');
console.log(cache.has('beta')); // false
console.log(cache.size); // 2
```

***

### entries()

```ts
entries(): IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
console.log([...sl.entries()]); // [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`entries`](IterableEntryBase.md#entries)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L66)

Test whether all entries satisfy the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if all pass; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
console.log(sl.every((v, k) => k > 0)); // true
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`every`](IterableEntryBase.md#every)

***

### filter()

```ts
filter(callbackfn, thisArg?): this;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:931](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L931)

Creates a new SkipList with entries that pass the predicate.

 *

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

##### thisArg?

`unknown`

#### Returns

`this`

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
    const result = sl.filter((v, k) => k > 1);
console.log(result.size); // 2
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`filter`](IterableEntryBase.md#filter)

***

### find()

```ts
find(callbackfn, thisArg?): [K, V | undefined] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L114)

Find the first entry that matches a predicate.

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

Matching `[key, value]` or `undefined`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'alpha'], [2, 'beta']]);
    const found = sl.find(v => v === 'beta');
console.log(found?.[0]); // 2
console.log(found?.[1]); // 'beta'
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`find`](IterableEntryBase.md#find)

***

### first()

```ts
first(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:501](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L501)

Returns the first (smallest key) entry, or `undefined` if empty.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[5, 'e'], [1, 'a'], [3, 'c']]);
console.log(sl.first()); // [1, 'a']
```

***

### floor()

```ts
floor(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:695](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L695)

Greatest entry ≤ key, or `undefined`.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
console.log(sl.floor(25)); // [20, 'b']
```

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L99)

Visit each entry, left-to-right.

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V` \| `undefined`, `void`\>

`(key, value, index, self) => void`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    const keys: number[] = [];
    sl.forEach((v, k) => keys.push(k));
console.log(keys); // [1, 2]
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`forEach`](IterableEntryBase.md#foreach)

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:367](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L367)

Get the value for a key, or `undefined` if not found.
Overrides base O(n) with O(log n) skip-list search.

 *

#### Parameters

##### key

`K`

#### Returns

`V` \| `undefined`

#### Example

```ts
type Product = { id: number; name: string; price: number };
    const products: Product[] = [
      { id: 1, name: 'Widget', price: 25 },
      { id: 2, name: 'Gadget', price: 50 },
      { id: 3, name: 'Doohickey', price: 15 }
    ];

    const index = new SkipList<number, Product>(products as any, {
      toEntryFn: (p: any) => [p.price, p]
    });

    // Iterate in sorted order by price
    const names = [...index.values()].map(p => p!.name);
console.log(names); // ['Doohickey', 'Widget', 'Gadget']

    // Range search: products between $20 and $60
    const range = index.rangeSearch([20, 60]);
console.log(range.map(([, p]) => p!.name)); // ['Widget', 'Gadget']
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`get`](IterableEntryBase.md#get)

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:405](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L405)

Check if a key exists.
Overrides base O(n) with O(log n) skip-list search.

 *

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [3, 'c'], [5, 'e']]);
console.log(sl.has(3)); // true
console.log(sl.has(4)); // false
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`has`](IterableEntryBase.md#has)

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

[`IterableEntryBase`](IterableEntryBase.md).[`hasValue`](IterableEntryBase.md#hasvalue)

***

### higher()

```ts
higher(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:739](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L739)

Least entry strictly > key, or `undefined`.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
console.log(sl.higher(15)); // [20, 'b']
```

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:166](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L166)

Check if empty

 *

#### Returns

`boolean`

#### Example

```ts
const sl = new SkipList<number, string>();
console.log(sl.isEmpty()); // true
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`isEmpty`](IterableEntryBase.md#isempty)

***

### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`K`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, string>([[3, 'c'], [1, 'a']]);
console.log([...sl.keys()]); // [1, 3]
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`keys`](IterableEntryBase.md#keys)

***

### last()

```ts
last(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:537](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L537)

Returns the last (largest key) entry, or `undefined` if empty.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[5, 'e'], [1, 'a'], [3, 'c']]);
console.log(sl.last()); // [5, 'e']
```

***

### lower()

```ts
lower(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:780](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L780)

Greatest entry strictly < key, or `undefined`.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[10, 'a'], [20, 'b'], [30, 'c']]);
console.log(sl.lower(25)); // [20, 'b']
```

***

### map()

```ts
map<MK, MV>(callback, options?): SkipList<MK, MV>;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:889](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L889)

Creates a new SkipList with entries transformed by callback.

 *

#### Type Parameters

##### MK

`MK`

##### MV

`MV`

#### Parameters

##### callback

`EntryCallback`\<`K`, `V` \| `undefined`, \[`MK`, `MV`\]\>

##### options?

`SkipListOptions`\<`MK`, `MV`, \[`MK`, `MV`\]\>

#### Returns

`SkipList`\<`MK`, `MV`\>

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
    const mapped = sl.map((v, k) => [k, v?.toUpperCase()] as [number, string]);
console.log([...mapped.values()]); // ['A', 'B']
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`map`](IterableEntryBase.md#map)

***

### pollFirst()

```ts
pollFirst(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:576](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L576)

Remove and return the first (smallest key) entry.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log(sl.pollFirst()); // [1, 'a']
console.log(sl.size); // 2
```

***

### pollLast()

```ts
pollLast(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:612](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L612)

Remove and return the last (largest key) entry.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
console.log(sl.pollLast()); // [3, 'c']
console.log(sl.size); // 2
```

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:203](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L203)

Print a human-friendly representation to the console.

#### Returns

`void`

#### Remarks

Time O(n), Space O(n)

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a']]);
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`print`](IterableEntryBase.md#print)

***

### rangeSearch()

```ts
rangeSearch(range, options?): [K, V | undefined][];
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:827](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L827)

Returns entries within the given key range.

 *

#### Parameters

##### range

\[`K`, `K`\]

##### options?

`SkipListRangeOptions` = `{}`

#### Returns

\[`K`, `V` \| `undefined`\][]

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e']]);
    const result = sl.rangeSearch([2, 4]);
console.log(result); // [[2, 'b'], [3, 'c'], [4, 'd']]
```

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

`ReduceEntryCallback`\<`K`, `V` \| `undefined`, `U`\>

`(acc, value, key, index, self) => acc`.

##### initialValue

`U`

Initial accumulator.

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, number>([[1, 10], [2, 20]]);
    const sum = sl.reduce((acc, v) => acc + (v ?? 0), 0);
console.log(sum); // 30
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`reduce`](IterableEntryBase.md#reduce)

***

### set()

```ts
set(key, value): this;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:289](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L289)

Insert or update a key-value pair. Returns `this` for chaining.
Unique keys only — if key exists, value is updated in place.

 *

#### Parameters

##### key

`K`

##### value

`V`

#### Returns

`this`

#### Example

```ts
const store = new SkipList<number, string>();

    store.set(3, 'three');
    store.set(1, 'one');
    store.set(5, 'five');
    store.set(2, 'two');

console.log(store.get(3)); // 'three'
console.log(store.get(1)); // 'one'
console.log(store.get(5)); // 'five'

    // Update existing key
    store.set(3, 'THREE');
console.log(store.get(3)); // 'THREE'
```

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L83)

Test whether any entry satisfies the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V` \| `undefined`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if any passes; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
console.log(sl.some((v, k) => k === 2)); // true
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`some`](IterableEntryBase.md#some)

***

### toArray()

```ts
toArray(): [K, V | undefined][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`K`, `V` \| `undefined`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Example

```ts
const sl = new SkipList<number, string>([[2, 'b'], [1, 'a']]);
console.log(sl.toArray()); // [[1, 'a'], [2, 'b']]
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`toArray`](IterableEntryBase.md#toarray)

***

### toVisual()

```ts
toVisual(): string | [K, V | undefined][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L195)

Visualize the iterable as an array of `[key, value]` pairs (or a custom string).

#### Returns

`string` \| \[`K`, `V` \| `undefined`\][]

Array of entries (default) or a string.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`toVisual`](IterableEntryBase.md#tovisual)

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

#### Example

```ts
const sl = new SkipList<number, string>([[1, 'a'], [2, 'b']]);
console.log([...sl.values()]); // ['a', 'b']
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`values`](IterableEntryBase.md#values)

***

### createDefaultComparator()

```ts
static createDefaultComparator<K>(): Comparator<K>;
```

Defined in: [data-structures/linked-list/skip-linked-list.ts:86](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/linked-list/skip-linked-list.ts#L86)

Creates a default comparator supporting number, string, Date, and bigint.

#### Type Parameters

##### K

`K`

#### Returns

`Comparator`\<`K`\>
