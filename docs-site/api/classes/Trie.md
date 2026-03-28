[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Trie

# Class: Trie\<R\>

Defined in: [data-structures/trie/trie.ts:216](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L216)

Prefix tree (Trie) for fast prefix queries and word storage.

## Remarks

Time O(1), Space O(1)

## Examples

```ts
// Trie isPrefix and isAbsolutePrefix checks
 const trie = new Trie(['tree', 'trial', 'trick', 'trip', 'trie']);

    // Check if string is a prefix of any word
    console.log(trie.hasPrefix('tri')); // true;
    console.log(trie.hasPrefix('tr')); // true;
    console.log(trie.hasPrefix('xyz')); // false;

    // Check if string is an absolute prefix (not a complete word)
    console.log(trie.hasPurePrefix('tri')); // true;
    console.log(trie.hasPurePrefix('tree')); // false; // 'tree' is a complete word

    // Verify size
    console.log(trie.size); // 5;
```

```ts
// Trie for autocomplete search index
 // Trie is perfect for autocomplete: O(m + k) where m is prefix length, k is results
    const searchIndex = new Trie(['typescript', 'javascript', 'python', 'java', 'rust', 'ruby', 'golang', 'kotlin']);

    // User types 'j' - get all suggestions
    const jResults = searchIndex.getWords('j');
    console.log(jResults); // contains 'javascript';
    console.log(jResults); // contains 'java';
    console.log(jResults.length); // 2;

    // User types 'ja' - get more specific suggestions
    const jaResults = searchIndex.getWords('ja');
    console.log(jaResults); // contains 'javascript';
    console.log(jaResults); // contains 'java';
    console.log(jaResults.length); // 2;

    // User types 'jav' - even more specific
    const javResults = searchIndex.getWords('jav');
    console.log(javResults); // contains 'javascript';
    console.log(javResults); // contains 'java';
    console.log(javResults.length); // 2;

    // Check for common prefix

    console.log(searchIndex.hasCommonPrefix('ja')); // false; // Not all words start with 'ja'

    // Total words in index
    console.log(searchIndex.size); // 8;

    // Get height (depth of tree)
    const height = searchIndex.getHeight();
    console.log(typeof height); // 'number';
```

```ts
// Dictionary: Case-insensitive word lookup
 // Create a case-insensitive dictionary
    const dictionary = new Trie<string>([], { caseSensitive: false });

    // Add words with mixed casing
    dictionary.add('Hello');
    dictionary.add('WORLD');
    dictionary.add('JavaScript');

    // Test lookups with different casings
    console.log(dictionary.has('hello')); // true;
    console.log(dictionary.has('HELLO')); // true;
    console.log(dictionary.has('Hello')); // true;
    console.log(dictionary.has('javascript')); // true;
    console.log(dictionary.has('JAVASCRIPT')); // true;
```

```ts
// File System Path Operations
 const fileSystem = new Trie<string>([
      '/home/user/documents/file1.txt',
      '/home/user/documents/file2.txt',
      '/home/user/pictures/photo.jpg',
      '/home/user/pictures/vacation/',
      '/home/user/downloads'
    ]);

    // Find common directory prefix
    console.log(fileSystem.getLongestCommonPrefix()); // '/home/user/';

    // List all files in a directory
    const documentsFiles = fileSystem.getWords('/home/user/documents/');
    console.log(documentsFiles); // ['/home/user/documents/file1.txt', '/home/user/documents/file2.txt'];
```

```ts
// IP Address Routing Table
 // Add IP address prefixes and their corresponding routes
    const routes = {
      '192.168.1': 'LAN_SUBNET_1',
      '192.168.2': 'LAN_SUBNET_2',
      '10.0.0': 'PRIVATE_NETWORK_1',
      '10.0.1': 'PRIVATE_NETWORK_2'
    };

    const ipRoutingTable = new Trie<string>(Object.keys(routes));

    // Check IP address prefix matching
    console.log(ipRoutingTable.hasPrefix('192.168.1')); // true;
    console.log(ipRoutingTable.hasPrefix('192.168.2')); // true;

    // Validate IP address belongs to subnet
    const ip = '192.168.1.100';
    const subnet = ip.split('.').slice(0, 3).join('.');
    console.log(ipRoutingTable.hasPrefix(subnet)); // true;
```

## Extends

- [`IterableElementBase`](IterableElementBase.md)\<`string`, `R`\>

## Type Parameters

### R

`R` = `any`

1. Node Structure: Each node in a Trie represents a string (or a part of a string). The root node typically represents an empty string.
2. Child Node Relationship: Each node's children represent the strings that can be formed by adding one character to the string at the current node. For example, if a node represents the string 'ca', one of its children might represent 'cat'.
3. Fast Retrieval: Trie allows retrieval in O(m) time complexity, where m is the length of the string to be searched.
4. Space Efficiency: Trie can store a large number of strings very space-efficiently, especially when these strings share common prefixes.
5. Autocomplete and Prediction: Trie can be used for implementing autocomplete and word prediction features, as it can quickly find all strings with a common prefix.
6. Sorting: Trie can be used to sort a set of strings in alphabetical order.
7. String Retrieval: For example, searching for a specific string in a large set of strings.
8. Autocomplete: Providing recommended words or phrases as a user types.
9. Spell Check: Checking the spelling of words.
10. IP Routing: Used in certain types of IP routing algorithms.
11. Text Word Frequency Count: Counting and storing the frequency of words in a large amount of text data.

## Constructors

### Constructor

```ts
new Trie<R>(words?, options?): Trie<R>;
```

Defined in: [data-structures/trie/trie.ts:225](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L225)

Create a Trie and optionally bulk-insert words.

#### Parameters

##### words?

`Iterable`\<`string`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of strings (or raw records if toElementFn is provided).

##### options?

`TrieOptions`\<`R`\>

Options such as toElementFn and caseSensitive.

#### Returns

`Trie`\<`R`\>

New Trie instance.

#### Remarks

Time O(totalChars), Space O(totalChars)

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`constructor`](IterableElementBase.md#constructor)

## Properties

### \_toElementFn?

```ts
protected optional _toElementFn?: (rawElement) => string;
```

Defined in: [data-structures/base/iterable-element-base.ts:38](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L38)

The converter used to transform a raw element (`R`) into a public element (`E`).

#### Parameters

##### rawElement

`R`

#### Returns

`string`

#### Remarks

Time O(1), Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`_toElementFn`](IterableElementBase.md#toelementfn)

## Accessors

### \_total

#### Get Signature

```ts
get protected _total(): number;
```

Defined in: [data-structures/trie/trie.ts:278](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L278)

(Protected) Get total count for base class iteration.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Total number of elements.

***

### caseSensitive

#### Get Signature

```ts
get caseSensitive(): boolean;
```

Defined in: [data-structures/trie/trie.ts:256](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L256)

Get whether comparisons are case-sensitive.

##### Remarks

Time O(1), Space O(1)

##### Returns

`boolean`

True if case-sensitive.

***

### root

#### Get Signature

```ts
get root(): TrieNode;
```

Defined in: [data-structures/trie/trie.ts:268](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L268)

Get the root node.

##### Remarks

Time O(1), Space O(1)

##### Returns

[`TrieNode`](TrieNode.md)

Root TrieNode.

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [data-structures/trie/trie.ts:244](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L244)

Get the number of stored words.

##### Remarks

Time O(1), Space O(1)

##### Returns

`number`

Word count.

***

### toElementFn

#### Get Signature

```ts
get toElementFn(): ((rawElement) => E) | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:47](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L47)

Exposes the current `toElementFn`, if configured.

##### Remarks

Time O(1), Space O(1).

##### Returns

((`rawElement`) => `E`) \| `undefined`

The converter function or `undefined` when not set.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toElementFn`](IterableElementBase.md#toelementfn)

## Methods

### \_caseProcess()

```ts
protected _caseProcess(str): string;
```

Defined in: [data-structures/trie/trie.ts:1080](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L1080)

(Protected) Normalize a string according to case sensitivity.

#### Parameters

##### str

`string`

Input string to normalize.

#### Returns

`string`

Normalized string based on caseSensitive.

#### Remarks

Time O(L), Space O(L)

***

### \_createInstance()

```ts
protected _createInstance(options?): this;
```

Defined in: [data-structures/trie/trie.ts:1013](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L1013)

(Protected) Create an empty instance of the same concrete class.

#### Parameters

##### options?

`TrieOptions`\<`R`\>

Options forwarded to the constructor.

#### Returns

`this`

An empty like-kind trie instance.

#### Remarks

Time O(1), Space O(1)

***

### \_createLike()

```ts
protected _createLike<RM>(elements?, options?): Trie<RM>;
```

Defined in: [data-structures/trie/trie.ts:1034](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L1034)

(Protected) Create a like-kind trie and seed it from an iterable.

#### Type Parameters

##### RM

`RM`

#### Parameters

##### elements?

`Iterable`\<`string`, `any`, `any`\> \| `Iterable`\<`RM`, `any`, `any`\>

Iterable used to seed the new trie.

##### options?

`TrieOptions`\<`RM`\>

Options forwarded to the constructor.

#### Returns

`Trie`\<`RM`\>

A like-kind Trie instance.

#### Remarks

Time O(ΣL), Space O(ΣL)

***

### \_getIterator()

```ts
protected _getIterator(): IterableIterator<string>;
```

Defined in: [data-structures/trie/trie.ts:1060](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L1060)

(Protected) Iterate all words in lexicographic order of edges.

#### Returns

`IterableIterator`\<`string`\>

Iterator of words.

#### Remarks

Time O(ΣL), Space O(H)

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`_getIterator`](IterableElementBase.md#getiterator)

***

### \_spawnLike()

```ts
protected _spawnLike<RM>(options?): Trie<RM>;
```

Defined in: [data-structures/trie/trie.ts:1050](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L1050)

(Protected) Spawn an empty like-kind trie instance.

#### Type Parameters

##### RM

`RM`

#### Parameters

##### options?

`TrieOptions`\<`RM`\>

Options forwarded to the constructor.

#### Returns

`Trie`\<`RM`\>

An empty like-kind Trie instance.

#### Remarks

Time O(1), Space O(1)

***

### \[iterator\]()

```ts
iterator: IterableIterator<string>;
```

Defined in: [data-structures/base/iterable-element-base.ts:60](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L60)

Returns an iterator over the structure's elements.

#### Parameters

##### args

...`unknown`[]

Optional iterator arguments forwarded to the internal iterator.

#### Returns

`IterableIterator`\<`string`\>

An `IterableIterator<E>` that yields the elements in traversal order.

#### Remarks

Producing the iterator is O(1); consuming the entire iterator is Time O(n) with O(1) extra space.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`[iterator]`](IterableElementBase.md#iterator)

***

### add()

```ts
add(word): boolean;
```

Defined in: [data-structures/trie/trie.ts:328](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L328)

Insert one word into the trie.

#### Parameters

##### word

`string`

Word to insert.

#### Returns

`boolean`

True if the word was newly added.

 *

#### Remarks

Time O(L), Space O(L)

#### Example

```ts
// Create a simple Trie with initial words
    const trie = new Trie(['apple', 'app', 'apply']);

    // Verify size
console.log(trie.size); // 3

    // Check if words exist
console.log(trie.has('apple')); // true
console.log(trie.has('app')); // true

    // Add a new word
    trie.add('application');
console.log(trie.size); // 4
```

***

### addMany()

```ts
addMany(words): boolean[];
```

Defined in: [data-structures/trie/trie.ts:383](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L383)

Insert many words from an iterable.

#### Parameters

##### words

`Iterable`\<`string`, `any`, `any`\> \| `Iterable`\<`R`, `any`, `any`\>

Iterable of strings (or raw records if toElementFn is provided).

#### Returns

`boolean`[]

Array of per-word 'added' flags.

 *

#### Remarks

Time O(ΣL), Space O(ΣL)

#### Example

```ts
const trie = new Trie();
    trie.addMany(['cat', 'car', 'card']);
console.log(trie.has('cat')); // true
console.log(trie.has('car')); // true
console.log(trie.size); // 3
```

***

### clear()

```ts
clear(): void;
```

Defined in: [data-structures/trie/trie.ts:513](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L513)

Remove all words and reset to a fresh root.

#### Returns

`void`

void

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const trie = new Trie(['a', 'b', 'c']);
    trie.clear();
console.log(trie.isEmpty()); // true
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clear`](IterableElementBase.md#clear)

***

### clone()

```ts
clone(): this;
```

Defined in: [data-structures/trie/trie.ts:875](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L875)

Deep clone this trie by iterating and inserting all words.

#### Returns

`this`

A new trie with the same words and options.

 *

#### Remarks

Time O(ΣL), Space O(ΣL)

#### Example

```ts
const trie = new Trie(['hello', 'world']);
    const copy = trie.clone();
    copy.delete('hello');
console.log(trie.has('hello')); // true
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`clone`](IterableElementBase.md#clone)

***

### delete()

```ts
delete(word): boolean;
```

Defined in: [data-structures/trie/trie.ts:566](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L566)

Delete one word if present.

#### Parameters

##### word

`string`

Word to delete.

#### Returns

`boolean`

True if a word was removed.

 *

#### Remarks

Time O(L), Space O(1)

#### Example

```ts
const trie = new Trie(['car', 'card', 'care', 'careful', 'can', 'cat']);

    // Delete a word
    trie.delete('card');
console.log(trie.has('card')); // false

    // Word with same prefix still exists
console.log(trie.has('care')); // true

    // Size decreased
console.log(trie.size); // 5

    // Iterate through all words
    const allWords = [...trie];
console.log(allWords.length); // 5
```

***

### every()

```ts
every(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:86](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L86)

Tests whether all elements satisfy the predicate.

#### Parameters

##### predicate

`ElementCallback`\<`string`, `R`, `boolean`\>

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
const trie = new Trie(['abc', 'abcd', 'abcde']);
console.log(trie.every(w => w.startsWith('abc'))); // true
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`every`](IterableElementBase.md#every)

***

### filter()

```ts
filter(predicate, thisArg?): this;
```

Defined in: [data-structures/trie/trie.ts:915](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L915)

Filter words into a new trie of the same class.

#### Parameters

##### predicate

`ElementCallback`\<`string`, `R`, `boolean`\>

Predicate (word, index, trie) → boolean to keep word.

##### thisArg?

`any`

Value for `this` inside the predicate.

#### Returns

`this`

A new trie containing words that satisfy the predicate.

 *

#### Remarks

Time O(ΣL), Space O(ΣL)

#### Example

```ts
const trie = new Trie(['cat', 'car', 'dog', 'card']);
    const result = trie.filter(w => w.startsWith('ca'));
console.log(result.size); // 3
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`filter`](IterableElementBase.md#filter)

***

### find()

#### Call Signature

```ts
find<S>(predicate, thisArg?): S | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:162](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L162)

Finds the first element that satisfies the predicate and returns it.

Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.

##### Type Parameters

###### S

`S` *extends* `string`

##### Parameters

###### predicate

`ElementCallback`\<`string`, `R`, `S`\>

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
const trie = new Trie(['apple', 'banana', 'cherry']);
console.log(trie.find(w => w.startsWith('ban'))); // 'banana'
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

#### Call Signature

```ts
find(predicate, thisArg?): string | undefined;
```

Defined in: [data-structures/base/iterable-element-base.ts:163](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L163)

Finds the first element that satisfies the predicate and returns it.

Finds the first element of type `S` (a subtype of `E`) that satisfies the predicate and returns it.

##### Parameters

###### predicate

`ElementCallback`\<`string`, `R`, `unknown`\>

Type-guard predicate: `(value, index, self) => value is S`.

###### thisArg?

`unknown`

Optional `this` binding for the predicate.

##### Returns

`string` \| `undefined`

The matched element typed as `S`, or `undefined` if not found.

##### Remarks

Time O(n) in the worst case; may exit early on the first match. Space O(1).

##### Example

```ts
const trie = new Trie(['apple', 'banana', 'cherry']);
console.log(trie.find(w => w.startsWith('ban'))); // 'banana'
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`find`](IterableElementBase.md#find)

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:132](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L132)

