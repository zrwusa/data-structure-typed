[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TreeSet

# Class: TreeSet\<K, R\>

Defined in: [data-structures/binary-tree/tree-set.ts:26](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L26)

An ordered Set backed by a red-black tree.

- Iteration order is ascending by key.
- No node exposure: all APIs use keys only.

## Example

```ts
// Set multiple key-value pairs
 const ts = new TreeSet<number, string>();
    ts.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
    console.log(ts.size); // 3;
```

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
new TreeSet<K, R>(elements?, options?): TreeSet<K, R>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:46](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L46)

Create a TreeSet from an iterable of keys or raw elements.

#### Parameters

##### elements?

`Iterable`\<`K`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of keys, or raw elements if `toElementFn` is provided.

##### options?

`TreeSetOptions`\<`K`, `R`\> = `{}`

Configuration options including optional `toElementFn` to transform raw elements.

#### Returns

`TreeSet`\<`K`, `R`\>

#### Throws

When using the default comparator and encountering unsupported key types,
or invalid keys (e.g. `NaN`, invalid `Date`).

#### Example

```ts
// Standard usage with keys
const set = new TreeSet([3, 1, 2]);

// Using toElementFn to transform raw objects
const users = [{ id: 3, name: 'Alice' }, { id: 1, name: 'Bob' }];
const set = new TreeSet<number, User>(users, { toElementFn: u => u.id });
```

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/binary-tree/tree-set.ts:101](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L101)

Number of elements in the set.

##### Returns

`number`

## Methods

### add()

```ts
add(key): this;
```

Defined in: [data-structures/binary-tree/tree-set.ts:388](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L388)

Add a key to the set (no-op if already present).

#### Parameters

##### key

`K`

#### Returns

`this`

#### Remarks

Expected time O(log n)

 *

#### Example

```ts
const tags = new TreeSet<string>(['javascript', 'typescript', 'react', 'typescript', 'node']);

    // Duplicates removed, sorted alphabetically
console.log([...tags]); // ['javascript', 'node', 'react', 'typescript']
console.log(tags.size); // 4

    tags.add('angular');
console.log(tags.first()); // 'angular'
console.log(tags.last()); // 'typescript'
```

***

### ceiling()

```ts
ceiling(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2739](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2739)

Smallest key that is >= the given key.

 *

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Example

```ts
// Available appointment times (minutes from midnight)
    const slots = new TreeSet<number>([540, 600, 660, 720, 840, 900]);

    // Customer wants something around 10:30 (630 min)
    const nearest = slots.ceiling(630);
console.log(nearest); // 660

    // What's the latest slot before 2:00 PM (840)?
    const before2pm = slots.lower(840);
console.log(before2pm); // 720

    // Book the 11:00 slot
    slots.delete(660);
console.log(slots.ceiling(630)); // 720
```

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/binary-tree/tree-set.ts:812](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L812)

Remove all keys.

 *

#### Returns

`void`

#### Example

```ts
const ts = new TreeSet<number>([1, 2]);
      ts.clear();
console.log(ts.isEmpty()); // true
```

***

### clone()

```ts
clone(): TreeSet<K>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:3369](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L3369)

Creates a shallow clone of this set.

#### Returns

`TreeSet`\<`K`\>

#### Remarks

Time O(n log n), Space O(n)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 2, 3]);
      const copy = ts.clone();
      copy.delete(1);
console.log(ts.has(1)); // true
```

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-set.ts:680](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L680)

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
const nums = new TreeSet<number>([1, 3, 5, 7, 9]);

console.log(nums.delete(5)); // true
console.log(nums.delete(5)); // false
console.log([...nums]); // [1, 3, 7, 9]
```

***

### entries()

```ts
entries(): IterableIterator<[K, K]>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1203](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1203)

Iterate over `[value, value]` pairs (native Set convention).

Note: TreeSet stores only keys internally; `[k, k]` is created on-the-fly during iteration.

 *

#### Returns

`IterableIterator`\<\[`K`, `K`\]\>

#### Example

```ts
const ts = new TreeSet<number>([3, 1, 2]);
console.log([...ts.entries()].map(([k]) => k)); // [1, 2, 3]
```

***

### every()

```ts
every(callbackfn, thisArg?): boolean;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1886](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1886)

Test whether all values satisfy a predicate.

#### Parameters

##### callbackfn

`TreeSetElementCallback`\<`K`, `boolean`, `TreeSet`\<`K`, `K`\>\>

##### thisArg?

`unknown`

#### Returns

`boolean`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ts = new TreeSet<number>([2, 4, 6]);
console.log(ts.every(k => k > 0)); // true
```

***

### filter()

```ts
filter(callbackfn, thisArg?): TreeSet<K>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1616](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1616)

