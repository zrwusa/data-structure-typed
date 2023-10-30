import {AVLTree, AVLTreeNode, BinaryTree, BinaryTreeNode, IterationType} from '../../../../src';
import {isDebugTest} from '../../../config';

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
  let tree: BinaryTree<number>;

  beforeEach(() => {
    tree = new BinaryTree<number>();
  });

  afterEach(() => {
    tree.clear();
  });

  it('should add a node', () => {
    const node = tree.add(1);
    expect(node).not.toBeNull();
    expect(tree.size).toBe(1);
  });

  it('should delete a node', () => {
    const node = tree.add(1);
    expect(tree.size).toBe(1);

    if (node) {
      const result = tree.delete(node, node => node);
      expect(result).toHaveLength(1);
      expect(tree.size).toBe(0);
    }
  });

  it('should add and find nodes', () => {
    tree.add(1, 1);
    tree.add(2, 2);
    tree.add(3, 3);

    expect(tree.has(1)).toBe(true);
    expect(tree.has(2)).toBe(true);
    expect(tree.has(3)).toBe(true);
    expect(tree.has(4)).toBe(false);
    const node4 = tree.get(4);
    expect(tree.has(node4)).toBe(false);
    expect(tree.has(node4, node => node)).toBe(false);
    expect(tree.has('3', node => node.val?.toString())).toBe(true);
  });

  it('should getDepth return correct depth', () => {
    tree.add(1);
    expect(tree.getDepth(1)).toBe(0);
    tree.add(2);
    expect(tree.getDepth(2)).toBe(1);
    tree.add(3);
    expect(tree.getDepth(3, 1)).toBe(1);
    tree.add(4);
    expect(tree.getDepth(4, 1)).toBe(2);
    expect(tree.getDepth(4)).toBe(2);
    expect(tree.getDepth(4, 2)).toBe(1);
  });

  it('should traverse in-order', () => {
    tree.add(null);
    tree.delete(1);
    expect(tree.getHeight()).toBe(-1);
    tree.add(4);
    tree.add(2);
    expect(tree.getHeight()).toBe(1);
    tree.iterationType = IterationType.RECURSIVE;
    expect(tree.getHeight()).toBe(1);
    tree.iterationType = IterationType.ITERATIVE;

    tree.add(6);
    tree.add(1);
    tree.add(new BinaryTreeNode(3));
    tree.add(5);
    tree.add(7);

    const inOrder = tree.dfs(node => node.key);

    expect(inOrder).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should getLeftMost', () => {
    tree.addMany([4, 2, 6, 1, 3, 5, 7]);

    const leftMost = tree.getLeftMost(tree.root, IterationType.RECURSIVE);
    expect(leftMost?.key).toEqual(1);
    const rightMost = tree.getRightMost(tree.root, IterationType.RECURSIVE);
    expect(rightMost?.key).toEqual(7);
  });

  it('should isSubtreeBST', () => {
    tree.addMany([
      new BinaryTreeNode(4, 4),
      new BinaryTreeNode(2, 2),
      new BinaryTreeNode(6, 6),
      new BinaryTreeNode(1, 1),
      new BinaryTreeNode(3, 3),
      new BinaryTreeNode(5, 5),
      new BinaryTreeNode(7, 7),
      new BinaryTreeNode(4, 4)
    ]);

    expect(tree.isSubtreeBST(tree.get(4), IterationType.RECURSIVE)).toBe(true);
    expect(tree.isSubtreeBST(tree.get(4), IterationType.ITERATIVE)).toBe(true);
  });

  it('should subTreeTraverse', () => {
    tree.addMany([4, 2, 6, 1, 3, 5, 7]);
    expect(tree.subTreeTraverse(node => node.key, tree.get(6), IterationType.RECURSIVE)).toEqual([6, 5, 7]);
  });

  it('should clear the tree', () => {
    tree.add(1);
    tree.add(2);

    expect(tree.size).toBe(2);

    tree.clear();

    expect(tree.size).toBe(0);
    expect(tree.root).toBeNull();
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
    expect(tree.dfs(node => node.key, 'in', tree.root, IterationType.RECURSIVE)).toEqual(expected);
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
  const avl = new AVLTree<{id: number; text: string}>();
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
  expect(tree.dfs(node => node.key, 'pre', tree.root, IterationType.RECURSIVE)).toEqual([
    35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55
  ]);
  expect(tree.dfs(node => node.key, 'in')).toEqual([15, 16, 20, 28, 29, 30, 35, 40, 45, 50, 55]);
  expect(tree.dfs(node => node.key, 'post')).toEqual([16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35]);
  expect(tree.dfs(node => node.key, 'post', tree.root, IterationType.RECURSIVE)).toEqual([
    16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35
  ]);
  expect(tree.bfs(node => node.key, tree.root, IterationType.RECURSIVE)).toEqual([
    35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
  ]);
  expect(tree.bfs(node => node.key, tree.root, IterationType.ITERATIVE)).toEqual([
    35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
  ]);

  const levels = tree.listLevels(node => node.key);
  expect(levels).toEqual([[35], [20, 40], [15, 29, 50], [16, 28, 30, 45, 55]]);
  isDebug && console.log(levels);

  expect(tree.listLevels(node => node.key, tree.root, IterationType.RECURSIVE)).toEqual([
    [35],
    [20, 40],
    [15, 29, 50],
    [16, 28, 30, 45, 55]
  ]);
  isDebug && console.log(levels);
});

