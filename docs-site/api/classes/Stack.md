[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Stack

# Class: Stack\<E, R\>

Defined in: [data-structures/stack/stack.ts:135](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L135)

LIFO stack with array storage and optional record→element conversion.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// Function Call Stack
 const functionStack = new Stack<string>();
    functionStack.push('main');
    functionStack.push('foo');
    functionStack.push('bar');
    console.log(functionStack.pop()); // 'bar';
    console.log(functionStack.pop()); // 'foo';
    console.log(functionStack.pop()); // 'main';
```

```ts
// Balanced Parentheses or Brackets
 type ValidCharacters = ')' | '(' | ']' | '[' | '}' | '{';

    const stack = new Stack<string>();
    const input: ValidCharacters[] = '[({})]'.split('') as ValidCharacters[];
    const matches: { [key in ValidCharacters]?: ValidCharacters } = { ')': '(', ']': '[', '}': '{' };
    for (const char of input) {
      if ('([{'.includes(char)) {
        stack.push(char);
      } else if (')]}'.includes(char)) {
        if (stack.pop() !== matches[char]) {
          fail('Parentheses are not balanced');
        }
      }
    }
    console.log(stack.isEmpty()); // true;
```

```ts
// Expression Evaluation and Conversion
 const stack = new Stack<number>();
    const expression = [5, 3, '+']; // Equivalent to 5 + 3
    expression.forEach(token => {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(token === '+' ? a + b : 0); // Only handling '+' here
      }
    });
    console.log(stack.pop()); // 8;
```

```ts
// Backtracking Algorithms
 const stack = new Stack<[number, number]>();
    const maze = [
      ['S', ' ', 'X'],
      ['X', ' ', 'X'],
      [' ', ' ', 'E']
    ];
    const start: [number, number] = [0, 0];
    const end = [2, 2];
    const directions = [
      [0, 1], // To the right
      [1, 0], // down
      [0, -1], // left
      [-1, 0] // up
    ];

    const visited = new Set<string>(); // Used to record visited nodes
    stack.push(start);
    const path: number[][] = [];

    while (!stack.isEmpty()) {
      const [x, y] = stack.pop()!;
      if (visited.has(`${x},${y}`)) continue; // Skip already visited nodes
      visited.add(`${x},${y}`);

      path.push([x, y]);

      if (x === end[0] && y === end[1]) {
        break; // Find the end point and exit
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          maze[nx]?.[ny] === ' ' || // feasible path
          maze[nx]?.[ny] === 'E' // destination
        ) {
          stack.push([nx, ny]);
        }
      }
    }

    console.log(path); // contains end;
```

```ts
// Stock Span Problem
 const stack = new Stack<number>();
    const prices = [100, 80, 60, 70, 60, 75, 85];
    const spans: number[] = [];
    prices.forEach((price, i) => {
      while (!stack.isEmpty() && prices[stack.peek()!] <= price) {
        stack.pop();
      }
      spans.push(stack.isEmpty() ? i + 1 : i - stack.peek()!);
      stack.push(i);
    });
    console.log(spans); // [1, 1, 1, 2, 1, 4, 6];
```

```ts
// Simplify File Paths
 const stack = new Stack<string>();
    const path = '/a/./b/../../c';
    path.split('/').forEach(segment => {
      if (segment === '..') stack.pop();
      else if (segment && segment !== '.') stack.push(segment);
    });
    console.log(stack.elements.join('/')); // 'c';
```

```ts
// Convert stack to array
 const stack = new Stack<number>([1, 2, 3]);
    console.log(stack.toArray()); // [1, 2, 3];
```

## Extends

- [`IterableElementBase`](IterableElementBase.md)\<`E`, `R`\>

## Type Parameters

### E

`E` = `any`

### R

`R` = `any`

1. Last In, First Out (LIFO): The core characteristic of a stack is its last in, first out nature, meaning the last element added to the stack will be the first to be removed.
2. Uses: Stacks are commonly used for managing a series of tasks or elements that need to be processed in a last in, first out manner. They are widely used in various scenarios, such as in function calls in programming languages, evaluation of arithmetic expressions, and backtracking algorithms.
3. Performance: Stack operations are typically O(1) in time complexity, meaning that regardless of the stack's size, adding, removing, and viewing the top element are very fast operations.
4. Function Calls: In most modern programming languages, the records of function calls are managed through a stack. When a function is called, its record (including parameters, local variables, and return address) is 'pushed' into the stack. When the function returns, its record is 'popped' from the stack.
5. Expression Evaluation: Used for the evaluation of arithmetic or logical expressions, especially when dealing with parenthesis matching and operator precedence.
6. Backtracking Algorithms: In problems where multiple branches need to be explored but only one branch can be explored at a time, stacks can be used to save the state at each branching point.

## Constructors

### Constructor

```ts
new Stack<E, R>(elements?, options?): Stack<E, R>;
```

Defined in: [data-structures/stack/stack.ts:146](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L146)

Create a Stack and optionally bulk-push elements.

#### Parameters

##### elements?

`Iterable`\<`E`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of elements (or raw records if toElementFn is set).

##### options?

`StackOptions`\<`E`, `R`\>

Options such as toElementFn and equality function.

#### Returns

`Stack`\<`E`, `R`\>

New Stack instance.

#### Remarks

Time O(N), Space O(N)

#### Overrides

```ts
IterableElementBase<E, R>.constructor
```

## Accessors

### elements

#### Get Signature

```ts
get elements(): E[];
```

Defined in: [data-structures/stack/stack.ts:159](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L159)

Get the backing array of elements.

##### Remarks

Time O(1), Space O(1)

##### Returns

`E`[]

Internal elements array.

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/stack/stack.ts:198](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L198)

Get the number of stored elements.

##### Remarks

Time O(1), Space O(1)

##### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log(stack.size); // 3
```

