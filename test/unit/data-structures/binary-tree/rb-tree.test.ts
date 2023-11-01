import {RBTreeNode, RedBlackTree, SN} from '../../../../src';
import {getRandomInt} from '../../../utils';

describe('RedBlackTree', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  describe('insert and getNode', () => {
    test('should insert and find a node in the tree', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);

      expect(tree.getNode(10)).toBeInstanceOf(RBTreeNode);
      expect(tree.getNode(20)).toBeInstanceOf(RBTreeNode);
      expect(tree.getNode(5)).toBeInstanceOf(RBTreeNode);
      expect(tree.getNode(15)).toBe(null);
    });

    test('should insert and find nodes with negative keys', () => {
      tree.insert(-10);
      tree.insert(-20);

      expect(tree.getNode(-10)).toBeInstanceOf(RBTreeNode);
      expect(tree.getNode(-20)).toBeInstanceOf(RBTreeNode);
    });
  });

  describe('deleteNode', () => {
    test('should delete a node from the tree', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.delete(20);

      expect(tree.getNode(20)).toBe(null);
    });

    test('should handle deleting a non-existent node', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.delete(15);

      expect(tree.getNode(15)).toBe(null);
    });
  });

  describe('minimum', () => {
    test('should find the minimum node in the tree', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.insert(15);
      tree.insert(3);

      const minNode = tree.getLeftMost(tree.root);
      expect(minNode.key).toBe(3);
    });

    test('should handle an empty tree', () => {
      const minNode = tree.getLeftMost(tree.root);
      expect(minNode).toBe(SN);
    });
  });

  describe('getRightMost', () => {
    test('should find the getRightMost node in the tree', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.insert(15);
      tree.insert(25);

      const maxNode = tree.getRightMost(tree.root);
      expect(maxNode.key).toBe(25);
    });

    test('should handle an empty tree', () => {
      const maxNode = tree.getRightMost(tree.root);
      expect(maxNode).toBe(SN);
    });
  });

  describe('getSuccessor', () => {
    test('should find the getSuccessor of a node', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.insert(15);
      tree.insert(25);

      const node = tree.getNode(15);
      const successorNode = tree.getSuccessor(node);

      expect(successorNode.key).toBe(20);
    });

    test('should handle a node with no getSuccessor', () => {
      tree.insert(10);
      tree.insert(5);

      const node = tree.getNode(10);
      const successorNode = tree.getSuccessor(node);
      // TODO not sure if it should be null or SN
      expect(successorNode).toBe(null);
    });
  });

  describe('getPredecessor', () => {
    test('should find the getPredecessor of a node', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.insert(15);
      tree.insert(25);

      const node = tree.getNode(20);
      const predecessorNode = tree.getPredecessor(node);

      expect(predecessorNode.key).toBe(15);
    });

    test('should handle a node with no getPredecessor', () => {
      tree.insert(10);
      tree.insert(20);

      const node = tree.getNode(20);
      const predecessorNode = tree.getPredecessor(node);
      // TODO not sure if it should be SN or something else.
      expect(predecessorNode).toBe(tree.getNode(10));
    });
  });
});

describe('RedBlackTree', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  it('should insert nodes into the tree', () => {
    tree.insert(10);
    expect(tree.getNode(10)).toBeDefined();
    tree.insert(20);
    expect(tree.getNode(20)).toBeDefined();
    tree.insert(5);
    expect(tree.getNode(5)).toBeDefined();
  });

  it('should delete nodes from the tree', () => {
    tree.insert(10);
    tree.insert(20);
    tree.insert(5);
    tree.delete(20);
    expect(tree.getNode(20)).toBe(null);
  });

  it('should get the successor of a node', () => {
    tree.insert(10);
    tree.insert(20);
    const node = tree.getNode(10);
    const successor = tree.getSuccessor(node);
    expect(successor?.key).toBe(20);
  });

  it('should get the predecessor of a node', () => {
    tree.insert(10);
    tree.insert(20);
    const node = tree.getNode(20);
    const predecessor = tree.getPredecessor(node);
    expect(predecessor?.key).toBe(10);
  });

  it('should rotate nodes to the left', () => {
    tree.insert(10);
    tree.insert(20);
    tree.insert(5);
    const node = tree.getNode(10);
    tree.insert(15);
    // Verify that rotation has occurred
    expect(node.left.key).toBe(5);
    expect(node.right.key).toBe(20);
  });

  it('should rotate nodes to the right', () => {
    tree.insert(10);
    tree.insert(20);
    tree.insert(5);
    const node = tree.getNode(20);
    tree.insert(25);
    // Verify that rotation has occurred
    expect(node.left.key).toBe(0);
    expect(node.right.key).toBe(25);
  });

  it('should fix the tree after deletion', () => {
    tree.insert(10);
    tree.insert(20);
    tree.insert(5);
    tree.insert(15);
    tree.delete(15);
    // Verify that the tree is still valid
    // You can add assertions to check the Red-Black Tree properties
  });

  it('should fix the tree after insertion', () => {
    tree.insert(1);
    tree.insert(2);
    tree.insert(5);
    tree.insert(15);
    const node15F = tree.getNode(15);
    expect(node15F.left).toBe(SN);
    expect(node15F.right).toBe(SN);
    expect(node15F.parent).toBe(tree.getNode(5));

    tree.insert(25);
    tree.insert(10);
    tree.insert(8);
    tree.insert(28);
    tree.insert(111);
    tree.insert(12);
    tree.delete(2);
    tree.insert(22);
    tree.insert(50);
    tree.insert(155);
    tree.insert(225);
    const node225F = tree.getNode(225);
    expect(node225F.left).toBe(SN);
    expect(node225F.right).toBe(SN);
    expect(node225F.parent.key).toBe(155);
    tree.insert(7);

    const node15S = tree.getNode(15);
    expect(node15S.left.key).toBe(8);
    expect(node15S.right.key).toBe(28);
    expect(node15S).toBe(tree.root);
    expect(node15S.parent).toBe(null);
    tree.delete(15);
    expect(tree.root.key).toBe(22);
    expect(tree.root.parent).toBe(null);

    const node15T = tree.getNode(15);
    expect(node15T).toBe(null);

    tree.insert(23);
    tree.insert(33);
    tree.insert(15);

    const nodeLM = tree.getLeftMost();
    expect(nodeLM.key).toBe(1);

    const node50 = tree.getNode(50);
    expect(node50.key).toBe(50);
    expect(node50.left.key).toBe(33);
    expect(node50.right).toBe(SN);
    const node15Fo = tree.getNode(15);

    expect(node15Fo.key).toBe(15);
    expect(node15Fo.left).toBe(SN);
    const node225S = tree.getNode(225);
    expect(node225S.left).toBe(SN);
    expect(node225S.right).toBe(SN);
    expect(node225S.parent.key).toBe(155);
    expect(tree.getNode(0)).toBe(null);
  });

  it('should fix the tree after insertion and deletion', () => {
    for (let i = 0; i < 1000; i++) {
      tree.insert(getRandomInt(-100, 1000));
      tree.delete(getRandomInt(-100, 1000));
    }
  });
});
