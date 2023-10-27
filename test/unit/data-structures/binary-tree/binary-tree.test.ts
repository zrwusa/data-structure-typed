import {AVLTree, AVLTreeNode, BinaryTree, BinaryTreeNode, IterationType} from '../../../../src';
import {isDebugTest} from "../../../config";

const isDebug = isDebugTest;
// const isDebug = true;

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

  test('should delete a node', () => {
    const node = binaryTree.add(1);
    expect(binaryTree.size).toBe(1);

    if (node) {
      const result = binaryTree.delete(node);
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

    const inOrder = binaryTree.dfs(node => node.key);

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

describe('BinaryTree Morris Traversal', () => {
  // Create a binary tree
  const tree = new BinaryTree<BinaryTreeNode<number>>();
  tree.add(1);
  tree.add(2);
  tree.add(3);
  tree.add(4);
  tree.add(5);
  it('should perform in-order Morris traversal correctly as dfs traversal', () => {
    // Perform in-order Morris traversal
    const result = tree.morris(node => node.key, 'in');

    // Expected in-order traversal result
    const expected = [4, 2, 5, 1, 3];

    expect(result).toEqual(expected);
    expect(tree.dfs(node => node.key, 'in')).toEqual(expected);
  });

  it('should perform pre-order Morris traversal correctly as dfs traversal', () => {
    // Perform pre-order Morris traversal
    const result = tree.morris(node => node.key, 'pre');

    // Expected pre-order traversal result
    const expected = [1, 2, 4, 5, 3];

    expect(result).toEqual(expected);
    expect(tree.dfs(node => node.key, 'pre')).toEqual(expected);
  });

  it('should perform post-order Morris traversal correctly as dfs traversal', () => {
    // Perform post-order Morris traversal
    const result = tree.morris(node => node.key, 'post');

    // Expected post-order traversal result
    const expected = [4, 5, 2, 3, 1];

    expect(result).toEqual([4, 5, 2, 3, 1]);
    expect(tree.dfs(node => node.key, 'post')).toEqual(expected);
  });

  it('after morris traversals should the structure of the tree be correct', () => {
    const node1 = tree.get(1);
    const node2 = tree.get(2);
    const node3 = tree.get(3);
    expect(node1?.left).toBe(node2);
    expect(node1?.right).toBe(node3);
  });
});

describe('BinaryTree APIs test', () => {
  const avl = new AVLTree<{ id: number; text: string }>();
  beforeEach(() => {
    avl.clear();
  });

  it('add', () => {
    avl.add(1);
    const node2 = new AVLTreeNode(2);
    avl.add(node2);
    const node3 = new AVLTreeNode(3, {id: 3, text: 'text3'});
    avl.add(node3);
    avl.add(node3, {id: 3, text: 'text33'});

    const bfsRes = avl.bfs(node => node);
    expect(bfsRes[0]?.key).toBe(2);
  });
});

describe('BinaryTree traversals', () => {
  const tree = new BinaryTree<number>();

  const arr = [35, 20, 40, 15, 29, null, 50, null, 16, 28, 30, 45, 55];
  tree.refill(arr);
  expect(tree.dfs(node => node.key, 'pre')).toEqual([35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55]);
  expect(tree.dfs(node => node.key, 'in')).toEqual([15, 16, 20, 28, 29, 30, 35, 40, 45, 50, 55]);
  expect(tree.dfs(node => node.key, 'post')).toEqual([16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35]);
  expect(tree.bfs(node => node.key, tree.root, IterationType.RECURSIVE)).toEqual([35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]);
  expect(tree.bfs(node => node.key, tree.root, IterationType.ITERATIVE)).toEqual([35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]);

  const levels = tree.listLevels(node => node.key);
  expect(levels).toEqual([[35], [20, 40], [15, 29, 50], [16, 28, 30, 45, 55]]);
  isDebug && console.log(levels);

})
