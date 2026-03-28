[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TreeMap

# Class: TreeMap\<K, V, R\>

Defined in: [data-structures/binary-tree/tree-map.ts:26](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L26)

An ordered Map backed by a red-black tree.

- Iteration order is ascending by key.
- No node exposure: all APIs use keys/values only.

## Example

```ts
// Set multiple key-value pairs
 const tm = new TreeMap<number, string>();
    tm.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
    console.log(tm.size); // 3;
```

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### R

`R` = \[`K`, `V`\]

## Implements

- `Iterable`\<\[`K`, `V` \| `undefined`\]\>

## Constructors

### Constructor

```ts
new TreeMap<K, V, R>(entries?, options?): TreeMap<K, V, R>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:46](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L46)

Create a TreeMap from an iterable of `[key, value]` entries or raw elements.

#### Parameters

##### entries?

  \| `Iterable`\<\[`K`, `V` \| `undefined`\], `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>

Iterable of `[key, value]` tuples, or raw elements if `toEntryFn` is provided.

##### options?

`TreeMapOptions`\<`K`, `V`, `R`\> = `{}`

Configuration options including optional `toEntryFn` to transform raw elements.

#### Returns

`TreeMap`\<`K`, `V`, `R`\>

#### Throws

If any entry is not a 2-tuple-like value (when no toEntryFn), or when using
the default comparator and encountering unsupported/invalid keys (e.g. `NaN`, invalid `Date`).

#### Example

```ts
// Standard usage with entries
const map = new TreeMap([['a', 1], ['b', 2]]);

// Using toEntryFn to transform raw objects
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const map = new TreeMap<number, User, User>(users, { toEntryFn: u => [u.id, u] });
```

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/binary-tree/tree-map.ts:134](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L134)

Number of entries in the map.

##### Returns

`number`

## Methods

### ceiling()

```ts
ceiling(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2963](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2963)

Smallest entry whose key is >= the given key.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const events = new TreeMap<Date, string>();

    const meeting = new Date('2024-01-15T10:00:00Z');
    const lunch = new Date('2024-01-15T12:00:00Z');
    const review = new Date('2024-01-15T15:00:00Z');
    const standup = new Date('2024-01-15T09:00:00Z');

    events.set(meeting, 'Team Meeting');
    events.set(lunch, 'Lunch Break');
    events.set(review, 'Code Review');
    events.set(standup, 'Daily Standup');

    // Events are sorted chronologically
      'Daily Standup',
      'Team Meeting',
      'Lunch Break',
      'Code Review'
    ]);

    // Next event after 11:00
    const after11 = new Date('2024-01-15T11:00:00Z');
console.log(events.ceiling(after11)?.[1]); // 'Lunch Break'

    // Events between 9:30 and 13:00
    const from = new Date('2024-01-15T09:30:00Z');
    const to = new Date('2024-01-15T13:00:00Z');
    const window = events.rangeSearch([from, to]);
console.log(window.map(([, v]) => v)); // ['Team Meeting', 'Lunch Break']
```

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/binary-tree/tree-map.ts:998](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L998)

Remove all entries.

 *

#### Returns

`void`

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a']]);
      tm.clear();
console.log(tm.isEmpty()); // true
```

***

### clone()

```ts
clone(): TreeMap<K, V>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:3632](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L3632)

Creates a shallow clone of this map.

#### Returns

`TreeMap`\<`K`, `V`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
      const copy = tm.clone();
      copy.delete(1);
console.log(tm.has(1)); // true
```

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-map.ts:866](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L866)

Delete a key.

#### Parameters

##### key

`K`

#### Returns

`boolean`

`true` if the key existed; otherwise `false`.

#### Remarks

Expected time O(log n)

 *

#### Example

```ts
const sessions = new TreeMap<string, number>([
      ['sess_abc', Date.now()],
      ['sess_def', Date.now()],
      ['sess_ghi', Date.now()]
    ]);

console.log(sessions.size); // 3
    sessions.delete('sess_def');
console.log(sessions.has('sess_def')); // false
console.log(sessions.size); // 2
```

***

### entries()

```ts
entries(): IterableIterator<[K, V | undefined]>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1395](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1395)

Iterate over `[key, value]` entries in ascending key order.

Note: values may be `undefined`.

 *

#### Returns

`IterableIterator`\<\[`K`, `V` \| `undefined`\]\>

#### Example

```ts
const tm = new TreeMap<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
console.log([...tm.entries()]); // [[1, 'a'], [2, 'b'], [3, 'c']]
```