Invokes a callback for each element in iteration order.

#### Parameters

##### callbackfn

`ElementCallback`\<`string`, `R`, `void`\>

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
const trie = new Trie(['a', 'b', 'c']);
    const words: string[] = [];
    trie.forEach(w => words.push(w));
console.log(words.sort()); // ['a', 'b', 'c']
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`forEach`](IterableElementBase.md#foreach)

***

### getHeight()

```ts
getHeight(): number;
```

Defined in: [data-structures/trie/trie.ts:608](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L608)

Compute the height (max depth) of the trie.

#### Returns

`number`

Maximum depth from root to a leaf.

#### Remarks

Time O(N), Space O(H)

***

### getLongestCommonPrefix()

```ts
getLongestCommonPrefix(): string;
```

Defined in: [data-structures/trie/trie.ts:751](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L751)

Return the longest common prefix among all words.

#### Returns

`string`

The longest common prefix string.

 *

#### Remarks

Time O(H), Space O(1)

#### Example

```ts
const trie = new Trie(['flower', 'flow', 'flight']);

console.log(trie.getLongestCommonPrefix()); // 'fl'
```

***

### getWords()

```ts
getWords(
   prefix?, 
   max?, 
   isAllWhenEmptyPrefix?): string[];
```

Defined in: [data-structures/trie/trie.ts:807](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L807)

Collect words under a prefix up to a maximum count.

#### Parameters

##### prefix?

`string` = `''`

Prefix to match; default empty string for root.

##### max?

`number` = `Number.MAX_SAFE_INTEGER`

Maximum number of words to return; default is Number.MAX_SAFE_INTEGER.

##### isAllWhenEmptyPrefix?

`boolean` = `false`

When true, collect from root even if prefix is empty.

#### Returns

`string`[]

Array of collected words (at most max).

 *

#### Remarks

Time O(K·L), Space O(K·L)

#### Example

```ts
const trie = new Trie(['apple', 'app', 'apply', 'application', 'apricot']);

    // Get all words with prefix 'app'
    const appWords = trie.getWords('app');
```

***

### has()

```ts
has(word): boolean;
```

Defined in: [data-structures/trie/trie.ts:433](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L433)

Check whether a word exists.

#### Parameters

##### word

`string`

Word to search for.

#### Returns

`boolean`

True if present.

 *

#### Remarks

Time O(L), Space O(1)

#### Example

```ts
const dict = new Trie(['apple', 'app', 'application']);

console.log(dict.has('app')); // true
console.log(dict.has('apple')); // true
console.log(dict.has('ap')); // false
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`has`](IterableElementBase.md#has)

***

### hasCommonPrefix()

```ts
hasCommonPrefix(input): boolean;
```

Defined in: [data-structures/trie/trie.ts:702](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L702)

Check whether the trie’s longest common prefix equals input.

#### Parameters

##### input

`string`

Candidate longest common prefix.

#### Returns

`boolean`

True if input equals the common prefix.

#### Remarks

Time O(min(H,L)), Space O(1)

***

### hasPrefix()

```ts
hasPrefix(input): boolean;
```

Defined in: [data-structures/trie/trie.ts:684](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L684)

Check whether any word starts with input.

#### Parameters

##### input

`string`

String to test as prefix.

#### Returns

`boolean`

True if input matches a path from root.

 *

#### Remarks

Time O(L), Space O(1)

#### Example

```ts
const trie = new Trie(['hello', 'help', 'world']);

console.log(trie.hasPrefix('hel')); // true
console.log(trie.hasPrefix('wor')); // true
console.log(trie.hasPrefix('xyz')); // false
```

***

### hasPurePrefix()

```ts
hasPurePrefix(input): boolean;
```

Defined in: [data-structures/trie/trie.ts:635](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L635)

Check whether input is a proper prefix of at least one word.

#### Parameters

##### input

`string`

String to test as prefix.

#### Returns

`boolean`

True if input is a prefix but not a full word.

#### Remarks

Time O(L), Space O(1)

***

### isEmpty()

```ts
isEmpty(): boolean;
```

Defined in: [data-structures/trie/trie.ts:477](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L477)

Check whether the trie is empty.

#### Returns

`boolean`

True if size is 0.

 *

#### Remarks

Time O(1), Space O(1)

#### Example

```ts
const trie = new Trie();
console.log(trie.isEmpty()); // true
    trie.add('word');
console.log(trie.isEmpty()); // false
```

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`isEmpty`](IterableElementBase.md#isempty)

***

### map()

#### Call Signature

```ts
map<RM>(
   callback, 
   options?, 
thisArg?): Trie<RM>;
```

Defined in: [data-structures/trie/trie.ts:956](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L956)

Transform words

 *

##### Type Parameters

###### RM

`RM`

##### Parameters

###### callback

`ElementCallback`\<`string`, `R`, `string`\>

###### options?

`TrieOptions`\<`RM`\>

###### thisArg?

`any`

##### Returns

`Trie`\<`RM`\>

##### Example

```ts
const trie = new Trie(['hello', 'world']);
    const upper = trie.map(w => w.toUpperCase());
console.log(upper.has('HELLO')); // true
```

##### Overrides

[`IterableElementBase`](IterableElementBase.md).[`map`](IterableElementBase.md#map)

#### Call Signature

```ts
map<EM, RM>(
   callback, 
   options?, 
thisArg?): IterableElementBase<EM, RM>;
```

Defined in: [data-structures/trie/trie.ts:969](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L969)

Map words into a new trie (possibly different record type).

##### Type Parameters

###### EM

`EM`

###### RM

`RM`

##### Parameters

###### callback

`ElementCallback`\<`string`, `R`, `EM`\>

Mapping function (word, index, trie) → newWord (string).

###### options?

`TrieOptions`\<`RM`\>

Options for the output trie (e.g., toElementFn, caseSensitive).

###### thisArg?

`any`

Value for `this` inside the callback.

##### Returns

[`IterableElementBase`](IterableElementBase.md)\<`EM`, `RM`\>

A new Trie constructed from mapped words.

##### Remarks

Time O(ΣL), Space O(ΣL)

##### Example

```ts
const trie = new Trie(['hello', 'world']);
    const upper = trie.map(w => w.toUpperCase());
console.log(upper.has('HELLO')); // true
```

##### Overrides

```ts
IterableElementBase.map
```

***

### mapSame()

```ts
mapSame(callback, thisArg?): this;
```

Defined in: [data-structures/trie/trie.ts:996](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/trie/trie.ts#L996)

Map words into a new trie of the same element type.

#### Parameters

##### callback

`ElementCallback`\<`string`, `R`, `string`\>

Mapping function (word, index, trie) → string.

##### thisArg?

`any`

Value for `this` inside the callback.

#### Returns

`this`

A new trie with mapped words.

#### Remarks

Time O(ΣL), Space O(ΣL)

#### Overrides

[`IterableElementBase`](IterableElementBase.md).[`mapSame`](IterableElementBase.md#mapsame)

***

### print()

```ts
print(): void;
```

Defined in: [data-structures/base/iterable-element-base.ts:268](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L268)

Prints `toVisual()` to the console. Intended for quick debugging.

#### Returns

`void`

`void`.

#### Remarks

Time O(n) due to materialization, Space O(n) for the intermediate representation.

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`print`](IterableElementBase.md#print)

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
reduce(callbackfn): string;
```

Defined in: [data-structures/base/iterable-element-base.ts:193](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L193)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`string`, `R`\>

##### Returns

`string`

##### Example

```ts
const trie = new Trie(['hi', 'hey', 'hello']);
    const totalChars = trie.reduce((acc, w) => acc + w.length, 0);
console.log(totalChars); // 10
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

#### Call Signature

```ts
reduce(callbackfn, initialValue): string;
```

Defined in: [data-structures/base/iterable-element-base.ts:194](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L194)

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`string`, `R`\>

###### initialValue

`string`

##### Returns

`string`

##### Example

```ts
const trie = new Trie(['hi', 'hey', 'hello']);
    const totalChars = trie.reduce((acc, w) => acc + w.length, 0);
console.log(totalChars); // 10
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

#### Call Signature

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: [data-structures/base/iterable-element-base.ts:195](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L195)

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

`ReduceElementCallback`\<`string`, `R`, `U`\>

###### initialValue

`U`

##### Returns

`U`

##### Example

```ts
const trie = new Trie(['hi', 'hey', 'hello']);
    const totalChars = trie.reduce((acc, w) => acc + w.length, 0);
console.log(totalChars); // 10
```

##### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`reduce`](IterableElementBase.md#reduce)

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: [data-structures/base/iterable-element-base.ts:109](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L109)

Tests whether at least one element satisfies the predicate.

#### Parameters

##### predicate

`ElementCallback`\<`string`, `R`, `boolean`\>

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
const trie = new Trie(['cat', 'dog', 'bird']);
console.log(trie.some(w => w.length === 3)); // true
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`some`](IterableElementBase.md#some)

***

### toArray()

```ts
toArray(): string[];
```

Defined in: [data-structures/base/iterable-element-base.ts:245](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L245)

Materializes the elements into a new array.

#### Returns

`string`[]

A shallow array copy of the iteration order.

#### Remarks

Time O(n), Space O(n).

#### Example

```ts
const trie = new Trie(['b', 'a', 'c']);
console.log(trie.toArray().sort()); // ['a', 'b', 'c']
```

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toArray`](IterableElementBase.md#toarray)

***

### toVisual()

```ts
toVisual(): string[];
```

Defined in: [data-structures/base/iterable-element-base.ts:257](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L257)

Returns a representation of the structure suitable for quick visualization.
Defaults to an array of elements; subclasses may override to provide richer visuals.

#### Returns

`string`[]

A visual representation (array by default).

#### Remarks

Time O(n), Space O(n).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`toVisual`](IterableElementBase.md#tovisual)

***

### values()

```ts
values(): IterableIterator<string>;
```

Defined in: [data-structures/base/iterable-element-base.ts:71](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/base/iterable-element-base.ts#L71)

Returns an iterator over the values (alias of the default iterator).

#### Returns

`IterableIterator`\<`string`\>

An `IterableIterator<E>` over all elements.

#### Remarks

Creating the iterator is O(1); full iteration is Time O(n), Space O(1).

#### Inherited from

[`IterableElementBase`](IterableElementBase.md).[`values`](IterableElementBase.md#values)
