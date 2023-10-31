import {RBTree, RBTreeNode} from '../../../../src';
<<<<<<< HEAD

describe('Red-Black Tree Tests', () => {
  let tree: RBTree<RBTreeNode<number>>;

  beforeEach(() => {
    tree = new RBTree<RBTreeNode<number>>();
  });

  test('Insertion and In-order Traversal', () => {
    tree.add(5);
    tree.add(3);
    tree.add(7);
    tree.add(2);
    tree.add(4);
    tree.add(6);
    tree.add(8);

    const inOrderTraversal: number[] = tree.dfs('in')

    expect(inOrderTraversal).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });

  test('Deletion', () => {
    tree.add(5);
    tree.add(3);
    tree.add(7);
    tree.add(2);
    tree.add(4);
    tree.add(6);
    tree.add(8);

    // Delete a node (e.g., 3) and check if it's gone
    tree.remove(3);
    expect(tree.has(3)).toBe(false);

    // Perform in-order traversal to check if the tree is still balanced
    const inOrderTraversal: number[] = tree.dfs('in');
    console.log(inOrderTraversal)


    expect(inOrderTraversal).toEqual([2, 4, 5, 6, 7, 8]);
=======

describe('RBTreeNode', () => {
  it('should create an instance of RBTreeNode', () => {
    const node = new RBTreeNode<number>(1);
    expect(node).toBeInstanceOf(RBTreeNode);
  });

  it('should set and get the ID correctly', () => {
    const node = new RBTreeNode<number>(1);
    expect(node.key).toBe(1);

    node.key = 2;
    expect(node.key).toBe(2);
  });

  it('should set and get the value correctly', () => {
    const node: RBTreeNode<number> = new RBTreeNode<number>(1, 42);
    expect(node.value).toBe(42);

    node.value = 55;
    expect(node.value).toBe(55);
  });

  it('should set and get the left child correctly', () => {
    const node1 = new RBTreeNode<number>(1);
    const node2 = new RBTreeNode<number>(2);

    node1.left = node2;

    expect(node1.left).toBe(node2);
    expect(node2.parent).toBe(node1);
  });

  it('should set and get the right child correctly', () => {
    const node1 = new RBTreeNode<number>(1);
    const node2 = new RBTreeNode<number>(2);

    node1.right = node2;

    expect(node1.right).toBe(node2);
    expect(node2.parent).toBe(node1);
  });

  it('should set and get the parent correctly', () => {
    const node1 = new RBTreeNode<number>(1);
    const node2 = new RBTreeNode<number>(2);

    node1.left = node2;

    expect(node2.parent).toBe(node1);
    expect(node1.left).toBe(node2);
  });

  it('should determine family position correctly', () => {
    const root = new RBTreeNode<number>(1);
    const leftChild = new RBTreeNode<number>(2);
    const rightChild = new RBTreeNode<number>(3);

    root.left = leftChild;
    root.right = rightChild;

    expect(leftChild.familyPosition).toBe('LEFT');
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root.familyPosition).toBe('ROOT');
  });
});

describe('Red-Black Tree Tests', () => {
  let tree: RBTree<RBTreeNode<number>>;

  beforeEach(() => {
    tree = new RBTree<RBTreeNode<number>>();
  });

  test('Insertion and In-order Traverse', () => {
    tree.add(5);
    // tree.add(3);
    // tree.add(7);
    // tree.add(2);
    // tree.add(4);
    // tree.add(6);
    // tree.add(8);
    //
    // const inOrderTraverse: number[] = tree.DFS('in')
    //
    // expect(inOrderTraverse).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });

  test('Deletion', () => {
    // tree.add(5);
    // tree.add(3);
    // tree.add(7);
    // tree.add(2);
    // tree.add(4);
    // tree.add(6);
    // tree.add(8);
    //
    // // Delete a node (e.g., 3) and check if it's gone
    // tree.delete(3);
    // expect(tree.has(3)).toBe(false);
    //
    // // Perform in-order traversal to check if the tree is still balanced
    // const inOrderTraverse: number[] = tree.DFS('in');
    //
    //
    // expect(inOrderTraverse).toEqual([2, 4, 5, 6, 7, 8]);
>>>>>>> 10bbcffcef4ed5901867431a3d3eae891d190b9d
  });
});

describe('Red-Black Tree', () => {
  let tree: RBTree<RBTreeNode<number>>;

  beforeEach(() => {
    tree = new RBTree<RBTreeNode<number>>();
  });

  it('should insert and retrieve values correctly', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    tree.add(15);

    expect(tree.get(10)).toBeDefined();
    expect(tree.get(20)).toBeDefined();
    expect(tree.get(5)).toBeDefined();
    expect(tree.get(15)).toBeDefined();
    expect(tree.get(30)).toBeUndefined();
  });

  it('should remove values correctly', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    tree.add(15);
    tree.add(30);
    tree.remove(20);

    expect(tree.get(20)).toBeUndefined();
  });

  it('should perform in-order traversal', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    tree.add(15);
    tree.add(30);

    const result: number[] = tree.dfs('in');

    expect(result).toEqual([5, 10, 15, 20, 30]);
  });

  it('should validate red-black tree properties', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    tree.add(15);

    // expect(tree.isRBTree()).toBeTruthy();
  });
});

describe('RBTree', () => {
  let tree: RBTree;

  beforeEach(() => {
    tree = new RBTree();
  });

  test('should insert and find nodes correctly', () => {
    tree.add(5);
    tree.add(3);
    tree.add(8);

    expect(tree.get(5)?.key).toBe(5);
    expect(tree.get(3)?.key).toBe(3);
    expect(tree.get(8)?.key).toBe(8);
  });

  test('should remove nodes correctly', () => {
    tree.add(5);
    tree.add(3);
    tree.add(8);

    tree.remove(3);
    expect(tree.get(3)).toBe(undefined);

    tree.remove(5);
    expect(tree.get(5)).toBe(undefined);

    tree.remove(8);
    expect(tree.get(8)).toBe(undefined);
  });

  test('should validate red-black tree properties', () => {
    tree.add(5);
    tree.add(3);
    tree.add(8);

    expect(tree.isRBTree()).toBe(true);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.isPerfectlyBalanced()).toBe(true);
    expect(tree.isEmpty()).toBe(false);
    tree.remove(8);
    expect(tree.size).toBe(2);
    tree.remove(9);
    expect(tree.size).toBe(2);
    tree.remove(5);
    expect(tree.size).toBe(1);
    tree.remove(3);
    expect(tree.size).toBe(0);
  });

  test('should handle various insert and remove scenarios', () => {
    // Test your tree with various insertion and deletion scenarios
    // and validate that it maintains red-black tree properties.
    // Make sure to test both simple and complex cases.

    // For example:
    tree.add(5);
    tree.add(3);
    tree.add(8);
    tree.remove(3);
    expect(tree.isRBTree()).toBe(true);

    // Add more test scenarios here.
  });
});

