[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / LinearBase

# Abstract Class: LinearBase\<E, R, NODE\>

Defined in: [data-structures/base/linear-base.ts:68](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L68)

Abstract linear container with array-like utilities.

## Remarks

Time O(1), Space O(1)

## Extends

- [`IterableElementBase`](IterableElementBase.md)\<`E`, `R`\>

## Extended by

- [`Queue`](Queue.md)
- [`Deque`](Deque.md)
- [`LinearLinkedBase`](LinearLinkedBase.md)

## Type Parameters

### E

`E`

Element type.

### R

`R` = `any`

Return type for mapped/derived views.

### NODE

`NODE` *extends* [`LinkedListNode`](LinkedListNode.md)\<`E`\> = [`LinkedListNode`](LinkedListNode.md)\<`E`\>

Linked node type used by some implementations.

## Constructors

### Constructor

```ts
new LinearBase<E, R, NODE>(options?): LinearBase<E, R, NODE>;
```

Defined in: [data-structures/base/linear-base.ts:78](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L78)

Construct a linear container with runtime options.

#### Parameters

##### options?

`LinearBaseOptions`\<`E`, `R`\>

`{ maxLen?, ... }` bounds/behavior options.

#### Returns

`LinearBase`\<`E`, `R`, `NODE`\>

#### Remarks

Time O(1), Space O(1)

#### Overrides

```ts
IterableElementBase<E, R>.constructor
```

## Accessors

### length

#### Get Signature

```ts
get abstract length(): number;
```

Defined in: [data-structures/base/linear-base.ts:91](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L91)

Element count.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Number of elements.

***

### maxLen

#### Get Signature

```ts
get maxLen(): number;
```

Defined in: [data-structures/base/linear-base.ts:100](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L100)

Upper bound for length (if positive), or `-1` when unbounded.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Maximum allowed length.

***

### toElementFn

#### Get Signature

```ts
get toElementFn(): ((rawElement) => E) | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:47](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L47)

Exposes the current `toElementFn`, if configured.

##### Remarks

Time O(1), Space O(1).

##### Returns

((`rawElement`) => `E`) \| `undefined`

The converter function or `undefined` when not set.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toElementFn`](IterableElementBase.md#toelementfn)

## Methods

### \[iterator\]()

```ts
iterator: IterableIterator<E>;
```

Defined in: [data-structures/base/iterable-element-base.ts:60](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L60)

Returns an iterator over the structure's elements.

#### Parameters

##### args

...`unknown`[]

Optional iterator arguments forwarded to the internal iterator.

#### Returns

`IterableIterator`\<`E`\>

An `IterableIterator<E>` that yields the elements in traversal order.

#### Remarks

Producing the iterator is O(1); consuming the entire iterator is Time O(n) with O(1) extra space.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`[iterator]`](IterableElementBase.md#iterator)

***

### addAt()

```ts
abstract addAt(index, newElementOrNode): boolean;
```

Defined in: [data-structures/base/linear-base.ts:377](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L377)

Insert an element/node at a position.

#### Parameters

##### index

`number`

Position (0-based).

##### newElementOrNode

`E` \| `NODE`

Element or node to insert.

#### Returns

`boolean`

`true` if inserted.

#### Remarks

Time O(1)~O(n) depending on implementation, Space O(1)

***

### at()

```ts
abstract at(index): E | undefined;
```

Defined in: [data-structures/base/linear-base.ts:360](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L360)

Get element at an index.

#### Parameters

##### index

`number`

Position (0-based).

#### Returns

`E` \| `undefined`

Element or `undefined`.

#### Remarks

Time O(1)~O(n) depending on implementation, Space O(1)

***

### clear()

```ts
abstract clear(): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:288](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L288)

Removes all elements from the structure.

#### Returns

`void`

`void`.

#### Remarks

Expected Time O(1) or O(n) depending on the implementation; Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`clear`](IterableElementBase.md#clear)

***

### clone()

```ts
abstract clone(): this;
```

Defined in: [data-structures/base/linear-base.ts:321](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L321)

Deep clone while preserving concrete subtype.

#### Returns

`this`

New list of the same species (`this` type).

#### Remarks

Time O(n), Space O(n)

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clone`](IterableElementBase.md#clone)

***

### concat()

```ts
concat(...items): this;
```

Defined in: [data-structures/base/linear-base.ts:165](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L165)

Concatenate elements and/or containers.

#### Parameters

##### items

...(`E` \| `LinearBase`\<`E`, `R`, `NODE`\>)[]

Elements or other containers.

#### Returns

`this`

New container with combined elements (`this` type).

#### Remarks

Time O(sum(length)), Space O(sum(length))

***

### delete()

```ts
abstract delete(elementOrNode): boolean;
```

Defined in: [data-structures/base/linear-base.ts:352](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L352)

Remove one element or node if present.

#### Parameters

##### elementOrNode

`E` \| `NODE` \| `undefined`

Element or node to delete.

#### Returns

`boolean`

`true` if removed.

#### Remarks

Time O(1)~O(n) depending on implementation, Space O(1)

***

### deleteAt()

```ts
abstract deleteAt(pos): E | undefined;
```

Defined in: [data-structures/base/linear-base.ts:368](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L368)

Remove element at a position.

#### Parameters

##### pos

`number`

Position (0-based).

#### Returns

`E` \| `undefined`

Removed element or `undefined`.

#### Remarks

Time O(1)~O(n) depending on implementation, Space O(1)

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:86](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L86)

