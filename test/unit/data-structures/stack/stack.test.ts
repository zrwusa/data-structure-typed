import { Stack } from '../../../../src';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  it('should be empty when initialized', () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it('should push elements onto the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.size).toBe(3);
  });

  it('should has and get', () => {
    const stack = new Stack<number, { id: number; name: string }>([], { toElementFn: rawElement => rawElement.id });
    expect(stack.has(1)).toBe(false);
    expect(stack.size).toBe(0);
  });

  it('should peek at the top element without removing it', () => {
    expect(stack.peek()).toBe(undefined);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.peek()).toBe(3);
    expect(stack.size).toBe(3);
  });

  it('should pop elements from the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    const poppedElement = stack.pop();
    expect(poppedElement).toBe(3);
    expect(stack.size).toBe(2);
  });

  it('should clone', function () {
    const stack = new Stack<string>();
    stack.push('1');
    stack.push('6');
    stack.push('2');
    stack.push('0');
    stack.push('5');
    stack.push('9');
    stack.delete('2');
    expect([...stack]).toEqual(['1', '6', '0', '5', '9']);
    const cloned = stack.clone();
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    stack.delete('5');
    expect([...stack]).toEqual(['1', '6', '0', '9']);
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
  });

  it('should return undefined when popping from an empty stack', () => {
    const poppedElement = stack.pop();
    expect(poppedElement).toBe(undefined);
  });

  it('should convert the stack to an array', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    const stackArray = stack.toArray();
    expect(stackArray).toEqual([1, 2, 3]);
  });

  it('should clear all elements from the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.clear();
    expect(stack.size).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });

  it('should clone the stack', () => {
    stack.push(1);
    stack.push(2);
    const clonedStack = stack.clone();
    expect(clonedStack.size).toBe(2);
    expect(clonedStack.pop()).toBe(2);
  });
});

describe('Stack iterative methods', () => {
  let stack: Stack<number>; // Declare a Stack instance

  beforeEach(() => {
    stack = new Stack<number>(); // Create a new Stack instance before each test
    stack.push(1);
    stack.push(2);
    stack.push(3);
  });

  it('should iterate through the stack', () => {
    const result: number[] = [];
    for (const element of stack) {
      result.push(element);
    }

    expect(result).toEqual([1, 2, 3]); // iteration should start from the top of the stack
  });

  it('should apply forEach to the stack', () => {
    const result: number[] = [];
    stack.forEach(element => {
      result.push(element);
    });

    expect(result).toEqual([1, 2, 3]);
  });

  it('should filter elements in the stack', () => {
    const filteredStack = stack.filter(element => element > 1);

    expect(filteredStack.size).toBe(2);
    expect([...filteredStack]).toEqual([2, 3]);
  });

  it('should map elements in the stack', () => {
    const mappedStack = stack.map(element => element * 2);

    expect(mappedStack.size).toBe(3);
    expect([...mappedStack]).toEqual([2, 4, 6]);
  });

  it('should reduce elements in the stack', () => {
    const sum = stack.reduce((accumulator, element) => accumulator + element, 0);

    expect(sum).toBe(6);
  });

  it('should toElementFn', () => {
    const stack = new Stack([{ key: 1 }, { key: 2 }, { key: 5 }, { key: 3 }], { toElementFn: item => item.key });
    expect(stack.size).toBe(4);
    expect([...stack]).toEqual([1, 2, 5, 3]);
  });

  it('should fromArray', () => {
    const stack = Stack.fromArray([1, 2, 5, 3]);
    expect(stack instanceof Stack).toBe(true);
    expect(stack.size).toBe(4);
    expect([...stack]).toEqual([1, 2, 5, 3]);
  });

  it('should iterable-element-base toElementFn', () => {
    const stack = new Stack<{ key: number }>([1, 2, 5, 3], { toElementFn: key => ({ key }) });
    expect([...stack]).toEqual([{ key: 1 }, { key: 2 }, { key: 5 }, { key: 3 }]);
    expect(() => {
      new Stack<{ key: number }>([1, 2, 5, 3], {
        // @ts-ignore
        toElementFn: {}
      });
    }).toThrow('toElementFn must be a function type');
  });
});

describe('classic uses', () => {
  it('@example Balanced Parentheses or Brackets', () => {
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
    expect(stack.isEmpty()).toBe(true);
  });

  it('@example Expression Evaluation and Conversion', () => {
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
    expect(stack.pop()).toBe(8);
  });

  it('@example Depth-First Search (DFS)', () => {
    const stack = new Stack<number>();
    const graph: { [key in number]: number[] } = { 1: [2, 3], 2: [4], 3: [5], 4: [], 5: [] };
    const visited: number[] = [];
    stack.push(1);
    while (!stack.isEmpty()) {
      const node = stack.pop()!;
      if (!visited.includes(node)) {
        visited.push(node);
        graph[node].forEach(neighbor => stack.push(neighbor));
      }
    }
    expect(visited).toEqual([1, 3, 5, 2, 4]); // Example DFS order
  });

  it('@example Backtracking Algorithms', () => {
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

    expect(path).toContainEqual(end);
  });

  it('@example Function Call Stack', () => {
    const functionStack = new Stack<string>();
    functionStack.push('main');
    functionStack.push('foo');
    functionStack.push('bar');
    expect(functionStack.pop()).toBe('bar');
    expect(functionStack.pop()).toBe('foo');
    expect(functionStack.pop()).toBe('main');
  });

  it('@example Simplify File Paths', () => {
    const stack = new Stack<string>();
    const path = '/a/./b/../../c';
    path.split('/').forEach(segment => {
      if (segment === '..') stack.pop();
      else if (segment && segment !== '.') stack.push(segment);
    });
    expect(stack.elements.join('/')).toBe('c');
  });

  it('@example Stock Span Problem', () => {
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
    expect(spans).toEqual([1, 1, 1, 2, 1, 4, 6]);
  });

  it('Browser Navigation', () => {
    const backStack = new Stack<string>();
    const forwardStack = new Stack<string>();
    backStack.push('Page 1');
    backStack.push('Page 2');
    forwardStack.push(backStack.pop()!);
    expect(backStack.size).toBe(1);
    expect(forwardStack.size).toBe(1);
  });

  it('String Reversal', () => {
    const stack = new Stack<string>();
    const input = 'hello';
    const reversed = [];
    input.split('').forEach(char => stack.push(char));
    while (!stack.isEmpty()) {
      reversed.push(stack.pop());
    }
    expect(reversed.join('')).toBe('olleh');
  });

  it('Next Greater Element', () => {
    const stack = new Stack<number>();
    const array = [4, 5, 2, 25];
    const nextGreater = new Array(array.length).fill(-1);
    array.forEach((_, i) => {
      while (!stack.isEmpty() && array[stack.peek()!] < array[i]) {
        const idx = stack.pop()!;
        nextGreater[idx] = array[i];
      }
      stack.push(i);
    });
    expect(nextGreater).toEqual([5, 25, 25, -1]);
  });
});