describe('RBTree', () => {
  let tree: RBTree;

  beforeEach(() => {
    tree = new RBTree();
  });

  it('should add nodes and maintain RBTree properties', () => {
    tree.add(10);
    tree.add(5);
    tree.add(15);
    tree.add(3);
    tree.add(7);

    // Make assertions here to check that the RBTree properties are maintained
    // For example, check that there are no consecutive red nodes
  });

  it('should remove nodes and maintain RBTree properties', () => {
    tree.add(10);
    tree.add(5);
    tree.add(15);
    tree.add(3);
    tree.add(7);

    tree.remove(5);

    // Make assertions here to check that the RBTree properties are maintained
  });

  it('should find nodes by key', () => {
    tree.add(10, 'A');
    tree.add(5, 'B');
    tree.add(15, 'C');
    tree.add(3, 'D');
    tree.add(7, 'E');

    const node = tree.get(5);

    expect(node?.val).toBe('B');
  });

  it('should check RBTree properties', () => {
    tree.add(10);
    tree.add(5);
    tree.add(15);
    tree.add(3);
    tree.add(7);

    const isRBTree = tree.isRBTree();

    expect(isRBTree).toBe(true);
  });
});



describe('RBTree', () => {
  it('should insert and find elements correctly', () => {
    const tree = new RBTree<RBTreeNode<number>>();


    tree.add(10);
    tree.add(20);
    tree.add(5);

    expect(tree.size).toBe(3);
    expect(tree.get(10)?.key).toBe(10);
    expect(tree.get(20)?.key).toBe(20);
    expect(tree.get(5)?.key).toBe(5);
  });

  it('should delete elements correctly', () => {
    const tree = new RBTree<RBTreeNode<number>>();


    tree.add(10);
    tree.add(20);
    tree.add(5);

    tree.remove(10);
    expect(tree.size).toBe(2);
    expect(tree.get(10)).toBeUndefined();
  });

  it('should balance the tree after insertions', () => {
    const tree = new RBTree<RBTreeNode<number>>();


    tree.add(10);
    tree.add(20);
    tree.add(5);

    // You can add expectations to check the tree's structure after insertions
    // For example, checking that the root is black, and the leaves are black, etc.
  });

  it('should maintain Red-Black properties after deletions', () => {
    const tree = new RBTree<RBTreeNode<number>>();

    tree.add(10);
    tree.add(20);
    tree.add(5);

    tree.remove(20);

    // You can add expectations to check Red-Black properties
    // For example, checking that there are no two consecutive red nodes in a path, etc.
    expect(tree.isRBTree()).toBe(true);
  });

  it('should handle edge cases', () => {
    const tree = new RBTree<RBTreeNode<number>>();


    // Test with an empty tree
    expect(tree.size).toBe(0);
    expect(tree.isRBTree()).toBe(true);

    // Test deleting non-existent elements
    tree.add(10);
    tree.remove(20);
    expect(tree.size).toBe(1);

    // Test deleting the root element
    tree.remove(10);
    expect(tree.size).toBe(0);
  });
});