describe('BinaryTree', () => {
  let tree: BinaryTree<string>;

  beforeEach(() => {
    tree = new BinaryTree<string>({iterationType: IterationType.RECURSIVE});
  });

  afterEach(() => {
    tree.clear();
  });

  it('should create an empty BinaryTree', () => {
    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBe(null);
  });

  it('should add nodes to the tree', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    expect(tree.size).toBe(3);
    expect(tree.isEmpty()).toBe(false);
    expect(tree.root?.key).toBe(5);
  });

  it('should clear the BinaryTree', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    tree.clear();

    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBe(null);
  });

  it('should get nodes by key', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    const nodeA = tree.get(5);
    const nodeB = tree.get(3);

    expect(nodeA?.key).toBe(5);
    expect(nodeA?.val).toBe('A');
    expect(nodeB?.key).toBe(3);
    expect(nodeB?.val).toBe('B');
  });

  it('should return null when getting a non-existent node', () => {
    tree.add(5, 'A');

    const node = tree.get(3);

    expect(node).toBe(null);
  });

  it('should get the depth of a node', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    expect(tree.getDepth(7)).toBe(1);
    expect(tree.getDepth(3)).toBe(1);
  });

  it('should get the height of the tree', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    expect(tree.getHeight()).toBe(1);
    expect(tree.getHeight(undefined, IterationType.RECURSIVE)).toBe(1);
    expect(tree.getMinHeight(undefined, IterationType.RECURSIVE)).toBe(1);
  });

  it('should check if the tree is a binary search tree', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    expect(tree.isBST()).toBe(true);
  });

  it('should perform a depth-first traversal', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    const result = tree.dfs();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of depth-first traversal
  });

  it('should perform a breadth-first traversal', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    const result = tree.bfs(node => node.key);
    expect(result).toEqual([5, 3, 7]);
    // Add assertions for the result of breadth-first traversal
  });

  it('should list levels of the tree', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    const levels = tree.listLevels();
    expect(levels).toEqual([[5], [3, 7]]);
    // Add assertions for the levels of the tree
  });

  it('should delete nodes from the tree', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    tree.delete(3);

    expect(tree.size).toBe(2);
    expect(tree.get(3)).toBe(null);
  });

  it('should check if the tree is perfectly balanced', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    expect(tree.isPerfectlyBalanced()).toBe(true);
  });

  it('should get nodes by a custom callback', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    const nodes = tree.getNodes('B', (node: BinaryTreeNode<string>) => node.val);

    expect(nodes.length).toBe(1);
    expect(nodes[0].key).toBe(3);

    const nodesRec = tree.getNodes(
      'B',
      (node: BinaryTreeNode<string>) => node.val,
      false,
      tree.root,
      IterationType.RECURSIVE
    );

    expect(nodesRec.length).toBe(1);
    expect(nodesRec[0].key).toBe(3);
  });

  it('should perform Morris traversal', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    tree.iterationType = IterationType.ITERATIVE;
    // @ts-ignore
    expect([...tree]).toEqual([3, 5, 7]);
    tree.iterationType = IterationType.RECURSIVE;
    // @ts-ignore
    expect([...tree]).toEqual([3, 5, 7]);
    tree.iterationType = IterationType.ITERATIVE;

    const result = tree.morris();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of Morris traversal
  });

  it('should perform delete all', () => {
    tree.add(5, 'A');
    tree.add(3, 'B');
    tree.add(7, 'C');

    tree.delete(5);
    tree.delete(7);
    tree.delete(3);
    expect(tree.root).toBe(null);
    expect(tree.getHeight()).toBe(-1);
  });
});