##### Returns

`number`

Current size.

 *

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

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/stack/stack.ts:537](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L537)

Remove all elements and reset storage.

#### Returns

`void`

void

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
    stack.clear();
console.log(stack.isEmpty()); // true
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clear`](IterableElementBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/stack/stack.ts:579](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L579)

Deep clone this stack.

#### Returns

`this`

A new stack with the same content.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
    const copy = stack.clone();
    copy.pop();
console.log(stack.size); // 3
console.log(copy.size); // 2
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clone`](IterableElementBase.md#clone)

***

### delete()

```ts
delete(element): boolean;
```

Defined in: [data-structures/stack/stack.ts:466](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L466)

Delete the first occurrence of a specific element.

#### Parameters

##### element

`E`

Element to remove (using the configured equality).

#### Returns

`boolean`

True if an element was removed.

 *

#### Remarks

Time O(N), Space O(1)

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
    stack.delete(2);
console.log(stack.toArray()); // [1, 3]
```

***

### deleteAt()

```ts
deleteAt(index): boolean;
```

Defined in: [data-structures/stack/stack.ts:478](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L478)

Delete the element at an index.

#### Parameters

##### index

`number`

Zero-based index from the bottom.

#### Returns

`boolean`

True if removed.

#### Remarks

Time O(N), Space O(1)

***

### deleteWhere()

```ts
deleteWhere(predicate): boolean;
```

Defined in: [data-structures/stack/stack.ts:491](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L491)

Delete the first element that satisfies a predicate.

#### Parameters

##### predicate

(`value`, `index`, `stack`) => `boolean`

Function (value, index, stack) → boolean to decide deletion.

#### Returns

`boolean`

True if a match was removed.

#### Remarks

Time O(N), Space O(1)

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

#### Example

```ts
const stack = new Stack<number>([2, 4, 6]);
console.log(stack.every(x => x % 2 === 0)); // true
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`every`](IterableElementBase.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/stack/stack.ts:623](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L623)

Filter elements into a new stack of the same class.

#### Parameters

##### predicate

`ElementCallback`\<`E`, `R`, `boolean`\>

Predicate (value, index, stack) → boolean to keep value.

##### thisArg?

`unknown`

Value for `this` inside the predicate.

#### Returns

`this`

A new stack with kept values.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const stack = new Stack<number>([1, 2, 3, 4, 5]);
    const evens = stack.filter(x => x % 2 === 0);
console.log(evens.toArray()); // [2, 4]
```

#### Overrides

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

##### Example

```ts
const stack = new Stack<number>([1, 2, 3, 4]);
console.log(stack.find(x => x > 2)); // 3
```

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

##### Example

```ts
const stack = new Stack<number>([1, 2, 3, 4]);
console.log(stack.find(x => x > 2)); // 3
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

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

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
    const items: number[] = [];
    stack.forEach(item => items.push(item));
