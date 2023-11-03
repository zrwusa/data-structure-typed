import {NIL, RBTNColor, RBTreeNode, RedBlackTree} from '../../../../src';
import {getRandomInt} from '../../../utils';
import {isDebugTest} from '../../../config';

const isDebug = isDebugTest;

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
      expect(minNode).toBe(NIL);
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
      expect(maxNode).toBe(NIL);
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
      // TODO not sure if it should be null or NIL
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
      // TODO not sure if it should be NIL or something else.
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

  it('should all node attributes fully conform to the red-black tree standards.', () => {
    tree.insert(10);
    tree.insert(20);
    tree.insert(5);
    tree.insert(15);
    tree.insert(21);
    tree.insert(6);
    tree.insert(2);

    let node10F = tree.getNode(10);
    let node20F = tree.getNode(20);
    let node5F = tree.getNode(5);
    let node15F = tree.getNode(15);
    let node21F = tree.getNode(21);
    let node6F = tree.getNode(6);
    let node2F = tree.getNode(2);
    expect(node10F.key).toBe(10);
    expect(node10F.color).toBe(RBTNColor.BLACK);
    expect(node10F.left).toBe(node5F);
    expect(node10F.right).toBe(node20F);
    expect(node10F.parent).toBe(null);
    expect(node20F.key).toBe(20);
    expect(node20F.color).toBe(RBTNColor.BLACK);
    expect(node20F.left).toBe(node15F);
    expect(node20F.right).toBe(node21F);
    expect(node20F.parent).toBe(node10F);
    expect(node5F.key).toBe(5);
    expect(node5F.color).toBe(RBTNColor.BLACK);
    expect(node5F.left).toBe(node2F);
    expect(node5F.right).toBe(node6F);
    expect(node5F.parent).toBe(node10F);
    expect(node15F.key).toBe(15);
    expect(node15F.color).toBe(RBTNColor.RED);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
    expect(node15F.parent).toBe(node20F);
    expect(node21F.key).toBe(21);
    expect(node21F.color).toBe(RBTNColor.RED);
    expect(node21F.left).toBe(NIL);
    expect(node21F.right).toBe(NIL);
    expect(node21F.parent).toBe(node20F);
    expect(node6F.key).toBe(6);
    expect(node6F.color).toBe(RBTNColor.RED);
    expect(node6F.left).toBe(NIL);
    expect(node6F.right).toBe(NIL);
    expect(node6F.parent).toBe(node5F);
    expect(node2F.key).toBe(2);
    expect(node2F.color).toBe(RBTNColor.RED);
    expect(node2F.left).toBe(NIL);
    expect(node2F.right).toBe(NIL);
    expect(node2F.parent).toBe(node5F);
    expect(node15F.key).toBe(15);
    expect(node15F.color).toBe(RBTNColor.RED);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
    expect(node15F.parent).toBe(node20F);
    tree.delete(5);
    node10F = tree.getNode(10);
    node20F = tree.getNode(20);
    node5F = tree.getNode(5);
    node15F = tree.getNode(15);
    node21F = tree.getNode(21);
    node6F = tree.getNode(6);
    node2F = tree.getNode(2);
    expect(node10F.key).toBe(10);
    expect(node10F.color).toBe(RBTNColor.BLACK);
    expect(node10F.left).toBe(node6F);
    expect(node10F.right).toBe(node20F);
    expect(node10F.parent).toBe(null);
    expect(node20F.key).toBe(20);
    expect(node20F.color).toBe(RBTNColor.BLACK);
    expect(node20F.left).toBe(node15F);
    expect(node20F.right).toBe(node21F);
    expect(node20F.parent).toBe(node10F);
    expect(node5F).toBe(null);
    expect(node15F.key).toBe(15);
    expect(node15F.color).toBe(RBTNColor.RED);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
    expect(node15F.parent).toBe(node20F);
    expect(node21F.key).toBe(21);
    expect(node21F.color).toBe(RBTNColor.RED);
    expect(node21F.left).toBe(NIL);
    expect(node21F.right).toBe(NIL);
    expect(node21F.parent).toBe(node20F);
    expect(node6F.key).toBe(6);
    expect(node6F.color).toBe(RBTNColor.BLACK);
    expect(node6F.left).toBe(node2F);
    expect(node6F.right).toBe(NIL);
    expect(node6F.parent).toBe(node10F);
    expect(node2F.key).toBe(2);
    expect(node2F.color).toBe(RBTNColor.RED);
    expect(node2F.left).toBe(NIL);
    expect(node2F.right).toBe(NIL);
    expect(node2F.parent).toBe(node6F);
    expect(node15F.key).toBe(15);
    expect(node15F.color).toBe(RBTNColor.RED);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
    expect(node15F.parent).toBe(node20F);
    tree.delete(20);
    node10F = tree.getNode(10);
    node20F = tree.getNode(20);
    node5F = tree.getNode(5);
    node15F = tree.getNode(15);
    node21F = tree.getNode(21);
    node6F = tree.getNode(6);
    node2F = tree.getNode(2);
    expect(node10F.key).toBe(10);
    expect(node10F.color).toBe(RBTNColor.BLACK);
    expect(node10F.left).toBe(node6F);
    expect(node10F.right).toBe(node21F);
    expect(node10F.parent).toBe(null);
    expect(node20F).toBe(null);
    expect(node5F).toBe(null);
    expect(node15F.key).toBe(15);
    expect(node15F.color).toBe(RBTNColor.RED);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
    expect(node15F.parent).toBe(node21F);
    expect(node21F.key).toBe(21);
    expect(node21F.color).toBe(RBTNColor.BLACK);
    expect(node21F.left).toBe(node15F);
    expect(node21F.right).toBe(NIL);
    expect(node21F.parent).toBe(node10F);
    expect(node6F.key).toBe(6);
    expect(node6F.color).toBe(RBTNColor.BLACK);
    expect(node6F.left).toBe(node2F);
    expect(node6F.right).toBe(NIL);
    expect(node6F.parent).toBe(node10F);
    expect(node2F.key).toBe(2);
    expect(node2F.color).toBe(RBTNColor.RED);
    expect(node2F.left).toBe(NIL);
    expect(node2F.right).toBe(NIL);
    expect(node2F.parent).toBe(node6F);
    expect(node15F.key).toBe(15);
    expect(node15F.color).toBe(RBTNColor.RED);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
    expect(node15F.parent).toBe(node21F);
  });

  it('should fix the tree after insertion', () => {
    tree.insert(1);
    tree.insert(2);
    tree.insert(5);
    tree.insert(15);
    const node15F = tree.getNode(15);
    expect(node15F.left).toBe(NIL);
    expect(node15F.right).toBe(NIL);
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
    expect(node225F.left).toBe(NIL);
    expect(node225F.right).toBe(NIL);
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
    expect(node50.right).toBe(NIL);
    const node15Fo = tree.getNode(15);

    expect(node15Fo.key).toBe(15);
    expect(node15Fo.left).toBe(NIL);
    const node225S = tree.getNode(225);
    expect(node225S.left).toBe(NIL);
    expect(node225S.right).toBe(NIL);
    expect(node225S.parent.key).toBe(155);
    expect(tree.getNode(0)).toBe(null);
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    tree.insert(6);
    tree.insert(7);
    tree.insert(8);
    tree.insert(9);
    tree.insert(10);
    tree.insert(11);
    tree.insert(12);
    tree.insert(13);
    tree.insert(14);
    tree.insert(15);
    tree.insert(16);
    tree.insert(17);
    tree.insert(18);
    tree.insert(19);
    tree.insert(110);

    isDebug && tree.print();
  });

  it('should fix the tree after insertion and deletion', () => {
    for (let i = 0; i < 100; i++) {
      tree.insert(getRandomInt(-100, 1000));
      tree.delete(getRandomInt(-100, 1000));
    }
  });
});