***

### every()

```ts
every(callbackfn, thisArg?): boolean;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2077](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2077)

Test whether all entries satisfy a predicate.

#### Parameters

##### callbackfn

`TreeMapEntryCallback`\<`K`, `V`, `boolean`, `TreeMap`\<`K`, `V`, \[`K`, `V`\]\>\>

##### thisArg?

`unknown`

#### Returns

`boolean`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
console.log(tm.every((v, k) => k > 0)); // true
```

***

### filter()

```ts
filter(callbackfn, thisArg?): TreeMap<K, V>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1808](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1808)

Create a new TreeMap containing only entries that satisfy the predicate.

#### Parameters

##### callbackfn

`TreeMapEntryCallback`\<`K`, `V`, `boolean`, `TreeMap`\<`K`, `V`, \[`K`, `V`\]\>\>

##### thisArg?

`unknown`

#### Returns

`TreeMap`\<`K`, `V`\>

#### Remarks

Time O(n log n) expected, Space O(n)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b'], [3, 'c']]);
      const filtered = tm.filter((v, k) => k > 1);
console.log([...filtered.keys()]); // [2, 3]
```

***

### find()

```ts
find(callbackfn, thisArg?): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2348](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2348)

Find the first entry that satisfies a predicate.

#### Parameters

##### callbackfn

`TreeMapEntryCallback`\<`K`, `V`, `boolean`, `TreeMap`\<`K`, `V`, \[`K`, `V`\]\>\>

##### thisArg?

`unknown`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

The first matching `[key, value]` tuple, or `undefined`.

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
console.log(tm.find(v => v === 'b')?.[0]); // 2
```

***

### first()

```ts
first(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2679](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2679)

Smallest entry by key.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
// Use score as key (descending), player name as value
    const leaderboard = new TreeMap<number, string>([], {
      comparator: (a, b) => b - a // descending
    });

    leaderboard.set(1500, 'Alice');
    leaderboard.set(2200, 'Bob');
    leaderboard.set(1800, 'Charlie');
    leaderboard.set(2500, 'Diana');

    // Top 3 players (first 3 in descending order)
    const top3 = [...leaderboard.entries()].slice(0, 3);
      [2500, 'Diana'],
      [2200, 'Bob'],
      [1800, 'Charlie']
    ]);

    // Highest scorer
console.log(leaderboard.first()); // [2500, 'Diana']

    // Remove lowest scorer
console.log(leaderboard.pollLast()); // [1500, 'Alice']
console.log(leaderboard.size); // 3
```

***

### floor()

```ts
floor(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:3089](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L3089)

Largest entry whose key is <= the given key.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const versions = new TreeMap<number, string>([
      [1, 'v1.0'],
      [3, 'v3.0'],
      [5, 'v5.0'],
      [7, 'v7.0']
    ]);

    // Largest version ≤ 4
console.log(versions.floor(4)); // [3, 'v3.0']
    // Largest version ≤ 5 (exact match)
console.log(versions.floor(5)); // [5, 'v5.0']
    // No version ≤ 0
```

***

### forEach()

```ts
forEach(cb, thisArg?): void;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1532](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1532)

Visit each entry in ascending key order.

Note: callback value may be `undefined`.

 *

#### Parameters

##### cb

(`value`, `key`, `map`) => `void`

##### thisArg?

`any`

#### Returns

`void`

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
      const pairs: string[] = [];
      tm.forEach((v, k) => pairs.push(`${k}:${v}`));
console.log(pairs); // ['1:a', '2:b']
```

***

### get()

```ts
get(key): V | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:567](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L567)

Get the value under a key.

#### Parameters

##### key

`K`

#### Returns

`V` \| `undefined`

#### Remarks

Expected time O(log n)

 *

#### Example

```ts
const config = new TreeMap<string, number>([
      ['maxRetries', 3],
      ['timeout', 5000],
      ['poolSize', 10]
    ]);

console.log(config.get('timeout')); // 5000
console.log(config.size); // 3
```

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-map.ts:715](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L715)

Test whether a key exists.

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Remarks

Expected time O(log n)

 *

#### Example

```ts
const flags = new TreeMap<string, boolean>([
      ['darkMode', true],
      ['betaFeature', false],
      ['notifications', true]
    ]);

console.log(flags.has('darkMode')); // true
console.log(flags.has('unknownFlag')); // false
```

***

### higher()

```ts
higher(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:3215](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L3215)

