[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / IterableEntryBase

# Abstract Class: IterableEntryBase\<K, V\>

Defined in: [data-structures/base/iterable-entry-base.ts:9](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L9)

Iterable view over key-value entries.

## Remarks

Time O(1), Space O(1)

## Extended by

- [`HashMap`](HashMap.md)
- [`LinkedHashMap`](LinkedHashMap.md)
- [`SkipList`](SkipList.md)
- [`AbstractGraph`](AbstractGraph.md)
- [`BinaryTree`](BinaryTree.md)

## Type Parameters

### K

`K` = `any`

Key type.

### V

`V` = `any`

Value type.

## Accessors

### size

#### Get Signature

```ts
get abstract size(): number;
```

Defined in: [data-structures/base/iterable-entry-base.ts:15](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L15)

Total number of entries.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Entry count.

## Methods

### \[iterator\]()

```ts
iterator: IterableIterator<[K, V]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L22)

Default iterator yielding `[key, value]` entries.

#### Parameters

##### args

...`any`[]

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n) to iterate, Space O(1)

***

### clear()

```ts
abstract clear(): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:218](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L218)

Remove all entries.

#### Returns

`void`

#### Remarks

Time O(n) typical, Space O(1)

***

### clone()

```ts
abstract clone(): this;
```

Defined in: [data-structures/base/iterable-entry-base.ts:225](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L225)

Deep clone preserving the concrete subtype.

#### Returns

`this`

A new instance of the same concrete class (`this` type).

#### Remarks

Time O(n) typical, Space O(n)

***

### entries()

```ts
entries(): IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:31](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L31)

Iterate over `[key, value]` pairs (may yield `undefined` values).

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

Iterator of `[K, V | undefined]`.

#### Remarks

Time O(n), Space O(1)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:66](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L66)

Test whether all entries satisfy the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if all pass; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

***

### filter()

```ts
abstract filter(...args): this;
```

Defined in: [data-structures/base/iterable-entry-base.ts:238](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L238)

Filter entries and return the same-species structure.

#### Parameters

##### args

...`any`[]

#### Returns

`this`

A new instance of the same concrete class (`this` type).

#### Remarks

Time O(n), Space O(n)

***

### find()

```ts
find(callbackfn, thisArg?): [K, V] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L114)

Find the first entry that matches a predicate.

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

\[`K`, `V`\] \| `undefined`

Matching `[key, value]` or `undefined`.

#### Remarks

Time O(n), Space O(1)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L99)

Visit each entry, left-to-right.

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V`, `void`\>

`(key, value, index, self) => void`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`void`

#### Remarks

Time O(n), Space O(1)

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:156](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L156)

Get the value under a key.

#### Parameters

##### key

`K`

Key to look up.

#### Returns

`V` \| `undefined`

Value or `undefined`.

#### Remarks

Time O(n) generic, Space O(1)

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:129](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L129)

Whether the given key exists.

#### Parameters

##### key

`K`

Key to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n) generic, Space O(1)

***

### hasValue()

```ts
hasValue(value): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:143](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L143)

Whether there exists an entry with the given value.

#### Parameters

##### value

`V`

Value to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

***

### isEmpty()

```ts
abstract isEmpty(): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:212](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L212)

Whether there are no entries.

#### Returns

`boolean`

`true` if empty; `false` otherwise.

#### Remarks

Time O(1) typical, Space O(1)

***

### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:42](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L42)

Iterate over keys only.

#### Returns

`IterableIterator`\<`K`\>

Iterator of keys.

#### Remarks

Time O(n), Space O(1)

***

### map()

```ts
abstract map(...args): any;
```

Defined in: [data-structures/base/iterable-entry-base.ts:231](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L231)

Map entries using an implementation-specific strategy.

#### Parameters

##### args

...`any`[]

#### Returns

`any`

#### Remarks

Time O(n), Space O(n)

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:203](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L203)

Print a human-friendly representation to the console.

#### Returns

`void`

#### Remarks

Time O(n), Space O(n)

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

`ReduceEntryCallback`\<`K`, `V`, `U`\>

`(acc, value, key, index, self) => acc`.

##### initialValue

`U`

Initial accumulator.

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-entry-base.ts:83](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L83)

Test whether any entry satisfies the predicate.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V`, `boolean`\>

`(key, value, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`boolean`

`true` if any passes; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

***

### toArray()

```ts
toArray(): [K, V][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`K`, `V`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

***

### toVisual()

```ts
toVisual(): string | [K, V][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L195)

Visualize the iterable as an array of `[key, value]` pairs (or a custom string).

#### Returns

`string` \| \[`K`, `V`\][]

Array of entries (default) or a string.

#### Remarks

Time O(n), Space O(n)

***

### values()

```ts
values(): IterableIterator<V>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)
