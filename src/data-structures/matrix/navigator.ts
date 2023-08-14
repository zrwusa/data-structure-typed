/**
 * @copyright Tyler Zeng <zrwusa@gmail.com>
 * @license MIT
 */
import type {Direction, NavigatorParams, Turning} from '../types';

export class Character {
    direction: Direction;
    turn: () => Character;

    /**
     * The constructor function takes in a direction and turning object and sets the direction and turn properties of the
     * Character class.
     * @param {Direction} direction - The direction parameter is used to specify the current direction of the character. It
     * can be any value that represents a direction, such as "north", "south", "east", or "west".
     * @param {Turning} turning - The `turning` parameter is an object that maps each direction to the corresponding
     * turning direction. It is used to determine the new direction when the character turns.
     */
    constructor(direction: Direction, turning: Turning) {
        this.direction = direction;
        this.turn = () => new Character(turning[direction], turning);
    }
}

export class Navigator<T = number> {
    onMove: (cur: [number, number]) => void;
    private readonly _matrix: T[][];
    private readonly _cur: [number, number];
    private _character: Character;
    private readonly _VISITED: T;

    /**
     * The constructor initializes the Navigator object with the given parameters and sets the current position as visited
     * in the matrix.
     * @param  - - `matrix`: a 2D array representing the grid or map
     */
    constructor({matrix, turning, onMove, init: {cur, charDir, VISITED}}: NavigatorParams<T>) {
        this._matrix = matrix;
        this._cur = cur;
        this._character = new Character(charDir, turning);
        this.onMove = onMove;
        this.onMove && this.onMove(this._cur);
        this._VISITED = VISITED;
        this._matrix[this._cur[0]][this._cur[1]] = this._VISITED;
    }

    /**
     * The "start" function moves the character in its current direction until it encounters an obstacle, then it turns the
     * character and repeats the process.
     */
    start() {
        while (this.check(this._character.direction) || this.check(this._character.turn().direction)) {
            const {direction} = this._character;
            if (this.check(direction)) {
                this.move(direction);
            } else if (this.check(this._character.turn().direction)) {
                this._character = this._character.turn();
            }
        }
    }

    /**
     * The function checks if there is a valid move in the specified direction in a matrix.
     * @param {Direction} direction - The direction parameter is a string that represents the direction in which to check.
     * It can be one of the following values: 'up', 'right', 'down', or 'left'.
     * @returns a boolean value.
     */
    check(direction: Direction) {
        let forward: T | undefined, row: T[] | undefined;
        const matrix = this._matrix;
        const [i, j] = this._cur;
        switch (direction) {
            case 'up':
                row = matrix[i - 1];
                if (!row) return false;
                forward = row[j];
                break;
            case 'right':
                forward = matrix[i][j + 1];
                break;
            case 'down':
                row = matrix[i + 1];
                if (!row) return false;
                forward = row[j];
                break;
            case 'left':
                forward = matrix[i][j - 1];
                break;
        }
        return forward !== undefined && forward !== this._VISITED;
    }

    /**
     * The `move` function updates the current position based on the given direction and updates the matrix accordingly.
     * @param {Direction} direction - The `direction` parameter is a string that represents the direction in which to move.
     * It can have one of the following values: 'up', 'right', 'down', or 'left'.
     */
    move(direction: Direction) {
        switch (direction) {
            case 'up':
                this._cur[0]--;
                break;
            case 'right':
                this._cur[1]++;
                break;
            case 'down':
                this._cur[0]++;
                break;
            case 'left':
                this._cur[1]--;
                break;
        }

        const [i, j] = this._cur;
        this._matrix[i][j] = this._VISITED;
        this.onMove && this.onMove(this._cur);
    }
}

