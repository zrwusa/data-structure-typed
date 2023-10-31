import { RedBlackTree, RBTreeNode } from '../../../../src';

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
