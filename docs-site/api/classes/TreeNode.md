[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / TreeNode

# Class: TreeNode\<V\>

Defined in: [data-structures/tree/tree.ts:1](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L1)

## Type Parameters

### V

`V` = `any`

## Constructors

### Constructor

```ts
new TreeNode<V>(
   key, 
   value?, 
children?): TreeNode<V>;
```

Defined in: [data-structures/tree/tree.ts:12](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L12)

The constructor function initializes a TreeNode object with a key, optional value, and optional
children.

#### Parameters

##### key

`string`

A string representing the key of the tree node.

##### value?

`V`

The `value` parameter is an optional parameter of type `V`. It represents the
value associated with the node. If no value is provided, it defaults to `undefined`.

##### children?

`TreeNode`\<`V`\>[]

The `children` parameter is an optional array of `TreeNode<V>`
objects. It represents the child nodes of the current node. If no children are provided, the
default value is an empty array.

#### Returns

`TreeNode`\<`V`\>

## Accessors

### children

#### Get Signature

```ts
get children(): TreeNode<V>[] | undefined;
```

Defined in: [data-structures/tree/tree.ts:63](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L63)

The function returns an array of TreeNode objects or undefined.

##### Returns

`TreeNode`\<`V`\>[] \| `undefined`

The `children` property is being returned. It is of type `TreeNode<V>[] | undefined`,
which means it can either be an array of `TreeNode<V>` objects or `undefined`.

#### Set Signature

```ts
set children(value): void;
```

Defined in: [data-structures/tree/tree.ts:72](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L72)

The function sets the value of the children property of a TreeNode object.

##### Parameters

###### value

`TreeNode`\<`V`\>[] \| `undefined`

The value parameter is of type TreeNode&lt;V&gt;[] |
undefined. This means that it can accept an array of TreeNode objects or undefined.

##### Returns

`void`

***

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [data-structures/tree/tree.ts:24](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L24)

The function returns the value of the protected variable _key.

##### Returns

`string`

The value of the `_key` property, which is a string.

#### Set Signature

```ts
set key(value): void;
```

Defined in: [data-structures/tree/tree.ts:33](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L33)

The above function sets the value of a protected variable called "key".

##### Parameters

###### value

`string`

The value parameter is a string that represents the value to be assigned
to the key.

##### Returns

`void`

***

### value

#### Get Signature

```ts
get value(): V | undefined;
```

Defined in: [data-structures/tree/tree.ts:43](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L43)

The function returns the value stored in a variable, or undefined if the variable is empty.

##### Returns

`V` \| `undefined`

The value of the variable `_value` is being returned.

#### Set Signature

```ts
set value(value): void;
```

Defined in: [data-structures/tree/tree.ts:52](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L52)

The function sets the value of a variable.

##### Parameters

###### value

`V` \| `undefined`

The parameter "value" is of type "V | undefined", which means it
can accept a value of type "V" or it can be undefined.

##### Returns

`void`

## Methods

### addChildren()

```ts
addChildren(children): void;
```

Defined in: [data-structures/tree/tree.ts:81](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L81)

The function `addChildren` adds one or more child nodes to the current node.

#### Parameters

##### children

`TreeNode`\<`V`\> \| `TreeNode`\<`V`\>[]

The `children` parameter can be either a single
`TreeNode<V>` object or an array of `TreeNode<V>` objects.

#### Returns

`void`

***

### getHeight()

```ts
getHeight(): number;
```

Defined in: [data-structures/tree/tree.ts:97](https://github.com/zrwusa/data-structure-typed/blob/ef6a7c995acacb09ef50137f5f48eccd3b55ca87/src/data-structures/tree/tree.ts#L97)

The function `getHeight()` calculates the maximum depth of a tree structure by performing a
breadth-first search.

#### Returns

`number`

the maximum depth or height of the tree.
