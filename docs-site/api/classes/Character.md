[**data-structure-typed**](../index.md)

***

[data-structure-typed](../index.md) / Character

# Class: Character

Defined in: [data-structures/matrix/navigator.ts:10](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L10)

## Constructors

### Constructor

```ts
new Character(direction, turning): Character;
```

Defined in: [data-structures/matrix/navigator.ts:22](https://github.com/zrwusa/data-structure-typed/blob/a9d6c9abc866183924585a6b636a09d910191f5d/src/data-structures/matrix/navigator.ts#L22)

The constructor function takes in a direction and turning object and sets the direction and turn properties of the
Character class.

#### Parameters

##### direction

`Direction`

The direction parameter is used to specify the current direction of the character. It
can be any value that represents a direction, such as "north", "south", "east", or "west".

##### turning

`Turning`

The `turning` parameter is an object that maps each direction to the corresponding
turning direction. It is used to determine the new direction when the character turns.

#### Returns

`Character`
