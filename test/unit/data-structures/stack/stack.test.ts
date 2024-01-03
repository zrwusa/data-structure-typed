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

  it('should peek at the top element without removing it', () => {
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

  test('should iterate through the stack', () => {
    const result: number[] = [];
    for (const element of stack) {
      result.push(element);
    }

    expect(result).toEqual([1, 2, 3]); // iteration should start from the top of the stack
  });

  test('should apply forEach to the stack', () => {
    const result: number[] = [];
    stack.forEach(element => {
      result.push(element);
    });

    expect(result).toEqual([1, 2, 3]);
  });

  test('should filter elements in the stack', () => {
    const filteredStack = stack.filter(element => element > 1);

    expect(filteredStack.size).toBe(2);
    expect([...filteredStack]).toEqual([2, 3]);
  });

  test('should map elements in the stack', () => {
    const mappedStack = stack.map(element => element * 2);

    expect(mappedStack.size).toBe(3);
    expect([...mappedStack]).toEqual([2, 4, 6]);
  });

  test('should reduce elements in the stack', () => {
    const sum = stack.reduce((accumulator, element) => accumulator + element, 0);

    expect(sum).toBe(6);
  });
});
