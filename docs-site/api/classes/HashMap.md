[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / HashMap

# Class: HashMap\<K, V, R\>

Defined in: [data-structures/hash/hash-map.ts:97](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L97)

Hash-based map. Supports object keys and custom hashing; offers O(1) average set/get/has.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// HashMap for user session caching O(1) performance
 interface UserSession {
      userId: number;
      username: string;
      loginTime: number;
      lastActivity: number;
    }

    // HashMap provides O(1) average-case performance for set/get/delete
    // Perfect for session management with fast lookups
    const sessionCache = new HashMap<string, UserSession>();

    // Simulate user sessions
    const sessions: [string, UserSession][] = [
      ['session_001', { userId: 1, username: 'alice', loginTime: 1000, lastActivity: 1050 }],
      ['session_002', { userId: 2, username: 'bob', loginTime: 1100, lastActivity: 1150 }],
      ['session_003', { userId: 3, username: 'charlie', loginTime: 1200, lastActivity: 1250 }]
    ];

    // Store sessions with O(1) insertion
    for (const [token, session] of sessions) {
      sessionCache.set(token, session);
    }

    console.log(sessionCache.size); // 3;

    // Retrieve session with O(1) lookup
    const userSession = sessionCache.get('session_001');
    console.log(userSession?.username); // 'alice';
    console.log(userSession?.userId); // 1;

    // Update session with O(1) operation
    if (userSession) {
      userSession.lastActivity = 2000;
      sessionCache.set('session_001', userSession);
    }

    // Check updated value
    const updated = sessionCache.get('session_001');
    console.log(updated?.lastActivity); // 2000;

    // Cleanup: delete expired sessions
    sessionCache.delete('session_002');
    console.log(sessionCache.has('session_002')); // false;

    // Verify remaining sessions
    console.log(sessionCache.size); // 2;

    // Get all active sessions
    const activeCount = [...sessionCache.values()].length;
    console.log(activeCount); // 2;
```

```ts
// Aggregate values
 const counts = new HashMap<string, number>([['a', 5], ['b', 3], ['c', 8]]);

    const total = counts.reduce((sum, v) => sum + (v ?? 0), 0);
    console.log(total); // 16;
```

```ts
// Iterate over entries
 const map = new HashMap<string, number>([['x', 1], ['y', 2]]);
    const keys: string[] = [];

    map.forEach((v, k) => keys.push(k));
    console.log(keys.sort()); // ['x', 'y'];
```

## Extends

- [`IterableEntryBase`](IterableEntryBase.md)\<`K`, `V`\>

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### R

`R` = \[`K`, `V`\]

1. Key-Value Pair Storage: HashMap stores key-value pairs. Each key map to a value.
2. Fast Lookup: It's used when you need to quickly find, insert, or delete entries based on a key.
3. Unique Keys: Keys are unique.
If you try to insert another entry with the same key, the new one will replace the old entry.
4. Unordered Collection: HashMap does not guarantee the order of entries, and the order may change over time.

## Constructors

### Constructor

```ts
new HashMap<K, V, R>(entryOrRawElements?, options?): HashMap<K, V, R>;
```

Defined in: [data-structures/hash/hash-map.ts:105](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L105)

Create a HashMap and optionally bulk-insert entries.

#### Parameters

##### entryOrRawElements?

`Iterable`\<\[`K`, `V`\] \| `R`\> = `[]`

Iterable of entries or raw elements to insert.

##### options?

`HashMapOptions`\<`K`, `V`, `R`\>

Options: hash function and optional record-to-entry converter.

#### Returns

`HashMap`\<`K`, `V`, `R`\>

New HashMap instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

```ts
IterableEntryBase<K, V>.constructor
```

## Accessors

### hashFn

#### Get Signature

```ts
get hashFn(): (key) => string;
```

Defined in: [data-structures/hash/hash-map.ts:166](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L166)

Get the current hash function for non-object keys.

##### Remarks

Time O(1), Space O(1)

##### Returns

Hash function.

(`key`) => `string`

***

### objMap

#### Get Signature

```ts
get objMap(): Map<object, V>;
```

Defined in: [data-structures/hash/hash-map.ts:133](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L133)

Get the internal Map used for object/function keys.

##### Remarks

Time O(1), Space O(1)

##### Returns

`Map`\<`object`, `V`\>

Map of object→value.

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/hash/hash-map.ts:155](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L155)

Get the number of distinct keys stored.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Current size.

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`size`](IterableEntryBase.md#size)

***

### store

#### Get Signature

```ts
get store(): object;
```

Defined in: [data-structures/hash/hash-map.ts:122](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L122)

Get the internal store for non-object keys.

##### Remarks

Time O(1), Space O(1)

##### Returns

`object`

Internal record of string→{key,value}.

***

### toEntryFn

#### Get Signature

```ts
get toEntryFn(): ((rawElement) => [K, V]) | undefined;
```

Defined in: [data-structures/hash/hash-map.ts:144](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L144)

Get the raw→entry converter function if present.

##### Remarks

Time O(1), Space O(1)

##### Returns

((`rawElement`) => \[`K`, `V`\]) \| `undefined`

Converter function or undefined.

## Methods

### \_createLike()

```ts
protected _createLike<TK, TV, TR>(entries?, options?): any;
```

Defined in: [data-structures/hash/hash-map.ts:702](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L702)

(Protected) Create a like-kind instance and seed it from an iterable.

#### Type Parameters

##### TK

`TK` = `K`

##### TV

`TV` = `V`

##### TR

`TR` = \[`TK`, `TV`\]

#### Parameters

##### entries?

`Iterable`\<`TR` \| \[`TK`, `TV`\]\> = `[]`

Iterable used to seed the new map.

##### options?

`any`

Options forwarded to the constructor.

#### Returns

`any`

A like-kind map instance.

#### Remarks

Time O(N), Space O(N)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<[K, V]>;
```

Defined in: [data-structures/hash/hash-map.ts:716](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L716)

Underlying iterator for the default iteration protocol.

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n), Space O(1)

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`_getIterator`](IterableEntryBase.md#getiterator)

***

### \[iterator\]()

```ts
iterator: IterableIterator<[K, V]>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L22)

Default iterator yielding `[key, value]` entries.

#### Parameters

##### args

...`any`[]

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

Iterator of `[K, V]`.

#### Remarks

Time O(n) to iterate, Space O(1)

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`[iterator]`](IterableEntryBase.md#iterator)

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/hash/hash-map.ts:237](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L237)

Remove all entries and reset counters.

#### Returns

`void`

void

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const map = new HashMap<string, number>([['a', 1], ['b', 2]]);
    map.clear();
console.log(map.isEmpty()); // true
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`clear`](IterableEntryBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/hash/hash-map.ts:577](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L577)

Deep clone this map, preserving hashing behavior.

#### Returns

`this`

A new map with the same content.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const map = new HashMap<string, number>([['a', 1]]);
    const copy = map.clone();
    copy.set('a', 99);
console.log(map.get('a')); // 1
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`clone`](IterableEntryBase.md#clone)

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [data-structures/hash/hash-map.ts:517](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L517)

Delete an entry by key.

#### Parameters

##### key

`K`

Key to delete.

#### Returns

`boolean`

True if the key was found and removed.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const map = new HashMap<string, number>([['x', 10], ['y', 20], ['z', 30]]);

console.log(map.delete('y')); // true
console.log(map.has('y')); // false
console.log(map.size); // 2
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
const map = new HashMap<string, number>([['a', 1], ['b', 2]]);
    const entries = [...map.entries()];
console.log(entries.length); // 2
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

#### Example

```ts
const map = new HashMap<string, number>([['a', 1], ['b', 2]]);
console.log(map.every(v => v > 0)); // true
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`every`](IterableEntryBase.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): any;
```

Defined in: [data-structures/hash/hash-map.ts:685](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L685)

Filter entries into a new map.

#### Parameters

##### predicate

`EntryCallback`\<`K`, `V`, `boolean`\>

Predicate (key, value, index, map) → boolean.

##### thisArg?

`any`

Value for `this` inside the predicate.

#### Returns

`any`

A new map containing entries that satisfied the predicate.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const map = new HashMap<number, string>([
      [1, 'Alice'],
      [2, 'Bob'],
      [3, 'Charlie'],
      [4, 'Diana'],
      [5, 'Eve']
    ]);

    // Iterate through entries
    const entries: [number, string][] = [];
    for (const [key, value] of map) {
      entries.push([key, value]);
    }

    // Filter operation (for iteration with collection methods)
    const filtered = [...map].filter(([key]) => key > 2);
console.log(filtered.length); // 3

    // Map operation
    const values = [...map.values()].map(v => v.length);
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`filter`](IterableEntryBase.md#filter)

***

### find()

```ts
find(callbackfn, thisArg?): [K, V] | undefined;
```

Defined in: [data-structures/base/iterable-entry-base.ts:114](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L114)

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

#### Example

```ts
const map = new HashMap<string, number>([['a', 10], ['b', 20]]);
    const found = map.find(v => v > 15);
