import { BinaryTree, BinaryTreeNode } from '../../../../src';
import { getRandomIntArray } from '../../../utils';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

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
    expect(node.value).toBe(42);

    node.value = 55;
    expect(node.value).toBe(55);
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
    leftChild.right = new BinaryTreeNode<number>(4);
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root.familyPosition).toBe('ROOT');
    expect(leftChild.familyPosition).toBe('ROOT_LEFT');
    rightChild.left = new BinaryTreeNode<number>(5);
    expect(rightChild.familyPosition).toBe('ROOT_RIGHT');
  });

  it('should determine only right child family position correctly', () => {
    const root = new BinaryTreeNode<number>(1);
    const rightChild = new BinaryTreeNode<number>(3);
    const isolated = new BinaryTreeNode<number>(2);

    root.right = rightChild;

    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(isolated.familyPosition).toBe('ISOLATED');
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

  it('should delete nodes', () => {
    expect(tree.getHeight(tree.root, 'ITERATIVE')).toBe(-1);
    expect(tree.getMinHeight()).toBe(-1);
    const node1 = tree.createNode(1);
    tree.add(node1);
    expect(tree.size).toBe(1);

    const leftChild = new BinaryTreeNode<number>(2);
    const rightChild = new BinaryTreeNode<number>(3);
    tree.add(leftChild);
    tree.add(rightChild);
    const root = tree.root;

    expect(leftChild.familyPosition).toBe('LEFT');
    tree.add(null);
    tree.add(new BinaryTreeNode<number>(4));
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root?.familyPosition).toBe('ROOT');
    expect(leftChild.familyPosition).toBe('ROOT_LEFT');
    tree.add(new BinaryTreeNode<number>(5));
    expect(rightChild.familyPosition).toBe('ROOT_RIGHT');

    tree.delete(new BinaryTreeNode<number>(200));
    tree.delete(rightChild);

    if (node1) {
      const result = tree.delete(node1);
      expect(result).toHaveLength(1);
      expect(tree.size).toBe(4);
      expect(tree.getMinHeight(tree.root, 'RECURSIVE')).toBe(1);
    }
  });

  it('should add and find nodes', () => {
    tree.add([1, 1]);
    tree.add(undefined);
    tree.add([2, 2]);
    tree.add([3, 3]);

    expect(tree.has(1)).toBe(true);
    expect(tree.has(2)).toBe(true);
    expect(tree.has(3)).toBe(true);
    expect(tree.has(4)).toBe(false);
    const node4 = tree.getNode(4);
    expect(tree.has(node4)).toBe(false);
    expect(tree.has(node4, node => node)).toBe(false);
    expect(tree.has('3', node => node.value?.toString())).toBe(true);
  });

  it('should the clone method work fine', () => {
    expect(tree.isEmpty()).toBe(true);
    tree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(tree.root?.key).toBe(4);
    expect(tree.root?.left?.key).toBe(2);
    expect(tree.root?.left?.left).toBe(null);
    expect(tree.root?.left?.right?.key).toBe(1);
    expect(tree.root?.right?.key).toBe(6);
    expect(tree.root?.right?.left?.key).toBe(3);
    expect(tree.root?.right?.right).toBe(null);

    const cloned = tree.clone();
    expect(cloned.root?.key).toBe(4);
    expect(cloned.root?.left?.key).toBe(2);
    expect(cloned.root?.left?.left).toBe(null);
    expect(cloned.root?.left?.right?.key).toBe(1);
    expect(cloned.root?.right?.key).toBe(6);
    expect(cloned.root?.right?.left?.key).toBe(3);
    expect(cloned.root?.right?.right).toBe(null);
    expect(cloned.dfs(node => node.key, 'PRE', cloned.getNode(6), 'ITERATIVE')).toEqual([6, 3, 7]);
    expect(cloned.dfs(node => (node ? node.key : null), 'PRE', cloned.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(cloned.dfs(node => (node ? node.key : node), 'PRE', cloned.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(cloned.dfs(node => (node ? node.key : null), 'PRE', cloned.getNode(6), 'RECURSIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    cloned.delete(6);
    cloned.delete(3);
    cloned.delete(7);
    cloned.delete(1);
    cloned.delete(5);
    cloned.delete(4);
    cloned.delete(2);
    // cloned.delete(null);
    // cloned.delete(null);
    // cloned.delete(null);
    expect(tree.size).toBe(10);
    expect(cloned.size).toBe(3);
    // expect(cloned.size).toBe(0);
    // expect(cloned.isEmpty()).toBe(true);
  });

  it('should be a balance tree after malicious manipulation', () => {
    tree.add(3);
    tree.add(12);
    tree.addMany(getRandomIntArray(100, 1, 100));
    tree.add(10);

    expect(tree.isPerfectlyBalanced()).toBe(true);
    const node3 = tree.getNode(3);

    if (node3) node3.right = tree.createNode(1);
    expect(tree.isPerfectlyBalanced()).toBe(false);

    tree.clear();
    tree.addMany([1, null, 2, null, 3, null, 4, null, 5, null, 6, null]);
    expect(tree.isPerfectlyBalanced()).toBe(false);
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
    tree.iterationType = 'RECURSIVE';
    expect(tree.getHeight()).toBe(1);
    tree.iterationType = 'ITERATIVE';

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

    const leftMost = tree.getLeftMost(tree.root, 'RECURSIVE');
    expect(leftMost?.key).toEqual(1);
    const rightMost = tree.getRightMost(tree.root, 'RECURSIVE');
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

    expect(tree.isBST(tree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(tree.isBST(tree.getNode(4), 'ITERATIVE')).toBe(true);
  });

  it('should isSubtreeBST', () => {
    tree.addMany([4, 2, 6, 1, 3, 5, 7, 4]);

    expect(tree.isBST(tree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(tree.isBST(tree.getNode(4), 'ITERATIVE')).toBe(true);
    expect(tree.getNodes(2, undefined, false, null)).toEqual([]);
    expect(tree.getNodes(tree.getNodeByKey(2), undefined, false, tree.root)).toEqual([tree.getNodeByKey(2)]);
  });

  it('should sub tree traverse', () => {
    tree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(tree.dfs(node => node.key, 'PRE', tree.getNode(6), 'ITERATIVE')).toEqual([6, 3, 7]);
    expect(tree.dfs(node => node.key, 'PRE', tree.getNode(6), 'ITERATIVE', false)).toEqual([6, 3, 7]);
    expect(tree.dfs(node => node.key, 'PRE', tree.getNode(6), 'RECURSIVE')).toEqual([6, 3, 7]);
    expect(tree.dfs(node => (node ? node.key : null), 'PRE', tree.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(tree.dfs(node => (node ? node.key : node), 'PRE', tree.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(tree.dfs(node => (node ? node.key : null), 'PRE', tree.getNode(6), 'RECURSIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
  });

  it('should clear the tree', () => {
    tree.add(1);
    tree.add(2);

    expect(tree.size).toBe(2);

    tree.clear();

    expect(tree.size).toBe(0);
    expect(tree.root).toBeUndefined();
  });

  it('should duplicated nodes just replace the node exists', function () {
    tree.clear();
    tree.addMany([-10, -10, -10, 9, 9, 20, null, null, 15, 7, 8, null, 2, null, 6, null, null, 8, 8, 8]);

    expect(tree.bfs(node => (node ? node.key : null), undefined, undefined, true)).toEqual([
      -10,
      9,
      20,
      null,
      null,
      15,
      7,
      8,
      null,
      2,
      null,
      6,
      null,
      null
    ]);
  });
});

describe('BinaryTree Morris Traversal', () => {
  // Create a binary tree
  const tree = new BinaryTree<number>();
  tree.add(1);
  tree.add(2);
  tree.add(3);
  tree.add(4);
  tree.add(5);
  it('should perform in-order Morris traversal correctly as dfs traversal', () => {
    // Perform in-order Morris traversal
    const result = tree.morris(node => node.key, 'IN');

    // Expected in-order traversal result
    const expected = [4, 2, 5, 1, 3];

    expect(result).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should perform pre-order Morris traversal correctly as dfs traversal', () => {
    // Perform pre-order Morris traversal
    const result = tree.morris(node => node.key, 'PRE');

    // Expected pre-order traversal result
    const expected = [1, 2, 4, 5, 3];

    expect(result).toEqual(expected);
    expect(tree.dfs(node => node.key, 'PRE')).toEqual(expected);
  });

  it('should perform post-order Morris traversal correctly as dfs traversal', () => {
    // Perform post-order Morris traversal
    const result = tree.morris(node => node.key, 'POST');

    // Expected post-order traversal result
    const expected = [4, 5, 2, 3, 1];

    expect(result).toEqual([4, 5, 2, 3, 1]);
    expect(tree.dfs(node => node.key, 'POST')).toEqual(expected);
  });

  it('after morris traversals should the structure of the tree be correct', () => {
    const node1 = tree.getNode(1);
    const node2 = tree.getNode(2);
    const node3 = tree.getNode(3);
    expect(node1?.left).toBe(node2);
    expect(node1?.right).toBe(node3);
  });
});

describe('BinaryTree toEntryFn', () => {
  it('should toEntryFn 1', () => {
    const tree = new BinaryTree<number, number, { obj: { id: number } }>([], {
      toEntryFn: ele => [ele.obj.id, ele.obj.id]
    });
    tree.add({ obj: { id: 1 } });
    tree.add({ obj: { id: 2 } });
    tree.add({ obj: { id: 3 } });
    tree.add({ obj: { id: 4 } });
    tree.add({ obj: { id: 5 } });

    const expected = [4, 2, 5, 1, 3];

    expect(tree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn 2', () => {
    const tree = new BinaryTree<number, number, { obj: { id: number } }>(
      [{ obj: { id: 1 } }, { obj: { id: 2 } }, { obj: { id: 3 } }, { obj: { id: 4 } }, { obj: { id: 5 } }],
      {
        toEntryFn: ele => [ele.obj.id, ele.obj.id]
      }
    );

    const expected = [4, 2, 5, 1, 3];

    expect(tree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn 3', () => {
    const tree = new BinaryTree<{ obj: { id: number } }, number>([
      { obj: { id: 1 } },
      { obj: { id: 2 } },
      { obj: { id: 3 } },
      { obj: { id: 4 } },
      { obj: { id: 5 } }
    ]);

    const expected = [
      { obj: { id: 4 } },
      { obj: { id: 2 } },
      { obj: { id: 5 } },
      { obj: { id: 1 } },
      { obj: { id: 3 } }
    ];

    expect(tree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });
});

describe('BinaryTree traversals', () => {
  const tree = new BinaryTree<number>();

  const arr = [35, 20, 40, 15, 29, null, 50, null, 16, 28, 30, 45, 55];
  tree.refill(arr);
  expect(tree.bfs(node => node, tree.root, 'ITERATIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    40,
    15,
    29,
    null,
    50,
    null,
    16,
    28,
    30,
    45,
    55
  ]);
  expect(tree.bfs(node => node, tree.root, 'RECURSIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    40,
    15,
    29,
    null,
    50,
    null,
    16,
    28,
    30,
    45,
    55
  ]);
  expect(tree.bfs(node => node, tree.root, 'ITERATIVE').map(node => (node === null ? null : node.key))).toEqual([
    35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
  ]);
  expect(tree.bfs(node => node, tree.root, 'RECURSIVE').map(node => (node === null ? null : node.key))).toEqual([
    35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
  ]);

  expect(tree.dfs(node => node.key, 'PRE')).toEqual([35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55]);
  expect(tree.dfs(node => node.key, 'PRE', tree.root, 'RECURSIVE')).toEqual([
    35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55
  ]);
  expect(tree.dfs(node => node, 'PRE', tree.root, 'ITERATIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    15,
    null,
    16,
    29,
    28,
    30,
    40,
    null,
    50,
    45,
    55
  ]);
  expect(tree.dfs(node => node, 'PRE', tree.root, 'RECURSIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    15,
    null,
    16,
    29,
    28,
    30,
    40,
    null,
    50,
    45,
    55
  ]);

  expect(tree.dfs(node => node.key, 'IN')).toEqual([15, 16, 20, 28, 29, 30, 35, 40, 45, 50, 55]);
  expect(tree.dfs(node => node.key, 'POST')).toEqual([16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35]);
  expect(tree.dfs(node => node.key, 'POST', tree.root, 'RECURSIVE')).toEqual([
    16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35
  ]);
  expect(tree.bfs(node => node.key, tree.root, 'RECURSIVE')).toEqual([35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]);
  expect(tree.bfs(node => node.key, tree.root, 'ITERATIVE')).toEqual([35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]);

  expect(tree.listLevels(node => node.key)).toEqual([[35], [20, 40], [15, 29, 50], [16, 28, 30, 45, 55]]);

  expect(tree.listLevels(node => node.key, tree.root, 'RECURSIVE')).toEqual([
    [35],
    [20, 40],
    [15, 29, 50],
    [16, 28, 30, 45, 55]
  ]);
  expect(tree.listLevels(node => (node ? node.key : null), tree.root, 'ITERATIVE', true)).toEqual([
    [35],
    [20, 40],
    [15, 29, null, 50],
    [null, 16, 28, 30, 45, 55]
  ]);
  expect(tree.listLevels(node => (node ? node.key : null), tree.root, 'RECURSIVE', true)).toEqual([
    [35],
    [20, 40],
    [15, 29, null, 50],
    [null, 16, 28, 30, 45, 55]
  ]);
});

describe('BinaryTree', () => {
  let tree: BinaryTree<number, string>;

  beforeEach(() => {
    tree = new BinaryTree<number, string>([], { iterationType: 'RECURSIVE' });
  });

  afterEach(() => {
    tree.clear();
  });

  it('should create an empty BinaryTree', () => {
    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBe(undefined);
  });

  it('should add nodes to the tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.size).toBe(3);
    expect(tree.isEmpty()).toBe(false);
    expect(tree.root?.key).toBe(5);
  });

  it('should clear the BinaryTree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.clear();

    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBe(undefined);
  });

  it('should get nodes by key', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const nodeA = tree.getNode(5);
    const nodeB = tree.getNode(3);

    expect(nodeA?.key).toBe(5);
    expect(nodeA?.value).toBe('A');
    expect(nodeB?.key).toBe(3);
    expect(nodeB?.value).toBe('B');
  });

  it('should return null when getting a non-existent node', () => {
    tree.add([5, 'A']);

    const node = tree.getNode(3);

    expect(node).toBe(null);
  });

  it('should get the depth of a node', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.getDepth(7)).toBe(1);
    expect(tree.getDepth(3)).toBe(1);
  });

  it('should get the height of the tree', () => {
    tree.add([5, 'A']);
    tree.add(3, 'B');
    tree.add([7, 'C']);

    expect(tree.getHeight()).toBe(1);
    expect(tree.getHeight(undefined, 'RECURSIVE')).toBe(1);
    expect(tree.getMinHeight(undefined, 'RECURSIVE')).toBe(1);
  });

  it('should check if the tree is a binary search tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.isBST()).toBe(true);
  });

  it('should perform a depth-first traversal', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const result = tree.dfs();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of depth-first traversal
  });

  it('should perform a breadth-first traversal', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const result = tree.bfs(node => node.key);
    expect(result).toEqual([5, 3, 7]);
    // Add assertions for the result of breadth-first traversal
  });

  it('should list levels of the tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const levels = tree.listLevels();
    expect(levels).toEqual([[5], [3, 7]]);
    // Add assertions for the levels of the tree
  });

  it('should delete nodes from the tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.delete(3);

    expect(tree.size).toBe(2);
    expect(tree.getNode(3)).toBe(null);
  });

  it('should check if the tree is perfectly balanced', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.isPerfectlyBalanced()).toBe(true);
  });

  it('should get nodes by a custom callback', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const nodes = tree.getNodes('B', node => node.value);

    expect(nodes.length).toBe(1);
    expect(nodes[0].key).toBe(3);

    const nodesRec = tree.getNodes('B', node => node.value, false, tree.root, 'RECURSIVE');

    expect(nodesRec.length).toBe(1);
    expect(nodesRec[0].key).toBe(3);
  });

  it('should perform Morris traversal', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.iterationType = 'ITERATIVE';
    expect([...tree]).toEqual([
      [3, 'B'],
      [5, 'A'],
      [7, 'C']
    ]);
    tree.iterationType = 'RECURSIVE';
    expect([...tree]).toEqual([
      [3, 'B'],
      [5, 'A'],
      [7, 'C']
    ]);
    tree.iterationType = 'ITERATIVE';

    const result = tree.morris();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of Morris traversal
  });

  it('should perform delete all', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.delete(5);
    tree.delete(7);
    tree.delete(3);
    expect(tree.root).toBe(undefined);
    expect(tree.getHeight()).toBe(-1);
  });
});

describe('BinaryTree iterative methods test', () => {
  let binaryTree: BinaryTree<number, string>;
  beforeEach(() => {
    binaryTree = new BinaryTree();
    binaryTree.add([1, 'a']);
    binaryTree.add(2, 'b');
    binaryTree.add([3, 'c']);
  });

  test('The node obtained by get Node should match the node type', () => {
    const node3 = binaryTree.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
  });

  test('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    binaryTree.forEach((value, key) => {
      mockCallback(value, key);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual(['b', 2]);
    expect(mockCallback.mock.calls[1]).toEqual(['a', 1]);
    expect(mockCallback.mock.calls[2]).toEqual(['c', 3]);
  });

  test('filter should return a new tree with filtered elements', () => {
    const filteredTree = binaryTree.filter((value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [3, 'c'],
      [2, 'b']
    ]);
  });

  test('map should return a new tree with modified elements', () => {
    const mappedTree = binaryTree.map((value, key) => (key * 2).toString());
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      [1, '2'],
      [2, '4'],
      [3, '6']
    ]);
  });

  test('reduce should accumulate values', () => {
    const sum = binaryTree.reduce((acc, currentValue, currentKey) => acc + currentKey, 0);
    expect(sum).toBe(6);
  });

  test('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of binaryTree) {
      entries.push(entry);
    }

    expect(entries.length).toBe(3);
    expect(entries).toEqual([
      [2, 'b'],
      [1, 'a'],
      [3, 'c']
    ]);
  });

  test('should clone work well', () => {
    const cloned = binaryTree.clone();
    expect(cloned.root?.left?.key).toBe(2);
    expect(cloned.root?.right?.value).toBe('c');
  });

  test('should keys', () => {
    const keys = binaryTree.keys();
    expect([...keys]).toEqual([2, 1, 3]);
  });

  test('should values', () => {
    const values = binaryTree.values();
    expect([...values]).toEqual(['b', 'a', 'c']);
  });

  test('should iterative method return undefined when the node is null', () => {
    const tree = new BinaryTree();
    tree.addMany([-10, -10, -10, 9, 9, 20, null, null, 15, 7, 8, null, 2, null, 6, null, null, 8, 8, 8]);
    const bfsResult = tree.bfs(undefined, undefined, undefined, true);
    expect(bfsResult).toEqual([
      -10,
      9,
      20,
      undefined,
      undefined,
      15,
      7,
      8,
      undefined,
      2,
      undefined,
      6,
      undefined,
      undefined
    ]);
  });
});
