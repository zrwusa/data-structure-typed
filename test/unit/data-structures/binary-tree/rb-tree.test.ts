import { RedBlackTree, RBTreeNode } from '../../../../src';
import {getRandomInt} from "../../../utils";

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
      expect(tree.getNode(15)).toBe(tree.NIL);
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

      expect(tree.getNode(20)).toBe(tree.NIL);
    });

    test('should handle deleting a non-existent node', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
      tree.delete(15);

      expect(tree.getNode(15)).toBe(tree.NIL);
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
      expect(minNode).toBe(tree.NIL);
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
      expect(maxNode).toBe(tree.NIL);
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
      // TODO not sure if it should be null or tree.NIL
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
      // TODO not sure if it should be tree.NIL or something else.
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
    expect(tree.getNode(20)).toBe(tree.NIL);
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
    for (let i = 0; i < 1000; i++) {
      tree.insert(getRandomInt(-100, 1000));
      tree.delete(getRandomInt(-100, 1000));
    }
    tree.insert(1);
    tree.insert(2);
    tree.insert(5);
    tree.insert(15);
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
    tree.insert(7);
    tree.delete(15);
    tree.insert(23);
    tree.insert(33);
    tree.insert(15);


    // Verify that the tree is still a valid Red-Black Tree
    // You can add assertions to check the Red-Black Tree properties
  });
});