Smallest entry whose key is > the given key.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const prices = new TreeMap<number, string>([
      [10, 'Basic'],
      [25, 'Standard'],
      [50, 'Premium'],
      [100, 'Enterprise']
    ]);

    // Next tier above $25
console.log(prices.higher(25)); // [50, 'Premium']
    // Next tier above $99
console.log(prices.higher(99)); // [100, 'Enterprise']
    // Nothing above $100
```

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/binary-tree/tree-map.ts:262](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L262)

Whether the map is empty.

 *

#### Returns

`boolean`

#### Example

```ts
console.log(new TreeMap().isEmpty()); // true
```

***

### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1127](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1127)

Iterate over keys in ascending order.

 *

#### Returns

`IterableIterator`\<`K`\>

#### Example

```ts
const tm = new TreeMap<number, string>([[3, 'c'], [1, 'a']]);
console.log([...tm.keys()]); // [1, 3]
```

***

### last()

```ts
last(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2724](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2724)

Largest entry by key.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const scores = new TreeMap<number, string>([
      [85, 'Bob'],
      [92, 'Alice'],
      [78, 'Charlie']
    ]);

console.log(scores.last()); // [92, 'Alice']
console.log(scores.first()); // [78, 'Charlie']
```

***

### lower()

```ts
lower(key): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:3339](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L3339)

Largest entry whose key is < the given key.

 *

#### Parameters

##### key

`K`

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const temps = new TreeMap<number, string>([
      [0, 'Freezing'],
      [20, 'Cool'],
      [30, 'Warm'],
      [40, 'Hot']
    ]);

    // Largest reading below 30
console.log(temps.lower(30)); // [20, 'Cool']
    // Nothing below 0
```

***

### map()

```ts
map<MK, MV>(
   callbackfn, 
   options?, 
thisArg?): TreeMap<MK, MV>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1665](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1665)

Create a new TreeMap by mapping each entry to a new `[key, value]` entry.

This mirrors `RedBlackTree.map`: mapping produces a new ordered container.

#### Type Parameters

##### MK

`MK`

##### MV

`MV`

#### Parameters

##### callbackfn

`TreeMapEntryCallback`\<`K`, `V`, \[`MK`, `MV`\], `TreeMap`\<`K`, `V`, \[`K`, `V`\]\>\>

##### options?

`Omit`\<`TreeMapOptions`\<`MK`, `MV`, \[`MK`, `MV`\]\>, `"toEntryFn"`\> & `object` = `{}`

##### thisArg?

`unknown`

#### Returns

`TreeMap`\<`MK`, `MV`\>

#### Remarks

Time O(n log n) expected, Space O(n)

 *

#### Example

```ts
const tm = new TreeMap<number, number>([[1, 10], [2, 20]]);
      const doubled = tm.map((v, k) => [k, (v ?? 0) * 2] as [number, number]);
console.log([...doubled.values()]); // [20, 40]
```

***

### pollFirst()

```ts
pollFirst(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2771](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2771)

Remove and return the smallest entry.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const tasks = new TreeMap<number, string>([
      [3, 'Low'],
      [1, 'Critical'],
      [2, 'Medium']
    ]);

    // Process lowest priority first
console.log(tasks.pollFirst()); // [1, 'Critical']
console.log(tasks.pollFirst()); // [2, 'Medium']
console.log(tasks.size); // 1
```

***

### pollLast()

```ts
pollLast(): [K, V | undefined] | undefined;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2820](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2820)

Remove and return the largest entry.

 *

#### Returns

\[`K`, `V` \| `undefined`\] \| `undefined`

#### Example

```ts
const bids = new TreeMap<number, string>([
      [100, 'Alice'],
      [150, 'Bob'],
      [120, 'Charlie']
    ]);

    // Remove highest bid
console.log(bids.pollLast()); // [150, 'Bob']
console.log(bids.size); // 2
console.log(bids.last()); // [120, 'Charlie']
```

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2615](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2615)

Print a human-friendly representation.

#### Returns

`void`

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a']]);
```

***

### rangeSearch()

```ts
rangeSearch(range, options?): [K, V | undefined][];
```

Defined in: [data-structures/binary-tree/tree-map.ts:3483](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L3483)

Return all entries in a given key range.

#### Parameters

##### range

\[`K`, `K`\]

`[low, high]`

##### options?

`TreeMapRangeOptions` = `{}`

Inclusive/exclusive bounds (defaults to inclusive).

 *