Tests whether all elements satisfy the predicate.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Function invoked for each element with signature `(value, index, self)`.

##### thisArg?

`unknown`

Optional `this` binding for the predicate.

#### Returns

`boolean`

`true` if every element passes; otherwise `false`.

#### Remarks

Time O(n) in the worst case; may exit early when the first failure is found. Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`every`](IterableElementBase.md#every)

***

### fill()

```ts
fill(
   value, 
   start?, 
   end?): this;
```

Defined in: [data-structures/base/linear-base.ts:292](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L292)

Fill a range with a value.

#### Parameters

##### value

`E`

Value to set.

##### start?

`number` = `0`

Inclusive start.

##### end?

`number` = `...`

Exclusive end.

#### Returns

`this`

This list.

#### Remarks

Time O(n), Space O(1)

***

### filter()

```ts
abstract filter(predicate, thisArg?): this;
```

Defined in: [data-structures/base/iterable-element-base.ts:340](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L340)

Filters elements using the provided predicate and returns the same concrete structure type.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Function with signature `(value, index, self) => boolean`.

##### thisArg?

`unknown`

Optional `this` binding for the predicate.

#### Returns

`this`

A new instance of the same concrete type containing only elements that pass the predicate.

#### Remarks

Time O(n), Space O(k) where `k` is the number of kept elements.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`filter`](IterableElementBase.md#filter)

***

### find()

#### Call Signature

```ts
find<S>(predicate, thisArg?): S | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:162](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L162)

Finds the first element that satisfies the predicate and returns it.

Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.

##### Type Parameters

###### S

`S`

##### Parameters

###### predicate

`ElementCallback`\<`E`, `R`, `S`\>

Type-guard predicate: `(value, index, self) => value is S`.

###### thisArg?

`unknown`

Optional `this` binding for the predicate.

##### Returns

`S` \| `undefined`

The matched element typed as `S`, or `undefined` if not found.

##### Remarks

Time O(n) in the worst case; may exit early on the first match. Space O(1).

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

#### Call Signature

```ts
find(predicate, thisArg?): E | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:163](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L163)

Finds the first element that satisfies the predicate and returns it.

Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.

##### Parameters

###### predicate

`ElementCallback`\<`E`, `R`, `unknown`\>

Type-guard predicate: `(value, index, self) => value is S`.

###### thisArg?

`unknown`

Optional `this` binding for the predicate.

##### Returns

`E` \| `undefined`

The matched element typed as `S`, or `undefined` if not found.

##### Remarks

Time O(n) in the worst case; may exit early on the first match. Space O(1).

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

***

### findIndex()

```ts
findIndex(predicate, thisArg?): number;
```

Defined in: [data-structures/base/linear-base.ts:151](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L151)

Find the first index matching a predicate.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

`(element, index, self) => boolean`.

##### thisArg?

`any`

Optional `this` for callback.

#### Returns

`number`

Index or `-1`.

#### Remarks

Time O(n), Space O(1)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:132](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L132)

Invokes a callback for each element in iteration order.

#### Parameters

##### callbackfn

`ElementCallback`\<`E`, `R`, `void`\>

Function invoked per element with signature `(value, index, self)`.

##### thisArg?

`unknown`

Optional `this` binding for the callback.

#### Returns

`void`

`void`.

#### Remarks

Time O(n), Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`forEach`](IterableElementBase.md#foreach)

***

### has()

```ts
has(element): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:188](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L188)

Checks whether a strictly-equal element exists in the structure.

#### Parameters

##### element

`E`

The element to test with `===` equality.

#### Returns

`boolean`

`true` if an equal element is found; otherwise `false`.

#### Remarks

Time O(n) in the worst case. Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`has`](IterableElementBase.md#has)

***

### indexOf()

```ts
indexOf(searchElement, fromIndex?): number;
```

Defined in: [data-structures/base/linear-base.ts:111](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L111)

First index of a value from the left.

#### Parameters

##### searchElement

`E`

Value to match.

##### fromIndex?

`number` = `0`

Start position (supports negative index).

#### Returns

`number`

Index or `-1` if not found.

#### Remarks

Time O(n), Space O(1)

***

### isEmpty()

```ts
abstract isEmpty(): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:279](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L279)

