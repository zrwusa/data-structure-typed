import {Character, NavigatorParams, Turning, Navigator} from '../../../../src';

const exampleMatrix: number[][] = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0]
];

// Create a sample redirect object
const exampleTurning: Turning = {
  up: 'right',
  right: 'down',
  down: 'left',
  left: 'up'
};

// Create a sample move callback function
const exampleOnMove = () => {
  expect(true).toBeTruthy();
  // console.log(`Moved to position (${cur[0]}, ${cur[1]})`);
};

// Create an initial parameter object for the example
const exampleInit: NavigatorParams<number>['init'] = {
  cur: [0, 0],
  charDir: 'right',
  VISITED: -1
};

// Create a Navigator Params object
const exampleNavigatorParams: NavigatorParams<number> = {
  matrix: exampleMatrix,
  turning: exampleTurning,
  onMove: exampleOnMove,
  init: exampleInit
};

describe('Character class', () => {
  it('should create a character with the correct direction', () => {
    const character = new Character('up', exampleTurning);
    expect(character.direction).toBe('up');
  });

  it('should turn the character in the correct direction', () => {
    const character = new Character('up', exampleTurning);
    const turnedCharacter = character.turn();
    expect(turnedCharacter.direction).toBe('right');
  });
});

describe('Navigator class', () => {
  let navigator: Navigator<number>;

  beforeEach(() => {
    navigator = new Navigator(exampleNavigatorParams);
  });

  it('should initialize with the correct matrix and current position', () => {
    expect(navigator['_matrix']).toEqual(exampleMatrix);
    expect(navigator['_cur']).toEqual(exampleInit.cur);
  });

  it('should move the character correctly', () => {
    navigator.move('right');
    expect(navigator['_cur']).toEqual([0, 1]);
    expect(navigator['_matrix'][0][1]).toBe(exampleInit.VISITED);
  });

  it('should turn the character correctly', () => {
    expect(navigator['_character'].direction).toBe('right');
  });

  it('should check for valid moves correctly', () => {
    expect(navigator.check('up')).toBe(false); // Blocked by wall
    expect(navigator.check('right')).toBe(true); // Open path
    expect(navigator.check('down')).toBe(true); // Blocked by wall
    expect(navigator.check('left')).toBe(false); // Open path
  });
});