Create a new TreeSet containing only values that satisfy the predicate.

#### Parameters

##### callbackfn

`TreeSetElementCallback`\<`K`, `boolean`, `TreeSet`\<`K`, `K`\>\>

##### thisArg?

`unknown`

#### Returns

`TreeSet`\<`K`\>

#### Remarks

Time O(n log n) expected, Space O(n)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 2, 3, 4, 5]);
      const evens = ts.filter(k => k % 2 === 0);
console.log([...evens]); // [2, 4]
```

***

### find()

```ts
find(callbackfn, thisArg?): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2157](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2157)

Find the first value that satisfies a predicate.

#### Parameters

##### callbackfn

`TreeSetElementCallback`\<`K`, `boolean`, `TreeSet`\<`K`, `K`\>\>

##### thisArg?

`unknown`

#### Returns

`K` \| `undefined`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 2, 3]);
      const found = ts.find(k => k === 2);
console.log(found); // 2
```

***

### first()

```ts
first(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2488](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2488)

Smallest key in the set.

 *

#### Returns

`K` \| `undefined`

#### Example

```ts
interface Student {
      name: string;
      gpa: number;
    }

    const ranking = new TreeSet<Student>(
      [
        { name: 'Alice', gpa: 3.8 },
        { name: 'Bob', gpa: 3.5 },
        { name: 'Charlie', gpa: 3.9 },
        { name: 'Diana', gpa: 3.5 }
      ],
      { comparator: (a, b) => b.gpa - a.gpa || a.name.localeCompare(b.name) }
    );

    // Sorted by GPA descending, then name ascending
    const names = [...ranking].map(s => s.name);
console.log(names); // ['Charlie', 'Alice', 'Bob', 'Diana']

    // Top student
console.log(ranking.first()?.name); // 'Charlie'

    // Filter students with GPA >= 3.8
    const honors = ranking.filter(s => s.gpa >= 3.8);
console.log(honors.toArray().map(s => s.name)); // ['Charlie', 'Alice']
```

***

### floor()

```ts
floor(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2857](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2857)

Largest key that is <= the given key.

 *

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Example

```ts
const breakpoints = new TreeSet<number>([320, 768, 1024, 1280, 1920]);

    // Current width is 800 → which breakpoint applies?
console.log(breakpoints.floor(800)); // 768
console.log(breakpoints.floor(1024)); // 1024
```

***

### forEach()

```ts
forEach(cb, thisArg?): void;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1340](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1340)

Visit each value in ascending order.

Callback follows native Set convention: `(value, value2, set)`.

 *

#### Parameters

##### cb

(`value`, `value2`, `set`) => `void`

##### thisArg?

`any`

#### Returns

`void`

#### Example

```ts
const ts = new TreeSet<number>([3, 1, 2]);
      const keys: number[] = [];
      ts.forEach(k => keys.push(k));
console.log(keys); // [1, 2, 3]
```

***

### has()

```ts
has(key): boolean;
```

Defined in: [data-structures/binary-tree/tree-set.ts:534](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L534)

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
const allowed = new TreeSet<string>(['admin', 'editor', 'viewer']);

console.log(allowed.has('admin')); // true
console.log(allowed.has('guest')); // false
```

***

### higher()

```ts
higher(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2973](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2973)

Smallest key that is > the given key.

 *

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Example

```ts
const levels = new TreeSet<number>([1, 5, 10, 25, 50, 100]);

console.log(levels.higher(10)); // 25
```

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/binary-tree/tree-set.ts:229](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L229)

Whether the set is empty.

 *

#### Returns

`boolean`

#### Example

```ts
console.log(new TreeSet().isEmpty()); // true
```

***

### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:941](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L941)

Iterate over keys in ascending order.

 *

#### Returns

`IterableIterator`\<`K`\>

#### Example

```ts
const ts = new TreeSet<number>([30, 10, 20]);
console.log([...ts.keys()]); // [10, 20, 30]
```

***

### last()

```ts
last(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2527](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2527)

Largest key in the set.

 *

#### Returns

`K` \| `undefined`

#### Example

```ts
const temps = new TreeSet<number>([18, 22, 15, 30, 25]);
console.log(temps.last()); // 30
console.log(temps.first()); // 15
```

***

### lower()

```ts
lower(key): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:3089](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L3089)

Largest key that is < the given key.

 *

#### Parameters

##### key

`K`

#### Returns

`K` \| `undefined`

#### Example

```ts
const tiers = new TreeSet<number>([100, 200, 500, 1000]);

console.log(tiers.lower(500)); // 200
```

***

### map()

