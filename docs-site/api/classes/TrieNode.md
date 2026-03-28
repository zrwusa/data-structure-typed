[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TrieNode

# Class: TrieNode

Defined in: [data-structures/trie/trie.ts:17](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L17)

Node used by Trie to store one character and its children.

## Remarks

Time O(1), Space O(1)

## Constructors

### Constructor

```ts
new TrieNode(key): TrieNode;
```

Defined in: [data-structures/trie/trie.ts:24](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L24)

Create a Trie node with a character key.

#### Parameters

##### key

`string`

#### Returns

`TrieNode`

New TrieNode instance.

#### Remarks

Time O(1), Space O(1)

## Accessors

### children

#### Get Signature

```ts
get children(): Map<string, TrieNode>;
```

Defined in: [data-structures/trie/trie.ts:61](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L61)

Get the child map of this node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`Map`\<`string`, `TrieNode`\>

Map from character to child node.

#### Set Signature

```ts
set children(value): void;
```

Defined in: [data-structures/trie/trie.ts:72](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L72)

Replace the child map of this node.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`Map`\<`string`, `TrieNode`\>

New map of character → node.

##### Returns

`void`

void

***

### isEnd

#### Get Signature

```ts
get isEnd(): boolean;
```

Defined in: [data-structures/trie/trie.ts:84](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L84)

Check whether this node marks the end of a word.

##### Remarks

Time O(1), Space O(1)

##### Returns

`boolean`

True if this node ends a word.

#### Set Signature

```ts
set isEnd(value): void;
```

Defined in: [data-structures/trie/trie.ts:95](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L95)

Mark this node as the end of a word or not.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`boolean`

Whether this node ends a word.

##### Returns

`void`

void

***

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [data-structures/trie/trie.ts:38](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L38)

Get the character key of this node.

##### Remarks

Time O(1), Space O(1)

##### Returns

`string`

Character key string.

#### Set Signature

```ts
set key(value): void;
```

Defined in: [data-structures/trie/trie.ts:49](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/trie/trie.ts#L49)

Set the character key of this node.

##### Remarks

Time O(1), Space O(1)

##### Parameters

###### value

`string`

New character key.

##### Returns

`void`

void