console.log(found?.[0]); // 'b'
console.log(found?.[1]); // 20
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`find`](IterableEntryBase.md#find)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-entry-base.ts:99](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L99)

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

#### Example

```ts
const map = new HashMap<string, number>([['a', 1], ['b', 2]]);
    let sum = 0;
    map.forEach(val => { sum += val; });
console.log(sum); // 3
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`forEach`](IterableEntryBase.md#foreach)

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/hash/hash-map.ts:432](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L432)

Get the value for a key.

#### Parameters

##### key

`K`

Key to look up.

#### Returns

`V` \| `undefined`

Value or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const map = new HashMap<string, number>([
      ['apple', 1],
      ['banana', 2],
      ['cherry', 3]
    ]);

    // Check if key exists
console.log(map.has('apple')); // true
console.log(map.has('date')); // false

    // Get value by key
console.log(map.get('banana')); // 2

    // Get all keys and values
    const keys = [...map.keys()];
    const values = [...map.values()];
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`get`](IterableEntryBase.md#get)

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/hash/hash-map.ts:474](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L474)

Check if a key exists.

#### Parameters

##### key

`K`

Key to test.

#### Returns

`boolean`

True if present.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const map = new HashMap<string, number>([['a', 1], ['b', 2]]);

console.log(map.has('a')); // true
console.log(map.has('z')); // false
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

`V`

Value to test.

#### Returns

`boolean`

`true` if found; otherwise `false`.

#### Remarks

Time O(n), Space O(1)

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`hasValue`](IterableEntryBase.md#hasvalue)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/hash/hash-map.ts:201](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L201)

Check whether the map is empty.

#### Returns

`boolean`

True if size is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const map = new HashMap();
console.log(map.isEmpty()); // true
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`isEmpty`](IterableEntryBase.md#isempty)

***

### isEntry()

```ts
isEntry(rawElement): rawElement is [K, V];
```

Defined in: [data-structures/hash/hash-map.ts:248](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L248)

Type guard: check if a raw value is a [key, value] entry.

#### Parameters

##### rawElement

`any`

#### Returns

`rawElement is [K, V]`

True if the value is a 2-tuple.

#### Remarks

Time O(1), Space O(1)

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
const map = new HashMap<string, number>([['x', 1], ['y', 2]]);
console.log([...map.keys()].sort()); // ['x', 'y']
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`keys`](IterableEntryBase.md#keys)

***

### map()

```ts
map<VM>(callbackfn, thisArg?): any;
```

Defined in: [data-structures/hash/hash-map.ts:621](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L621)

Map values to a new map with the same keys.

#### Type Parameters

##### VM

`VM`

#### Parameters

##### callbackfn

`EntryCallback`\<`K`, `V`, `VM`\>

Mapping function (key, value, index, map) → newValue.

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`any`

A new map with transformed values.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const prices = new HashMap<string, number>([['apple', 1], ['banana', 2]]);

    const doubled = prices.map(v => (v ?? 0) * 2);
console.log(doubled.get('apple')); // 2
console.log(doubled.get('banana')); // 4
```

#### Overrides

[`IterableEntryBase`](IterableEntryBase.md).[`map`](IterableEntryBase.md#map)

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
const map = new HashMap<string, number>([['a', 1]]);
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`print`](IterableEntryBase.md#print)

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

#### Example

```ts
const map = new HashMap<string, number>([['a', 10], ['b', 20], ['c', 30]]);
    const total = map.reduce((acc, val) => acc + val, 0);
console.log(total); // 60
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`reduce`](IterableEntryBase.md#reduce)

***

### set()

```ts
set(key, value): boolean;
```

Defined in: [data-structures/hash/hash-map.ts:325](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L325)

Insert or replace a single entry.

#### Parameters

##### key

`K`

Key.

##### value

`V`

Value.

#### Returns

`boolean`

True when the operation succeeds.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
// Create a simple HashMap with key-value pairs
    const map = new HashMap<number, string>([
      [1, 'one'],
      [2, 'two'],
      [3, 'three']
    ]);

    // Verify size
console.log(map.size); // 3

    // Set a new key-value pair
    map.set(4, 'four');
console.log(map.size); // 4

    // Verify entries
```

***

### setHashFn()

```ts
setHashFn(fn): this;
```

Defined in: [data-structures/hash/hash-map.ts:537](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L537)

Replace the hash function and rehash the non-object store.

#### Parameters

##### fn

(`key`) => `string`

New hash function for non-object keys.

#### Returns

`this`

This map instance.

#### Remarks

Time O(N), Space O(N)

***

### setMany()

```ts
setMany(entryOrRawElements): boolean[];
```

Defined in: [data-structures/hash/hash-map.ts:370](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/hash/hash-map.ts#L370)

Insert many entries from an iterable.

#### Parameters

##### entryOrRawElements

`Iterable`\<\[`K`, `V`\] \| `R`\>

Iterable of entries or raw elements to insert.

#### Returns

`boolean`[]

Array of per-entry results.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const map = new HashMap<string, number>();
    map.setMany([['a', 1], ['b', 2], ['c', 3]]);
console.log(map.size); // 3
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

#### Example

```ts
const map = new HashMap<string, number>([['a', 1], ['b', 5]]);
console.log(map.some(v => v > 3)); // true
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`some`](IterableEntryBase.md#some)

***

### toArray()

```ts
toArray(): [K, V][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:186](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L186)

Converts data structure to `[key, value]` pairs.

#### Returns

\[`K`, `V`\][]

Array of entries.

#### Remarks

Time O(n), Space O(n)

#### Example

```ts
const map = new HashMap<string, number>([['a', 1]]);
console.log(map.toArray().length); // 1
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`toArray`](IterableEntryBase.md#toarray)

***

### toVisual()

```ts
toVisual(): string | [K, V][];
```

Defined in: [data-structures/base/iterable-entry-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L195)

Visualize the iterable as an array of `[key, value]` pairs (or a custom string).

#### Returns

`string` \| \[`K`, `V`\][]

Array of entries (default) or a string.

#### Remarks

Time O(n), Space O(n)

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`toVisual`](IterableEntryBase.md#tovisual)

***

### values()

```ts
values(): IterableIterator<V>;
```

Defined in: [data-structures/base/iterable-entry-base.ts:53](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-entry-base.ts#L53)

Iterate over values only.

#### Returns

`IterableIterator`\<`V`\>

Iterator of values.

#### Remarks

Time O(n), Space O(1)

#### Example

```ts
const map = new HashMap<string, number>([['a', 10], ['b', 20]]);
console.log([...map.values()].sort()); // [10, 20]
```

#### Inherited from

[`IterableEntryBase`](IterableEntryBase.md).[`values`](IterableEntryBase.md#values)