Indicates whether the structure currently contains no elements.

#### Returns

`boolean`

`true` if empty; otherwise `false`.

#### Remarks

Expected Time O(1), Space O(1) for most implementations.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`isEmpty`](IterableElementBase.md#isempty)

***

### join()

```ts
join(separator?): string;
```

Defined in: [data-structures/base/linear-base.ts:228](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L228)

Join all elements into a string.

#### Parameters

##### separator?

`string` = `','`

Separator string.

#### Returns

`string`

Concatenated string.

#### Remarks

Time O(n), Space O(n)

***

### lastIndexOf()

```ts
lastIndexOf(searchElement, fromIndex?): number;
```

Defined in: [data-structures/base/linear-base.ts:131](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L131)

Last index of a value from the right.

#### Parameters

##### searchElement

`E`

Value to match.

##### fromIndex?

`number` = `...`

Start position (supports negative index).

#### Returns

`number`

Index or `-1` if not found.

#### Remarks

Time O(n), Space O(1)

***

### map()

```ts
abstract map<EM, RM>(
   callback, 
   options?, 
thisArg?): IterableElementBase<EM, RM>;
```

Defined in: [data-structures/base/iterable-element-base.ts:312](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L312)

Maps each element to a new element and returns a new iterable structure.

#### Type Parameters

##### EM

`EM`

The mapped element type.

##### RM

`RM`

The mapped raw element type used internally by the target structure.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Function with signature `(value, index, self) => mapped`.

##### options?

`IterableElementBaseOptions`\<`EM`, `RM`\>

Optional options for the returned structure, including its `toElementFn`.

##### thisArg?

`unknown`

Optional `this` binding for the callback.

#### Returns

[`IterableElementBase`](IterableElementBase.md)\<`EM`, `RM`\>

A new `IterableElementBase<EM, RM>` containing mapped elements.

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`map`](IterableElementBase.md#map)

***

### mapSame()

```ts
abstract mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/base/iterable-element-base.ts:328](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L328)

Maps each element to the same element type and returns the same concrete structure type.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `E`\>

Function with signature `(value, index, self) => mappedValue`.

##### thisArg?

`unknown`

Optional `this` binding for the callback.

#### Returns

`this`

A new instance of the same concrete type with mapped elements.

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`mapSame`](IterableElementBase.md#mapsame)

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:268](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L268)

Prints `toVisual()` to the console. Intended for quick debugging.

#### Returns

`void`

`void`.

#### Remarks

Time O(n) due to materialization, Space O(n) for the intermediate representation.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`print`](IterableElementBase.md#print)

***

### push()

```ts
abstract push(elementOrNode): boolean;
```

Defined in: [data-structures/base/linear-base.ts:336](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L336)

Append one element or node to the tail.

#### Parameters

##### elementOrNode

`E` \| `NODE`

Element or node.

#### Returns

`boolean`

`true` if appended.

#### Remarks

Time O(1) amortized typical, Space O(1)

***

### pushMany()

```ts
abstract pushMany(elements): boolean[];
```

Defined in: [data-structures/base/linear-base.ts:344](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L344)

Append many elements/nodes at once.

#### Parameters

##### elements

  \| `Iterable`\<`E`, `any`, `any`\>
  \| `Iterable`\<`R`, `any`, `any`\>
  \| `Iterable`\<`NODE`, `any`, `any`\>

Iterable of elements or nodes.

#### Returns

`boolean`[]

Array of booleans indicating append success.

#### Remarks

Time O(n), Space O(1)

***

### reduce()

Reduces all elements to a single accumulated value.

#### Param

Reducer of signature `(acc, value, index, self) => nextAcc`. The first element is used as the initial accumulator.

#### Param

Reducer of signature `(acc, value, index, self) => nextAcc`.

#### Param

The initial accumulator value of type `E`.

#### Template

The accumulator type when it differs from `E`.

#### Param

Reducer of signature `(acc: U, value, index, self) => U`.

#### Param

The initial accumulator value of type `U`.

#### Remarks

Time O(n), Space O(1). Throws if called on an empty structure without `initialValue`.

#### Call Signature

```ts
reduce(callbackfn): E;
```

Defined in: [data-structures/base/iterable-element-base.ts:193](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L193)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`\>

##### Returns

`E`

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

#### Call Signature

```ts
reduce(callbackfn, initialValue): E;
```

Defined in: [data-structures/base/iterable-element-base.ts:194](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L194)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`\>

###### initialValue

`E`

##### Returns

`E`

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

#### Call Signature

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-element-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L195)

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`E`, `R`, `U`\>

###### initialValue

`U`

##### Returns

`U`

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

***

### reduceRight()

```ts
reduceRight<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/linear-base.ts:256](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L256)