```ts
map<MK>(
   callbackfn, 
   options?, 
thisArg?): TreeSet<MK>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1473](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1473)

Create a new TreeSet by mapping each value to a new key.

This mirrors `RedBlackTree.map`: mapping produces a new ordered container.

#### Type Parameters

##### MK

`MK`

#### Parameters

##### callbackfn

`TreeSetElementCallback`\<`K`, `MK`, `TreeSet`\<`K`, `K`\>\>

##### options?

`Omit`\<`TreeSetOptions`\<`MK`, `MK`\>, `"toElementFn"`\> & `object` = `{}`

##### thisArg?

`unknown`

#### Returns

`TreeSet`\<`MK`\>

#### Remarks

Time O(n log n) expected, Space O(n)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 2, 3]);
      const doubled = ts.map(k => k * 2);
console.log([...doubled]); // [2, 4, 6]
```

***

### pollFirst()

```ts
pollFirst(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2568](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2568)

Remove and return the smallest key.

 *

#### Returns

`K` \| `undefined`

#### Example

```ts
const queue = new TreeSet<number>([5, 1, 8, 3]);

console.log(queue.pollFirst()); // 1
console.log(queue.pollFirst()); // 3
console.log(queue.size); // 2
```

***

### pollLast()

```ts
pollLast(): K | undefined;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2611](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2611)

Remove and return the largest key.

 *

#### Returns

`K` \| `undefined`

#### Example

```ts
const stack = new TreeSet<number>([10, 20, 30]);

console.log(stack.pollLast()); // 30
console.log(stack.size); // 2
```

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2424](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2424)

Print a human-friendly representation.

#### Returns

`void`

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 2, 3]);
```

***

### rangeSearch()

```ts
rangeSearch(range, options?): K[];
```

Defined in: [data-structures/binary-tree/tree-set.ts:3219](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L3219)

Return all keys in a given range.

#### Parameters

##### range

\[`K`, `K`\]

`[low, high]`

##### options?

`TreeSetRangeOptions` = `{}`

Inclusive/exclusive bounds (defaults to inclusive).

 *

#### Returns

`K`[]

#### Example

```ts
// Simplified: use numeric IP representation
    const blocklist = new TreeSet<number>([
      167772160, // 10.0.0.0
      167772416, // 10.0.1.0
      167772672, // 10.0.2.0
      167773184  // 10.0.4.0
    ]);

    // Check if any blocked IP is in range 10.0.1.0 - 10.0.3.0
    const inRange = blocklist.rangeSearch([167772416, 167772928]);
console.log(inRange); // [167772416, 167772672]

    // Quick membership check
console.log(blocklist.has(167772416)); // true
console.log(blocklist.has(167772800)); // false
```

***

### reduce()

```ts
reduce<A>(callbackfn, initialValue): A;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1755](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1755)

Reduce values into a single accumulator.

#### Type Parameters

##### A

`A`

#### Parameters

##### callbackfn

`TreeSetReduceCallback`\<`K`, `A`, `TreeSet`\<`K`, `K`\>\>

##### initialValue

`A`

#### Returns

`A`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 2, 3]);
      const sum = ts.reduce((acc, k) => acc + k, 0);
console.log(sum); // 6
```

***

### some()

```ts
some(callbackfn, thisArg?): boolean;
```

Defined in: [data-structures/binary-tree/tree-set.ts:2021](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2021)

Test whether any value satisfies a predicate.

#### Parameters

##### callbackfn

`TreeSetElementCallback`\<`K`, `boolean`, `TreeSet`\<`K`, `K`\>\>

##### thisArg?

`unknown`

#### Returns

`boolean`

#### Remarks

Time O(n), Space O(1)

 *

#### Example

```ts
const ts = new TreeSet<number>([1, 3, 5]);
console.log(ts.some(k => k === 3)); // true
```

***

### toArray()

```ts
toArray(): K[];
```

Defined in: [data-structures/binary-tree/tree-set.ts:2294](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L2294)

Materialize the set into an array of keys.

#### Returns

`K`[]

#### Remarks

Time O(n), Space O(n)

 *

#### Example

```ts
const ts = new TreeSet<number>([3, 1, 2]);
console.log(ts.toArray()); // [1, 2, 3]
```

***

### values()

```ts
values(): IterableIterator<K>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:1072](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L1072)

Iterate over values in ascending order.

Note: for Set-like containers, `values()` is the same as `keys()`.

 *

#### Returns

`IterableIterator`\<`K`\>

#### Example

```ts
const ts = new TreeSet<number>([2, 1, 3]);
console.log([...ts.values()]); // [1, 2, 3]
```

***

### createDefaultComparator()

```ts
static createDefaultComparator<K>(): Comparator<K>;
```

Defined in: [data-structures/binary-tree/tree-set.ts:71](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/binary-tree/tree-set.ts#L71)

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
