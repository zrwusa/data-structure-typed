import {RBTree, RBTreeNode} from '../../../../src';

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
  });
});