console.log(items); // [1, 2, 3]
```

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

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log(stack.has(2)); // true
console.log(stack.has(9)); // false
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`has`](IterableElementBase.md#has)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/stack/stack.ts:260](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L260)

Check whether the stack is empty.

#### Returns

`boolean`

True if size is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const stack = new Stack<number>();
console.log(stack.isEmpty()); // true
    stack.push(1);
console.log(stack.isEmpty()); // false
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`isEmpty`](IterableElementBase.md#isempty)

***

### map()

```ts
map<EM, RM>(
   callback, 
   options?, 
thisArg?): Stack<EM, RM>;
```

Defined in: [data-structures/stack/stack.ts:691](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L691)

Map values into a new stack (possibly different element type).

#### Type Parameters

##### EM

`EM`

##### RM

`RM`

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `EM`\>

Mapping function (value, index, stack) → newElement.

##### options?

`IterableElementBaseOptions`\<`EM`, `RM`\>

Options for the output stack (e.g., toElementFn).

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

`Stack`\<`EM`, `RM`\>

A new Stack with mapped elements.

 *

#### Remarks

Time O(N), Space O(N)

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
    const doubled = stack.map(x => x * 2);
console.log(doubled.toArray()); // [2, 4, 6]
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`map`](IterableElementBase.md#map)

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/stack/stack.ts:641](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L641)

Map values into a new stack of the same element type.

#### Parameters

##### callback

`ElementCallback`\<`E`, `R`, `E`\>

Mapping function (value, index, stack) → newValue.

##### thisArg?

`unknown`

Value for `this` inside the callback.

#### Returns

`this`

A new stack with mapped values.

#### Remarks

Time O(N), Space O(N)

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`mapSame`](IterableElementBase.md#mapsame)

***

### peek()

```ts
peek(): E | undefined;
```

Defined in: [data-structures/stack/stack.ts:302](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L302)

Get the top element without removing it.

#### Returns

`E` \| `undefined`

Top element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const stack = new Stack<string>(['a', 'b', 'c']);
console.log(stack.peek()); // 'c'
console.log(stack.size); // 3
```

***

### pop()

```ts
pop(): E | undefined;
```

Defined in: [data-structures/stack/stack.ts:410](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L410)

Pop and return the top element.

#### Returns

`E` \| `undefined`

Removed element or undefined.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const stack = new Stack<number>([10, 20, 30, 40, 50]);

    // Peek at the top element without removing
    const top = stack.peek();
console.log(top); // 50

    // Pop removes from the top (LIFO order)
    const popped = stack.pop();
console.log(popped); // 50

    // Next pop gets the previous element
    const next = stack.pop();
console.log(next); // 40

    // Verify length decreased
console.log(stack.size); // 3
```

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

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`print`](IterableElementBase.md#print)

***

### push()

```ts
push(element): boolean;
```

Defined in: [data-structures/stack/stack.ts:354](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L354)

Push one element onto the top.

#### Parameters

##### element

`E`

Element to push.

#### Returns

`boolean`

True when pushed.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
// Create a simple Stack with initial values
    const stack = new Stack([1, 2, 3, 4, 5]);

    // Verify the stack maintains insertion order (LIFO will be shown in pop)
console.log([...stack]); // [1, 2, 3, 4, 5]

    // Check length
console.log(stack.size); // 5

    // Push a new element to the top
    stack.push(6);
console.log(stack.size); // 6
```

***

### pushMany()

```ts
pushMany(elements): boolean[];
```

Defined in: [data-structures/stack/stack.ts:421](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L421)

Push many elements from an iterable.

#### Parameters

##### elements

`Iterable`\<`E`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of elements (or raw records if toElementFn is set).

#### Returns

`boolean`[]

Array of per-element success flags.

#### Remarks

Time O(N), Space O(1)

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

##### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log(stack.reduce((acc, x) => acc + x, 0)); // 6
```

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

##### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log(stack.reduce((acc, x) => acc + x, 0)); // 6
```

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

##### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log(stack.reduce((acc, x) => acc + x, 0)); // 6
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

***

### setEquality()

```ts
setEquality(equals): this;
```

Defined in: [data-structures/stack/stack.ts:712](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L712)

Set the equality comparator used by delete/search operations.

#### Parameters

##### equals

(`a`, `b`) => `boolean`

Equality predicate (a, b) → boolean.

#### Returns

`this`

This stack.

#### Remarks

Time O(1), Space O(1)

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

#### Example

```ts
const stack = new Stack<number>([1, 3, 4]);
console.log(stack.some(x => x % 2 === 0)); // true
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`some`](IterableElementBase.md#some)

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

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log(stack.toArray()); // [1, 2, 3]
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toArray`](IterableElementBase.md#toarray)

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

#### Example

```ts
const stack = new Stack<number>([1, 2, 3]);
console.log([...stack.values()]); // [1, 2, 3]
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`values`](IterableElementBase.md#values)

***

### fromArray()

```ts
static fromArray<E, R>(
   this, 
   elements, 
   options?): any;
```

Defined in: [data-structures/stack/stack.ts:213](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/stack/stack.ts#L213)

Create a stack from an array of elements.

#### Type Parameters

##### E

`E`

##### R

`R` = `any`

#### Parameters

##### this

`Object`

The constructor (subclass) to instantiate.

##### elements

`E`[]

Array of elements to push in order.

##### options?

`StackOptions`\<`E`, `R`\>

Options forwarded to the constructor.

#### Returns

`any`

A new Stack populated from the array.

#### Remarks

Time O(N), Space O(N)
