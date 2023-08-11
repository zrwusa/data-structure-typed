import type {Direction, NavigatorParams, Turning} from '../types';

export class Character {
    direction: Direction;
    turn: () => Character;

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

    constructor({matrix, turning, onMove, init: {cur, charDir, VISITED}}: NavigatorParams<T>) {
        this._matrix = matrix;
        this._cur = cur;
        this._character = new Character(charDir, turning);
        this.onMove = onMove;
        this.onMove && this.onMove(this._cur);
        this._VISITED = VISITED;
        this._matrix[this._cur[0]][this._cur[1]] = this._VISITED;
    }

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