#### Returns

\[`K`, `V` \| `undefined`\][]

#### Example

```ts
interface Product {
      name: string;
      price: number;
      stock: number;
    }

    const inventory = new TreeMap<string, Product, Product>(
      [
        { name: 'Widget', price: 9.99, stock: 100 },
        { name: 'Gadget', price: 24.99, stock: 50 },
        { name: 'Doohickey', price: 4.99, stock: 200 }
      ],
      { toEntryFn: p => [p.name, p] }
    );

    // Sorted alphabetically by product name
console.log([...inventory.keys()]); // ['Doohickey', 'Gadget', 'Widget']

    // Filter high-stock items
    const highStock = inventory.filter(p => (p?.stock ?? 0) > 75);
console.log([...highStock.keys()]); // ['Doohickey', 'Widget']

    // Calculate total inventory value
    const totalValue = inventory.reduce(
      (sum, p) => sum + (p ? p.price * p.stock : 0),
      0
    );
```

***

### reduce()

```ts
reduce<A>(callbackfn, initialValue): A;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1946](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1946)

Reduce entries into a single accumulator.

#### Type Parameters

##### A

`A`

#### Parameters

##### callbackfn

`TreeMapReduceCallback`\<`K`, `V`, `A`, `TreeMap`\<`K`, `V`, \[`K`, `V`\]\>\>

##### initialValue

`A`

#### Returns

`A`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const tm = new TreeMap<number, number>([[1, 10], [2, 20]]);
console.log(tm.reduce((acc, v) => acc + (v ?? 0), 0)); // 30
```

***

### set()

```ts
set(key, value): this;
```

Defined in: [data-structures/binary-tree/tree-map.ts:417](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L417)

Set or overwrite a value for a key.

#### Parameters

##### key

`K`

##### value

`V` \| `undefined`

#### Returns

`this`

#### Remarks

Expected time O(log n)

 *

#### Example

```ts
const contacts = new TreeMap<string, string>([
      ['Bob', '555-0102'],
      ['Alice', '555-0101'],
      ['Charlie', '555-0103']
    ]);

    // Contacts are automatically sorted by name
console.log([...contacts.keys()]); // ['Alice', 'Bob', 'Charlie']
console.log(contacts.get('Bob')); // '555-0102'

    // Find the first contact alphabetically after 'B'
console.log(contacts.ceiling('B')); // ['Bob', '555-0102']

    // Find contacts in range
      ['Alice', '555-0101'],
      ['Bob', '555-0102']
    ]);
```

***

### some()

```ts
some(callbackfn, thisArg?): boolean;
```

Defined in: [data-structures/binary-tree/tree-map.ts:2212](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2212)

Test whether any entry satisfies a predicate.

#### Parameters

##### callbackfn

`TreeMapEntryCallback`\<`K`, `V`, `boolean`, `TreeMap`\<`K`, `V`, \[`K`, `V`\]\>\>

##### thisArg?

`unknown`

#### Returns

`boolean`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[1, 'a'], [2, 'b']]);
console.log(tm.some((v, k) => k === 2)); // true
```

***

### toArray()

```ts
toArray(): [K, V | undefined][];
```

Defined in: [data-structures/binary-tree/tree-map.ts:2485](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L2485)

Materialize the map into an array of `[key, value]` tuples.

#### Returns

\[`K`, `V` \| `undefined`\][]

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const tm = new TreeMap<number, string>([[2, 'b'], [1, 'a']]);
console.log(tm.toArray()); // [[1, 'a'], [2, 'b']]
```

***

### values()

```ts
values(): IterableIterator<V | undefined>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:1264](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L1264)

Iterate over values in ascending key order.

Note: values may be `undefined` (TreeMap allows storing `undefined`, like native `Map`).

 *

#### Returns

`IterableIterator`\<`V` \| `undefined`\>

#### Example

```ts
const tm = new TreeMap<number, string>([[2, 'b'], [1, 'a']]);
console.log([...tm.values()]); // ['a', 'b']
```

***

### createDefaultComparator()

```ts
static createDefaultComparator<K>(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/tree-map.ts:87](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-map.ts#L87)

Create the strict default comparator.

Supports:
- `number` (rejects `NaN`; treats `-0` and `0` as equal)
- `string`
- `Date` (orders by `getTime()`, rejects invalid dates)

For other key types, a custom comparator must be provided.

#### Type Parameters

##### K

`K`

#### Returns

`Comparator`\<`K`\>