Right-to-left reduction over elements.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

`ReduceLinearCallback`\<`E`, `U`\>

`(acc, element, index, self) => acc`.

##### initialValue

`U`

Initial accumulator (optional generic overloads supported).

#### Returns

`U`

Final accumulator.

#### Remarks

Time O(n), Space O(1)

***

### reverse()

```ts
abstract reverse(): this;
```

Defined in: [data-structures/base/linear-base.ts:328](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L328)

Reverse the order of elements in-place (or equivalent).

#### Returns

`this`

This list.

#### Remarks

Time O(n), Space O(1)

***

### setAt()

```ts
abstract setAt(index, value): boolean;
```

Defined in: [data-structures/base/linear-base.ts:314](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L314)

Set the value at an index.

#### Parameters

##### index

`number`

Position (0-based).

##### value

`E`

New value.

#### Returns

`boolean`

`true` if updated.

#### Remarks

Time O(1) typical, Space O(1)

***

### slice()

```ts
slice(start?, end?): this;
```

Defined in: [data-structures/base/linear-base.ts:273](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L273)

Create a shallow copy of a subrange.

#### Parameters

##### start?

`number` = `0`

Inclusive start (supports negative index).

##### end?

`number` = `...`

Exclusive end (supports negative index).

#### Returns

`this`

New list with the range (`this` type).

#### Remarks

Time O(n), Space O(n)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:109](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L109)

Tests whether at least one element satisfies the predicate.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Function invoked for each element with signature `(value, index, self)`.

##### thisArg?

`unknown`

Optional `this` binding for the predicate.

#### Returns

`boolean`

`true` if any element passes; otherwise `false`.

#### Remarks

Time O(n) in the worst case; may exit early on first success. Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`some`](IterableElementBase.md#some)

***

### sort()

```ts
sort(compareFn?): this;
```

Defined in: [data-structures/base/linear-base.ts:185](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L185)

In-place stable order via array sort semantics.

#### Parameters

##### compareFn?

(`a`, `b`) => `number`

Comparator `(a, b) => number`.

#### Returns

`this`

This container.

#### Remarks

Time O(n log n), Space O(n) (materializes to array temporarily)

***

### splice()

```ts
splice(
   start, 
   deleteCount?, ...
   items): this;
```

Defined in: [data-structures/base/linear-base.ts:201](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L201)

Remove and/or insert elements at a position (array-compatible).

#### Parameters

##### start

`number`

Start index (supports negative index).

##### deleteCount?

`number` = `0`

How many to remove.

##### items

...`E`[]

Elements to insert.

#### Returns

`this`

Removed elements as a new list (`this` type).

#### Remarks

Time O(n + m), Space O(min(n, m)) where `m = items.length`

***

### toArray()

```ts
toArray(): E[];
```

Defined in: [data-structures/base/iterable-element-base.ts:245](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L245)

Materializes the elements into a new array.

#### Returns

`E`[]

A shallow array copy of the iteration order.

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toArray`](IterableElementBase.md#toarray)

***

### toReversedArray()

```ts
toReversedArray(): E[];
```

Defined in: [data-structures/base/linear-base.ts:237](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/linear-base.ts#L237)

Snapshot elements into a reversed array.

#### Returns

`E`[]

New reversed array.

#### Remarks

Time O(n), Space O(n)

***

### toVisual()

```ts
toVisual(): E[];
```

Defined in: [data-structures/base/iterable-element-base.ts:257](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L257)

Returns a representation of the structure suitable for quick visualization.
Defaults to an array of elements; subclasses may override to provide richer visuals.

#### Returns

`E`[]

A visual representation (array by default).

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toVisual`](IterableElementBase.md#tovisual)

***

### values()

```ts
values(): IterableIterator<E>;
```

Defined in: [data-structures/base/iterable-element-base.ts:71](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/base/iterable-element-base.ts#L71)

Returns an iterator over the values (alias of the default iterator).

#### Returns

`IterableIterator`\<`E`\>

An `IterableIterator<E>` over all elements.

#### Remarks

Creating the iterator is O(1); full iteration is Time O(n), Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`values`](IterableElementBase.md#values)
