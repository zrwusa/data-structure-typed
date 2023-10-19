import {BinaryTree, BinaryTreeNode} from '../../../../src';

describe('BinaryTreeNode', () => {
  it('should create an instance of BinaryTreeNode', () => {
    const node = new BinaryTreeNode<number>(1);
    expect(node).toBeInstanceOf(BinaryTreeNode);
  });

  it('should set and get the ID correctly', () => {
    const node = new BinaryTreeNode<number>(1);
    expect(node.key).toBe(1);

    node.key = 2;
    expect(node.key).toBe(2);
  });

  it('should set and get the value correctly', () => {
    const node: BinaryTreeNode<number> = new BinaryTreeNode<number>(1, 42);
    expect(node.val).toBe(42);

    node.val = 55;
    expect(node.val).toBe(55);
  });

  it('should set and get the left child correctly', () => {
    const node1 = new BinaryTreeNode<number>(1);
    const node2 = new BinaryTreeNode<number>(2);

    node1.left = node2;

    expect(node1.left).toBe(node2);
    expect(node2.parent).toBe(node1);
  });

  it('should set and get the right child correctly', () => {
    const node1 = new BinaryTreeNode<number>(1);
    const node2 = new BinaryTreeNode<number>(2);

    node1.right = node2;

    expect(node1.right).toBe(node2);
    expect(node2.parent).toBe(node1);
  });

  it('should set and get the parent correctly', () => {
    const node1 = new BinaryTreeNode<number>(1);
    const node2 = new BinaryTreeNode<number>(2);

    node1.left = node2;

    expect(node2.parent).toBe(node1);
    expect(node1.left).toBe(node2);
  });

  it('should determine family position correctly', () => {
    const root = new BinaryTreeNode<number>(1);
    const leftChild = new BinaryTreeNode<number>(2);
    const rightChild = new BinaryTreeNode<number>(3);

    root.left = leftChild;
    root.right = rightChild;

    expect(leftChild.familyPosition).toBe('LEFT');
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root.familyPosition).toBe('ROOT');
  });
});

describe('BinaryTree', () => {
  let binaryTree: BinaryTree;

  beforeEach(() => {
    binaryTree = new BinaryTree();
  });

  afterEach(() => {
    binaryTree.clear();
  });

  test('should add a node', () => {
    const node = binaryTree.add(1);
    expect(node).not.toBeNull();
    expect(binaryTree.size).toBe(1);
  });

  test('should remove a node', () => {
    const node = binaryTree.add(1);
    expect(binaryTree.size).toBe(1);

    if (node) {
      const result = binaryTree.remove(node);
      expect(result).toHaveLength(1);
      expect(binaryTree.size).toBe(0);
    }
  });

  test('should add and find nodes', () => {
    binaryTree.add(1);
    binaryTree.add(2);
    binaryTree.add(3);

    expect(binaryTree.has(1)).toBe(true);
    expect(binaryTree.has(2)).toBe(true);
    expect(binaryTree.has(3)).toBe(true);
    expect(binaryTree.has(4)).toBe(false);
  });

  test('should getDepth return correct depth', () => {
    binaryTree.add(1);
    expect(binaryTree.getDepth(1)).toBe(0);
    binaryTree.add(2);
    expect(binaryTree.getDepth(2)).toBe(1);
    binaryTree.add(3);
    expect(binaryTree.getDepth(3, 1)).toBe(1);
    binaryTree.add(4);
    expect(binaryTree.getDepth(4, 1)).toBe(2);
    expect(binaryTree.getDepth(4)).toBe(2);
    expect(binaryTree.getDepth(4, 2)).toBe(1);
  });

  test('should traverse in-order', () => {
    binaryTree.add(4);
    binaryTree.add(2);
    binaryTree.add(6);
    binaryTree.add(1);
    binaryTree.add(3);
    binaryTree.add(5);
    binaryTree.add(7);

    const inOrder = binaryTree.dfs('in');

    expect(inOrder).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('should clear the tree', () => {
    binaryTree.add(1);
    binaryTree.add(2);

    expect(binaryTree.size).toBe(2);

    binaryTree.clear();

    expect(binaryTree.size).toBe(0);
    expect(binaryTree.root).toBeNull();
  });
});
