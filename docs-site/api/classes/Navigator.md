[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Navigator

# Class: Navigator\<T\>

Defined in: [data-structures/matrix/navigator.ts:31](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L31)

## Type Parameters

### T

`T` = `number`

## Constructors

### Constructor

```ts
new Navigator<T>(-): Navigator<T>;
```

Defined in: [data-structures/matrix/navigator.ts:43](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L43)

The constructor initializes the Navigator object with the given parameters and sets the current position as visited
in the matrix.

#### Parameters

##### -

`NavigatorParams`\<`T`\>

`matrix`: a 2D array representing the grid or map

#### Returns

`Navigator`\<`T`\>

## Methods

### check()

```ts
check(direction): boolean;
```

Defined in: [data-structures/matrix/navigator.ts:74](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L74)

The function checks if there is a valid move in the specified direction in a matrix.

#### Parameters

##### direction

`Direction`

The direction parameter is a string that represents the direction in which to check.
It can be one of the following values: 'up', 'right', 'down', or 'left'.

#### Returns

`boolean`

a boolean value.

***

### move()

```ts
move(direction): void;
```

Defined in: [data-structures/matrix/navigator.ts:104](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L104)

The `move` function updates the current position based on the given direction and updates the matrix accordingly.

#### Parameters

##### direction

`Direction`

The `direction` parameter is a string that represents the direction in which to move.
It can have one of the following values: 'up', 'right', 'down', or 'left'.

#### Returns

`void`

***

### start()

```ts
start(): void;
```

Defined in: [data-structures/matrix/navigator.ts:57](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L57)

The "start" function moves the character in its current direction until it encounters an obstacle, then it turns the
character and repeats the process.

#### Returns

`void`
