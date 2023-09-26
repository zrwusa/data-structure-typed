import {Stack} from '../../../../src';

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
    expect(stack.size()).toBe(3);
  });

  it('should peek at the top element without removing it', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.peek()).toBe(3);
    expect(stack.size()).toBe(3);
  });

  it('should pop elements from the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    const poppedElement = stack.pop();
    expect(poppedElement).toBe(3);
    expect(stack.size()).toBe(2);
  });

  it('should return null when popping from an empty stack', () => {
    const poppedElement = stack.pop();
    expect(poppedElement).toBeNull();
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
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });

  it('should clone the stack', () => {
    stack.push(1);
    stack.push(2);
    const clonedStack = stack.clone();
    expect(clonedStack.size()).toBe(2);
    expect(clonedStack.pop()).toBe(2);
  });
});
